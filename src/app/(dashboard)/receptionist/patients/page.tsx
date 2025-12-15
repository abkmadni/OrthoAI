"use client";

import { useEffect, useState } from "react";

type Patient = {
  _id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
};

export default function ReceptionistPatientsPage() {
  const [items, setItems] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Patient | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/patients", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load patients");
        const data = await res.json();
        if (active) setItems(data.data ?? []);
      } catch (err: any) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/patients/${editing._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: editing.firstName,
          lastName: editing.lastName,
          email: editing.email,
          phone: editing.phone,
        }),
      });
      if (!res.ok) throw new Error("Failed to update patient");
      const { data } = await res.json();
      setItems((prev) => prev.map((p) => (p._id === data._id ? { ...p, ...data } : p)));
      setEditing(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Patients</h1>
        <p className="text-sm text-gray-500">Search and intake patients.</p>
      </div>

      <div className="rounded-xl border bg-white shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">All patients</h3>
          {loading && <span className="text-xs text-gray-500">Loading…</span>}
          {error && <span className="text-xs text-red-600">{error}</span>}
        </div>
        <div className="divide-y">
          {items.length === 0 && !loading && !error && (
            <div className="p-4 text-sm text-gray-500">No patients found.</div>
          )}
          {items.map((p) => (
            <div key={p._id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="font-medium text-gray-900">{p.firstName} {p.lastName}</p>
                <p className="text-xs text-gray-500">{p.email || "No email"}</p>
                <p className="text-xs text-gray-500">{p.phone || "No phone"}</p>
              </div>
              <div className="flex gap-2 text-xs text-gray-500">
                <button
                  onClick={() => setEditing(p)}
                  className="px-3 py-1 rounded border border-gray-200 hover:border-teal-500 hover:text-teal-700 transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Edit patient</h3>
              <button onClick={() => setEditing(null)} className="text-sm text-gray-500">Close</button>
            </div>
            <div className="grid gap-3">
              <input
                className="rounded border p-2"
                value={editing.firstName}
                onChange={(e) => setEditing({ ...editing, firstName: e.target.value })}
              />
              <input
                className="rounded border p-2"
                value={editing.lastName}
                onChange={(e) => setEditing({ ...editing, lastName: e.target.value })}
              />
              <input
                className="rounded border p-2"
                value={editing.email || ""}
                onChange={(e) => setEditing({ ...editing, email: e.target.value })}
              />
              <input
                className="rounded border p-2"
                value={editing.phone || ""}
                onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm rounded border">Cancel</button>
              <button
                disabled={saving}
                onClick={saveEdit}
                className="px-4 py-2 text-sm rounded bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
