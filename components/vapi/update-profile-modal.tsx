"use client";

import React, { useState } from "react";
import { BaseVapiModal, VapiMessage } from "./base-vapi-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CallStatus } from "./call-status";
import { CallControls } from "./call-controls";
import { CallProgress } from "./call-progress";
import { ErrorDisplay } from "./error-display";
import { PatientInfo } from "./patient-info";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { type Doc } from "@/convex/_generated/dataModel";

interface UpdateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: {
    user: Doc<"users">;
    profile: Doc<"profiles">;
  };
}

export function UpdateProfileModal({
  isOpen,
  onClose,
  userProfile,
}: UpdateProfileModalProps) {
  const [callCompleted, setCallCompleted] = useState(false);

  const UPDATE_PROFILE_ASSISTANT_ID =
    process.env.NEXT_PUBLIC_VAPI_UPDATE_PROFILE_ASSISTANT_ID;

  // Reset all state when modal opens/closes
  const resetModalState = () => {
    setCallCompleted(false);
    console.log("🔄 Profile update modal state reset");
  };

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      resetModalState();
    }
  }, [isOpen]);

  // Prepare dynamic variables exactly as expected by the VAPI profile update script
  const assistantOverrides = {
    variableValues: {
      // Core required variables
      patientEmail: userProfile.user.email,
      patientFirstName: userProfile.profile.firstName,
      patientLastName: userProfile.profile.lastName,
      profileExists: true, // Should always be true for this assistant

      // Basic Profile Information
      existingUserId: userProfile.user._id,
      existingDateOfBirth: userProfile.profile.dateOfBirth || "",
      existingGender: userProfile.profile.gender || "",
      existingPhoneNumber: userProfile.profile.phoneNumber || "",
      existingIsProfileComplete: userProfile.profile.isProfileComplete || false,

      // Address Information
      existingAddressStreet: userProfile.profile.address?.street || "",
      existingAddressCity: userProfile.profile.address?.city || "",
      existingAddressState: userProfile.profile.address?.state || "",
      existingAddressZipCode: userProfile.profile.address?.zipCode || "",
      existingAddressCountry: userProfile.profile.address?.country || "",

      // Communication Preferences
      existingCommPrefEmail:
        userProfile.profile.communicationPreferences?.email || false,
      existingCommPrefSms:
        userProfile.profile.communicationPreferences?.sms || false,
      existingCommPrefPhone:
        userProfile.profile.communicationPreferences?.phone || false,

      // Emergency Contact Information
      existingEmergencyContactName:
        userProfile.profile.emergencyContact?.name || "",
      existingEmergencyContactRelationship:
        userProfile.profile.emergencyContact?.relationship || "",
      existingEmergencyContactPhone:
        userProfile.profile.emergencyContact?.phoneNumber || "",

      // Medical History Information
      existingAllergies: userProfile.profile.medicalHistory?.allergies || [],
      existingCurrentMedications:
        userProfile.profile.medicalHistory?.currentMedications || [],
      existingChronicConditions:
        userProfile.profile.medicalHistory?.chronicConditions || [],
      existingPreviousSurgeries:
        userProfile.profile.medicalHistory?.previousSurgeries || [],
      existingFamilyHistory:
        userProfile.profile.medicalHistory?.familyHistory || [],

      // Insurance Information
      existingInsuranceProvider: userProfile.profile.insurance?.provider || "",
      existingInsurancePolicyNumber:
        userProfile.profile.insurance?.policyNumber || "",
      existingInsuranceGroupNumber:
        userProfile.profile.insurance?.groupNumber || "",
      existingInsuranceSubscriberName:
        userProfile.profile.insurance?.subscriberName || "",
      existingInsuranceRelationshipToSubscriber:
        userProfile.profile.insurance?.relationshipToSubscriber || "",

      // Consent Information
      existingConsentTreatment:
        userProfile.profile.consents?.treatmentConsent || false,
      existingConsentDataProcessing:
        userProfile.profile.consents?.dataProcessingConsent || false,
      existingConsentMarketing:
        userProfile.profile.consents?.marketingConsent || false,
      existingConsentTimestamp:
        userProfile.profile.consents?.consentTimestamp || 0,
    },
    artifactPlan: {
      recordingEnabled: true,
      videoRecordingEnabled: false,
    },
  };

  const handleCallStart = async () => {
    // Ensure clean state at call start
    setCallCompleted(false);
    console.log(
      "🔍 Profile update call started - Lisa will handle profile updates"
    );
  };

  const handleCallEnd = async () => {
    setCallCompleted(true);
    console.log("📞 Profile update call completed");

    // Show completion message
    toast.success("📝 Profile Update Completed!", {
      description:
        "Lisa has completed your profile update. Your information has been successfully updated.",
      duration: 5000,
    });

    // Close modal after a brief delay with cleanup
    setTimeout(() => {
      resetModalState();
      onClose();
    }, 2000);
  };

  // Enhanced close handler with proper cleanup
  const handleModalClose = async () => {
    console.log("🚪 Closing profile update modal with cleanup");
    resetModalState();
    onClose();
    return Promise.resolve();
  };

  const handleMessage = (message: VapiMessage) => {
    console.log("📨 Lisa Profile Update Message:", message);

    // Handle specific function calls to show progress
    if (message.functionCall?.name === "getProfileMissingFields") {
      console.log("🔍 Assistant is checking profile completeness");
      toast.info("Checking your current profile information...", {
        duration: 3000,
      });
    }

    if (message.functionCall?.name === "updatePatientProfileAction") {
      console.log("📝 Assistant is updating profile information");
      toast.success("Updating your profile information...", {
        duration: 3000,
      });
    }
  };

  console.log("assistantOverrides", assistantOverrides);

  return (
    <BaseVapiModal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="Update Medical Profile with Lisa"
      description="Connect with Lisa, our dedicated profile update specialist who will help you complete or update your medical profile information efficiently and accurately."
      assistantId={UPDATE_PROFILE_ASSISTANT_ID || ""}
      assistantOverrides={assistantOverrides}
      onCallStart={handleCallStart}
      onCallEnd={handleCallEnd}
      onMessage={handleMessage}
      clearLogsAfterCallEnd={true}
      clearLogsDelay={1000}
    >
      {({ callState, assistantId, startCall, endCall, toggleMute }) => (
        <>
          {/* Patient Information */}
          <PatientInfo userProfile={userProfile} />

          {/* Call Controls */}
          <Card
            className={`border-2 ${
              callState.isActive
                ? "border-teal-200 bg-teal-50"
                : "border-slate-200"
            }`}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
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
                startButtonText="Start Profile Update"
                disabledMessage="Profile Update Service Unavailable"
              />

              {/* Configuration Note */}
              {!assistantId && (
                <div className="text-center text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <strong>Note:</strong> Please set the{" "}
                  <code className="bg-amber-100 px-1 rounded text-xs">
                    NEXT_PUBLIC_VAPI_UPDATE_PROFILE_ASSISTANT_ID
                  </code>{" "}
                  environment variable to enable profile updates.
                </div>
              )}

              {/* Service Information */}
              {assistantId && !callState.isActive && !callCompleted && (
                <div className="text-center text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <strong>What to expect:</strong> Lisa will review your current
                  profile information, identify any missing or outdated details,
                  and help you update your medical profile to ensure complete
                  and accurate information for better healthcare services.
                </div>
              )}

              {/* Call Completed Message */}
              {callCompleted && (
                <div className="text-center text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">
                  <strong>Profile Update Complete:</strong> Your medical profile
                  has been successfully updated with Lisa&apos;s assistance.
                  Your healthcare providers now have access to your most current
                  information.
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
