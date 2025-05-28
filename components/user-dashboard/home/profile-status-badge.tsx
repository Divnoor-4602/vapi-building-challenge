"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle } from "lucide-react";

export function ProfileStatusBadge() {
  // Get the profile completion status from Convex
  const isProfileComplete = useQuery(api.profiles.getProfileCompletionStatus);

  // Show loading state while query is pending
  if (isProfileComplete === undefined) {
    return (
      <Badge variant="secondary" className="animate-pulse">
        Loading...
      </Badge>
    );
  }

  return (
    <Badge
      variant={isProfileComplete ? "default" : "destructive"}
      className={
        isProfileComplete
          ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-200 flex items-center gap-1"
          : "bg-red-100 text-red-800 hover:bg-red-200 border-red-200 flex items-center gap-1"
      }
    >
      {isProfileComplete ? (
        <>
          <CheckCircle className="h-3 w-3" />
          Profile Complete
        </>
      ) : (
        <>
          <AlertCircle className="h-3 w-3" />
          Profile Incomplete
        </>
      )}
    </Badge>
  );
}
