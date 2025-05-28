"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function AuthRedirect() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { user: currentUser, isLoading } = useCurrentUser();

  useEffect(() => {
    // Wait for both Clerk and Convex to load
    if (!isLoaded || !user || isLoading) return;

    // If user doesn't exist in Convex yet (webhook might be processing), wait a bit
    if (currentUser === null) {
      // Set a timeout to retry after webhook processing
      const timeout = setTimeout(() => {
        window.location.reload();
      }, 2000);
      return () => clearTimeout(timeout);
    }

    // If currentUser is still loading (undefined), wait
    if (currentUser === undefined) return;

    // Now currentUser is guaranteed to be a user object
    // Redirect based on user type
    switch (currentUser.userType) {
      case "doctor":
        router.replace("/doctor-dashboard");
        break;
      case "admin":
        router.replace("/admin-dashboard");
        break;
      case "user":
      default:
        router.replace("/user-dashboard");
        break;
    }
  }, [isLoaded, user, currentUser, isLoading, router]);

  // Show loading state while determining redirect
  return (
    <div className="flex min-h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900"></div>
        <p className="text-sm text-gray-600">Setting up your account...</p>
      </div>
    </div>
  );
}
