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
                  {ticket.patient.currentSymptoms.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-3 w-3 text-orange-500" />
                        <span className="text-xs font-medium text-gray-700">
                          Symptoms ({ticket.patient.currentSymptoms.length})
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 ml-5 line-clamp-2">
                        {ticket.patient.currentSymptoms
                          .slice(0, 2)
                          .map((s) => `${s.symptom} (${s.severity})`)
                          .join(", ")}
                        {ticket.patient.currentSymptoms.length > 2 &&
                          ` +${ticket.patient.currentSymptoms.length - 2} more`}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <Button
                      size="sm"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTicketClick(ticket);
                      }}
                    >
                      <Eye className="mr-2 h-3 w-3" />
                      Review & Assign Next Steps
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Show more indicator if there are more tickets */}
          {incomingTickets.length > 3 && (
            <div className="text-center pt-4">
              <p className="text-sm text-gray-500">
                +{incomingTickets.length - 3} more tickets waiting for review
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal for ticket details and actions */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Medical Ticket #{selectedTicket?._id.slice(-6)}
            </DialogTitle>
            <DialogDescription>
              Review patient information and assign next steps
            </DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-6">
              {/* Patient Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3">
                  Patient Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Name:</span>{" "}
                      {selectedTicket.profile.firstName}{" "}
                      {selectedTicket.profile.lastName}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Age:</span>{" "}
                      {new Date().getFullYear() -
                        new Date(
                          selectedTicket.profile.dateOfBirth
                        ).getFullYear()}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Gender:</span>{" "}
                      {selectedTicket.profile.gender || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedTicket.profile.phoneNumber}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Date of Birth:</span>{" "}
                      {new Date(
                        selectedTicket.profile.dateOfBirth
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chief Complaint */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Chief Complaint
                </h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {selectedTicket.patient.chiefComplaint}
                </p>
              </div>

              {/* Current Symptoms */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Current Symptoms
                </h3>
                <div className="space-y-3">
                  {selectedTicket.patient.currentSymptoms.map(
                    (symptom, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{symptom.symptom}</span>
                          <Badge className={severityVariants[symptom.severity]}>
                            {symptom.severity.toUpperCase()}
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
              {selectedTicket.profile.medicalHistory &&
                (selectedTicket.profile.medicalHistory.allergies.length > 0 ||
                  selectedTicket.profile.medicalHistory.currentMedications
                    .length > 0) && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Medical History
                    </h3>
                    <div className="bg-yellow-50 p-4 rounded-lg space-y-3">
                      {selectedTicket.profile.medicalHistory.allergies.length >
                        0 && (
                        <div>
                          <p className="font-medium text-yellow-900">
                            Allergies:
                          </p>
                          <p className="text-yellow-800">
                            {selectedTicket.profile.medicalHistory.allergies.join(
                              ", "
                            )}
                          </p>
                        </div>
                      )}
                      {selectedTicket.profile.medicalHistory.currentMedications
                        .length > 0 && (
                        <div>
                          <p className="font-medium text-yellow-900">
                            Current Medications:
                          </p>
                          <div className="space-y-1">
                            {selectedTicket.profile.medicalHistory.currentMedications.map(
                              (med, index) => (
                                <p
                                  key={index}
                                  className="text-yellow-800 text-sm"
                                >
                                  {med.name} - {med.dosage} ({med.frequency})
                                </p>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {/* Action Selection */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Assign Next Steps
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant={
                      selectedAction === "appointment" ? "default" : "outline"
                    }
                    className="h-20 flex-col"
                    onClick={() => setSelectedAction("appointment")}
                  >
                    <Calendar className="h-6 w-6 mb-2" />
                    Schedule Appointment
                  </Button>
                  <Button
                    variant={
                      selectedAction === "pharmacy" ? "default" : "outline"
                    }
                    className="h-20 flex-col"
                    onClick={() => setSelectedAction("pharmacy")}
                  >
                    <Pill className="h-6 w-6 mb-2" />
                    Prescribe Medication
                  </Button>
                </div>
              </div>

              {/* Appointment Type Selection */}
              {selectedAction === "appointment" && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Appointment Type
                  </h4>
                  <Select
                    value={appointmentType}
                    onValueChange={setAppointmentType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select appointment type" />
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
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Prescriptions</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addPrescription}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Prescription
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {prescriptions.map((prescription, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">
                              Medication
                            </label>
                            <Input
                              value={prescription.medication}
                              onChange={(e) =>
                                updatePrescription(
                                  index,
                                  "medication",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., Amoxicillin"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">
                              Dosage
                            </label>
                            <Input
                              value={prescription.dosage}
                              onChange={(e) =>
                                updatePrescription(
                                  index,
                                  "dosage",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., 500mg"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">
                              Frequency
                            </label>
                            <Input
                              value={prescription.frequency}
                              onChange={(e) =>
                                updatePrescription(
                                  index,
                                  "frequency",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., Twice daily"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">
                              Instructions
                            </label>
                            <Input
                              value={prescription.instructions}
                              onChange={(e) =>
                                updatePrescription(
                                  index,
                                  "instructions",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., Take with food"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="text-sm font-medium">Additional Notes</label>
                <textarea
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional notes or instructions..."
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
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
