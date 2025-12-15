"use client";

import { useState } from "react";

type PatientPayload = {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
};

type ApptPayload = {
  title: string;
  start: string;
  end: string;
  type: string;
  notes?: string;
};

export default function ReceptionistDashboard() {
  const [openPatient, setOpenPatient] = useState(false);
  const [openAppt, setOpenAppt] = useState(false);
  const [patientForm, setPatientForm] = useState<PatientPayload>({ firstName: "", lastName: "", email: "", phone: "" });
  const [apptForm, setApptForm] = useState<ApptPayload>({ title: "", start: "", end: "", type: "checkup", notes: "" });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submitPatient = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const payload = {
        ...patientForm,
        dateOfBirth: new Date().toISOString(),
        gender: "other",
        medicalHistory: [],
        dentist: undefined,
      };
      const res = await fetch("/api/patients", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Failed to create patient");
      setMessage("Patient created");
      setOpenPatient(false);
      setPatientForm({ firstName: "", lastName: "", email: "", phone: "" });
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };

  const submitAppt = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...apptForm,
          start: new Date(apptForm.start).toISOString(),
          end: new Date(apptForm.end).toISOString(),
          patient: undefined,
          dentist: undefined,
          status: "scheduled",
        }),
      });
      if (!res.ok) throw new Error("Failed to create appointment");
      setMessage("Appointment created");
      setOpenAppt(false);
      setApptForm({ title: "", start: "", end: "", type: "checkup", notes: "" });
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Receptionist Dashboard</h1>
        <p className="text-muted-foreground text-gray-500 mt-1">
          Front desk overview: today’s appointments and quick actions.
        </p>
        {message && <p className="text-sm text-emerald-600 mt-2">{message}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Check-ins pending</p>
          <p className="text-2xl font-bold">4</p>
          <p className="text-xs text-orange-600 mt-1">Verify insurance on arrival</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Today’s appointments</p>
          <p className="text-2xl font-bold">12</p>
          <p className="text-xs text-gray-500 mt-1">3 new bookings</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Waiting room</p>
          <p className="text-2xl font-bold">3</p>
          <p className="text-xs text-gray-500 mt-1">2 are late</p>
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm">
        <div className="p-5 border-b">
          <h3 className="font-semibold text-gray-900">Quick actions</h3>
        </div>
        <div className="p-5 grid gap-3 md:grid-cols-2">
          <button
            onClick={() => setOpenAppt(true)}
            className="rounded-lg border border-dashed border-gray-300 p-4 text-left hover:border-teal-500 hover:bg-teal-50 transition-colors"
          >
            <p className="font-semibold text-gray-800">Book a new appointment</p>
            <p className="text-sm text-gray-500">Find a slot and assign a provider</p>
          </button>
          <button
            onClick={() => setOpenPatient(true)}
            className="rounded-lg border border-dashed border-gray-300 p-4 text-left hover:border-teal-500 hover:bg-teal-50 transition-colors"
          >
            <p className="font-semibold text-gray-800">Register a new patient</p>
            <p className="text-sm text-gray-500">Capture contact and insurance details</p>
          </button>
        </div>
      </div>

      {/* Patient modal */}
      {openPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Register patient</h3>
              <button onClick={() => setOpenPatient(false)} className="text-sm text-gray-500">Close</button>
            </div>
            <div className="grid gap-3">
              <input className="rounded border p-2" placeholder="First name" value={patientForm.firstName} onChange={(e) => setPatientForm({ ...patientForm, firstName: e.target.value })} />
              <input className="rounded border p-2" placeholder="Last name" value={patientForm.lastName} onChange={(e) => setPatientForm({ ...patientForm, lastName: e.target.value })} />
              <input className="rounded border p-2" placeholder="Email" value={patientForm.email} onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })} />
              <input className="rounded border p-2" placeholder="Phone" value={patientForm.phone} onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setOpenPatient(false)} className="px-4 py-2 text-sm rounded border">Cancel</button>
              <button disabled={busy} onClick={submitPatient} className="px-4 py-2 text-sm rounded bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment modal */}
      {openAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Book appointment</h3>
              <button onClick={() => setOpenAppt(false)} className="text-sm text-gray-500">Close</button>
            </div>
            <div className="grid gap-3">
              <input className="rounded border p-2" placeholder="Title" value={apptForm.title} onChange={(e) => setApptForm({ ...apptForm, title: e.target.value })} />
              <label className="text-xs text-gray-500">Start</label>
              <input type="datetime-local" className="rounded border p-2" value={apptForm.start} onChange={(e) => setApptForm({ ...apptForm, start: e.target.value })} />
              <label className="text-xs text-gray-500">End</label>
              <input type="datetime-local" className="rounded border p-2" value={apptForm.end} onChange={(e) => setApptForm({ ...apptForm, end: e.target.value })} />
              <input className="rounded border p-2" placeholder="Type (checkup/cleaning/etc)" value={apptForm.type} onChange={(e) => setApptForm({ ...apptForm, type: e.target.value })} />
              <textarea className="rounded border p-2" placeholder="Notes" value={apptForm.notes} onChange={(e) => setApptForm({ ...apptForm, notes: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setOpenAppt(false)} className="px-4 py-2 text-sm rounded border">Cancel</button>
              <button disabled={busy} onClick={submitAppt} className="px-4 py-2 text-sm rounded bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
