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
import { appointmentsColumns } from "./appointments-columns";
import { CalendarDays } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

interface AppointmentsTableProps {
  className?: string;
}

export function AppointmentsTable({ className }: AppointmentsTableProps) {
  const { user } = useUser();

  // Fetch appointments for the current user
  const appointments = useQuery(
    api.appointments.getAppointmentsByClerkId,
    user?.id ? { clerkId: user.id, limit: 10 } : "skip"
  );

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
          data={appointments || []}
        />
      </CardContent>
    </Card>
  );
}
