"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { UserRole } from "@/lib/role-storage"

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "dentist", label: "Dentist" },
  { value: "staff", label: "Staff / Receptionist" },
]

type AdminUser = {
  _id: string
  name: string
  email: string
  role: UserRole
  active?: boolean
  createdAt?: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState<{ name: string; email: string; role: UserRole }>({
    name: "",
    email: "",
    role: "dentist",
  })

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
  }, [users])

  const loadUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/users", { cache: "no-store" })
      const body = await res.json().catch(() => ({}))
      if (!res.ok || body.success === false) throw new Error(body.error || "Failed to load users")
      setUsers(body.data || [])
    } catch (err: any) {
      setError(err?.message || "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const createUser = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required")
      return
    }
    setSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok || body.success === false) throw new Error(body.error || "Failed to create user")
      setUsers((prev) => [body.data, ...prev])
      setForm({ name: "", email: "", role: "dentist" })
    } catch (err: any) {
      setError(err?.message || "Failed to create user")
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (user: AdminUser) => {
    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !user.active }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok || body.success === false) throw new Error(body.error || "Failed to update user")
      setUsers((prev) => prev.map((u) => (u._id === user._id ? body.data : u)))
    } catch (err: any) {
      setError(err?.message || "Failed to update user")
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" })
      const body = await res.json().catch(() => ({}))
      if (!res.ok || body.success === false) throw new Error(body.error || "Failed to delete user")
      setUsers((prev) => prev.filter((u) => u._id !== userId))
    } catch (err: any) {
      setError(err?.message || "Failed to delete user")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500">Create admins, dentists, and staff. Revoke or delete accounts.</p>
        </div>
        <Link href="/admin" className="text-sm text-blue-600 hover:underline">
          ← Back to Admin
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="border rounded-lg p-4 bg-white shadow-sm lg:col-span-1">
          <h3 className="font-semibold text-gray-900">Add User</h3>
          <div className="space-y-3 mt-3">
            <div>
              <label className="text-sm text-gray-700">Full Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700">Email</label>
              <input
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="user@example.com"
                type="email"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserRole }))}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={createUser}
              disabled={saving}
              className="w-full bg-blue-600 text-white rounded px-3 py-2 text-sm hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Create User"}
            </button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-900">Users</h3>
              <p className="text-xs text-gray-500">Active users can sign in; revoked users are disabled.</p>
            </div>
            <button
              onClick={loadUsers}
              className="text-sm text-blue-600 hover:underline"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500">Loading users...</p>
          ) : sortedUsers.length === 0 ? (
            <p className="text-sm text-gray-500">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Role</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.map((user) => (
                    <tr key={user._id} className="border-b last:border-b-0">
                      <td className="py-2 pr-4 font-medium text-gray-900">{user.name}</td>
                      <td className="py-2 pr-4 text-gray-700">{user.email}</td>
                      <td className="py-2 pr-4 capitalize">{user.role}</td>
                      <td className="py-2 pr-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            user.active === false ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                          }`}
                        >
                          {user.active === false ? "Revoked" : "Active"}
                        </span>
                      </td>
                      <td className="py-2 space-x-2">
                        <button
                          onClick={() => toggleActive(user)}
                          className="text-xs px-3 py-1 rounded border text-gray-700 hover:bg-gray-50"
                        >
                          {user.active === false ? "Restore" : "Revoke"}
                        </button>
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="text-xs px-3 py-1 rounded border border-red-200 text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
