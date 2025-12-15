import CalendarScheduler from '@/components/features/appointments/calendar-scheduler'

export default function DentistSchedulePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Schedule</h1>
        <p className="text-sm text-gray-500">Select a slot or use the button to book.</p>
      </div>

      <CalendarScheduler />
    </div>
  );
}
