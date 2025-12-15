"use client"

import Link from "next/link"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Manage users, access all dashboards, and configure settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <h3 className="font-semibold text-gray-900">User Management</h3>
          <p className="text-sm text-gray-500">Add dentists, staff, and admins. Revoke access when needed.</p>
          <Link href="/admin/users" className="mt-3 inline-block px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm">
            Manage Users
          </Link>
        </div>
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <h3 className="font-semibold text-gray-900">Settings</h3>
          <p className="text-sm text-gray-500">Clinic and platform configuration.</p>
          <Link href="/admin/settings" className="mt-3 inline-block px-3 py-2 rounded bg-slate-700 text-white hover:bg-slate-800 text-sm">
            Open Settings
          </Link>
        </div>
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <h3 className="font-semibold text-gray-900">Dashboards</h3>
          <p className="text-sm text-gray-500">Jump into dentist or staff views for testing.</p>
          <div className="flex gap-2 mt-3 text-sm">
            <Link href="/dentist" className="px-3 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700">
              Dentist
            </Link>
            <Link href="/receptionist" className="px-3 py-2 rounded bg-amber-600 text-white hover:bg-amber-700">
              Staff
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
