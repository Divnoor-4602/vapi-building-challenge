"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  Calendar,
  Pill,
  Stethoscope,
  ChartLine,
  HeartHandshake,
} from "lucide-react";
import { createMedicalFlowCall } from "@/lib/actions/vapi.action";
import { api } from "@/convex/_generated/api";
import {
  BookAppointmentModal,
  RequestPrescriptionModal,
  UpdateProfileModal,
} from "@/components/vapi";
import {
  validateProfileForAppointment,
  getProfileCompletionMessage,
} from "@/lib/utils/profileValidation";

interface ActionCardProps {
  className?: string;
}

export function ActionCard({ className }: ActionCardProps) {
  // Query current user profile
  const userProfile = useQuery(api.profiles.getCurrentUserProfile);

  // Modal state
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isRequestPrescriptionModalOpen, setIsRequestPrescriptionModalOpen] =
    useState(false);
  const [isUpdateProfileModalOpen, setIsUpdateProfileModalOpen] =
    useState(false);

  // Handle the medical flow call
  const handleCompleteMedicalFlowCall = async () => {
    if (!userProfile?.profile?.phoneNumber) {
      toast.error("Please add a phone number to your profile first", {
        richColors: true,
      });
      return;
    }

    try {
      const fullName = `${userProfile.profile.firstName} ${userProfile.profile.lastName}`;
      const phoneNumber = userProfile.profile.phoneNumber;
      console.log("Full name:", fullName);
      console.log("Phone number:", phoneNumber);

      const call = await createMedicalFlowCall(fullName, phoneNumber);
      console.log("Call created:", call);
    } catch (error) {
      console.error("Error creating call:", error);
      toast.error("Failed to create call. Please try again.", {
        richColors: true,
      });
    }
  };

  // Book appointment handler with profile validation
  const handleAppointmentCall = async () => {
    if (!userProfile?.user || !userProfile?.profile) {
      toast.error("Please complete your profile first", {
        description: "A complete profile is required to book appointments",
        richColors: true,
      });
      return;
    }

    // Validate profile completeness
    const validation = validateProfileForAppointment(userProfile.profile);

    if (!validation.isComplete) {
      const message = getProfileCompletionMessage(validation);
      toast.error("Profile incomplete", {
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

    // Check microphone permission before opening modal
    try {
      // First, check if we already have permission
      if (navigator.permissions) {
        try {
          const permissionStatus = await navigator.permissions.query({
            name: "microphone" as PermissionName,
          });

          if (permissionStatus.state === "granted") {
            setIsAppointmentModalOpen(true);
            return;
          } else if (permissionStatus.state === "denied") {
            toast.error("Microphone Permission Blocked", {
              description:
                "Microphone access has been blocked. Please click the 🔒 lock icon in your browser's address bar and allow microphone access, then try again.",
              richColors: true,
              duration: 10000,
              action: {
                label: "How to Fix",
                onClick: () => {
                  // Show detailed instructions
                  toast.info("Reset Microphone Permission", {
                    description:
                      "1. Click the 🔒 lock icon in your address bar\n2. Set Microphone to 'Allow'\n3. Refresh the page\n4. Try booking again",
                    duration: 15000,
                  });
                },
              },
            });
            return;
          }
        } catch {
          // Permission query not supported, continue with getUserMedia
        }
      }

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false, // Explicitly disable video
      });

      // Stop the stream immediately after getting permission
      stream.getTracks().forEach((track) => track.stop());

      // Profile is complete and microphone permission granted, open the appointment modal
      setIsAppointmentModalOpen(true);
    } catch (error) {
      if (error instanceof DOMException) {
        if (
          error.name === "NotAllowedError" ||
          error.name === "PermissionDeniedError"
        ) {
          toast.error("Microphone Permission Required", {
            description:
              "Please allow microphone access to place voice calls. Click the 🔒 lock icon in your browser's address bar and enable microphone access.",
            richColors: true,
            duration: 10000,
            action: {
              label: "Detailed Steps",
              onClick: () => {
                toast.info("Enable Microphone Access", {
                  description:
                    "Chrome/Edge: Click 🔒 → Site Settings → Microphone → Allow\nFirefox: Click 🔒 → Permissions → Microphone → Allow\nSafari: Develop → User Agent → Allow...",
                  duration: 20000,
                });
              },
            },
          });
        } else if (error.name === "NotFoundError") {
          toast.error("No Microphone Found", {
            description:
              "No microphone device was found. Please connect a microphone and try again.",
            richColors: true,
          });
        } else {
          toast.error("Microphone Access Error", {
            description: `Unable to access microphone: ${error.message}. Please check your device settings and try again.`,
            richColors: true,
          });
        }
      } else {
        toast.error("Audio Device Error", {
          description:
            "There was an issue accessing your audio device. Please try again.",
          richColors: true,
        });
      }
    }
  };

  // Handle prescription call
  const handlePrescriptionCall = async () => {
    if (!userProfile?.user || !userProfile?.profile) {
      toast.error("Please complete your profile first", {
        description: "A complete profile is required for prescription requests",
        richColors: true,
      });
      return;
    }

    // Open prescription modal
    setIsRequestPrescriptionModalOpen(true);
  };

  // handle update profile
  const handleUpdateProfile = async () => {
    if (!userProfile?.user || !userProfile?.profile) {
      toast.error("Please complete your profile first", {
        description: "A profile is required for updates",
        richColors: true,
      });
      return;
    }

    // Open update profile modal
    setIsUpdateProfileModalOpen(true);
  };

  // provide information about the user's medical history, previous visits, prescriptions and any other relevant information to the user
  const handleMedicalAnalysis = async () => {
    console.log("Medical analysis clicked");
  };

  const handleCustomerCareCall = async () => {
    try {
      // TODO: Create customer care-specific VAPI call
      console.log("Customer care call initiated");
    } catch (error) {
      console.error("Error creating customer care call:", error);
    }
  };

  // Check if phone number exists and profile completeness
  const hasPhoneNumber = userProfile?.profile?.phoneNumber;
  const profileValidation = userProfile?.profile
    ? validateProfileForAppointment(userProfile.profile)
    : { isComplete: false, missingFields: [], missingCriticalFields: [] };

  const actions = [
    {
      id: "complete-intake",
      label: "Complete Patient Intake",
      description:
        "Full medical intake, profile creation, and appointment booking",
      icon: Stethoscope,
      colorClass: hasPhoneNumber
        ? "bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 border-blue-200"
        : "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed",
      onClick: handleCompleteMedicalFlowCall,
      disabled: !hasPhoneNumber,
    },
    {
      id: "book-appointment",
      label: "Book Appointment",
      description: profileValidation.isComplete
        ? "Schedule with available doctors (requires microphone access)"
        : "Complete your profile to book appointments",
      icon: Calendar,
      colorClass: profileValidation.isComplete
        ? "bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 border-green-200"
        : "bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-500 border-gray-200",
      onClick: handleAppointmentCall,
      disabled: false, // Always enabled to show validation messages
    },
    {
      id: "request-prescription",
      label: "Request Prescription",
      description: "New prescription request",
      icon: Pill,
      colorClass:
        "bg-purple-50 hover:bg-purple-100 text-purple-700 hover:text-purple-800 border-purple-200",
      onClick: handlePrescriptionCall,
      disabled: false,
    },
    {
      id: "update-profile",
      label: "Update Medical Profile",
      description: "Modify existing patient information",
      icon: UserPlus,
      colorClass:
        "bg-teal-50 hover:bg-teal-100 text-teal-700 hover:text-teal-800 border-teal-200",
      onClick: handleUpdateProfile,
      disabled: false,
    },
    {
      id: "medical-analysis",
      label: "Medical Analysis",
      description: "Feeling confused? Let's talk about your health",
      icon: ChartLine,
      colorClass:
        "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-800 border-indigo-200",
      onClick: handleMedicalAnalysis,
      disabled: false,
    },

    {
      id: "customer-care",
      label: "Customer Support",
      description: "Get help with any questions",
      icon: HeartHandshake,
      colorClass:
        "bg-orange-50 hover:bg-orange-100 text-orange-700 hover:text-orange-800 border-orange-200",
      onClick: handleCustomerCareCall,
      disabled: false,
    },
  ];

  return (
    <>
      <Card className={`border-gray-200 shadow-sm ${className}`}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-gray-900 font-heading">
            Healthcare Services
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Access our AI-powered healthcare services through voice assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {actions.map((action) => {
            const IconComponent = action.icon;

            return (
              <Button
                key={action.id}
                variant="outline"
                className={`w-full justify-start h-16 shadow-none ${action.colorClass} flex-col items-start p-4`}
                onClick={action.onClick}
                disabled={action.disabled}
              >
                <div className="flex items-center w-full min-w-0">
                  <IconComponent className="mr-3 h-5 w-5 flex-shrink-0" />
                  <div className="text-left min-w-0 flex-1">
                    <div className="font-medium text-sm truncate">
                      {action.label}
                    </div>
                    <div className="text-xs opacity-75 mt-0.5 line-clamp-2">
                      {action.description}
                      {action.id === "complete-intake" && !hasPhoneNumber && (
                        <span className="block text-red-500 mt-1 truncate">
                          Phone number required
                        </span>
                      )}
                      {action.id === "book-appointment" &&
                        !profileValidation.isComplete && (
                          <span className="block text-amber-600 mt-1 truncate">
                            {profileValidation.missingCriticalFields.length > 0
                              ? `Missing: ${profileValidation.missingCriticalFields.join(", ")}`
                              : "Profile needs completion"}
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Book Appointment Modal */}
      {userProfile?.user && userProfile?.profile && (
        <BookAppointmentModal
          isOpen={isAppointmentModalOpen}
          onClose={() => setIsAppointmentModalOpen(false)}
          userProfile={{
            user: userProfile.user,
            profile: userProfile.profile,
          }}
        />
      )}

      {/* Prescription Modal */}
      {userProfile?.user && userProfile?.profile && (
        <RequestPrescriptionModal
          isOpen={isRequestPrescriptionModalOpen}
          onClose={() => setIsRequestPrescriptionModalOpen(false)}
          userProfile={{
            user: userProfile.user,
            profile: userProfile.profile,
          }}
        />
      )}

      {/* Update Profile Modal */}
      {userProfile?.user && userProfile?.profile && (
        <UpdateProfileModal
          isOpen={isUpdateProfileModalOpen}
          onClose={() => setIsUpdateProfileModalOpen(false)}
          userProfile={{
            user: userProfile.user,
            profile: userProfile.profile,
          }}
        />
      )}
    </>
  );
}
