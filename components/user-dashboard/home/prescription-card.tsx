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

// Type based on the schema
type PrescriptionDetails = {
  medication: string;
  dosage: string;
  frequency: string;
  instructions: string;
};

type Prescription = {
  id: string;
  prescriptionDetails: PrescriptionDetails;
  notes?: string;
  createdAt: string;
  status: "active" | "completed" | "cancelled";
  prescribedBy: string;
  refillsRemaining: number;
};

// Sample prescription data
const samplePrescriptions: Prescription[] = [
  {
    id: "presc-001",
    prescriptionDetails: {
      medication: "Amoxicillin",
      dosage: "500mg",
      frequency: "3 times daily",
      instructions:
        "Take with food. Complete the full course even if symptoms improve.",
    },
    notes: "For bacterial infection treatment",
    createdAt: "2024-01-15",
    status: "active",
    prescribedBy: "Dr. Sarah Wilson",
    refillsRemaining: 2,
  },
  {
    id: "presc-002",
    prescriptionDetails: {
      medication: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      instructions:
        "Take at the same time each day, preferably in the morning.",
    },
    notes: "For blood pressure management",
    createdAt: "2024-01-10",
    status: "active",
    prescribedBy: "Dr. Michael Brown",
    refillsRemaining: 5,
  },
  {
    id: "presc-003",
    prescriptionDetails: {
      medication: "Ibuprofen",
      dosage: "400mg",
      frequency: "As needed",
      instructions: "Take with food. Do not exceed 3 doses per day.",
    },
    notes: "For pain and inflammation relief",
    createdAt: "2024-01-08",
    status: "completed",
    prescribedBy: "Dr. Emily Davis",
    refillsRemaining: 0,
  },
];

interface PrescriptionCardProps {
  className?: string;
}

const statusVariants = {
  active: "bg-green-100 text-green-800 hover:bg-green-200",
  completed: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  cancelled: "bg-red-100 text-red-800 hover:bg-red-200",
};

export function PrescriptionCard({ className }: PrescriptionCardProps) {
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
        {samplePrescriptions.map((prescription) => (
          <div
            key={prescription.id}
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
                    Prescribed by {prescription.prescribedBy}
                  </p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className={statusVariants[prescription.status]}
              >
                {prescription.status}
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
                    {new Date(prescription.createdAt).toLocaleDateString(
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
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Refills:
                  </span>
                  <span className="text-sm text-gray-600">
                    {prescription.refillsRemaining} remaining
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
        ))}

        {/* Empty state */}
        {samplePrescriptions.length === 0 && (
          <div className="text-center py-8">
            <Pill className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No prescriptions found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
