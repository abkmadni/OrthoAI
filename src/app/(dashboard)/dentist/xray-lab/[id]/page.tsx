import BoundingBoxCanvas from '@/components/features/xray/bounding-box-canvas'
import DownloadReportButton from '@/components/features/xray/download-report-button'

// 1. MOCK DATA (Simulating what DB/Python would return)
const MOCK_XRAY_URL = "https://prod-images-static.radiopaedia.org/images/1568739/5917493c52519577c645df92178479_jumbo.jpg" // Public sample X-ray
const MOCK_AI_RESULTS = [
  {
    id: "1",
    label: "Cavity",
    confidence: 0.98,
    x: 150, // Absolute pixel coordinates on original image
    y: 250,
    width: 60,
    height: 60,
    color: "#ef4444" // Red
  },
  {
    id: "2",
    label: "Root Canal Needed",
    confidence: 0.85,
    x: 320,
    y: 210,
    width: 80,
    height: 100,
    color: "#f59e0b" // Amber
  }
]

export default async function XrayResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
            <h1 className="text-3xl font-bold">X-Ray Analysis Results</h1>
            <p className="text-gray-500">Scan ID: #{id}</p>
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
               <BoundingBoxCanvas imageUrl={MOCK_XRAY_URL} issues={MOCK_AI_RESULTS} />
            </div>
        </div>

        {/* RIGHT: Findings List */}
        <div className="space-y-4">
            <div className="p-4 rounded-lg border" style={{ backgroundColor: '#f9fafb', borderColor: '#f3f4f6' }}>
                <h3 className="font-semibold text-lg mb-4" style={{ color: '#1f2937' }}>Detected Issues (AI)</h3>
                <div className="space-y-3">
                    {MOCK_AI_RESULTS.map((issue) => (
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