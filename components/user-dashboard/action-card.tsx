"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Calendar, CalendarClock, Phone } from "lucide-react";

interface ActionCardProps {
  className?: string;
}

export function ActionCard({ className }: ActionCardProps) {
  const actions = [
    {
      id: "create-profile",
      label: "Create Profile",
      icon: UserPlus,
      onClick: () => {
        // TODO: Navigate to create patient profile
        console.log("Create patient clicked");
      },
    },
    {
      id: "book-appointment",
      label: "Book an Appointment",
      icon: Calendar,
      onClick: () => {
        // TODO: Navigate to book appointment
        console.log("Book appointment clicked");
      },
    },
    {
      id: "reschedule-appointment",
      label: "Reschedule an Appointment",
      icon: CalendarClock,
      onClick: () => {
        // TODO: Navigate to reschedule appointment
        console.log("Reschedule appointment clicked");
      },
    },
    {
      id: "customer-care",
      label: "Call Customer Care",
      icon: Phone,
      onClick: () => {
        // TODO: Initiate customer care call
        console.log("Call customer care clicked");
      },
    },
  ];

  return (
    <Card className={`border-gray-200 shadow-sm ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-gray-900 font-heading">
          Quick Actions
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">
          Manage your healthcare needs with these essential actions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => {
          const IconComponent = action.icon;
          return (
            <Button
              key={action.id}
              variant="outline"
              className="w-full justify-start h-12 border-0 bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 shadow-none"
              onClick={action.onClick}
            >
              <IconComponent className="mr-3 h-4 w-4" />
              {action.label}
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
