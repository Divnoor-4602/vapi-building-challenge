"use client";

import { Loader2 } from "lucide-react";
import { type CallState } from "./base-vapi-modal";

interface CallStatusProps {
  callState: CallState;
}

export function CallStatus({ callState }: CallStatusProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div
        className={`p-3 rounded-lg text-center text-xs ${
          callState.isActive
            ? "bg-green-100 text-green-800"
            : "bg-slate-100 text-slate-600"
        }`}
      >
        <div className="font-semibold">Call Status</div>
        <div>{callState.status}</div>
      </div>

      <div
        className={`p-3 rounded-lg text-center text-xs ${
          callState.isAssistantSpeaking
            ? "bg-blue-100 text-blue-800"
            : "bg-slate-100 text-slate-600"
        }`}
      >
        <div className="font-semibold">Assistant</div>
        <div className="flex items-center justify-center gap-1">
          {callState.isAssistantSpeaking ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Speaking...
            </>
          ) : (
            "Listening"
          )}
        </div>
      </div>

      <div className="p-3 rounded-lg text-center text-xs bg-purple-100 text-purple-800">
        <div className="font-semibold">Volume Level</div>
        <div className="mt-1 w-full bg-purple-200 rounded-full h-2">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-200"
            style={{ width: `${callState.volumeLevel * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
