"use client"

import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Dialog } from "@/components/ui/dialog"

type Patient = {
  _id: string
  patientCode?: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  address?: string
  gender?: string
  dateOfBirth?: string
  medicalHistory?: string[]
  notes?: string
  dentist?: { _id: string; name?: string; email?: string } | string
}

type PatientRecord = {
  _id: string
  patient: string
  recordType: "X-Ray" | "Past Report" | "Prescription" | "Lab Result" | "Clinical Note"
  title?: string
  fileUrl?: string
  date?: string
  description?: string
  uploadedBy?: "Patient" | "Doctor"
  createdAt?: string
}

function formatDate(date?: string) {
  if (!date) return "—"
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString()
}

function calcAge(date?: string) {
  if (!date) return "—"
  const dob = new Date(date)
  if (Number.isNaN(dob.getTime())) return "—"
  const diff = Date.now() - dob.getTime()
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
  return `${years}`
}

export default function PatientProfilePage() {
  const params = useParams<{ id: string }>()
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id
  const id = rawId ? decodeURIComponent(rawId) : undefined

  const [patient, setPatient] = useState<Patient | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [records, setRecords] = useState<PatientRecord[]>([])
  const [recordsLoading, setRecordsLoading] = useState(false)
  const [recordsError, setRecordsError] = useState<string | null>(null)
  const [noteText, setNoteText] = useState("")
  const [noteSaving, setNoteSaving] = useState(false)
  const [showXrayModal, setShowXrayModal] = useState(false)
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [scheduleStart, setScheduleStart] = useState("")
  const [scheduleDuration, setScheduleDuration] = useState(30)
  const [scheduleType, setScheduleType] = useState<"checkup" | "cleaning" | "x-ray" | "surgery" | "ortho" | "other">("checkup")
  const [scheduleNotes, setScheduleNotes] = useState("")
  const [scheduleSaving, setScheduleSaving] = useState(false)
  const [scheduleError, setScheduleError] = useState<string | null>(null)
  const [uploadType, setUploadType] = useState<"X-Ray" | "Lab Result" | "Prescription" | "Past Report">("X-Ray")
  const [uploadTitle, setUploadTitle] = useState("")
  const [uploadFileUrl, setUploadFileUrl] = useState<string | undefined>(undefined)
  const [uploadSaving, setUploadSaving] = useState(false)

  const patientIdForApi = patient?._id || patient?.patientCode

  const openXrayModal = () => {
    setRecordsError(null)
    setShowXrayModal(true)
  }

  const openNoteModal = () => {
    setRecordsError(null)
    setShowNoteModal(true)
  }

  const openScheduleModal = () => {
    setScheduleError(null)
    setScheduleStart("")
    setScheduleNotes("")
    setShowScheduleModal(true)
  }

  const openUploadModal = () => {
    setRecordsError(null)
    setUploadFileUrl(undefined)
    setUploadTitle("")
    setUploadType("X-Ray")
    setShowUploadModal(true)
  }

  useEffect(() => {
    if (!id) {
      setError("Missing patient id")
      setLoading(false)
      return
    }
    let active = true
    ;(async () => {
      try {
        // First try direct fetch by id; if it fails with 400/404, fall back to list lookup
        const res = await fetch(`/api/patients/${id}`, { cache: "no-store" })
        if (active && res.ok) {
          const { data } = (await res.json()) as { data: Patient }
          setPatient(data)
          return
        }

        // If invalid id or not found, try searching the full list so we still render if present
        const list = await fetch(`/api/patients`, { cache: "no-store" })
        if (!active) return
        if (!list.ok) {
          setError(`Failed to load patient (${res.status || list.status})`)
          return
        }
        const { data: all } = (await list.json()) as { data: Patient[] }
        const found = all?.find((p) => p._id === id || p.patientCode === id)
        if (found) {
          setPatient(found)
        } else {
          setError("Patient not found")
        }
      } catch (err: any) {
        if (!active) return
        setError(err?.message || "Failed to load patient")
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [id])

  const dentistName = useMemo(() => {
    if (!patient?.dentist) return "Not assigned"
    if (typeof patient.dentist === "string") return patient.dentist
    return patient.dentist.name || patient.dentist._id || "Not assigned"
  }, [patient])

  const xrayRecords = useMemo(() => records.filter((r) => r.recordType === "X-Ray"), [records])
  const clinicalNotes = useMemo(() => records.filter((r) => r.recordType === "Clinical Note"), [records])
  const historyRecords = useMemo(() => {
    return [...records].sort((a, b) => {
      const da = new Date(a.date || a.createdAt || 0).getTime()
      const db = new Date(b.date || b.createdAt || 0).getTime()
      return db - da
    })
  }, [records])

  useEffect(() => {
    if (!patientIdForApi) return
    let active = true
    setRecordsLoading(true)

    ;(async () => {
      try {
        const res = await fetch(`/api/patients/${patientIdForApi}/records`, { cache: "no-store" })
        if (!active) return
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          setRecordsError(body?.error || "Failed to load records")
          return
        }
        const { data } = (await res.json()) as { data: PatientRecord[] }
        setRecords(data || [])
      } catch (err: any) {
        if (!active) return
        setRecordsError(err?.message || "Failed to load records")
      } finally {
        if (active) setRecordsLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [patientIdForApi])

  const addClinicalNote = async () => {
    if (!patientIdForApi) return
    if (!noteText.trim()) {
      setRecordsError("Note cannot be empty")
      return
    }
    setNoteSaving(true)
    setRecordsError(null)
    try {
      const res = await fetch(`/api/patients/${patientIdForApi}/records`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recordType: "Clinical Note",
          description: noteText.trim(),
          title: "Clinical Note",
          uploadedBy: "Doctor",
        }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(body?.error || "Failed to save note")
      }
      const newRecord = body.data as PatientRecord
      setRecords((prev) => [newRecord, ...prev])
      setNoteText("")
      setShowNoteModal(false)
    } catch (err: any) {
      setRecordsError(err?.message || "Failed to save note")
    } finally {
      setNoteSaving(false)
    }
  }

  const createAppointment = async () => {
    if (!patient || !patientIdForApi) return
    if (!scheduleStart) {
      setScheduleError("Start time is required for scheduling")
      return
    }
    setScheduleSaving(true)
    setScheduleError(null)
    try {
      const startDate = new Date(scheduleStart)
      const endDate = new Date(startDate.getTime() + scheduleDuration * 60000)
      const dentistId = typeof patient.dentist === "string" ? patient.dentist : patient.dentist?._id
      const res = await fetch(`/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${patient.firstName} ${patient.lastName} - ${scheduleType}`,
          start: startDate,
          end: endDate,
          patient: patient._id,
          dentist: dentistId,
          type: scheduleType,
          status: "scheduled",
          notes: scheduleNotes,
        }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body?.error || "Failed to schedule appointment")
      setShowScheduleModal(false)
    } catch (err: any) {
      setScheduleError(err?.message || "Failed to schedule appointment")
    } finally {
      setScheduleSaving(false)
    }
  }

  const onUploadFile = (file?: File | null) => {
    if (!file) {
      setUploadFileUrl(undefined)
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setUploadFileUrl(typeof reader.result === "string" ? reader.result : undefined)
    }
    reader.readAsDataURL(file)
  }

  const openRecordFile = async (fileUrl?: string | null) => {
    if (!fileUrl) return
    try {
      const openInTab = (url: string, revoke?: () => void) => {
        const newTab = window.open(url, "_blank", "noopener")
        if (!newTab) {
          setRecordsError("Popup blocked. Please allow popups for this site to view the file.")
          if (revoke) revoke()
          return
        }
        if (revoke) newTab.onload = revoke
      }

      if (fileUrl.startsWith("data:")) {
        const res = await fetch(fileUrl)
        const blob = await res.blob()
        const blobUrl = URL.createObjectURL(blob)
        openInTab(blobUrl, () => URL.revokeObjectURL(blobUrl))
      } else {
        openInTab(fileUrl)
      }
    } catch (err) {
      console.error("Failed to open file", err)
      setRecordsError("Unable to open file. Please try downloading instead.")
    }
  }

  const uploadRecord = async () => {
    if (!patientIdForApi) return
    if (!uploadFileUrl) {
      setRecordsError("File is required")
      return
    }
    setUploadSaving(true)
    setRecordsError(null)
    try {
      const res = await fetch(`/api/patients/${patientIdForApi}/records`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recordType: uploadType,
          title: uploadTitle || uploadType,
          fileUrl: uploadFileUrl,
          uploadedBy: "Doctor",
        }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body?.error || "Failed to upload record")
      const newRecord = body.data as PatientRecord
      setRecords((prev) => [newRecord, ...prev])
      setShowUploadModal(false)
      setUploadFileUrl(undefined)
      setUploadTitle("")
    } catch (err: any) {
      setRecordsError(err?.message || "Failed to upload record")
    } finally {
      setUploadSaving(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading patient...</div>
  }

  if (error || !patient) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-700">Patient Not Found</h2>
        <p className="text-gray-500 mb-4">{error || "The patient does not exist."}</p>
        <Link href="/dentist/patients" className="text-blue-600 hover:underline">
          ← Back to Directory
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dentist/patients" className="text-sm text-gray-500 hover:underline mb-1 block">
            &larr; Back to Directory
          </Link>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            {patient.firstName} {patient.lastName}
            <span className="text-sm px-2 py-1 rounded-full bg-green-100 text-green-800">Active</span>
          </h1>
          <p className="text-gray-500">Code: {patient.patientCode || patient._id} - {patient.gender || "-"} - Age {calcAge(patient.dateOfBirth)}</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded bg-white text-gray-700 hover:bg-gray-50">Edit Profile</button>
          <button
            onClick={openScheduleModal}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Schedule Next Appointment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-gray-900 mb-4 border-b pb-2">Contact Information</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="block text-gray-500">Phone</span>
                <span className="text-gray-900 font-medium">{patient.phone || "—"}</span>
              </div>
              <div>
                <span className="block text-gray-500">Email</span>
                <span className="text-gray-900 font-medium">{patient.email || "—"}</span>
              </div>
              <div>
                <span className="block text-gray-500">Address</span>
                <span className="text-gray-900 font-medium">{patient.address || "—"}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-gray-900 mb-4 border-b pb-2">Demographics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Gender</span><span className="text-gray-900 font-medium">{patient.gender || "—"}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Date of Birth</span><span className="text-gray-900 font-medium">{formatDate(patient.dateOfBirth)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Age</span><span className="text-gray-900 font-medium">{calcAge(patient.dateOfBirth)}</span></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-gray-900 mb-4 border-b pb-2">Medical History</h3>
            {recordsLoading ? (
              <p className="text-sm text-gray-500">Loading records…</p>
            ) : historyRecords.length === 0 ? (
              <p className="text-sm text-gray-500">No patient records yet.</p>
            ) : (
              <ul className="space-y-2">
                {historyRecords.map((record) => (
                  <li key={record._id} className="border rounded p-3 bg-gray-50 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-gray-900">
                        {record.recordType}
                        {record.title ? ` – ${record.title}` : ""}
                      </span>
                      <span className="text-xs text-gray-500">{formatDate(record.date || record.createdAt)}</span>
                    </div>
                    {record.description && <p className="text-xs text-gray-700 mt-1">{record.description}</p>}
                    {record.fileUrl && (
                      <button
                        type="button"
                        onClick={() => openRecordFile(record.fileUrl)}
                        className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                      >
                        Open file
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <span className="text-sm text-blue-600 font-medium">Dentist</span>
              <p className="text-lg font-bold text-blue-900">{dentistName}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <span className="text-sm text-green-600 font-medium">Notes</span>
              <p className="text-sm text-green-900">{patient.notes || "No notes yet."}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <span className="text-sm text-purple-600 font-medium">Patient Code</span>
              <p className="text-sm font-mono text-purple-900 break-all">{patient.patientCode || patient._id}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-gray-900">Upcoming / Recent</h3>
              <p className="text-xs text-gray-500">Hook up to appointments/treatments later</p>
            </div>
            <div className="p-6 text-sm text-gray-500">No timeline items yet.</div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={openXrayModal}
              className="flex-1 bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-900 text-center transition"
            >
              View X-Rays
            </button>
            <button
              onClick={openNoteModal}
              className="flex-1 border-2 border-dashed border-gray-300 text-gray-500 p-4 rounded-lg hover:border-blue-400 hover:text-blue-600 transition"
            >
              + Add Clinical Note
            </button>
            <button
              onClick={openUploadModal}
              className="flex-1 border-2 border-gray-200 text-gray-700 p-4 rounded-lg hover:border-green-400 hover:text-green-700 transition"
            >
              + Upload Record
            </button>
          </div>
        </div>
      </div>

      <Dialog isOpen={showXrayModal} onClose={() => setShowXrayModal(false)} title="X-Ray Records">
        <div className="space-y-3">
          {recordsLoading && <p className="text-sm text-gray-500">Loading X-rays…</p>}
          {recordsError && <p className="text-sm text-red-600">{recordsError}</p>}
          {!recordsLoading && xrayRecords.length === 0 && <p className="text-sm text-gray-500">No X-rays yet.</p>}
          {xrayRecords.map((record) => (
            <div key={record._id} className="flex items-center justify-between rounded border px-3 py-2">
              <div>
                <p className="text-sm font-semibold text-gray-900">{record.title || "X-Ray"}</p>
                <p className="text-xs text-gray-500">{record.date ? formatDate(record.date) : "Date unknown"}</p>
              </div>
              {record.fileUrl ? (
                <button
                  type="button"
                  onClick={() => openRecordFile(record.fileUrl)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Open
                </button>
              ) : (
                <span className="text-xs text-gray-400">No file</span>
              )}
            </div>
          ))}
        </div>
      </Dialog>

      <Dialog isOpen={showNoteModal} onClose={() => setShowNoteModal(false)} title="Add Clinical Note">
        <div className="space-y-3">
          {recordsError && <p className="text-sm text-red-600">{recordsError}</p>}
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write a brief clinical note"
            rows={4}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowNoteModal(false)}
              className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={addClinicalNote}
              disabled={noteSaving}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {noteSaving ? "Saving..." : "Save Note"}
            </button>
          </div>
          {clinicalNotes.length > 0 && (
            <div className="pt-2 border-t space-y-2">
              {clinicalNotes.map((note) => (
                <div key={note._id} className="border rounded p-2 bg-gray-50">
                  <p className="text-gray-900">{note.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{note.date ? formatDate(note.date) : "Added"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Dialog>

      <Dialog isOpen={showScheduleModal} onClose={() => setShowScheduleModal(false)} title="Schedule Next Appointment">
        <div className="space-y-3">
          {scheduleError && <p className="text-sm text-red-600">{scheduleError}</p>}
          <label className="text-sm font-medium text-gray-700">Start</label>
          <input
            type="datetime-local"
            value={scheduleStart}
            onChange={(e) => setScheduleStart(e.target.value)}
            className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Duration (min)</label>
              <input
                type="number"
                min={5}
                max={240}
                value={scheduleDuration}
                onChange={(e) => setScheduleDuration(Number(e.target.value) || 0)}
                className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Type</label>
              <select
                value={scheduleType}
                onChange={(e) => setScheduleType(e.target.value as typeof scheduleType)}
                className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="checkup">Checkup</option>
                <option value="cleaning">Cleaning</option>
                <option value="x-ray">X-Ray</option>
                <option value="surgery">Surgery</option>
                <option value="ortho">Ortho</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={scheduleNotes}
              onChange={(e) => setScheduleNotes(e.target.value)}
              rows={3}
              className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Purpose, prep, or instructions"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShowScheduleModal(false)} className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button
              onClick={createAppointment}
              disabled={scheduleSaving}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {scheduleSaving ? "Scheduling..." : "Schedule"}
            </button>
          </div>
        </div>
      </Dialog>

      <Dialog isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} title="Upload Record">
        <div className="space-y-3">
          {recordsError && <p className="text-sm text-red-600">{recordsError}</p>}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Type</label>
              <select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value as typeof uploadType)}
                className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="X-Ray">X-Ray</option>
                <option value="Lab Result">Lab Result</option>
                <option value="Prescription">Prescription</option>
                <option value="Past Report">Past Report</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Title</label>
              <input
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="Optional title"
                className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">File</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => onUploadFile(e.target.files?.[0])}
              className="w-full text-sm"
            />
            {uploadFileUrl && <p className="text-xs text-green-600 mt-1">File ready to upload</p>}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShowUploadModal(false)} className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button
              onClick={uploadRecord}
              disabled={uploadSaving}
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
            >
              {uploadSaving ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
