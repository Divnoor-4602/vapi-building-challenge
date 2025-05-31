"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock, Pause } from "lucide-react";

export function TicketsOverview() {
  const { user } = useUser();
  const tickets = useQuery(
    api.medicalTickets.getAllTicketsForUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  const statusCounts = {
    completed: tickets?.filter((t) => t.status === "completed").length || 0,
    in_progress: tickets?.filter((t) => t.status === "in_progress").length || 0,
    on_hold: tickets?.filter((t) => t.status === "on_hold").length || 0,
    cancelled: tickets?.filter((t) => t.status === "cancelled").length || 0,
  };

  const statusConfig = {
    completed: {
      label: "Completed",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    in_progress: {
      label: "In Progress",
      icon: AlertCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    on_hold: {
      label: "On Hold",
      icon: Pause,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    cancelled: {
      label: "Cancelled",
      icon: Clock,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Object.entries(statusConfig).map(([status, config]) => {
        const Icon = config.icon;
        const count = statusCounts[status as keyof typeof statusCounts];

        return (
          <Card
            key={status}
            className={`${config.bgColor} ${config.borderColor}`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {config.label}
              </CardTitle>
              <Icon className={`h-4 w-4 ${config.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${config.color}`}>
                {count}
              </div>
              <p className="text-xs text-muted-foreground">
                {count === 1 ? "ticket" : "tickets"}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
