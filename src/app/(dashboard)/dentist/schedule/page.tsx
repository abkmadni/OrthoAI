import CalendarScheduler from '@/components/features/appointments/calendar-scheduler'

export default function DentistSchedulePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Schedule</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + New Appointment
        </button>
      </div>
      
      {/* Client Calendar Component */}
      <CalendarScheduler />
    </div>
  );
}
