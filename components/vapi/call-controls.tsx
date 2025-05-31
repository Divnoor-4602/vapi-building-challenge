"use client";

import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Mic, MicOff } from "lucide-react";
import { type CallState } from "./base-vapi-modal";

interface CallControlsProps {
  callState: CallState;
  assistantId?: string;
  startCall: () => Promise<void>;
  endCall: () => void;
  toggleMute: () => void;
  startButtonText?: string;
  disabledMessage?: string;
}

export function CallControls({
  callState,
  assistantId,
  startCall,
  endCall,
  toggleMute,
  startButtonText = "Start Call",
  disabledMessage = "Service Unavailable",
}: CallControlsProps) {
  return (
    <div className="flex justify-center gap-3">
      {!callState.isActive ? (
        <Button
          onClick={startCall}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={!assistantId}
        >
          <Phone className="mr-2 h-4 w-4" />
          {!assistantId ? disabledMessage : startButtonText}
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button onClick={endCall} variant="destructive" size="sm">
            <PhoneOff className="mr-2 h-4 w-4" />
            End Call
          </Button>

          <Button
            onClick={toggleMute}
            variant={callState.isMuted ? "default" : "outline"}
            size="sm"
          >
            {callState.isMuted ? (
              <>
                <MicOff className="mr-2 h-4 w-4" />
                Unmute
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Mute
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
