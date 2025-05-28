import React from "react";
import {
  ActionCard,
  AppointmentsTable,
  PrescriptionCard,
  MedicalTicketReport,
} from "@/components/user-dashboard";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  // TODO: Replace with actual profile completion check
  const isProfileComplete = false; // This should come from user data/API

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between flex-col gap-4 sm:flex-row">
          <h1 className="text-4xl font-extrabold">Dashboard</h1>
          <Badge
            variant={isProfileComplete ? "default" : "destructive"}
            className={
              isProfileComplete
                ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
                : "bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
            }
          >
            {isProfileComplete ? "Profile Complete" : "Profile Incomplete"}
          </Badge>
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
