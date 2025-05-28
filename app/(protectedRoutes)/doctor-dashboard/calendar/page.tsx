"use client";

import FullCalendar from "@fullcalendar/react";
import React from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import interactionPlugin from "@fullcalendar/interaction";
import { useGoogleCalendar } from "@/hooks/use-google-calendar";

/**
 * Calendar Component
 *
 * @component
 * @description A full-featured calendar interface for doctors that displays their appointments
 * and schedules. It includes the following features:
 * - Integration with Google Calendar
 * - Multiple view options (month, week, day)
 * - Business hours indication
 * - Real-time event updates
 * - Interactive event clicking with external links opening in new tabs
 */
const Calendar = () => {
  const { events, isLoading, error, hasGoogleAccount } = useGoogleCalendar();

  // Loading state with spinner animation
  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Error handling and Google Calendar connection status
  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <p className="mt-2 text-sm text-red-700">{error}</p>
          {!hasGoogleAccount && (
            <p className="mt-2 text-sm text-red-700">
              Please connect your Google Calendar to view events.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 lg:max-w-[1200px] mx-auto">
      <FullCalendar
        eventClick={(info) => {
          if (info.event.url) {
            window.open(info.event.url, "_blank");
            info.jsEvent.preventDefault(); // prevents current tab from navigating
          }
        }}
        timeZone="local"
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          googleCalendarPlugin,
          interactionPlugin,
        ]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        height="auto"
        nowIndicator={true}
        businessHours={{
          daysOfWeek: [1, 2, 3, 4, 5, 6, 7], // Monday - Sunday
          startTime: "09:00",
          endTime: "17:00",
        }}
        slotMinTime="08:30:00"
        slotMaxTime="18:00:00"
      />
    </div>
  );
};

export default Calendar;
