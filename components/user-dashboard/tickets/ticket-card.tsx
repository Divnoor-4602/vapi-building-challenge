"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  FileText,
  User,
  Calendar,
  Stethoscope,
  Phone,
  MapPin,
  Heart,
  Pill,
  Shield,
  ChevronDown,
  ChevronUp,
  Activity,
  UserCheck,
  ClipboardList,
  AlertTriangle,
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

// Types based on the comprehensive query return type
type Symptom = {
  symptom: string;
  severity: "mild" | "moderate" | "severe";
  duration: string;
  notes?: string;
};

type Medication = {
  name: string;
  dosage: string;
  frequency: string;
};

type Surgery = {
  procedure: string;
  year: string;
};

type Address = {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
};

type EmergencyContact = {
  name: string;
  relationship: string;
  phoneNumber: string;
};

type MedicalHistory = {
  allergies: string[];
  currentMedications: Medication[];
  chronicConditions: string[];
  previousSurgeries: Surgery[];
  familyHistory?: string[];
};

type Insurance = {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  subscriberName: string;
  relationshipToSubscriber: string;
};

type Consents = {
  treatmentConsent: boolean;
  dataProcessingConsent: boolean;
  marketingConsent: boolean;
  consentTimestamp: number;
};

type CommunicationPreferences = {
  email: boolean;
  sms: boolean;
  phone: boolean;
};

type Profile = {
  _id: Id<"profiles">;
  _creationTime: number;
  userId: Id<"users">;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  phoneNumber: string;
  address?: Address;
  communicationPreferences: CommunicationPreferences;
  emergencyContact?: EmergencyContact;
  medicalHistory?: MedicalHistory;
  insurance?: Insurance;
  consents?: Consents;
  isProfileComplete: boolean;
};

type Patient = {
  _id: Id<"patients">;
  _creationTime: number;
  userId: Id<"users">;
  profileId: Id<"profiles">;
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
};

type Prescription = {
  _id: Id<"prescriptions">;
  _creationTime: number;
  patientId: Id<"patients">;
  ticketId: Id<"medicalTickets">;
  prescriptionDetails: {
    medication: string;
    dosage: string;
    frequency: string;
    instructions: string;
  };
  notes?: string;
};

type TicketData = {
  _id: Id<"medicalTickets">;
  _creationTime: number;
  userId: Id<"users">;
  profileId: Id<"profiles">;
  patientId: Id<"patients">;
  status: "cancelled" | "completed" | "in_progress" | "on_hold";
  nextSteps?: "vapi_appointment" | "vapi_prescription";
  notes?: string;
  createdAt: number;
  patient: Patient;
  profile: Profile;
  prescriptions: Prescription[];
};

interface TicketCardProps {
  ticket: TicketData;
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

const nextStepsVariants = {
  vapi_appointment: "bg-blue-100 text-blue-800",
  vapi_prescription: "bg-purple-100 text-purple-800",
};

export function TicketCard({ ticket, className }: TicketCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAddress = (address?: Address) => {
    if (!address) return "Not provided";
    const parts = [
      address.street,
      address.city,
      address.state,
      address.zipCode,
      address.country,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Not provided";
  };

  return (
    <Card className={`border-gray-200 shadow-sm ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-blue-600" />
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Medical Ticket #{ticket._id.slice(-8)}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 mt-1">
                Created {formatDate(ticket.createdAt)}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant="secondary"
              className={statusVariants[ticket.status]}
            >
              {ticket.status.replace("_", " ")}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Basic Ticket Information */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Stethoscope className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              Chief Complaint
            </span>
          </div>
          <p className="text-sm text-blue-800 mb-3">
            {ticket.patient.chiefComplaint}
          </p>

          {ticket.patient.currentSymptoms.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm font-medium text-blue-900">
                Current Symptoms:
              </span>
              <div className="flex flex-wrap gap-2">
                {ticket.patient.currentSymptoms.map((symptom, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className={severityVariants[symptom.severity]}
                  >
                    {symptom.symptom} ({symptom.severity}) - {symptom.duration}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {ticket.patient.recommendedAction && (
            <div className="mt-3">
              <Badge
                variant="secondary"
                className={actionVariants[ticket.patient.recommendedAction]}
              >
                Recommended:{" "}
                {ticket.patient.recommendedAction.replace("_", " ")}
              </Badge>
            </div>
          )}

          {ticket.nextSteps && (
            <div className="mt-3">
              <Badge
                variant="secondary"
                className={nextStepsVariants[ticket.nextSteps]}
              >
                Next Steps: {ticket.nextSteps.replace("_", " ")}
              </Badge>
            </div>
          )}
        </div>

        {/* Patient Information */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">
              Patient: {ticket.profile.firstName} {ticket.profile.lastName}
            </span>
          </div>
          {ticket.patient.requiresFollowUp && (
            <Badge
              variant="secondary"
              className="bg-orange-100 text-orange-800"
            >
              Follow-up Required
            </Badge>
          )}
        </div>

        {/* Prescriptions */}
        {ticket.prescriptions.length > 0 && (
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Pill className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">
                Prescriptions ({ticket.prescriptions.length})
              </span>
            </div>
            <div className="space-y-2">
              {ticket.prescriptions.map((prescription) => (
                <div
                  key={prescription._id}
                  className="bg-white p-3 rounded border"
                >
                  <div className="font-medium text-sm text-purple-900">
                    {prescription.prescriptionDetails.medication}
                  </div>
                  <div className="text-xs text-purple-700 mt-1">
                    {prescription.prescriptionDetails.dosage} -{" "}
                    {prescription.prescriptionDetails.frequency}
                  </div>
                  <div className="text-xs text-purple-600 mt-1">
                    {prescription.prescriptionDetails.instructions}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {ticket.notes && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <ClipboardList className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Notes</span>
            </div>
            <p className="text-sm text-gray-700">{ticket.notes}</p>
          </div>
        )}

        {/* Expanded Details */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent className="space-y-4">
            {/* Profile Information */}
            <Collapsible
              open={expandedSections.profile}
              onOpenChange={() => toggleSection("profile")}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between h-auto p-3"
                >
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-4 w-4" />
                    <span className="font-medium">Profile Information</span>
                  </div>
                  {expandedSections.profile ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      Date of Birth:
                    </span>
                    <p className="text-sm text-gray-700">
                      {new Date(
                        ticket.profile.dateOfBirth
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      Gender:
                    </span>
                    <p className="text-sm text-gray-700">
                      {ticket.profile.gender || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      Phone:
                    </span>
                    <p className="text-sm text-gray-700">
                      {ticket.profile.phoneNumber}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      Profile Complete:
                    </span>
                    <Badge
                      variant="secondary"
                      className={
                        ticket.profile.isProfileComplete
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {ticket.profile.isProfileComplete ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>

                {/* Address */}
                {ticket.profile.address && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        Address
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {formatAddress(ticket.profile.address)}
                    </p>
                  </div>
                )}

                {/* Emergency Contact */}
                {ticket.profile.emergencyContact && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Phone className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        Emergency Contact
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Name:</span>{" "}
                        {ticket.profile.emergencyContact.name}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Relationship:</span>{" "}
                        {ticket.profile.emergencyContact.relationship}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Phone:</span>{" "}
                        {ticket.profile.emergencyContact.phoneNumber}
                      </p>
                    </div>
                  </div>
                )}

                {/* Communication Preferences */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Communication Preferences
                    </span>
                  </div>
                  <div className="flex space-x-4">
                    <Badge
                      variant="secondary"
                      className={
                        ticket.profile.communicationPreferences.email
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }
                    >
                      Email:{" "}
                      {ticket.profile.communicationPreferences.email
                        ? "Yes"
                        : "No"}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={
                        ticket.profile.communicationPreferences.sms
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }
                    >
                      SMS:{" "}
                      {ticket.profile.communicationPreferences.sms
                        ? "Yes"
                        : "No"}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={
                        ticket.profile.communicationPreferences.phone
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }
                    >
                      Phone:{" "}
                      {ticket.profile.communicationPreferences.phone
                        ? "Yes"
                        : "No"}
                    </Badge>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Medical History */}
            {ticket.profile.medicalHistory && (
              <Collapsible
                open={expandedSections.medical}
                onOpenChange={() => toggleSection("medical")}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-auto p-3"
                  >
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4" />
                      <span className="font-medium">Medical History</span>
                    </div>
                    {expandedSections.medical ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3 space-y-3">
                  {/* Allergies */}
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-900">
                        Allergies
                      </span>
                    </div>
                    {ticket.profile.medicalHistory.allergies.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {ticket.profile.medicalHistory.allergies.map(
                          (allergy, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-red-100 text-red-800"
                            >
                              {allergy}
                            </Badge>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-red-700">No known allergies</p>
                    )}
                  </div>

                  {/* Current Medications */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Pill className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        Current Medications
                      </span>
                    </div>
                    {ticket.profile.medicalHistory.currentMedications.length >
                    0 ? (
                      <div className="space-y-2">
                        {ticket.profile.medicalHistory.currentMedications.map(
                          (med, index) => (
                            <div
                              key={index}
                              className="bg-white p-2 rounded border"
                            >
                              <div className="font-medium text-sm text-blue-900">
                                {med.name}
                              </div>
                              <div className="text-xs text-blue-700">
                                {med.dosage} - {med.frequency}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-blue-700">
                        No current medications
                      </p>
                    )}
                  </div>

                  {/* Chronic Conditions */}
                  {ticket.profile.medicalHistory.chronicConditions.length >
                    0 && (
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Activity className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-900">
                          Chronic Conditions
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {ticket.profile.medicalHistory.chronicConditions.map(
                          (condition, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-orange-100 text-orange-800"
                            >
                              {condition}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Previous Surgeries */}
                  {ticket.profile.medicalHistory.previousSurgeries.length >
                    0 && (
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Stethoscope className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-900">
                          Previous Surgeries
                        </span>
                      </div>
                      <div className="space-y-2">
                        {ticket.profile.medicalHistory.previousSurgeries.map(
                          (surgery, index) => (
                            <div
                              key={index}
                              className="bg-white p-2 rounded border"
                            >
                              <div className="font-medium text-sm text-purple-900">
                                {surgery.procedure}
                              </div>
                              <div className="text-xs text-purple-700">
                                Year: {surgery.year}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Family History */}
                  {ticket.profile.medicalHistory.familyHistory &&
                    ticket.profile.medicalHistory.familyHistory.length > 0 && (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <User className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-900">
                            Family History
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {ticket.profile.medicalHistory.familyHistory.map(
                            (history, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="bg-green-100 text-green-800"
                              >
                                {history}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Insurance Information */}
            {ticket.profile.insurance && (
              <Collapsible
                open={expandedSections.insurance}
                onOpenChange={() => toggleSection("insurance")}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-auto p-3"
                  >
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <span className="font-medium">Insurance Information</span>
                    </div>
                    {expandedSections.insurance ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        Provider:
                      </span>
                      <p className="text-sm text-gray-700">
                        {ticket.profile.insurance.provider}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        Policy Number:
                      </span>
                      <p className="text-sm text-gray-700">
                        {ticket.profile.insurance.policyNumber}
                      </p>
                    </div>
                    {ticket.profile.insurance.groupNumber && (
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          Group Number:
                        </span>
                        <p className="text-sm text-gray-700">
                          {ticket.profile.insurance.groupNumber}
                        </p>
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        Subscriber:
                      </span>
                      <p className="text-sm text-gray-700">
                        {ticket.profile.insurance.subscriberName}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        Relationship:
                      </span>
                      <p className="text-sm text-gray-700">
                        {ticket.profile.insurance.relationshipToSubscriber}
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Follow-up Information */}
            {ticket.patient.requiresFollowUp &&
              ticket.patient.followUpNotes && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-900">
                      Follow-up Notes
                    </span>
                  </div>
                  <p className="text-sm text-yellow-800">
                    {ticket.patient.followUpNotes}
                  </p>
                </div>
              )}

            {/* Provider Information */}
            {ticket.patient.assignedProviderId && (
              <div className="p-4 bg-indigo-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <UserCheck className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-900">
                    Assigned Provider
                  </span>
                </div>
                <p className="text-sm text-indigo-800">
                  Provider ID: {ticket.patient.assignedProviderId}
                </p>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
