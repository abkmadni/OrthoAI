'use client'

import BoundingBoxCanvas from '@/components/features/xray/bounding-box-canvas'
import DownloadReportButton from '@/components/features/xray/download-report-button'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function XrayResultPage() {
  const params = useParams()
  const id = params?.id as string
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      const storedData = localStorage.getItem(`xray_result_${id}`)
      if (storedData) {
        setData(JSON.parse(storedData))
      }
      setLoading(false)
    }
  }, [id])

  if (loading) {
    return <div>Loading analysis...</div>
  }

  if (!data) {
    return <div>Analysis not found. Please try uploading again.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
            <h1 className="text-3xl font-bold">X-Ray Analysis Results</h1>
            <p className="text-gray-500">Scan ID: #{id}</p>
            <p className="text-blue-600 font-semibold mt-1">Detected Type: {data.type}</p>
        </div>
        <div className="flex gap-2">
             {/* Client Component handles the download logic */}
            <DownloadReportButton reportRefId="printable-report-area" scanId={id} />
            
            <button className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50">
                Start Treatment
            </button>
        </div>
      </div>

      {/* WRAPPER ID for PDF Generation - Using explicit HEX colors for html2canvas compatibility */}
      <div id="printable-report-area" className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 rounded-xl" style={{ backgroundColor: '#ffffff', color: '#111827' }}>
        
        {/* LEFT: Main Viewer */}
        <div className="lg:col-span-2 border rounded-lg shadow-sm overflow-hidden" style={{ borderColor: '#e5e7eb' }}>
            <div className="p-2 border-b text-sm font-medium" style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb', color: '#6b7280' }}>Visual Analysis</div>
            <div className="p-2">
               <BoundingBoxCanvas imageUrl={data.imageUrl} issues={data.issues} />
            </div>
        </div>

        {/* RIGHT: Findings List */}
        <div className="space-y-4">
            <div className="p-4 rounded-lg border" style={{ backgroundColor: '#f9fafb', borderColor: '#f3f4f6' }}>
                <h3 className="font-semibold text-lg mb-4" style={{ color: '#1f2937' }}>Detected Issues (AI)</h3>
                <div className="space-y-3">
                    {data.issues.map((issue: any) => (
                        <div key={issue.id} className="flex items-start gap-3 p-3 rounded-md border shadow-sm" style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}>
                            <div 
                                className="w-4 h-4 mt-1 rounded-full flex-shrink-0" 
                                style={{ backgroundColor: issue.color }}
                            />
                            <div>
                                <p className="font-medium" style={{ color: '#111827' }}>{issue.label}</p>
                                <p className="text-sm" style={{ color: '#6b7280' }}>Confidence: {Math.round(issue.confidence * 100)}%</p>
                            </div>
                        </div>
                    ))}
                    {data.issues.length === 0 && (
                        <p className="text-gray-500 italic">No issues detected.</p>
                    )}
                </div>
            </div>

             <div className="p-4 rounded-lg border shadow-sm" style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}>
                <h3 className="font-semibold text-lg mb-2" style={{ color: '#1f2937' }}>Notes</h3>
                <div className="p-3 border rounded text-sm italic min-h-[100px]" style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb', color: '#4b5563' }}>
                  (Notes entered here will appear in the PDF)
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}