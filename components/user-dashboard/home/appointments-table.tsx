"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AppointmentsDataTable } from "./appointments-data-table";
import { appointmentsColumns, type Appointment } from "./appointments-columns";
import { CalendarDays } from "lucide-react";

// Sample data for appointments
const sampleAppointments: Appointment[] = [
  {
    id: "apt-001",
    patientName: "John Doe",
    doctorName: "Dr. Sarah Wilson",
    date: "2024-01-15",
    time: "10:00 AM",
    status: "upcoming",
    type: "consultation",
    department: "Cardiology",
  },
  {
    id: "apt-002",
    patientName: "Jane Smith",
    doctorName: "Dr. Michael Brown",
    date: "2024-01-12",
    time: "2:30 PM",
    status: "completed",
    type: "follow-up",
    department: "Orthopedics",
  },
  {
    id: "apt-003",
    patientName: "Robert Johnson",
    doctorName: "Dr. Emily Davis",
    date: "2024-01-10",
    time: "9:15 AM",
    status: "completed",
    type: "routine",
    department: "General Medicine",
  },
  {
    id: "apt-004",
    patientName: "Maria Garcia",
    doctorName: "Dr. James Miller",
    date: "2024-01-08",
    time: "11:45 AM",
    status: "cancelled",
    type: "consultation",
    department: "Dermatology",
  },
  {
    id: "apt-005",
    patientName: "David Wilson",
    doctorName: "Dr. Lisa Anderson",
    date: "2024-01-18",
    time: "3:00 PM",
    status: "upcoming",
    type: "emergency",
    department: "Emergency",
  },
  {
    id: "apt-006",
    patientName: "Sarah Thompson",
    doctorName: "Dr. Mark Taylor",
    date: "2024-01-05",
    time: "1:15 PM",
    status: "rescheduled",
    type: "follow-up",
    department: "Neurology",
  },
];

interface AppointmentsTableProps {
  className?: string;
}

export function AppointmentsTable({ className }: AppointmentsTableProps) {
  return (
    <Card className={`border-gray-200 shadow-sm ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <CalendarDays className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg font-bold text-gray-900 font-heading">
            Appointments
          </CardTitle>
        </div>
        <CardDescription className="text-sm text-gray-600 mt-2">
          View and manage your upcoming, completed, and past medical
          appointments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AppointmentsDataTable
          columns={appointmentsColumns}
          data={sampleAppointments}
        />
      </CardContent>
    </Card>
  );
}
