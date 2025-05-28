import React from "react";
import { TicketsOverview } from "@/components/user-dashboard/tickets/tickets-overview";
import { ActiveTicketCard } from "@/components/user-dashboard/tickets/active-ticket-card";
import { RecentTicketsList } from "@/components/user-dashboard/tickets/recent-tickets-list";

export default function TicketsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold">Medical Tickets</h1>
            <p className="text-muted-foreground mt-2">
              View and manage all your medical consultation tickets
            </p>
          </div>
        </div>

        {/* Main Layout: Active Ticket Card (Left) + Overview & Recent Tickets (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Active Ticket Card */}
          <div className="lg:col-span-1">
            <ActiveTicketCard />
          </div>

          {/* Right Column: Overview and Recent Tickets */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Overview */}
            <div>
              <h2 className="text-xl font-bold mb-4">Tickets Overview</h2>
              <TicketsOverview />
            </div>

            {/* Recent Tickets */}
            <RecentTicketsList />
          </div>
        </div>
      </div>
    </div>
  );
}
