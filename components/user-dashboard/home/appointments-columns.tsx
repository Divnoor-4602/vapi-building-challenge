"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Calendar, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Appointment = {
  _id: string;
  _creationTime: number;
  summary: string;
  startDateTime: string;
  endDateTime: string;
  timeZone: string;
  status: "cancelled" | "completed" | "confirmed";
  notes?: string;
  createdAt: number;
  doctor: {
    _id: string;
    name: string;
    email: string;
  };
  patient: {
    _id: string;
    name: string;
    email: string;
  };
  profile: {
    _id: string;
    firstName: string;
    lastName: string;
  };
};

const statusVariants = {
  upcoming: "bg-blue-100 text-blue-800 hover:bg-blue-200", // mapped from "confirmed"
  completed: "bg-green-100 text-green-800 hover:bg-green-200",
  cancelled: "bg-red-100 text-red-800 hover:bg-red-200",
};

const statusLabels = {
  confirmed: "Upcoming",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const appointmentsColumns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "profile",
    header: "Patient",
    cell: ({ row }) => {
      const profile = row.getValue("profile") as Appointment["profile"];
      return (
        <div className="font-medium">
          {profile.firstName} {profile.lastName}
        </div>
      );
    },
  },
  {
    accessorKey: "doctor",
    header: "Doctor",
    cell: ({ row }) => {
      const doctor = row.getValue("doctor") as Appointment["doctor"];
      return <div className="text-sm text-gray-600">{doctor.name}</div>;
    },
  },
  {
    accessorKey: "startDateTime",
    header: "Date",
    cell: ({ row }) => {
      const startDateTime = row.getValue("startDateTime") as string;
      const date = new Date(startDateTime);
      return (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm">
            {date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "startDateTime",
    header: "Time",
    id: "time",
    cell: ({ row }) => {
      const startDateTime = row.getValue("startDateTime") as string;
      const date = new Date(startDateTime);
      return (
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm">
            {date.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "summary",
    header: "Appointment",
    cell: ({ row }) => (
      <div className="text-sm text-gray-600 max-w-[200px] truncate">
        {row.getValue("summary")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as keyof typeof statusLabels;
      const displayStatus = status === "confirmed" ? "upcoming" : status;
      return (
        <Badge variant="secondary" className={statusVariants[displayStatus]}>
          {statusLabels[status]}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(appointment._id)}
            >
              Copy appointment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            {appointment.status === "confirmed" && (
              <>
                <DropdownMenuItem>Reschedule</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  Cancel appointment
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
