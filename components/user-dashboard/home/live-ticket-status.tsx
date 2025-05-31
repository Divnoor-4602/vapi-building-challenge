"use client";

import React from "react";
import { useQuery } from "convex/react";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface LiveTicketStatusProps {
  className?: string;
}

export function LiveTicketStatus({ className }: LiveTicketStatusProps) {
  // Get current user data from Convex
  const userData = useQuery(api.users.current);

  // Get active tickets for the user
  const activeTickets = useQuery(
    api.medicalTickets.getActiveTicketsForUser,
    userData?._id ? { userId: userData._id as Id<"users"> } : "skip"
  );

  // Check if there are any active tickets
  const hasActiveTickets = activeTickets && activeTickets.length > 0;
  const activeTicketCount = activeTickets?.length || 0;

  return (
    <Badge
      variant={hasActiveTickets ? "secondary" : "outline"}
      className={`${
        hasActiveTickets
          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200 flex items-center gap-1"
          : "bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200 flex items-center gap-1"
      } ${className}`}
    >
      {hasActiveTickets ? (
        <>
          <Clock className="h-3 w-3" />
          {activeTicketCount === 1
            ? "Ticket in Progress"
            : `${activeTicketCount} Tickets Active`}
        </>
      ) : (
        <>
          <CheckCircle className="h-3 w-3" />
          No Active Tickets
        </>
      )}
    </Badge>
  );
}
