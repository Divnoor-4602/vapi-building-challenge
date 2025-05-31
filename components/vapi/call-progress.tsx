"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type CallState } from "./base-vapi-modal";

interface CallProgressProps {
  callState: CallState;
  title?: string;
}

export function CallProgress({
  callState,
  title = "Call Progress",
}: CallProgressProps) {
  if (callState.progress.length === 0) return null;

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {callState.progress.map((event, index) => (
            <div
              key={index}
              className="text-xs p-2 bg-slate-50 rounded border-l-2 border-blue-500"
            >
              <span className="text-slate-500">
                {new Date().toLocaleTimeString()}
              </span>
              <span className="ml-2">{event}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
