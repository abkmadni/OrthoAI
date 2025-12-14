'use client'

import DropzoneUploader from '@/components/features/xray/dropzone-uploader'
import { useRouter } from 'next/navigation'

export default function DentistXrayLabPage() {
  const router = useRouter()

  const handleUploadComplete = (data: any) => {
    // Store result in localStorage for the detail page to pick up
    // In a real app, this would be stored in a database
    localStorage.setItem(`xray_result_${data.imageId}`, JSON.stringify(data))
    router.push(`/dentist/xray-lab/${data.imageId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">X-Ray Lab</h1>
      </div>

      <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-800">Add New Scan</h2>
            <p className="text-gray-600">Upload a patient's X-ray image for AI analysis.</p>
          </div>
          
          <DropzoneUploader onUploadComplete={handleUploadComplete} />
        </div>
      </div>

      {/* Placeholder for recent scans list */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Recent Scans</h3>
        <div className="bg-white border rounded-lg p-8 text-center text-gray-400">
          No recent scans found.
        </div>
      </div>
    </div>
  );
}
