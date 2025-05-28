"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";
import {
  FileText,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  Calendar,
  Stethoscope,
} from "lucide-react";

// Types based on the schema
type Symptom = {
  symptom: string;
  severity: "mild" | "moderate" | "severe";
  duration: string;
  notes?: string;
};

type MedicalTicket = {
  id: string;
  status: "cancelled" | "completed" | "in_progress" | "on_hold";
  nextSteps?: "vapi_appointment" | "vapi_prescription";
  notes?: string;
  createdAt: string;
  // Patient visit details
  chiefComplaint: string;
  currentSymptoms: Symptom[];
  recommendedAction?:
    | "schedule_appointment"
    | "urgent_care"
    | "emergency"
    | "prescription_consultation";
  assignedProviderId?: string;
  requiresFollowUp: boolean;
  followUpNotes?: string;
  // Additional details for display
  patientName: string;
  providerName?: string;
};

// Sample medical ticket data
const sampleMedicalTicket: MedicalTicket = {
  id: "ticket-001",
  status: "completed",
  nextSteps: "vapi_prescription",
  notes:
    "Patient responded well to initial consultation. Prescribed antibiotics for bacterial infection.",
  createdAt: "2024-01-15",
  chiefComplaint: "Persistent cough and fever for 3 days",
  currentSymptoms: [
    {
      symptom: "Dry cough",
      severity: "moderate",
      duration: "3 days",
      notes: "Worse at night",
    },
    {
      symptom: "Fever",
      severity: "mild",
      duration: "2 days",
      notes: "Temperature around 100.5°F",
    },
    {
      symptom: "Fatigue",
      severity: "moderate",
      duration: "3 days",
    },
  ],
  recommendedAction: "prescription_consultation",
  assignedProviderId: "dr-wilson-001",
  requiresFollowUp: true,
  followUpNotes: "Schedule follow-up in 1 week to assess improvement",
  patientName: "John Doe",
  providerName: "Dr. Sarah Wilson",
};

interface MedicalTicketReportProps {
  className?: string;
}

const statusVariants = {
  completed: "bg-green-100 text-green-800 hover:bg-green-200",
  in_progress: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  on_hold: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  cancelled: "bg-red-100 text-red-800 hover:bg-red-200",
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

export function MedicalTicketReport({ className }: MedicalTicketReportProps) {
  if (!sampleMedicalTicket) {
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
            <p className="text-gray-500">No recent medical visits found</p>
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
                {new Date(sampleMedicalTicket.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }
                )}
              </span>
            </div>
            <Badge
              variant="secondary"
              className={statusVariants[sampleMedicalTicket.status]}
            >
              {sampleMedicalTicket.status.replace("_", " ")}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                Provider: {sampleMedicalTicket.providerName || "Not assigned"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <div>
                <span className="text-sm font-medium text-blue-900">
                  Chief Complaint:
                </span>
                <p className="text-sm text-blue-800">
                  {sampleMedicalTicket.chiefComplaint}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Symptoms */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Reported Symptoms
          </h3>
          <div className="space-y-2">
            {sampleMedicalTicket.currentSymptoms.map((symptom, index) => (
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

        {/* Recommended Action */}
        {sampleMedicalTicket.recommendedAction && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Recommended Action
            </h3>
            <Badge
              variant="secondary"
              className={actionVariants[sampleMedicalTicket.recommendedAction]}
            >
              {sampleMedicalTicket.recommendedAction.replace("_", " ")}
            </Badge>
          </div>
        )}

        {/* Follow-up */}
        {sampleMedicalTicket.requiresFollowUp && (
          <div className="bg-orange-50 p-3 rounded-md">
            <div className="flex items-start space-x-2">
              <Clock className="h-4 w-4 text-orange-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-900">
                  Follow-up Required
                </p>
                {sampleMedicalTicket.followUpNotes && (
                  <p className="text-sm text-orange-800 mt-1">
                    {sampleMedicalTicket.followUpNotes}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        {sampleMedicalTicket.nextSteps && (
          <div className="bg-green-50 p-3 rounded-md">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">Next Steps</p>
                <p className="text-sm text-green-800">
                  {sampleMedicalTicket.nextSteps === "vapi_appointment"
                    ? "Schedule Appointment"
                    : "Prescription Consultation"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Provider Notes */}
        {sampleMedicalTicket.notes && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Provider Notes
            </h3>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-700">
                {sampleMedicalTicket.notes}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
