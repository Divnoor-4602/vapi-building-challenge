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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  User,
  Stethoscope,
  AlertTriangle,
  Clock,
  FileText,
  Phone,
} from "lucide-react";

const statusVariants = {
  completed: "bg-green-100 text-green-800",
  in_progress: "bg-blue-100 text-blue-800",
  on_hold: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
};

interface ActiveTicketCardProps {
  className?: string;
}

export function ActiveTicketCard({ className }: ActiveTicketCardProps) {
  const { user } = useUser();
  const tickets = useQuery(
    api.medicalTickets.getAllTicketsForUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  if (!user) {
    return (
      <Card className={`border-gray-200 shadow-sm ${className}`}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-gray-900 font-heading">
            Active Medical Ticket
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Please sign in to view your active tickets
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Find the most recent active ticket (in_progress or on_hold)
  const activeTicket = tickets
    ?.filter(
      (ticket) => ticket.status === "in_progress" || ticket.status === "on_hold"
    )
    .sort((a, b) => b.createdAt - a.createdAt)[0];

  // If no active ticket, find the most recent completed ticket
  const displayTicket =
    activeTicket ||
    tickets
      ?.filter((ticket) => ticket.status === "completed")
      .sort((a, b) => b.createdAt - a.createdAt)[0];

  const isActive = !!activeTicket;

  if (!displayTicket) {
    return (
      <Card className={`border-gray-200 shadow-sm ${className}`}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-gray-900 font-heading">
            Medical Tickets
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            No tickets found
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              No Medical Tickets
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              You haven&apos;t created any medical tickets yet.
            </p>
            <Button
              variant="outline"
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 border-blue-200"
            >
              <Phone className="mr-2 h-4 w-4" />
              Start New Consultation
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className={`border-gray-200 shadow-sm ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-gray-900 font-heading flex items-center gap-2">
          {isActive ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>LIVE</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span>RECENT</span>
            </div>
          )}
          <span className="text-sm font-normal text-gray-500">
            {isActive ? "Active Medical Ticket" : "Most Recent Ticket"}
          </span>
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {isActive
            ? "Real-time updates for your ongoing consultation"
            : "Your most recently completed consultation"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Ticket Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-sm">
              Ticket #{displayTicket._id.slice(-6)}
            </span>
          </div>
          <Badge className={statusVariants[displayTicket.status]}>
            {displayTicket.status.replace("_", " ").toUpperCase()}
          </Badge>
        </div>

        {/* Patient Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="font-medium text-sm">
              {displayTicket.profile.firstName} {displayTicket.profile.lastName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {displayTicket.patient.chiefComplaint}
            </span>
          </div>
        </div>

        {/* Symptoms */}
        {displayTicket.patient.currentSymptoms.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="font-medium text-sm">Current Symptoms</span>
            </div>
            <div className="space-y-1">
              {displayTicket.patient.currentSymptoms
                .slice(0, 2)
                .map((symptom, index) => (
                  <div key={index} className="text-sm text-gray-600 ml-6">
                    • {symptom.symptom} ({symptom.severity})
                  </div>
                ))}
              {displayTicket.patient.currentSymptoms.length > 2 && (
                <div className="text-sm text-gray-500 ml-6">
                  +{displayTicket.patient.currentSymptoms.length - 2} more
                  symptoms
                </div>
              )}
            </div>
          </div>
        )}

        {/* Next Steps */}
        {displayTicket.nextSteps && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="font-medium text-sm">Next Steps</span>
            </div>
            <div className="text-sm text-gray-600 ml-6">
              {displayTicket.nextSteps === "vapi_appointment"
                ? "Schedule appointment with doctor"
                : "Prescription consultation required"}
            </div>
          </div>
        )}

        {/* Follow-up */}
        {displayTicket.patient.requiresFollowUp && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-500" />
              <span className="font-medium text-sm">Follow-up Required</span>
            </div>
            {displayTicket.patient.followUpNotes && (
              <div className="text-sm text-gray-600 ml-6">
                {displayTicket.patient.followUpNotes}
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        {displayTicket.notes && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-sm">Notes</span>
            </div>
            <div className="text-sm text-gray-600 ml-6">
              {displayTicket.notes}
            </div>
          </div>
        )}

        {/* Created Date */}
        <div className="pt-2 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            {isActive ? "Created" : "Completed"}:{" "}
            {formatDate(displayTicket.createdAt)}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {isActive ? (
            <>
              <Button
                variant="outline"
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 border-blue-200"
                size="sm"
                disabled
              >
                <Activity className="mr-2 h-4 w-4" />
                Under review by our medical experts
              </Button>
              <Button
                variant="outline"
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-800 border-gray-200"
                size="sm"
              >
                <FileText className="mr-2 h-4 w-4" />
                View Full Details
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="w-full bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 border-green-200"
                size="sm"
              >
                <FileText className="mr-2 h-4 w-4" />
                View Completed Report
              </Button>
              <Button
                variant="outline"
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 border-blue-200"
                size="sm"
              >
                <Phone className="mr-2 h-4 w-4" />
                Start New Consultation
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
