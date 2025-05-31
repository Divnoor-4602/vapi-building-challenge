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
import {
  FileText,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  Calendar,
  Stethoscope,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

interface MedicalTicketReportProps {
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
  in_progress: "In Progress",
  on_hold: "On Hold",
  cancelled: "Cancelled",
};

const severityVariants = {
  mild: "bg-green-100 text-green-700",
  moderate: "bg-yellow-100 text-yellow-700",
  severe: "bg-red-100 text-red-700",
};

const actionVariants = {
  schedule_appointment: "bg-blue-100 text-blue-800",
  urgent_care: "bg-orange-100 text-orange-800",
  emergency: "bg-red-100 text-red-800",
  prescription_consultation: "bg-purple-100 text-purple-800",
};

const nextStepsLabels = {
  vapi_appointment: "Schedule Appointment",
  vapi_prescription: "Prescription Consultation",
};

export function MedicalTicketReport({ className }: MedicalTicketReportProps) {
  const { user } = useUser();

  // Fetch the most recent medical ticket for the current user
  const recentTicket = useQuery(
    api.medicalTickets.getMostRecentTicketForUser,
    user?.id ? { clerkId: user.id } : "skip"
  );

  // No tickets found
  if (!recentTicket) {
    return (
      <Card className={`border-gray-200 shadow-sm ${className}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg font-bold text-gray-900 font-heading">
              Recent Medical Visit
            </CardTitle>
          </div>
          <CardDescription className="text-sm text-gray-600 mt-2">
            Your most recent medical consultation at a glance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Stethoscope className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No recent medical visits found</p>
            <p className="text-sm text-gray-400">
              Your medical consultation history will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-gray-200 shadow-sm ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg font-semibold text-gray-900">
            Recent Medical Visit
          </CardTitle>
        </div>
        <CardDescription className="text-sm text-gray-600 mt-2">
          Your most recent medical consultation at a glance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Visit Overview */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Visit Date:{" "}
                {new Date(recentTicket.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <Badge
              variant="secondary"
              className={statusVariants[recentTicket.status]}
            >
              {statusLabels[recentTicket.status]}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                Patient: {recentTicket.profile.firstName}{" "}
                {recentTicket.profile.lastName}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <div>
                <span className="text-sm font-medium text-blue-900">
                  Chief Complaint:
                </span>
                <p className="text-sm text-blue-800">
                  {recentTicket.patient.chiefComplaint}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Symptoms */}
        {recentTicket.patient.currentSymptoms.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Reported Symptoms
            </h3>
            <div className="space-y-2">
              {recentTicket.patient.currentSymptoms.map((symptom, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {symptom.symptom}
                      </span>
                      <Badge
                        variant="secondary"
                        className={severityVariants[symptom.severity]}
                      >
                        {symptom.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Duration: {symptom.duration}
                    </p>
                    {symptom.notes && (
                      <p className="text-xs text-gray-500 mt-1">
                        {symptom.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Action */}
        {recentTicket.patient.recommendedAction && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Recommended Action
            </h3>
            <Badge
              variant="secondary"
              className={actionVariants[recentTicket.patient.recommendedAction]}
            >
              {recentTicket.patient.recommendedAction.replace("_", " ")}
            </Badge>
          </div>
        )}

        {/* Follow-up */}
        {recentTicket.patient.requiresFollowUp && (
          <div className="bg-orange-50 p-3 rounded-md">
            <div className="flex items-start space-x-2">
              <Clock className="h-4 w-4 text-orange-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-900">
                  Follow-up Required
                </p>
                {recentTicket.patient.followUpNotes && (
                  <p className="text-sm text-orange-800 mt-1">
                    {recentTicket.patient.followUpNotes}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        {recentTicket.nextSteps && (
          <div className="bg-green-50 p-3 rounded-md">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">Next Steps</p>
                <p className="text-sm text-green-800">
                  {nextStepsLabels[recentTicket.nextSteps]}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Provider Notes */}
        {recentTicket.notes && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Provider Notes
            </h3>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-700">{recentTicket.notes}</p>
            </div>
          </div>
        )}

        {/* Prescriptions (if any) */}
        {recentTicket.prescriptions.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Prescriptions from this visit
            </h3>
            <div className="space-y-2">
              {recentTicket.prescriptions.map((prescription, index) => (
                <div key={index} className="bg-green-50 p-3 rounded-md">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-green-900">
                      {prescription.prescriptionDetails.medication}
                    </span>
                    <span className="text-xs text-green-700">
                      {prescription.prescriptionDetails.dosage}
                    </span>
                  </div>
                  <p className="text-xs text-green-800">
                    {prescription.prescriptionDetails.frequency} -{" "}
                    {prescription.prescriptionDetails.instructions}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
