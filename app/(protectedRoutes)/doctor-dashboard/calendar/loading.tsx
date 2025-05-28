import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CalendarLoading() {
  return (
    <div className="p-8 lg:max-w-[1200px] mx-auto">
      {/* Calendar Header */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-8 w-48" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-12" />
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
        {/* Calendar Header Row */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-7 gap-0">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="p-4 text-center border-r border-gray-200 last:border-r-0"
              >
                <Skeleton className="h-4 w-16 mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Time Grid */}
        <div className="grid grid-cols-8 gap-0 min-h-[600px]">
          {/* Time Column */}
          <div className="border-r border-gray-200 bg-gray-50/50">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="h-16 border-b border-gray-100 flex items-center justify-center"
              >
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          {[...Array(7)].map((_, dayIndex) => (
            <div
              key={dayIndex}
              className="border-r border-gray-200 last:border-r-0"
            >
              {[...Array(12)].map((_, hourIndex) => (
                <div
                  key={hourIndex}
                  className="h-16 border-b border-gray-100 p-1 relative"
                >
                  {/* Random events */}
                  {Math.random() > 0.7 && (
                    <div className="absolute inset-1">
                      <Skeleton className="h-full w-full rounded" />
                    </div>
                  )}
                  {Math.random() > 0.85 && (
                    <div className="absolute inset-1 top-1/2">
                      <Skeleton className="h-1/2 w-full rounded" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Loading Spinner */}
      <div className="flex items-center justify-center mt-8">
        <div className="flex items-center space-x-2 text-gray-500">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <span className="text-sm">Loading calendar events...</span>
        </div>
      </div>
    </div>
  );
}
