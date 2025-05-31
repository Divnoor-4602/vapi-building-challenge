"use client";

import React, { useState } from "react";
import { BaseVapiModal, VapiMessage } from "./base-vapi-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CallStatus } from "./call-status";
import { CallControls } from "./call-controls";
import { CallProgress } from "./call-progress";
import { ErrorDisplay } from "./error-display";
import { Pill } from "lucide-react";
import { toast } from "sonner";
import { type Doc } from "@/convex/_generated/dataModel";
import {
  validateProfileForAppointment,
  getProfileCompletionMessage,
} from "@/lib/utils/profileValidation";

interface RequestPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: {
    user: Doc<"users">;
    profile: Doc<"profiles">;
  };
}

export function RequestPrescriptionModal({
  isOpen,
  onClose,
  userProfile,
}: RequestPrescriptionModalProps) {
  const [callCompleted, setCallCompleted] = useState(false);

  const PRESCRIPTION_ASSISTANT_ID =
    process.env.NEXT_PUBLIC_VAPI_PRESCRIPTION_ASSISTANT_ID;

  // Prepare dynamic variables exactly as expected by Lakshay's script
  const assistantOverrides = {
    variableValues: {
      // Core required variables from the script
      userId: userProfile.user._id,
      profileId: userProfile.profile._id,
      patientFirstName: userProfile.profile.firstName,
      patientLastName: userProfile.profile.lastName,
      patientEmail: userProfile.user.email,
      now: new Date().toISOString(),

      // Optional additional data (not required by script but useful)
      patientPhone: userProfile.profile.phoneNumber || "",
    },
    artifactPlan: {
      recordingEnabled: true,
      videoRecordingEnabled: false,
    },
  };

  const handleCallStart = async () => {
    // Validate profile completeness using actual profile data
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

    setCallCompleted(false);
    console.log(
      "🔍 Call started - Lakshay will handle medical ticket creation and review"
    );
  };

  const handleCallEnd = async () => {
    setCallCompleted(true);
    console.log("📞 Call completed - Lakshay finished consultation flow");

    // Show completion message
    toast.success("💊 Medical Consultation Completed!", {
      description:
        "Lakshay has completed your consultation. Any prescriptions or appointment recommendations have been processed.",
      duration: 5000,
    });

    // Close modal after a brief delay
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const handleMessage = (message: VapiMessage) => {
    console.log("📨 Lakshay Assistant Message:", message);

    // Handle specific function calls to show progress
    if (message.functionCall?.name === "createMedicalTicket") {
      console.log("💊 Assistant is creating medical ticket for review");
      toast.info("Creating medical ticket for team review...", {
        duration: 3000,
      });
    }

    if (message.functionCall?.name === "checkMedicalTicketStatus") {
      console.log("🔍 Assistant is waiting for medical team decision");
      toast.info("Waiting for medical team review...", { duration: 3000 });
    }

    if (message.functionCall?.name === "createPrescription") {
      console.log("💊 Assistant is processing prescription");
      toast.success("Prescription approved and being processed!", {
        duration: 4000,
      });
    }

    if (message.functionCall?.name === "createAppointment") {
      console.log("📅 Assistant is scheduling appointment");
      toast.success("Appointment is being scheduled!", { duration: 4000 });
    }
  };

  console.log("assistantOverrides", assistantOverrides);

  return (
    <BaseVapiModal
      isOpen={isOpen}
      onClose={async () => {
        onClose();
        return Promise.resolve();
      }}
      title="Medical Consultation with Lakshay"
      description="Connect with Lakshay, our comprehensive medical assistant who can help with both prescription consultations and appointment scheduling based on your medical needs."
      assistantId={PRESCRIPTION_ASSISTANT_ID || ""}
      assistantOverrides={assistantOverrides}
      onCallStart={handleCallStart}
      onCallEnd={handleCallEnd}
      onMessage={handleMessage}
      clearLogsAfterCallEnd={true}
      clearLogsDelay={3000}
    >
      {({ callState, assistantId, startCall, endCall, toggleMute }) => (
        <>
          {/* Patient Information */}
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-slate-600">Name:</span>
                  <div>
                    {userProfile.profile.firstName}{" "}
                    {userProfile.profile.lastName}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-slate-600">Email:</span>
                  <div>{userProfile.user.email}</div>
                </div>
                {userProfile.profile.phoneNumber && (
                  <div>
                    <span className="font-medium text-slate-600">Phone:</span>
                    <div>{userProfile.profile.phoneNumber}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Call Controls */}
          <Card
            className={`border-2 ${
              callState.isActive
                ? "border-purple-200 bg-purple-50"
                : "border-slate-200"
            }`}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Pill className="h-4 w-4" />
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
                  await startCall();
                  return Promise.resolve();
                }}
                endCall={endCall}
                toggleMute={toggleMute}
                startButtonText="Start Medical Consultation"
                disabledMessage="Medical Consultation Service Unavailable"
              />

              {/* Configuration Note */}
              {!assistantId && (
                <div className="text-center text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <strong>Note:</strong> Please set the{" "}
                  <code className="bg-amber-100 px-1 rounded text-xs">
                    NEXT_PUBLIC_VAPI_PRESCRIPTION_ASSISTANT_ID
                  </code>{" "}
                  environment variable to enable medical consultations.
                </div>
              )}

              {/* Service Information */}
              {assistantId && !callState.isActive && !callCompleted && (
                <div className="text-center text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <strong>What to expect:</strong> Lakshay will gather
                  information about your health concerns, submit it to our
                  medical team for review, and then either help you with
                  prescription fulfillment or schedule an appointment based on
                  their recommendation.
                </div>
              )}

              {/* Call Completed Message */}
              {callCompleted && (
                <div className="text-center text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">
                  <strong>Consultation Complete:</strong> Your medical
                  consultation with Lakshay has been completed. Any
                  prescriptions or appointments have been processed according to
                  the medical team&apos;s recommendations.
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
