"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Calendar,
  User,
  Stethoscope,
  Pill,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Id } from "@/convex/_generated/dataModel";

// Type for the ticket data in the table
export type TicketTableData = {
  _id: Id<"medicalTickets">;
  ticketId: string;
  patientName: string;
  chiefComplaint: string;
  status: "cancelled" | "completed" | "in_progress" | "on_hold";
  createdAt: number;
  symptomsCount: number;
  prescriptionsCount: number;
  nextSteps?: "vapi_appointment" | "vapi_prescription";
  requiresFollowUp: boolean;
};

const statusVariants = {
  completed: "bg-green-100 text-green-800 hover:bg-green-200",
  in_progress: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  on_hold: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  cancelled: "bg-red-100 text-red-800 hover:bg-red-200",
};

const nextStepsVariants = {
  vapi_appointment: "bg-blue-100 text-blue-800",
  vapi_prescription: "bg-purple-100 text-purple-800",
};

export const ticketsColumns: ColumnDef<TicketTableData>[] = [
  {
    accessorKey: "ticketId",
    header: "Ticket ID",
    cell: ({ row }) => (
      <div className="font-medium text-sm">#{row.getValue("ticketId")}</div>
    ),
  },
  {
    accessorKey: "patientName",
    header: "Patient",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <User className="h-4 w-4 text-gray-400" />
        <span className="font-medium">{row.getValue("patientName")}</span>
      </div>
    ),
  },
  {
    accessorKey: "chiefComplaint",
    header: "Chief Complaint",
    cell: ({ row }) => {
      const complaint = row.getValue("chiefComplaint") as string;
      const truncated =
        complaint.length > 50 ? complaint.substring(0, 50) + "..." : complaint;
      return (
        <div className="flex items-center space-x-2">
          <Stethoscope className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600" title={complaint}>
            {truncated}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
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
    accessorKey: "symptomsCount",
    header: "Symptoms",
    cell: ({ row }) => (
      <div className="text-sm text-gray-600">
        {row.getValue("symptomsCount")} symptom
        {row.getValue("symptomsCount") !== 1 ? "s" : ""}
      </div>
    ),
  },
  {
    accessorKey: "prescriptionsCount",
    header: "Prescriptions",
    cell: ({ row }) => {
      const count = row.getValue("prescriptionsCount") as number;
      return count > 0 ? (
        <div className="flex items-center space-x-2">
          <Pill className="h-4 w-4 text-purple-500" />
          <span className="text-sm text-purple-600">
            {count} prescription{count !== 1 ? "s" : ""}
          </span>
        </div>
      ) : (
        <div className="text-sm text-gray-400">None</div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as keyof typeof statusVariants;
      return (
        <Badge variant="secondary" className={statusVariants[status]}>
          {status.replace("_", " ").toUpperCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "nextSteps",
    header: "Next Steps",
    cell: ({ row }) => {
      const nextSteps = row.getValue("nextSteps") as
        | keyof typeof nextStepsVariants
        | undefined;
      const requiresFollowUp = row.original.requiresFollowUp;

      if (nextSteps) {
        return (
          <Badge variant="secondary" className={nextStepsVariants[nextSteps]}>
            {nextSteps.replace("_", " ")}
          </Badge>
        );
      }

      if (requiresFollowUp) {
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            Follow-up Required
          </Badge>
        );
      }

      return <div className="text-sm text-gray-400">None</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const ticket = row.original;

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
              onClick={() => navigator.clipboard.writeText(ticket._id)}
            >
              Copy ticket ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Download report</DropdownMenuItem>
            {ticket.status === "in_progress" && (
              <DropdownMenuItem>Continue consultation</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
