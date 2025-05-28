import React from "react";
import { ProfileForm } from "@/components/user-dashboard/profile/profile-form";

export default function ProfilePage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-4xl font-extrabold">Profile</h1>
        </div>

        {/* Profile Form */}
        <div className="w-full">
          <ProfileForm />
        </div>
      </div>
    </div>
  );
}
