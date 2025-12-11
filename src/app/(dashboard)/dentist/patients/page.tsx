import PatientSearch from '@/components/features/patients/patient-search'
import AddPatientButton from '@/components/features/patients/add-patient-button'
import Link from 'next/link'

// MOCK DATA
const MOCK_PATIENTS = [
  { id: 'P-101', name: 'John Doe', age: 34, phone: '555-0101', lastVisit: '2024-10-12', status: 'Active' },
  { id: 'P-102', name: 'Jane Smith', age: 28, phone: '555-0102', lastVisit: '2024-09-28', status: 'Active' },
  { id: 'P-103', name: 'Michael Brown', age: 45, phone: '555-0103', lastVisit: '2024-11-01', status: 'Pending' },
  { id: 'P-104', name: 'Emily Davis', age: 52, phone: '555-0104', lastVisit: '2024-08-15', status: 'Archived' },
  { id: 'P-105', name: 'Chris Wilson', age: 23, phone: '555-0105', lastVisit: '2024-11-15', status: 'Active' },
  { id: 'P-106', name: 'Sarah Johnson', age: 39, phone: '555-0106', lastVisit: '2024-10-30', status: 'Active' },
  { id: 'P-107', name: 'David Lee', age: 61, phone: '555-0107', lastVisit: '2024-07-22', status: 'Pending' },
  { id: 'P-108', name: 'Jessica Taylor', age: 29, phone: '555-0108', lastVisit: '2024-11-10', status: 'Active' },
  { id: 'P-109', name: 'Daniel Martinez', age: 35, phone: '555-0109', lastVisit: '2024-09-05', status: 'Active' },
  { id: 'P-110', name: 'Laura White', age: 42, phone: '555-0110', lastVisit: '2024-10-01', status: 'Archived' },
]

export default async function DentistPatientsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>
}) {
  const query = (await searchParams).query || ''
  
  const filteredPatients = MOCK_PATIENTS.filter((patient) => {
    const lowerQuery = query.toLowerCase()
    return (
      patient.name.toLowerCase().includes(lowerQuery) ||
      patient.id.toLowerCase().includes(lowerQuery)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Patient Directory</h1>
        <AddPatientButton />
      </div>

      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div className="w-full md:w-1/2">
          <PatientSearch placeholder="Search by Name or ID (e.g., P-101)..." />
        </div>
        <div className="text-sm text-gray-500">
          Showing {filteredPatients.length} results
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.age}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.lastVisit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${patient.status === 'Active' ? 'bg-green-100 text-green-800' : 
                        patient.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/dentist/patients/${patient.id}`} className="text-blue-600 hover:text-blue-900">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                  No patients found matching "{query}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}