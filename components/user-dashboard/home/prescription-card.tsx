"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pill, Clock, FileText, Calendar } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

interface PrescriptionCardProps {
  className?: string;
}

const statusVariants = {
  completed: "bg-green-100 text-green-800 hover:bg-green-200",
  in_progress: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  on_hold: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  cancelled: "bg-red-100 text-red-800 hover:bg-red-200",
};

const statusLabels = {
  completed: "Completed",
  in_progress: "Active",
  on_hold: "On Hold",
  cancelled: "Cancelled",
};

export function PrescriptionCard({ className }: PrescriptionCardProps) {
  const { user } = useUser();

  // Fetch prescriptions for the current user
  const prescriptions = useQuery(
    api.prescriptions.getPrescriptionsForUser,
    user?.id ? { clerkId: user.id, limit: 3 } : "skip"
  );

  return (
    <Card className={`border-gray-200 shadow-sm ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Pill className="h-5 w-5 text-green-600" />
          <CardTitle className="text-lg font-bold text-gray-900 font-heading">
            Recent Prescriptions
          </CardTitle>
        </div>
        <CardDescription className="text-sm text-gray-600 mt-2">
          View your current and recent medication prescriptions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {prescriptions && prescriptions.length > 0 ? (
          prescriptions.map((prescription) => (
            <div
              key={prescription._id}
              className="border border-gray-200 rounded-lg p-4 space-y-3 hover:bg-gray-50 transition-colors"
            >
              {/* Header with medication name and status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Pill className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {prescription.prescriptionDetails.medication}
                    </h3>
                    <p className="text-sm text-gray-600">
                      For: {prescription.patient.chiefComplaint}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={statusVariants[prescription.ticket.status]}
                >
                  {statusLabels[prescription.ticket.status]}
                </Badge>
              </div>

              {/* Prescription details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">
                      Dosage:
                    </span>
                    <span className="text-sm text-gray-600">
                      {prescription.prescriptionDetails.dosage}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Frequency:
                    </span>
                    <span className="text-sm text-gray-600">
                      {prescription.prescriptionDetails.frequency}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Prescribed:
                    </span>
                    <span className="text-sm text-gray-600">
                      {new Date(prescription._creationTime).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">
                      Patient:
                    </span>
                    <span className="text-sm text-gray-600">
                      {prescription.profile.firstName}{" "}
                      {prescription.profile.lastName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 p-3 rounded-md">
                <div className="flex items-start space-x-2">
                  <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Instructions:
                    </p>
                    <p className="text-sm text-blue-800 mt-1">
                      {prescription.prescriptionDetails.instructions}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes (if available) */}
              {prescription.notes && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm font-medium text-gray-700">Notes:</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {prescription.notes}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          /* Empty state */
          <div className="text-center py-8">
            <Pill className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No prescriptions found</p>
            <p className="text-sm text-gray-400">
              Prescriptions from your recent medical visits will appear here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
