import React from "react";
import { SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import {
  ActionCard,
  AppointmentsTable,
  PrescriptionCard,
  MedicalTicketReport,
  ProfileStatusBadge,
  LiveTicketStatus,
} from "@/components/user-dashboard";

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-4xl font-extrabold">Dashboard</h1>
          <div className="flex items-center gap-3">
            <LiveTicketStatus />
            <ProfileStatusBadge />
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
          {/* Left Column - Action Card and Prescription Card */}
          <div className="lg:col-span-1 space-y-6">
            <ActionCard />
            <PrescriptionCard />
          </div>

          {/* Right Column - Appointments Table and Medical Report */}
          <div className="lg:col-span-2 space-y-6">
            <AppointmentsTable />
            <MedicalTicketReport />
          </div>
        </div>
      </div>
    </div>
  );
}
