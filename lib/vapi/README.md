# Vapi Web Client

This module provides a type-safe wrapper around the Vapi Web SDK for making voice calls in your Next.js application.

## Setup

The client is automatically configured using the `NEXT_PUBLIC_VAPI_API_KEY` environment variable defined in your schema.

## Usage

### Basic Import

```typescript
import { vapiWebClient } from "@/lib/vapi/vapiClient";
```

### Starting a Call with Assistant ID

```typescript
// Start a call with an existing assistant
const call = await vapiWebClient.startWithAssistant("your-assistant-id");
```

### Starting a Call with Inline Configuration

```typescript
// Start a call with inline assistant configuration
const call = await vapiWebClient.startWithConfig({
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en-US",
  },
  model: {
    provider: "openai",
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful medical assistant.",
      },
    ],
  },
  voice: {
    provider: "playht",
    voiceId: "jennifer",
  },
  name: "Medical Assistant",
});
```

### Event Listeners

```typescript
// Listen for call events
vapiWebClient.onCallStart(() => {
  console.log("Call started");
});

vapiWebClient.onCallEnd(() => {
  console.log("Call ended");
});

vapiWebClient.onSpeechStart(() => {
  console.log("Assistant is speaking");
});

vapiWebClient.onSpeechEnd(() => {
  console.log("Assistant finished speaking");
});

vapiWebClient.onVolumeLevel((volume) => {
  console.log("Volume level:", volume);
});

vapiWebClient.onMessage((message) => {
  console.log("Received message:", message);
});

vapiWebClient.onError((error) => {
  console.error("Call error:", error);
});
```

### Controlling the Call

```typescript
// Send a message during the call
vapiWebClient.sendMessage({
  type: "add-message",
  message: {
    role: "system",
    content: "The user has clicked a button",
  },
});

// Mute/unmute the microphone
vapiWebClient.setMuted(true);
const isMuted = vapiWebClient.isMuted();

// Make the assistant say something
vapiWebClient.say("Thank you for your patience!");

// Stop the call
vapiWebClient.stop();
```

### React Hook Example

```typescript
import { useEffect, useState } from "react";
import { vapiWebClient } from "@/lib/vapi/vapiClient";

export function useVapiCall() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Set up event listeners
    vapiWebClient.onCallStart(() => {
      setIsCallActive(true);
    });

    vapiWebClient.onCallEnd(() => {
      setIsCallActive(false);
      setIsAssistantSpeaking(false);
    });

    vapiWebClient.onSpeechStart(() => {
      setIsAssistantSpeaking(true);
    });

    vapiWebClient.onSpeechEnd(() => {
      setIsAssistantSpeaking(false);
    });

    vapiWebClient.onError((error) => {
      console.error("Vapi error:", error);
      setIsCallActive(false);
    });

    return () => {
      // Cleanup: Use raw client for advanced operations like event removal
      const rawClient = vapiWebClient.getRawClient();
      // Note: You would need to store callbacks to remove them properly
    };
  }, []);

  const startCall = async (assistantId: string) => {
    try {
      await vapiWebClient.startWithAssistant(assistantId);
    } catch (error) {
      console.error("Failed to start call:", error);
    }
  };

  const endCall = () => {
    vapiWebClient.stop();
  };

  const toggleMute = () => {
    const newMutedState = !vapiWebClient.isMuted();
    vapiWebClient.setMuted(newMutedState);
    setIsMuted(newMutedState);
  };

  return {
    isCallActive,
    isAssistantSpeaking,
    isMuted,
    startCall,
    endCall,
    toggleMute,
  };
}
```

### React Component Example

```typescript
'use client';

import { useVapiCall } from '@/hooks/useVapiCall';

export function VapiCallInterface() {
  const { isCallActive, isAssistantSpeaking, isMuted, startCall, endCall, toggleMute } = useVapiCall();

  const handleStartCall = () => {
    startCall('your-assistant-id');
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-2">
        {!isCallActive ? (
          <button
            onClick={handleStartCall}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Start Call
          </button>
        ) : (
          <button
            onClick={endCall}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            End Call
          </button>
        )}

        {isCallActive && (
          <button
            onClick={toggleMute}
            className={`px-4 py-2 rounded ${
              isMuted
                ? 'bg-orange-500 hover:bg-orange-600'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {isMuted ? 'Unmute' : 'Mute'}
          </button>
        )}
      </div>

      <div className="text-sm text-gray-600">
        Status: {isCallActive ? 'Call Active' : 'No Call'}
        {isAssistantSpeaking && ' - Assistant Speaking'}
      </div>
    </div>
  );
}
```

## Advanced Usage

For advanced operations like custom event removal or accessing additional SDK features, use the raw client:

```typescript
const rawClient = vapiWebClient.getRawClient();
// Use rawClient for advanced operations
```

## Environment Variables

Make sure to set up your environment variables:

```env
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_public_key
```

The client will automatically use this key from your environment configuration.
