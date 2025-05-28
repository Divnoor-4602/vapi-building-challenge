"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { TicketCard } from "@/components/user-dashboard/tickets/ticket-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from "lucide-react";

export function TicketsList() {
  const { user } = useUser();
  const tickets = useQuery(
    api.medicalTickets.getAllTicketsForUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  if (!user) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-muted-foreground">
          Please sign in to view your tickets.
        </p>
      </div>
    );
  }

  if (tickets === undefined) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Medical Tickets</h3>
          <p className="text-muted-foreground text-center">
            You haven&apos;t created any medical tickets yet. Start a
            consultation to create your first ticket.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">All Tickets</h2>
        <p className="text-muted-foreground">
          {tickets.length} {tickets.length === 1 ? "ticket" : "tickets"} total
        </p>
      </div>

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <TicketCard key={ticket._id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
}
