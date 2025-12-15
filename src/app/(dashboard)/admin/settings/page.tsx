"use client"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-sm text-gray-500">Configure global or clinic-wide options. Extend this page as needed.</p>
      </div>

      <div className="border rounded-lg p-4 bg-white shadow-sm space-y-2">
        <p className="text-sm text-gray-700">Placeholder for branding, feature flags, and billing controls.</p>
        <p className="text-xs text-gray-500">Add form fields here to persist settings into `ClinicSettings` or other models.</p>
      </div>
    </div>
  )
}
