'use client'

import { Calendar, dateFnsLocalizer, View, Views } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useState, useCallback } from 'react'

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
const MOCK_EVENTS = [
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
  const [date, setDate] = useState(new Date(2024, 10, 29)) // Start at fixed date for demo

  const onNavigate = useCallback((newDate: Date) => setDate(newDate), [setDate])
  const onView = useCallback((newView: View) => setView(newView), [setView])

  // Custom styling for events
  const eventPropGetter = (event: any) => {
    const backgroundColor = event.status === 'confirmed' ? '#2563eb' : '#d97706'
    return { style: { backgroundColor } }
  }

  return (
    <div className="h-[600px] bg-white p-4 rounded-lg shadow-sm border">
      <Calendar
        localizer={localizer}
        events={MOCK_EVENTS}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        view={view}
        date={date}
        onView={onView}
        onNavigate={onNavigate}
        eventPropGetter={eventPropGetter}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
      />
    </div>
  )
}
