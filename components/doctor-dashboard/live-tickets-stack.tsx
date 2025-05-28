"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  User,
  Stethoscope,
  AlertTriangle,
  Clock,
  FileText,
  Phone,
  Eye,
  CheckCircle,
  Calendar,
  Pill,
  X,
  Plus,
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

interface LiveTicketsStackProps {
  className?: string;
}

interface PrescriptionForm {
  medication: string;
  dosage: string;
  frequency: string;
  instructions: string;
}

interface TicketData {
  _id: Id<"medicalTickets">;
  patient: {
    _id: Id<"patients">;
    chiefComplaint: string;
    currentSymptoms: Array<{
      symptom: string;
      severity: "mild" | "moderate" | "severe";
      duration: string;
      notes?: string;
    }>;
    recommendedAction?: string;
  };
  profile: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender?: string;
    phoneNumber: string;
    medicalHistory?: {
      allergies: string[];
      currentMedications: Array<{
        name: string;
        dosage: string;
        frequency: string;
      }>;
    };
  };
  createdAt: number;
  status: string;
}

const severityVariants = {
  mild: "bg-green-100 text-green-800 border-green-200",
  moderate: "bg-yellow-100 text-yellow-800 border-yellow-200",
  severe: "bg-red-100 text-red-800 border-red-200",
};

const priorityOrder = {
  severe: 3,
  moderate: 2,
  mild: 1,
};

const appointmentTypes = [
  { value: "general", label: "General Consultation" },
  { value: "follow-up", label: "Follow-up Appointment" },
  { value: "specialist", label: "Specialist Referral" },
  { value: "urgent", label: "Urgent Care" },
  { value: "routine", label: "Routine Check-up" },
];

export function LiveTicketsStack({ className }: LiveTicketsStackProps) {
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<
    "appointment" | "pharmacy" | null
  >(null);
  const [appointmentType, setAppointmentType] = useState("");
  const [prescriptions, setPrescriptions] = useState<PrescriptionForm[]>([]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const incomingTickets = useQuery(
    api.medicalTickets.getIncomingTicketsForDoctors
  );

  const completeWithAppointment = useMutation(
    api.medicalTickets.completeTicketWithAppointment
  );
  const completeWithPrescription = useMutation(
    api.medicalTickets.completeTicketWithPrescription
  );
  const createMultiplePrescriptions = useMutation(
    api.prescriptions.createMultiplePrescriptions
  );

  const handleTicketClick = (ticket: TicketData) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
    setSelectedAction(null);
    setAppointmentType("");
    setPrescriptions([]);
    setNotes("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
    setSelectedAction(null);
    setAppointmentType("");
    setPrescriptions([]);
    setNotes("");
  };

  const addPrescription = () => {
    setPrescriptions([
      ...prescriptions,
      { medication: "", dosage: "", frequency: "", instructions: "" },
    ]);
  };

  const removePrescription = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const updatePrescription = (
    index: number,
    field: keyof PrescriptionForm,
    value: string
  ) => {
    const updated = [...prescriptions];
    updated[index][field] = value;
    setPrescriptions(updated);
  };

  const handleSubmit = async () => {
    if (!selectedTicket || !selectedAction) return;

    setIsSubmitting(true);
    try {
      if (selectedAction === "appointment") {
        if (!appointmentType) {
          alert("Please select an appointment type");
          return;
        }
        await completeWithAppointment({
          ticketId: selectedTicket._id,
          appointmentType,
          notes,
        });
      } else if (selectedAction === "pharmacy") {
        if (prescriptions.length === 0) {
          alert("Please add at least one prescription");
          return;
        }

        // Validate prescriptions
        const validPrescriptions = prescriptions.filter(
          (p) => p.medication && p.dosage && p.frequency && p.instructions
        );

        if (validPrescriptions.length === 0) {
          alert("Please fill in all prescription details");
          return;
        }

        // Create prescriptions first
        await createMultiplePrescriptions({
          patientId: selectedTicket.patient._id,
          ticketId: selectedTicket._id,
          prescriptions: validPrescriptions,
          notes,
        });

        // Then complete the ticket
        await completeWithPrescription({
          ticketId: selectedTicket._id,
          notes,
        });
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error completing ticket:", error);
      alert("Failed to complete ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (incomingTickets === undefined) {
    return (
      <Card className={`border-gray-200 shadow-sm ${className}`}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-gray-900 font-heading flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Live Incoming Tickets</span>
            </div>
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Loading incoming patient tickets...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!incomingTickets || incomingTickets.length === 0) {
    return (
      <Card className={`border-gray-200 shadow-sm ${className}`}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-gray-900 font-heading flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span>Live Incoming Tickets</span>
            </div>
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            No incoming tickets requiring review
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              All Caught Up!
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              No new tickets are waiting for your review at the moment.
            </p>
            <Button
              variant="outline"
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 border-blue-200"
            >
              <Activity className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort tickets by priority (highest severity symptoms first) and creation time
  const sortedTickets = [...incomingTickets].sort((a, b) => {
    // Get highest severity for each ticket
    const aMaxSeverity = Math.max(
      ...a.patient.currentSymptoms.map((s) => priorityOrder[s.severity])
    );
    const bMaxSeverity = Math.max(
      ...b.patient.currentSymptoms.map((s) => priorityOrder[s.severity])
    );

    // Sort by severity first, then by creation time (newest first)
    if (aMaxSeverity !== bMaxSeverity) {
      return bMaxSeverity - aMaxSeverity;
    }
    return b.createdAt - a.createdAt;
  });

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getHighestSeverity = (
    symptoms: Array<{ severity: "mild" | "moderate" | "severe" }>
  ) => {
    const severities = symptoms.map((s) => s.severity);
    if (severities.includes("severe")) return "severe";
    if (severities.includes("moderate")) return "moderate";
    return "mild";
  };

  return (
    <>
      <Card className={`border-gray-200 shadow-sm ${className}`}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-gray-900 font-heading flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>LIVE</span>
            </div>
            <span className="text-sm font-normal text-gray-500">
              Incoming Tickets ({incomingTickets.length})
            </span>
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            New patient tickets requiring medical review and next steps
            assignment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pb-8 pr-6">
          {sortedTickets.slice(0, 3).map((ticket, index) => {
            const highestSeverity = getHighestSeverity(
              ticket.patient.currentSymptoms
            );

            return (
              <Card
                key={ticket._id}
                className={`border-gray-200 border-l-4 ${
                  highestSeverity === "severe"
                    ? "border-l-red-500 bg-red-50/30"
                    : highestSeverity === "moderate"
                      ? "border-l-yellow-500 bg-yellow-50/30"
                      : "border-l-green-500 bg-green-50/30"
                } hover:shadow-md transition-all cursor-pointer relative transform hover:scale-[1.02]`}
                style={{
                  transform: `translateY(${index * 4}px) translateX(${index * 2}px)`,
                  zIndex: 3 - index,
                  boxShadow: `0 ${4 - index}px ${8 - index * 2}px rgba(0, 0, 0, ${0.1 - index * 0.02})`,
                }}
                onClick={() => handleTicketClick(ticket)}
              >
                <CardContent className="p-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-sm">
                        #{ticket._id.slice(-6)}
                      </span>
                      <Badge className={severityVariants[highestSeverity]}>
                        {highestSeverity.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(ticket.createdAt)}
                    </div>
                  </div>

                  {/* Patient Info */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-sm">
                        {ticket.profile.firstName} {ticket.profile.lastName}
                      </span>
                      <span className="text-xs text-gray-500">
                        Age:{" "}
                        {new Date().getFullYear() -
                          new Date(ticket.profile.dateOfBirth).getFullYear()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600 line-clamp-1">
                        {ticket.patient.chiefComplaint}
                      </span>
                    </div>
                  </div>

                  {/* Symptoms Preview */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span className="font-medium text-sm">Symptoms</span>
                    </div>
                    <div className="space-y-1">
                      {ticket.patient.currentSymptoms
                        .slice(0, 2)
                        .map((symptom, idx) => (
                          <div
                            key={idx}
                            className="text-sm text-gray-600 ml-6 flex items-center gap-2"
                          >
                            <span>• {symptom.symptom}</span>
                            <Badge
                              variant="outline"
                              className={`text-xs ${severityVariants[symptom.severity]}`}
                            >
                              {symptom.severity}
                            </Badge>
                          </div>
                        ))}
                      {ticket.patient.currentSymptoms.length > 2 && (
                        <div className="text-sm text-gray-500 ml-6">
                          +{ticket.patient.currentSymptoms.length - 2} more
                          symptoms
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recommended Action */}
                  {ticket.patient.recommendedAction && (
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-sm">
                          Recommended Action
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 ml-6">
                        {ticket.patient.recommendedAction ===
                        "schedule_appointment"
                          ? "Schedule appointment with doctor"
                          : ticket.patient.recommendedAction === "urgent_care"
                            ? "Urgent care required"
                            : ticket.patient.recommendedAction === "emergency"
                              ? "Emergency care needed"
                              : "Prescription consultation"}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 border-blue-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTicketClick(ticket);
                      }}
                    >
                      <Eye className="mr-2 h-3 w-3" />
                      Review
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-800 border-gray-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Phone className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {Math.min(incomingTickets.length, 3)} of{" "}
              {incomingTickets.length} ticket
              {incomingTickets.length !== 1 ? "s" : ""} awaiting review
              {incomingTickets.length > 3 && (
                <span className="text-blue-600 ml-1">
                  (+{incomingTickets.length - 3} more)
                </span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-800 border-gray-200"
            >
              <FileText className="mr-2 h-3 w-3" />
              View All
            </Button>
          </div>
        </div>
      </Card>

      {/* Ticket Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Ticket #{selectedTicket?._id.slice(-6)} - Medical Review
            </DialogTitle>
            <DialogDescription>
              Review patient information and assign next steps for medical care
            </DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-6">
              {/* Patient Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Patient Information
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Name:</strong> {selectedTicket.profile.firstName}{" "}
                      {selectedTicket.profile.lastName}
                    </p>
                    <p>
                      <strong>Age:</strong>{" "}
                      {new Date().getFullYear() -
                        new Date(
                          selectedTicket.profile.dateOfBirth
                        ).getFullYear()}
                    </p>
                    <p>
                      <strong>Gender:</strong>{" "}
                      {selectedTicket.profile.gender || "Not specified"}
                    </p>
                    <p>
                      <strong>Phone:</strong>{" "}
                      {selectedTicket.profile.phoneNumber}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    Chief Complaint
                  </h3>
                  <p className="text-gray-700">
                    {selectedTicket.patient.chiefComplaint}
                  </p>
                </div>
              </div>

              {/* Symptoms */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Current Symptoms
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTicket.patient.currentSymptoms.map(
                    (symptom, idx) => (
                      <div
                        key={idx}
                        className="border-0 bg-gray-50 rounded-lg p-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{symptom.symptom}</span>
                          <Badge className={severityVariants[symptom.severity]}>
                            {symptom.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Duration: {symptom.duration}
                        </p>
                        {symptom.notes && (
                          <p className="text-sm text-gray-600 mt-1">
                            Notes: {symptom.notes}
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Medical History */}
              {selectedTicket.profile.medicalHistory && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Medical History</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Allergies</h4>
                      <p className="text-sm text-gray-600">
                        {selectedTicket.profile.medicalHistory.allergies
                          .length > 0
                          ? selectedTicket.profile.medicalHistory.allergies.join(
                              ", "
                            )
                          : "None reported"}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Current Medications</h4>
                      <div className="text-sm text-gray-600">
                        {selectedTicket.profile.medicalHistory
                          .currentMedications.length > 0
                          ? selectedTicket.profile.medicalHistory.currentMedications.map(
                              (med, idx) => (
                                <p key={idx}>
                                  {med.name} - {med.dosage} ({med.frequency})
                                </p>
                              )
                            )
                          : "None reported"}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Selection */}
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold">Assign Next Steps</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant={
                      selectedAction === "appointment" ? "default" : "outline"
                    }
                    className="h-20 flex flex-col items-center justify-center gap-2 border-0 bg-gray-50 hover:bg-gray-100"
                    onClick={() => setSelectedAction("appointment")}
                  >
                    <Calendar className="h-6 w-6" />
                    <span>Schedule Appointment</span>
                  </Button>
                  <Button
                    variant={
                      selectedAction === "pharmacy" ? "default" : "outline"
                    }
                    className="h-20 flex flex-col items-center justify-center gap-2 border-0 bg-gray-50 hover:bg-gray-100"
                    onClick={() => setSelectedAction("pharmacy")}
                  >
                    <Pill className="h-6 w-6" />
                    <span>Prescribe Medication</span>
                  </Button>
                </div>

                {/* Appointment Type Selection */}
                {selectedAction === "appointment" && (
                  <div className="space-y-4 p-4 border-0 bg-gray-50 rounded-lg">
                    <h4 className="font-medium">Select Appointment Type</h4>
                    <Select
                      value={appointmentType}
                      onValueChange={setAppointmentType}
                    >
                      <SelectTrigger className="border-gray-200">
                        <SelectValue placeholder="Choose appointment type..." />
                      </SelectTrigger>
                      <SelectContent>
                        {appointmentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Prescription Form */}
                {selectedAction === "pharmacy" && (
                  <div className="space-y-4 p-4 border-0 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Add Prescriptions</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addPrescription}
                        className="border-gray-200"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Prescription
                      </Button>
                    </div>

                    {prescriptions.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No prescriptions added yet. Click &quot;Add
                        Prescription&quot; to start.
                      </p>
                    )}

                    <div className="space-y-4">
                      {prescriptions.map((prescription, index) => (
                        <div
                          key={index}
                          className="border-0 bg-white rounded-lg p-4 space-y-3 shadow-sm"
                        >
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium">
                              Prescription {index + 1}
                            </h5>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removePrescription(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="text-sm font-medium">
                                Medication
                              </label>
                              <Input
                                placeholder="e.g., Amoxicillin"
                                value={prescription.medication}
                                onChange={(e) =>
                                  updatePrescription(
                                    index,
                                    "medication",
                                    e.target.value
                                  )
                                }
                                className="border-gray-200"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Dosage
                              </label>
                              <Input
                                placeholder="e.g., 500mg"
                                value={prescription.dosage}
                                onChange={(e) =>
                                  updatePrescription(
                                    index,
                                    "dosage",
                                    e.target.value
                                  )
                                }
                                className="border-gray-200"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Frequency
                              </label>
                              <Input
                                placeholder="e.g., Three times daily"
                                value={prescription.frequency}
                                onChange={(e) =>
                                  updatePrescription(
                                    index,
                                    "frequency",
                                    e.target.value
                                  )
                                }
                                className="border-gray-200"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Instructions
                              </label>
                              <Input
                                placeholder="e.g., Take with food"
                                value={prescription.instructions}
                                onChange={(e) =>
                                  updatePrescription(
                                    index,
                                    "instructions",
                                    e.target.value
                                  )
                                }
                                className="border-gray-200"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Show prescription badges */}
                    {prescriptions.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">
                          Prescriptions Summary:
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {prescriptions.map(
                            (prescription, index) =>
                              prescription.medication && (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs border-gray-200"
                                >
                                  {prescription.medication} -{" "}
                                  {prescription.dosage}
                                </Badge>
                              )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Notes */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-200 rounded-lg resize-none"
                    rows={3}
                    placeholder="Add any additional notes or instructions..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseModal}
              className="border-gray-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedAction || isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Complete Ticket"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
