"use client";

import React from "react";
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
  FileText,
  Stethoscope,
  HeartHandshake,
} from "lucide-react";
import { createMedicalFlowCall } from "@/lib/actions/vapi.action";
import { api } from "@/convex/_generated/api";

interface ActionCardProps {
  className?: string;
}

export function ActionCard({ className }: ActionCardProps) {
  // Query current user profile
  const userProfile = useQuery(api.profiles.getCurrentUserProfile);

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

  // Individual VAPI handlers for specific flows
  const handleAppointmentCall = async () => {
    try {
      // TODO: Create appointment-specific VAPI call
      console.log("Appointment booking call initiated");
    } catch (error) {
      console.error("Error creating appointment call:", error);
    }
  };

  const handlePrescriptionCall = async () => {
    try {
      // TODO: Create prescription-specific VAPI call
      console.log("Prescription request call initiated");
    } catch (error) {
      console.error("Error creating prescription call:", error);
    }
  };

  const handleCustomerCareCall = async () => {
    try {
      // TODO: Create customer care-specific VAPI call
      console.log("Customer care call initiated");
    } catch (error) {
      console.error("Error creating customer care call:", error);
    }
  };

  // Check if phone number exists
  const hasPhoneNumber = userProfile?.profile?.phoneNumber;
  const isLoading = userProfile === undefined;

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
      description: "Schedule with available doctors",
      icon: Calendar,
      colorClass:
        "bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 border-green-200",
      onClick: handleAppointmentCall,
      disabled: false,
    },
    {
      id: "request-prescription",
      label: "Request Prescription",
      description: "Refill or new prescription request",
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
      onClick: () => {
        console.log("Update profile clicked");
      },
      disabled: false,
    },
    {
      id: "view-records",
      label: "View Medical Records",
      description: "Access your health history",
      icon: FileText,
      colorClass:
        "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-800 border-indigo-200",
      onClick: () => {
        console.log("View medical records clicked");
      },
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
              disabled={isLoading || action.disabled}
            >
              <div className="flex items-center w-full">
                <IconComponent className="mr-3 h-5 w-5 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-medium text-sm">{action.label}</div>
                  <div className="text-xs opacity-75 mt-0.5">
                    {action.description}
                    {action.id === "complete-intake" &&
                      !hasPhoneNumber &&
                      !isLoading && (
                        <span className="block text-red-500 mt-1">
                          Phone number required
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
  );
}
