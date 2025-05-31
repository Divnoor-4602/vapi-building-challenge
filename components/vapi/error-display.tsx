"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import { type CallState } from "./base-vapi-modal";

interface ErrorDisplayProps {
  callState: CallState;
}

export function ErrorDisplay({ callState }: ErrorDisplayProps) {
  if (callState.errors.length === 0) return null;

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-red-800 flex items-center gap-2">
          <XCircle className="h-4 w-4" />
          Errors
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {callState.errors.map((error, index) => (
          <div key={index} className="text-red-700 text-xs mb-1">
            {error}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
