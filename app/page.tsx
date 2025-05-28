"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function Home() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { user: currentUser, isLoading } = useCurrentUser();

  useEffect(() => {
    // Wait for both Clerk and Convex to load
    if (!isLoaded || isLoading) return;

    // If user is authenticated, redirect to appropriate dashboard
    if (user && currentUser) {
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
      return;
    }

    // If user is logged in but currentUser is null, they might be a new user
    // whose webhook is still processing, redirect to auth-redirect to handle this
    if (user && currentUser === null) {
      router.replace("/auth-redirect");
      return;
    }
  }, [isLoaded, user, currentUser, isLoading, router]);

  // Show loading state while checking authentication
  if (!isLoaded || (user && isLoading)) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gap-8 p-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900"></div>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show home page content for non-authenticated users
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-8 p-8">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold">Hospital Voice Agent</h1>
        <h2 className="text-3xl font-semibold text-gray-600">
          Welcome to Our Healthcare Platform
        </h2>
        <p className="text-lg max-w-2xl mx-auto leading-relaxed">
          Experience the future of healthcare with our AI-powered voice agent.
          Get instant medical assistance, book appointments, and manage your
          health records with ease. Our platform connects patients with
          healthcare professionals seamlessly.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="p-4 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">AI Voice Assistant</h3>
            <p className="text-sm text-gray-600">
              Get instant medical guidance through our intelligent voice
              interface.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="text-lg font-medium mb-2">Easy Appointments</h4>
            <p className="text-sm text-gray-600">
              Book and manage appointments with healthcare professionals
              effortlessly.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h5 className="text-base font-medium mb-2">Secure Records</h5>
            <p className="text-sm text-gray-600">
              Access your medical history and prescriptions in one secure
              location.
            </p>
          </div>
        </div>

        {/* Authentication buttons for non-authenticated users */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8">
          <Link
            href="/sign-in"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
