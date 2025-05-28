import React from "react";
import { LiveTicketsStack } from "@/components/doctor-dashboard";

export default function LiveTicketsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold">Live Ticket Review</h1>
            <p className="text-muted-foreground mt-2">
              Review and assign next steps for incoming patient tickets
            </p>
          </div>
        </div>

        {/* Main Layout: Live Tickets Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Live Tickets Stack */}
          <div className="lg:col-span-1">
            <LiveTicketsStack />
          </div>

          {/* Right Column: Additional Tools/Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Placeholder for additional doctor tools */}
            <div className="h-96 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Additional Review Tools</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
