"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import PatientSearch from "@/components/features/patients/patient-search";
import AddPatientButton from "@/components/features/patients/add-patient-button";
import Link from "next/link";

type Patient = {
  _id: string;
  patientCode?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dentist?: { _id: string; name?: string; email?: string } | string;
};

export default function DentistPatientsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.toLowerCase() ?? "";
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/patients", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load patients");
        const data = await res.json();
        if (active) setPatients(data.data ?? []);
      } catch (err: any) {
        if (active) setError(err.message || "Unable to load patients");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!query) return patients;
    return patients.filter((p) => {
      const name = `${p.firstName} ${p.lastName}`.toLowerCase();
      return name.includes(query) || p._id.toLowerCase().includes(query);
    });
  }, [patients, query]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Patient Directory</h1>
          <p className="text-sm text-gray-500">Live data from your database.</p>
        </div>
        <AddPatientButton />
      </div>

      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div className="w-full md:w-1/2">
          <PatientSearch placeholder="Search by name or ID..." />
        </div>
        <div className="text-sm text-gray-500">
          {loading ? "Loading..." : `Showing ${filtered.length} result${filtered.length === 1 ? "" : "s"}`}
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dentist</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {error && (
              <tr>
                <td colSpan={5} className="px-6 py-6 text-sm text-red-600">{error}</td>
              </tr>
            )}
            {!error && filtered.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                  {query ? `No patients found for "${query}"` : "No patients found."}
                </td>
              </tr>
            )}
            {!error && filtered.map((patient) => (
              <tr key={patient._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.patientCode || patient._id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{patient.firstName} {patient.lastName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {patient.email || "No email"}<br />
                  {patient.phone || "No phone"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {typeof patient.dentist === "string"
                    ? patient.dentist || "—"
                    : patient.dentist?.name || patient.dentist?._id || "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/dentist/patients/${patient._id}`} className="text-blue-600 hover:text-blue-900">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}