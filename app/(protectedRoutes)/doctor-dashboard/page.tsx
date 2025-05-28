import React from "react";
import { SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { LiveTicketsStack } from "@/components/doctor-dashboard";

export default function DoctorDashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-4xl font-extrabold">Doctor Dashboard</h1>
          <div className="flex items-center gap-3">
            {/* Placeholder for doctor-specific status badges */}
            <SignOutButton>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Live Tickets Stack */}
          <div className="lg:col-span-1 space-y-6">
            <LiveTicketsStack />
          </div>

          {/* Right Column - Doctor-specific data tables and reports */}
          <div className="lg:col-span-2 space-y-6">
            {/* Placeholder for patient management table */}
            <div className="h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Patient Management Table</p>
            </div>
            <div className="h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Medical Reports & Analytics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
