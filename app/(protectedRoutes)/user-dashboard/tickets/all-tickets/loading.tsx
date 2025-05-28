import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AllTicketsLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
        </div>

        {/* All Tickets Table */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-8 w-32" />
            </div>
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search and Filters */}
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-sm">
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-20" />
                </div>
              </div>

              {/* Table */}
              <div className="rounded-md border border-gray-200 shadow-sm">
                {/* Table Header */}
                <div className="bg-gray-50 p-4 border-b">
                  <div className="grid grid-cols-8 gap-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>

                {/* Table Rows */}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="p-4 border-b border-gray-100 hover:bg-gray-50"
                  >
                    <div className="grid grid-cols-8 gap-4 items-center">
                      {/* Ticket ID */}
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-16" />
                      </div>

                      {/* Patient Name */}
                      <Skeleton className="h-4 w-20" />

                      {/* Chief Complaint */}
                      <Skeleton className="h-4 w-full" />

                      {/* Status */}
                      <Skeleton className="h-5 w-20" />

                      {/* Created Date */}
                      <Skeleton className="h-4 w-16" />

                      {/* Symptoms Count */}
                      <div className="flex items-center space-x-1">
                        <Skeleton className="h-3 w-3" />
                        <Skeleton className="h-3 w-4" />
                      </div>

                      {/* Next Steps */}
                      <Skeleton className="h-5 w-24" />

                      {/* Actions */}
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between space-x-2 py-4">
                <Skeleton className="h-4 w-48" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
