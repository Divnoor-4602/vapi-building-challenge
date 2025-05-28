import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DoctorDashboardLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-12 w-56" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Live Tickets Stack */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-2 w-2 rounded-full" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="space-y-3 pb-8 pr-6">
                {/* Live Ticket Cards */}
                {[...Array(3)].map((_, index) => (
                  <Card
                    key={index}
                    className="border-gray-200 border-l-4 border-l-blue-500 bg-blue-50/30"
                    style={{
                      transform: `translateY(${index * 4}px) translateX(${index * 2}px)`,
                      zIndex: 3 - index,
                    }}
                  >
                    <CardContent className="p-4">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-5 w-16" />
                        </div>
                        <Skeleton className="h-3 w-20" />
                      </div>

                      {/* Patient Info */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-12" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </div>

                      {/* Symptoms Preview */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <div className="space-y-1">
                          {[...Array(2)].map((_, idx) => (
                            <div
                              key={idx}
                              className="text-sm text-gray-600 ml-6 flex items-center gap-2"
                            >
                              <Skeleton className="h-3 w-20" />
                              <Skeleton className="h-4 w-12" />
                            </div>
                          ))}
                          <Skeleton className="h-3 w-32 ml-6" />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2 border-t border-gray-100">
                        <Skeleton className="h-8 flex-1" />
                        <Skeleton className="h-8 w-10" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Doctor-specific data tables and reports */}
          <div className="lg:col-span-2 space-y-6">
            {/* Patient Management Table */}
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="h-64 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Skeleton className="h-12 w-12 mx-auto" />
                  <Skeleton className="h-4 w-48" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medical Reports & Analytics */}
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="h-64 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Skeleton className="h-12 w-12 mx-auto" />
                  <Skeleton className="h-4 w-56" />
                  <div className="grid grid-cols-3 gap-4 w-full">
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
