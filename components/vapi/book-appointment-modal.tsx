"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { type Doc } from "@/convex/_generated/dataModel";
import { BaseVapiModal, type VapiMessage } from "./base-vapi-modal";
import { PatientInfo } from "./patient-info";
import { CallControls } from "./call-controls";
import { CallStatus } from "./call-status";
import { CallProgress } from "./call-progress";
import { ErrorDisplay } from "./error-display";
import {
  validateProfileForAppointment,
  getProfileCompletionMessage,
} from "@/lib/utils/profileValidation";

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: {
    user: Doc<"users">;
    profile: Doc<"profiles">;
  };
}

interface AppointmentResult {
  appointment: {
    _id: string;
    _creationTime: number;
    summary: string;
    startDateTime: string;
    endDateTime: string;
    status: "cancelled" | "completed" | "confirmed";
    doctorId: string;
    notes?: string;
  };
  doctorEmail: string;
}

export function BookAppointmentModal({
  isOpen,
  onClose,
  userProfile,
}: BookAppointmentModalProps) {
  const [appointmentCreated, setAppointmentCreated] =
    useState<AppointmentResult | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);

  const APPOINTMENT_ASSISTANT_ID =
    process.env.NEXT_PUBLIC_VAPI_APPOINTMENT_ASSISTANT_ID;

  // Get assigned doctor for the user
  const assignedDoctor = useQuery(api.users.getAssignedDoctorForUser, {
    clerkId: userProfile.user.clerkId,
  });

  // Poll for appointment creation
  const pollingResult = useQuery(
    api.appointments.checkRecentAppointmentCreation,
    isPolling && callStartTime
      ? {
          userId: userProfile.user._id,
          profileId: userProfile.profile._id,
          afterTimestamp: callStartTime.getTime(),
        }
      : "skip"
  );

  // Monitor polling results
  useEffect(() => {
    if (pollingResult && !appointmentCreated) {
      setAppointmentCreated(pollingResult);
      setIsPolling(false);

      // Success! Show toast and close modal
      toast.success(
        `🎉 Appointment booked successfully! ${pollingResult.appointment.summary} on ${new Date(pollingResult.appointment.startDateTime).toLocaleDateString()}`,
        {
          description: `You'll receive a calendar invite at ${pollingResult.doctorEmail}`,
          duration: 5000,
        }
      );

      // Close modal after a brief delay
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  }, [pollingResult, appointmentCreated, onClose]);

  // Prepare profile data for the assistant
  const assistantOverrides = {
    variableValues: {
      // Essential patient information for appointment booking
      patientFirstName: userProfile.profile.firstName,
      patientLastName: userProfile.profile.lastName,
      patientEmail: userProfile.user.email,
      patientPhone: userProfile.profile.phoneNumber,

      // Doctor information (may be empty - assistant can use getDoctor tool if needed)
      doctorId: assignedDoctor?._id || "",
      doctorName: assignedDoctor?.name || "",
      doctorEmail: assignedDoctor?.email || "",

      // Current date and time for scheduling context
      now: new Date().toISOString(),
    },

    artifactPlan: {
      recordingEnabled: true,
      videoRecordingEnabled: false,
    },
  };

  const handleCallStart = async () => {
    // Validate profile completeness before starting the call
    const validation = validateProfileForAppointment(userProfile.profile);

    if (!validation.isComplete) {
      const message = getProfileCompletionMessage(validation);
      toast.error("Profile Incomplete", {
        description: message,
        richColors: true,
        action: {
          label: "Update Profile",
          onClick: () => {
            // TODO: Navigate to profile page or trigger profile update
            console.log("Navigate to profile update");
          },
        },
      });
      return;
    }

    setCallStartTime(new Date());
    setIsPolling(true);
    console.log("🔍 Started polling for appointment creation");
  };

  const handleCallEnd = async () => {
    setIsPolling(false);
    console.log("🛑 Stopped polling for appointment creation");
  };

  const handleMessage = (message: VapiMessage) => {
    // Handle appointment-specific messages
    if (message.functionCall?.name === "createAppointment") {
      console.log("📅 Assistant is booking appointment");
    }
  };

  console.log("assistantOverrides", assistantOverrides);

  return (
    <BaseVapiModal
      isOpen={isOpen}
      onClose={onClose}
      title="Book Medical Appointment"
      description="Connect with our AI assistant to schedule your appointment with available doctors"
      assistantId={APPOINTMENT_ASSISTANT_ID || ""}
      assistantOverrides={assistantOverrides}
      onCallStart={handleCallStart}
      onCallEnd={handleCallEnd}
      onMessage={handleMessage}
    >
      {({ callState, assistantId, startCall, endCall, toggleMute }) => (
        <>
          {/* Patient Information */}
          <PatientInfo userProfile={userProfile} />

          {/* Call Controls */}
          <Card
            className={`border-2 ${
              callState.isActive
                ? "border-green-200 bg-green-50"
                : "border-slate-200"
            }`}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Voice Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              {/* Status Indicators */}
              <CallStatus callState={callState} />

              {/* Action Buttons */}
              <CallControls
                callState={callState}
                assistantId={assistantId}
                startCall={async () => {
                  startCall();
                  return Promise.resolve();
                }}
                endCall={endCall}
                toggleMute={toggleMute}
                startButtonText="Start Appointment Call"
                disabledMessage="Appointment Service Unavailable"
              />

              {/* Configuration Note */}
              {!assistantId && (
                <div className="text-center text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <strong>Note:</strong> Please set the{" "}
                  <code className="bg-amber-100 px-1 rounded text-xs">
                    NEXT_PUBLIC_VAPI_APPOINTMENT_ASSISTANT_ID
                  </code>{" "}
                  environment variable to enable appointment booking.
                </div>
              )}

              {/* Service Information */}
              {assistantId && !callState.isActive && (
                <div className="text-center text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <strong>How it works:</strong> Riley will verify your contact
                  information, discuss your appointment needs, check your
                  assigned doctor&apos;s availability, and schedule your
                  appointment with calendar confirmation sent to your email.
                </div>
              )}

              {/* Success Message */}
              {appointmentCreated && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800 font-medium">
                    <CheckCircle className="h-5 w-5" />
                    Appointment Booked Successfully!
                  </div>
                  <div className="mt-2 text-sm text-green-700">
                    <div>
                      <strong>Appointment:</strong>{" "}
                      {appointmentCreated.appointment.summary}
                    </div>
                    <div>
                      <strong>Date:</strong>{" "}
                      {new Date(
                        appointmentCreated.appointment.startDateTime
                      ).toLocaleString()}
                    </div>
                    <div>
                      <strong>Doctor:</strong> {appointmentCreated.doctorEmail}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Call Progress */}
          <CallProgress callState={callState} />

          {/* Errors */}
          <ErrorDisplay callState={callState} />
        </>
      )}
    </BaseVapiModal>
  );
}
