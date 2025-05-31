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
import { FileText, User, Stethoscope, Pill, ArrowRight } from "lucide-react";
import Link from "next/link";

const statusVariants = {
  completed: "bg-green-100 text-green-800",
  in_progress: "bg-blue-100 text-blue-800",
  on_hold: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
};

interface RecentTicketsListProps {
  className?: string;
}

export function RecentTicketsList({ className }: RecentTicketsListProps) {
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
            Recent Tickets
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Please sign in to view your tickets
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <Card className={`border-gray-200 shadow-sm ${className}`}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-gray-900 font-heading">
            Recent Tickets
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Your most recent medical consultations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-8 w-8 text-gray-400 mb-3" />
            <h3 className="text-sm font-semibold mb-1 text-gray-700">
              No Tickets Yet
            </h3>
            <p className="text-gray-500 text-xs">
              Start your first consultation to see tickets here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get the 3 most recent tickets
  const recentTickets = tickets
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 3);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Card className={`border-gray-200 shadow-sm ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-gray-900 font-heading">
              Recent Tickets
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Your most recent medical consultations
            </CardDescription>
          </div>
          {tickets.length > 3 && (
            <Link href="/user-dashboard/tickets/all-tickets">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              >
                View All
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentTickets.map((ticket) => (
          <div
            key={ticket._id}
            className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="h-3 w-3 text-gray-500" />
                <span className="text-xs font-medium text-gray-700">
                  #{ticket._id.slice(-6)}
                </span>
              </div>
              <Badge className={`text-xs ${statusVariants[ticket.status]}`}>
                {ticket.status.replace("_", " ").toUpperCase()}
              </Badge>
            </div>

            {/* Patient and Chief Complaint */}
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3 text-gray-400" />
                <span className="text-xs font-medium text-gray-800">
                  {ticket.profile.firstName} {ticket.profile.lastName}
                </span>
              </div>
              <div className="flex items-start gap-1">
                <Stethoscope className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-gray-600 leading-relaxed">
                  {truncateText(ticket.patient.chiefComplaint, 50)}
                </span>
              </div>
            </div>

            {/* Symptoms Preview */}
            {ticket.patient.currentSymptoms.length > 0 && (
              <div className="mt-2">
                <div className="text-xs text-gray-500">
                  {ticket.patient.currentSymptoms.length} symptom
                  {ticket.patient.currentSymptoms.length !== 1 ? "s" : ""}{" "}
                  reported
                </div>
              </div>
            )}

            {/* Prescriptions Count */}
            {ticket.prescriptions.length > 0 && (
              <div className="flex items-center gap-1 mt-2">
                <Pill className="h-3 w-3 text-purple-500" />
                <span className="text-xs text-purple-600">
                  {ticket.prescriptions.length} prescription
                  {ticket.prescriptions.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}

            {/* Date */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                {formatDate(ticket.createdAt)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-6 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              >
                View Details
                <ArrowRight className="ml-1 h-2 w-2" />
              </Button>
            </div>
          </div>
        ))}

        {/* View All Button */}
        {tickets.length > 3 && (
          <div className="pt-2">
            <Link href="/user-dashboard/tickets/all-tickets">
              <Button
                variant="outline"
                className="w-full text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-800 border-gray-200"
              >
                View All {tickets.length} Tickets
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
