"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { vapiWebClient } from "@/lib/vapi/vapiClient";

/**
 * Message types from VAPI WebSDK
 */
export interface VapiMessage {
  type: string;
  functionCall?: {
    name: string;
    parameters?: Record<string, unknown>;
  };
  [key: string]: unknown;
}

export interface BaseVapiModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  assistantId: string;
  assistantOverrides?: {
    variableValues?: Record<string, unknown>;
    artifactPlan?: {
      recordingEnabled?: boolean;
      videoRecordingEnabled?: boolean;
    };
  };
  onCallStart?: () => void;
  onCallEnd?: () => void;
  onMessage?: (message: VapiMessage) => void;
  clearLogsAfterCallEnd?: boolean;
  clearLogsDelay?: number;
  children: (props: {
    callState: CallState;
    assistantId: string;
    startCall: () => void;
    endCall: () => void;
    toggleMute: () => void;
  }) => ReactNode;
}

interface CallState {
  isActive: boolean;
  isConnecting: boolean;
  status: string;
  isAssistantSpeaking: boolean;
  isMuted: boolean;
  volumeLevel: number;
  progress: string[];
  errors: string[];
  error?: string;
}

const initialCallState: CallState = {
  isActive: false,
  isConnecting: false,
  status: "Ready to call",
  isAssistantSpeaking: false,
  isMuted: false,
  volumeLevel: 0,
  progress: [],
  errors: [],
};

// Helper function to process assistant overrides
function processAssistantOverrides(
  overrides?: BaseVapiModalProps["assistantOverrides"]
) {
  if (!overrides) return {};

  return {
    ...overrides,
    variableValues: overrides.variableValues || {},
  };
}

export function BaseVapiModal({
  isOpen,
  onClose,
  title,
  description,
  assistantId,
  assistantOverrides,
  onCallStart,
  onCallEnd,
  onMessage,
  clearLogsAfterCallEnd = false,
  clearLogsDelay = 2000,
  children,
}: BaseVapiModalProps) {
  // Call state management
  const [callState, setCallState] = useState<CallState>(initialCallState);
  const callStartTime = useRef<Date | null>(null);
  const clearLogsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced message handler
  const handleMessage = useCallback(
    (message: VapiMessage) => {
      console.log("📨 Received message:", message);

      // Track call state changes
      if (message.type === "speech-start") {
        setCallState((prev) => ({ ...prev, isAssistantSpeaking: false }));
      } else if (message.type === "speech-end") {
        setCallState((prev) => ({ ...prev, isAssistantSpeaking: true }));
      }

      // Track function calls for progress updates
      if (message.type === "function-call" && message.functionCall?.name) {
        const functionName = message.functionCall.name;
        console.log(`🔧 Function call detected: ${functionName}`);

        setCallState((prev) => ({
          ...prev,
          progress: [...prev.progress, `🔧 ${functionName}`],
        }));
      }

      onMessage?.(message);
    },
    [onMessage]
  );

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (clearLogsTimeoutRef.current) {
        clearTimeout(clearLogsTimeoutRef.current);
      }
    };
  }, []);

  // VAPI event handling setup
  useEffect(() => {
    if (!isOpen) return;

    console.log("🔧 Setting up VAPI event listeners");

    // Call started event
    vapiWebClient.onCallStart(() => {
      console.log("📞 Call started");
      callStartTime.current = new Date();
      setCallState((prev) => ({
        ...prev,
        isActive: true,
        isConnecting: false,
        status: "Connected",
        progress: [...prev.progress, "✅ Call connected"],
      }));

      onCallStart?.();
    });

    // Call ended event
    vapiWebClient.onCallEnd(() => {
      console.log("📞 Call ended");
      setCallState((prev) => ({
        ...prev,
        isActive: false,
        status: "Call ended",
        progress: [...prev.progress, "📞 Call ended"],
      }));

      onCallEnd?.();

      // Clear logs after delay if requested
      if (clearLogsAfterCallEnd) {
        clearLogsTimeoutRef.current = setTimeout(() => {
          setCallState(initialCallState);
        }, clearLogsDelay);
      }
    });

    // Message event
    vapiWebClient.onMessage((message: unknown) => {
      handleMessage(message as VapiMessage);
    });

    // Speech detection events
    vapiWebClient.onSpeechStart(() => {
      setCallState((prev) => ({ ...prev, isAssistantSpeaking: false }));
    });

    vapiWebClient.onSpeechEnd(() => {
      setCallState((prev) => ({ ...prev, isAssistantSpeaking: true }));
    });

    // Volume level event
    vapiWebClient.onVolumeLevel((volume: number) => {
      setCallState((prev) => ({ ...prev, volumeLevel: volume }));
    });

    // Error event
    vapiWebClient.onError((error: unknown) => {
      console.error("❌ VAPI Error:", error);
      setCallState((prev) => ({
        ...prev,
        errors: [...prev.errors, String(error)],
        progress: [...prev.progress, `❌ Error: ${String(error)}`],
      }));

      onCallEnd?.();
    });

    // Cleanup function
    return () => {
      console.log("🧹 Cleaning up VAPI event listeners");
    };
  }, [
    isOpen,
    onCallStart,
    onCallEnd,
    clearLogsAfterCallEnd,
    clearLogsDelay,
    handleMessage,
  ]);

  // Simplified start call function
  const startCall = useCallback(async () => {
    console.log("🚀 Starting call with assistant:", assistantId);

    if (!assistantId) {
      console.error("❌ No assistant ID provided");
      setCallState((prev) => ({
        ...prev,
        error: "No assistant configured",
      }));
      toast.error("No assistant configured. Please check your setup.");
      return;
    }

    try {
      setCallState((prev) => ({
        ...prev,
        isConnecting: true,
        error: undefined,
      }));

      const processedOverrides = processAssistantOverrides(assistantOverrides);
      console.log(
        "🎯 Starting assistant call with overrides:",
        processedOverrides
      );

      await vapiWebClient.startWithAssistant(assistantId, processedOverrides);
    } catch (error) {
      console.error("Failed to start call:", error);
      setCallState((prev) => ({
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error.message : "Failed to start call",
      }));
      toast.error("Failed to start call. Please try again.");
    }
  }, [assistantId, assistantOverrides]);

  const endCall = () => {
    console.log("🛑 Ending call");
    vapiWebClient.stop();
  };

  const toggleMute = () => {
    const newMutedState = !callState.isMuted;
    console.log(`🔇 ${newMutedState ? "Muting" : "Unmuting"} microphone`);
    vapiWebClient.setMuted(newMutedState);
    setCallState((prev) => ({ ...prev, isMuted: newMutedState }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {children({
            callState,
            assistantId,
            startCall,
            endCall,
            toggleMute,
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
