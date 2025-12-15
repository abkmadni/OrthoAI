"use client";

import { useEffect, useState } from "react";

type Appt = {
  _id: string;
  title: string;
  start: string;
  end: string;
  status: string;
  type: string;
  notes?: string;
};

export default function ReceptionistAppointmentsPage() {
  const [items, setItems] = useState<Appt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Appt | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/appointments", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load appointments");
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
      const res = await fetch(`/api/appointments/${editing._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: editing.status, notes: editing.notes, type: editing.type }),
      });
      if (!res.ok) throw new Error("Failed to update appointment");
      const { data } = await res.json();
      setItems((prev) => prev.map((a) => (a._id === data._id ? { ...a, ...data } : a)));
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
        <h1 className="text-2xl font-semibold text-gray-900">Appointments</h1>
        <p className="text-sm text-gray-500">Manage bookings and arrivals.</p>
      </div>

      <div className="rounded-xl border bg-white shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Upcoming</h3>
          {loading && <span className="text-xs text-gray-500">Loading…</span>}
          {error && <span className="text-xs text-red-600">{error}</span>}
        </div>
        <div className="divide-y">
          {items.length === 0 && !loading && !error && (
            <div className="p-4 text-sm text-gray-500">No appointments found.</div>
          )}
          {items.map((appt) => (
            <div key={appt._id} className="p-4 flex items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="font-medium text-gray-900">{appt.title}</p>
                <p className="text-xs text-gray-500">
                  {new Date(appt.start).toLocaleString()} – {new Date(appt.end).toLocaleTimeString()}
                </p>
                <p className="text-xs text-gray-500">Type: {appt.type}</p>
                {appt.notes && <p className="text-xs text-gray-500">Notes: {appt.notes}</p>}
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-teal-50 text-teal-700 capitalize">
                {appt.status}
              </span>
              <button
                onClick={() => setEditing(appt)}
                className="text-xs px-3 py-1 rounded border border-gray-200 hover:border-teal-500 hover:text-teal-700 transition-colors"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Edit appointment</h3>
              <button onClick={() => setEditing(null)} className="text-sm text-gray-500">Close</button>
            </div>
            <div className="grid gap-3">
              <label className="text-xs text-gray-500">Status</label>
              <select
                className="rounded border p-2"
                value={editing.status}
                onChange={(e) => setEditing({ ...editing, status: e.target.value })}
              >
                <option value="scheduled">scheduled</option>
                <option value="completed">completed</option>
                <option value="cancelled">cancelled</option>
                <option value="no-show">no-show</option>
              </select>
              <label className="text-xs text-gray-500">Type</label>
              <input
                className="rounded border p-2"
                value={editing.type}
                onChange={(e) => setEditing({ ...editing, type: e.target.value })}
              />
              <label className="text-xs text-gray-500">Notes</label>
              <textarea
                className="rounded border p-2"
                value={editing.notes || ""}
                onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
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
