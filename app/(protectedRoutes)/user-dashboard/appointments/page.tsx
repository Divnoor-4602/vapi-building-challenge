"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Id } from "@/convex/_generated/dataModel";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { format } from "date-fns";

interface Appointment {
  _id: Id<"appointments">;
  _creationTime: number;
  userId: Id<"users">;
  profileId: Id<"profiles">;
  ticketId?: Id<"medicalTickets">;
  title: string;
  description?: string;
  startTime: number;
  endTime: number;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  type: "checkup" | "consultation" | "follow_up" | "emergency" | "other";
  location: "in_person" | "virtual";
  meetingLink?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export default function AppointmentsPage() {
  const { user } = useUser();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Get the Convex user ID using the Clerk ID
  const convexUser = useQuery(api.users.getUserByClerkId, {
    clerkId: user?.id ?? "",
  });

  // Get user appointments from Convex
  const appointments = useQuery(
    api.appointments.getUserAppointments,
    convexUser ? {
      userId: convexUser._id,
      status: "scheduled",
    } : "skip"
  ) as Appointment[] | undefined;

  // Count upcoming appointments
  const upcomingAppointments = appointments?.filter(
    (appointment) => appointment.startTime > Date.now()
  ).length ?? 0;

  const handleEventClick = (info: any) => {
    const appointment = appointments?.find(
      (apt) => apt._id === info.event.id
    );
    if (appointment) {
      setSelectedAppointment(appointment);
      setIsDialogOpen(true);
    }
  };

  // Format appointments for FullCalendar
  const calendarEvents = appointments?.map((appointment) => ({
    id: appointment._id,
    title: appointment.title,
    start: new Date(appointment.startTime),
    end: new Date(appointment.endTime),
    backgroundColor: appointment.status === "scheduled" ? "#10b981" : 
                    appointment.status === "completed" ? "#6b7280" :
                    appointment.status === "cancelled" ? "#ef4444" : "#f59e0b",
    borderColor: appointment.status === "scheduled" ? "#059669" :
                appointment.status === "completed" ? "#4b5563" :
                appointment.status === "cancelled" ? "#dc2626" : "#d97706",
    extendedProps: {
      type: appointment.type,
      location: appointment.location,
      doctorName: appointment.doctorName,
      doctorSpecialty: appointment.doctorSpecialty,
      meetingLink: appointment.meetingLink,
      notes: appointment.notes,
    },
  })) ?? [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view your upcoming appointments
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {upcomingAppointments} Upcoming
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-2 border-gray-200">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[600px]">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                events={calendarEvents}
                eventClick={handleEventClick}
                businessHours={{
                  daysOfWeek: [1, 2, 3, 4, 5],
                  startTime: "09:00",
                  endTime: "17:00",
                }}
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
                allDaySlot={false}
                height="100%"
                eventTimeFormat={{
                  hour: "numeric",
                  minute: "2-digit",
                  meridiem: "short",
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 border-gray-200">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments?.filter(
                (appointment) => appointment.startTime > Date.now()
              ).sort(
                (a, b) => a.startTime - b.startTime
              ).map((appointment) => (
                <div
                  key={appointment._id}
                  className="flex items-start space-x-4 p-4 rounded-lg border bg-card"
                >
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">{appointment.title}</p>
                    <p className="text-sm text-muted-foreground">
                      with Dr. {appointment.doctorName} ({appointment.doctorSpecialty})
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(appointment.startTime), "PPP p")}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge variant={
                        appointment.location === "virtual" ? "secondary" : "outline"
                      }>
                        {appointment.location === "virtual" ? "Virtual" : "In Person"}
                      </Badge>
                      <Badge variant="outline">
                        {appointment.type.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedAppointment(appointment);
                      setIsDialogOpen(true);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              ))}

              {(!appointments || appointments.length === 0) && (
                <div className="text-center py-6 text-muted-foreground">
                  No upcoming appointments
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Doctor</h3>
                <p className="text-sm text-muted-foreground">
                  Dr. {selectedAppointment.doctorName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedAppointment.doctorSpecialty}
                </p>
              </div>

              <div>
                <h3 className="font-medium">Date & Time</h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(selectedAppointment.startTime), "PPP p")} -{" "}
                  {format(new Date(selectedAppointment.endTime), "p")}
                </p>
              </div>

              <div>
                <h3 className="font-medium">Location</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedAppointment.location === "virtual" ? "Virtual" : "In Person"}
                </p>
                {selectedAppointment.meetingLink && (
                  <a
                    href={selectedAppointment.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Join Meeting
                  </a>
                )}
              </div>

              <div>
                <h3 className="font-medium">Status</h3>
                <Badge
                  variant={
                    selectedAppointment.status === "scheduled"
                      ? "default"
                      : selectedAppointment.status === "completed"
                      ? "secondary"
                      : selectedAppointment.status === "cancelled"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {selectedAppointment.status.replace("_", " ")}
                </Badge>
              </div>

              {selectedAppointment.notes && (
                <div>
                  <h3 className="font-medium">Notes</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedAppointment.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
