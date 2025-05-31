"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Doc } from "@/convex/_generated/dataModel";

interface PatientInfoProps {
  userProfile: {
    user: Doc<"users">;
    profile: Doc<"profiles">;
  };
}

export function PatientInfo({ userProfile }: PatientInfoProps) {
  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-slate-600">
          Patient Information
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Name:</span>{" "}
            {userProfile.profile.firstName} {userProfile.profile.lastName}
          </div>
          <div>
            <span className="font-medium">Phone:</span>{" "}
            {userProfile.profile.phoneNumber}
          </div>
          <div>
            <span className="font-medium">Email:</span> {userProfile.user.email}
          </div>
          <div>
            <span className="font-medium">DOB:</span>{" "}
            {userProfile.profile.dateOfBirth}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
