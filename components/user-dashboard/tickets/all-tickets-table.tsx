"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TicketsDataTable } from "./tickets-data-table";
import { ticketsColumns, type TicketTableData } from "./tickets-columns";
import { FileText } from "lucide-react";

interface AllTicketsTableProps {
  className?: string;
}

export function AllTicketsTable({ className }: AllTicketsTableProps) {
  const { user } = useUser();
  const tickets = useQuery(
    api.medicalTickets.getAllTicketsForUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  if (!user) {
    return (
      <Card className={`border-gray-200 shadow-sm ${className}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg font-bold text-gray-900 font-heading">
              All Medical Tickets
            </CardTitle>
          </div>
          <CardDescription className="text-sm text-gray-600 mt-2">
            Please sign in to view your medical tickets
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (tickets === undefined) {
    return (
      <Card className={`border-gray-200 shadow-sm ${className}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg font-bold text-gray-900 font-heading">
              All Medical Tickets
            </CardTitle>
          </div>
          <CardDescription className="text-sm text-gray-600 mt-2">
            Complete overview of all your medical consultation tickets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search skeleton */}
            <div className="flex items-center space-x-2">
              <Skeleton className="h-10 w-80" />
            </div>
            {/* Table skeleton */}
            <div className="rounded-md border border-gray-200">
              <div className="bg-gray-50 p-4">
                <div className="grid grid-cols-8 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-4" />
                  ))}
                </div>
              </div>
              <div className="p-4 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-8 gap-4">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <Skeleton key={j} className="h-4" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (tickets.length === 0) {
    return (
      <Card className={`border-gray-200 shadow-sm ${className}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg font-bold text-gray-900 font-heading">
              All Medical Tickets
            </CardTitle>
          </div>
          <CardDescription className="text-sm text-gray-600 mt-2">
            Complete overview of all your medical consultation tickets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Medical Tickets</h3>
            <p className="text-gray-500 text-center">
              You haven&apos;t created any medical tickets yet. Start a
              consultation to create your first ticket.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform the tickets data for the table
  const tableData: TicketTableData[] = tickets.map((ticket) => ({
    _id: ticket._id,
    ticketId: ticket._id.slice(-6),
    patientName: `${ticket.profile.firstName} ${ticket.profile.lastName}`,
    chiefComplaint: ticket.patient.chiefComplaint,
    status: ticket.status,
    createdAt: ticket.createdAt,
    symptomsCount: ticket.patient.currentSymptoms.length,
    prescriptionsCount: ticket.prescriptions.length,
    nextSteps: ticket.nextSteps,
    requiresFollowUp: ticket.patient.requiresFollowUp,
  }));

  return (
    <Card className={`border-gray-200 shadow-sm ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg font-bold text-gray-900 font-heading">
              All Medical Tickets
            </CardTitle>
          </div>
          <div className="text-sm text-gray-600">
            {tickets.length} {tickets.length === 1 ? "ticket" : "tickets"} total
          </div>
        </div>
        <CardDescription className="text-sm text-gray-600 mt-2">
          Complete overview of all your medical consultation tickets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TicketsDataTable columns={ticketsColumns} data={tableData} />
      </CardContent>
    </Card>
  );
}
