import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FileText, Upload, File, Image as ImageIcon, FlaskConical } from 'lucide-react'

// 1. SHARED MOCK DB (Should be in a separate file in real app, but fine here for prototype)
const MOCK_PATIENTS_DB = [
  { id: 'P-101', name: 'John Doe', age: 34, status: 'Active', gender: 'Male', email: 'john.doe@example.com', phone: '555-0101' },
  { id: 'P-102', name: 'Jane Smith', age: 28, status: 'Active', gender: 'Female', email: 'jane.smith@example.com', phone: '555-0102' },
  { id: 'P-103', name: 'Michael Brown', age: 45, status: 'Pending', gender: 'Male', email: 'm.brown@example.com', phone: '555-0103' },
  { id: 'P-104', name: 'Emily Davis', age: 52, status: 'Archived', gender: 'Female', email: 'emily.d@example.com', phone: '555-0104' },
  { id: 'P-105', name: 'Chris Wilson', age: 23, status: 'Active', gender: 'Male', email: 'chris.w@example.com', phone: '555-0105' },
  { id: 'P-106', name: 'Sarah Johnson', age: 39, status: 'Active', gender: 'Female', email: 'sarah.j@example.com', phone: '555-0106' },
  { id: 'P-107', name: 'David Lee', age: 61, status: 'Pending', gender: 'Male', email: 'david.lee@example.com', phone: '555-0107' },
  { id: 'P-108', name: 'Jessica Taylor', age: 29, status: 'Active', gender: 'Female', email: 'jessica.t@example.com', phone: '555-0108' },
  { id: 'P-109', name: 'Daniel Martinez', age: 35, status: 'Active', gender: 'Male', email: 'daniel.m@example.com', phone: '555-0109' },
  { id: 'P-110', name: 'Laura White', age: 42, status: 'Archived', gender: 'Female', email: 'laura.w@example.com', phone: '555-0110' },
]

// Default details to fill in the gaps
const DEFAULT_DETAILS = {
  dob: '1990-01-01', // Placeholder
  address: '123 Placeholder St, City',
  medicalHistory: [
    'Allergy to Penicillin',
    'Hypertension (controlled)',
    'Previous Root Canal (2021)'
  ],
  lastVisit: '2024-10-12',
  nextVisit: '2024-12-15',
  recentTreatments: [
    { date: '2024-10-12', procedure: 'Dental Cleaning', dentist: 'Dr. Smith', cost: '$120' },
    { date: '2024-05-20', procedure: 'Cavity Filling (Tooth 14)', dentist: 'Dr. Smith', cost: '$250' },
  ],
  // Mock Patient Records
  records: [
    { id: 1, title: 'Previous OPG X-Ray', type: 'X-Ray', date: '2023-05-10', uploadedBy: 'Patient' },
    { id: 2, title: 'Blood Test Results', type: 'Lab Result', date: '2024-01-15', uploadedBy: 'Doctor' },
    { id: 3, title: 'Antibiotics Prescription', type: 'Prescription', date: '2024-05-20', uploadedBy: 'Doctor' },
  ]
}

export default async function PatientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // 2. LOOKUP PATIENT
  const foundPatient = MOCK_PATIENTS_DB.find(p => p.id === id);

  if (!foundPatient) {
    return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-700">Patient Not Found</h2>
            <p className="text-gray-500 mb-4">The patient with ID "{id}" does not exist in our records.</p>
            <Link href="/dentist/patients" className="text-blue-600 hover:underline">
                ← Back to Directory
            </Link>
        </div>
    )
  }

  // Merge found data with default hardcoded details
  const patient = { ...DEFAULT_DETAILS, ...foundPatient };

  const getIconForRecordType = (type: string) => {
    switch (type) {
      case 'X-Ray': return <ImageIcon className="w-4 h-4 text-blue-500" />;
      case 'Prescription': return <FileText className="w-4 h-4 text-green-500" />;
      case 'Lab Result': return <FlaskConical className="w-4 h-4 text-purple-500" />;
      default: return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header / Breadcrumb */}
      <div className="flex items-center justify-between">
        <div>
            <Link href="/dentist/patients" className="text-sm text-gray-500 hover:underline mb-1 block">
              ← Back to Directory
            </Link>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              {patient.name}
              <span className={`text-sm px-2 py-1 rounded-full ${patient.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {patient.status}
              </span>
            </h1>
            <p className="text-gray-500">ID: {patient.id} • {patient.gender} • {patient.age} Years Old</p>
        </div>
        <div className="flex gap-2">
            <button className="px-4 py-2 border rounded bg-white text-gray-700 hover:bg-gray-50">
                Edit Profile
            </button>
            <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
                New Appointment
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Contact & Info */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-semibold text-gray-900 mb-4 border-b pb-2">Contact Information</h3>
                <div className="space-y-3 text-sm">
                    <div>
                        <span className="block text-gray-500">Phone</span>
                        <span className="text-gray-900 font-medium">{patient.phone}</span>
                    </div>
                    <div>
                        <span className="block text-gray-500">Email</span>
                        <span className="text-gray-900 font-medium">{patient.email}</span>
                    </div>
                    <div>
                        <span className="block text-gray-500">Address</span>
                        <span className="text-gray-900 font-medium">{patient.address}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-semibold text-gray-900 mb-4 border-b pb-2">Medical History</h3>
                <ul className="space-y-2">
                    {patient.medicalHistory.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-red-700 bg-red-50 p-2 rounded">
                           ⚠️ {item}
                        </li>
                    ))}
                </ul>
            </div>

            {/* NEW: Patient Records Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4 border-b pb-2">
                  <h3 className="font-semibold text-gray-900">Records & Files</h3>
                  <button className="text-xs flex items-center gap-1 text-blue-600 hover:underline">
                    <Upload className="w-3 h-3" /> Upload
                  </button>
                </div>
                <ul className="space-y-3">
                    {patient.records.map((record) => (
                        <li key={record.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded border border-transparent hover:border-gray-100 transition-colors group">
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-50 rounded-md">
                                {getIconForRecordType(record.type)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{record.title}</p>
                                <p className="text-xs text-gray-500">{record.date} • {record.type}</p>
                              </div>
                           </div>
                           <button className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 hover:underline">
                             View
                           </button>
                        </li>
                    ))}
                </ul>
                <div className="mt-4 pt-2 border-t text-center">
                   <button className="text-xs text-gray-500 hover:text-gray-900">View All Records</button>
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: Clinical Dashboard */}
        <div className="md:col-span-2 space-y-6">
             {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <span className="text-sm text-blue-600 font-medium">Last Visit</span>
                    <p className="text-lg font-bold text-blue-900">{patient.lastVisit}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <span className="text-sm text-green-600 font-medium">Next Appointment</span>
                    <p className="text-lg font-bold text-green-900">{patient.nextVisit}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <span className="text-sm text-purple-600 font-medium">Total Treatments</span>
                    <p className="text-lg font-bold text-purple-900">14</p>
                </div>
            </div>

            {/* Treatment History Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="font-semibold text-gray-900">Treatment History</h3>
                    <Link href={`/dentist/patients/${patient.id}/treatment-plan`} className="text-sm text-blue-600 hover:underline">
                        View Full Plan →
                    </Link>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Procedure</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dentist</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cost</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {patient.recentTreatments.map((tx, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-900">{tx.date}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{tx.procedure}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{tx.dentist}</td>
                                <td className="px-6 py-4 text-sm text-gray-900 text-right">{tx.cost}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

             <div className="flex gap-4">
                <Link 
                    href="/dentist/xray-lab" 
                    className="flex-1 bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-900 text-center transition"
                >
                    View X-Rays
                </Link>
                <button className="flex-1 border-2 border-dashed border-gray-300 text-gray-500 p-4 rounded-lg hover:border-blue-400 hover:text-blue-600 transition">
                    + Add Clinical Note
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
