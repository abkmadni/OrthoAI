'use client'

import { useState, useRef } from 'react'
import { uploadXray } from '@/actions/xray'

export default function DropzoneUploader() {
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
      setMessage(null)
    }
  }

  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.[0]) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', fileInputRef.current.files[0])

    try {
      const result = await uploadXray(formData)
      if (result.success) {
        setMessage(result.message || 'Upload successful!')
        setPreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
      } else {
        setMessage(result.error || 'Upload failed')
      }
    } catch (error) {
      setMessage('An unexpected error occurred')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border border-dashed border-gray-300 text-center">
      <h3 className="text-lg font-semibold mb-4">Upload X-Ray Scan</h3>
      
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100
          cursor-pointer mb-4"
      />

      {preview && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Preview:</p>
          <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded shadow-sm" />
        </div>
      )}

      <div className="flex gap-2 justify-center">
        <button
          onClick={handleUpload}
          disabled={!preview || uploading}
          className={`px-4 py-2 rounded text-white font-medium transition-colors
            ${!preview || uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {uploading ? 'Uploading...' : 'Upload Scan'}
        </button>
        
        {preview && (
          <button
             onClick={() => {
               setPreview(null);
               setMessage(null);
               if (fileInputRef.current) fileInputRef.current.value = '';
             }}
             className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 text-gray-700"
          >
            Cancel
          </button>
        )}
      </div>

      {message && (
        <div className={`mt-4 text-sm p-2 rounded ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}
    </div>
  )
}
