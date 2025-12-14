'use client'

import { Calendar, dateFnsLocalizer, View, Views, SlotInfo } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useState, useCallback } from 'react'
import { Dialog } from '@/components/ui/dialog'

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

// Mock Data
const INITIAL_EVENTS = [
  {
    id: 1,
    title: 'Dental Cleaning - John Doe',
    start: new Date(2024, 10, 29, 10, 0), // Note: Month is 0-indexed (10 = Nov)
    end: new Date(2024, 10, 29, 11, 0),
    resource: 'Dr. Smith',
    status: 'confirmed'
  },
  {
    id: 2,
    title: 'Root Canal - Sarah Johnson',
    start: new Date(2024, 10, 29, 14, 0),
    end: new Date(2024, 10, 29, 15, 30),
    resource: 'Dr. Smith',
    status: 'pending'
  },
  {
    id: 3,
    title: 'Checkup - Jane Smith',
    start: new Date(2024, 10, 30, 9, 30),
    end: new Date(2024, 10, 30, 10, 0),
    resource: 'Dr. Lee',
    status: 'confirmed'
  },
]

export default function CalendarScheduler() {
  const [view, setView] = useState<View>(Views.WEEK)
  const [date, setDate] = useState(new Date(2024, 10, 29))
  const [events, setEvents] = useState(INITIAL_EVENTS)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null)
  const [newEventTitle, setNewEventTitle] = useState('')

  const onNavigate = useCallback((newDate: Date) => setDate(newDate), [setDate])
  const onView = useCallback((newView: View) => setView(newView), [setView])

  const handleSelectSlot = useCallback(
    (slotInfo: SlotInfo) => {
      setSelectedSlot(slotInfo)
      setNewEventTitle('')
      setIsModalOpen(true)
    },
    []
  )

  const handleSaveEvent = () => {
    if (newEventTitle && selectedSlot) {
      const newEvent = {
        id: events.length + 1,
        title: newEventTitle,
        start: selectedSlot.start as Date,
        end: selectedSlot.end as Date,
        resource: 'Dr. Smith',
        status: 'confirmed'
      }
      setEvents([...events, newEvent])
      setIsModalOpen(false)
    }
  }

  // Custom styling for events
  const eventPropGetter = (event: any) => {
    // Use CSS variables for colors if possible, or map to the theme colors
    // Note: react-big-calendar expects inline styles with hex/rgb usually, 
    // but we can try to use the computed style or just hardcode the theme mapping here for now
    // to keep it simple while respecting the "blue" theme.
    const backgroundColor = event.status === 'confirmed' ? 'var(--primary)' : '#d97706'
    return { style: { backgroundColor } }
  }

  return (
    <>
      <div className="h-[600px] bg-background p-4 rounded-lg shadow-sm border border-border">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          view={view}
          date={date}
          onView={onView}
          onNavigate={onNavigate}
          eventPropGetter={eventPropGetter}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          selectable
          onSelectSlot={handleSelectSlot}
        />
      </div>

      <Dialog 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="New Appointment"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Appointment Title
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              placeholder="e.g., Cleaning - Patient Name"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              autoFocus
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Time: {selectedSlot?.start.toLocaleString()}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-foreground bg-secondary rounded-md hover:bg-muted"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEvent}
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:opacity-90"
            >
              Save Appointment
            </button>
          </div>
        </div>
      </Dialog>
    </>
  )
}
