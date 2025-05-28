import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DoctorProfileLoading() {
  return (
    <div className="container mx-auto p-8">
      <Skeleton className="h-9 w-48 mb-8" />

      {/* Personal Info Section */}
      <Card className="border-gray-200 shadow-sm rounded-lg mb-6">
        <CardHeader className="pb-4">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4">
              <Skeleton className="h-32 w-32 rounded-full" />
              <Skeleton className="h-8 w-24" />
            </div>

            {/* Personal Details Form */}
            <div className="flex-1 grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Bio Section */}
      <Card className="border-gray-200 shadow-sm rounded-lg mb-6">
        <CardHeader className="pb-4">
          <Skeleton className="h-6 w-56" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credentials Section */}
      <Card className="border-gray-200 shadow-sm rounded-lg">
        <CardHeader className="pb-4">
          <Skeleton className="h-6 w-56" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Upload Area */}
            <div className="p-4 border-2 border-dashed rounded-lg">
              <div className="flex flex-col items-center gap-2">
                <div className="p-4 rounded-full bg-gray-100">
                  <Skeleton className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            </div>

            {/* Document List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
