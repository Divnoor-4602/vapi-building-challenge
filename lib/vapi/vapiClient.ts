import Vapi from "@vapi-ai/web";
import { env } from "../schema";

// Create Vapi client instance with public key
export const vapiClient = new Vapi(env.NEXT_PUBLIC_VAPI_API_KEY);

// Type for messages that can be sent during a call
export interface VapiMessage {
  type: "add-message";
  message: {
    role: "system" | "user" | "assistant" | "tool" | "function";
    content: string;
  };
}

// Enhanced client with convenient methods
export class VapiWebClient {
  private client: Vapi;

  constructor() {
    this.client = vapiClient;
  }

  /**
   * Start a call with an assistant ID
   * @param assistantId - The ID of the assistant to use
   * @param assistantOverrides - Optional overrides for the assistant
   */
  async startWithAssistant(
    assistantId: string,
    assistantOverrides?: Record<string, unknown>
  ) {
    return await this.client.start(assistantId, assistantOverrides);
  }

  /**
   * Start a call with inline assistant configuration
   * @param config - Assistant configuration object
   */
  async startWithConfig(config: Record<string, unknown>) {
    return await this.client.start(config);
  }

  /**
   * Send a message during the call
   */
  sendMessage(message: VapiMessage) {
    this.client.send(message);
  }

  /**
   * Stop the current call
   */
  stop() {
    this.client.stop();
  }

  /**
   * Check if microphone is muted
   */
  isMuted(): boolean {
    return this.client.isMuted();
  }

  /**
   * Mute or unmute the microphone
   */
  setMuted(muted: boolean) {
    this.client.setMuted(muted);
  }

  /**
   * Make the assistant say something
   */
  say(message: string, endCallAfterSpoken?: boolean) {
    this.client.say(message, endCallAfterSpoken);
  }

  /**
   * Add event listener for speech start
   */
  onSpeechStart(callback: () => void) {
    this.client.on("speech-start", callback);
  }

  /**
   * Add event listener for speech end
   */
  onSpeechEnd(callback: () => void) {
    this.client.on("speech-end", callback);
  }

  /**
   * Add event listener for call start
   */
  onCallStart(callback: () => void) {
    this.client.on("call-start", callback);
  }

  /**
   * Add event listener for call end
   */
  onCallEnd(callback: () => void) {
    this.client.on("call-end", callback);
  }

  /**
   * Add event listener for volume level updates
   */
  onVolumeLevel(callback: (volume: number) => void) {
    this.client.on("volume-level", callback);
  }

  /**
   * Add event listener for messages
   */
  onMessage(callback: (message: unknown) => void) {
    this.client.on("message", callback);
  }

  /**
   * Add event listener for errors
   */
  onError(callback: (error: unknown) => void) {
    this.client.on("error", callback);
  }

  /**
   * Get the underlying Vapi client instance for advanced usage
   * Use this for event removal or other advanced operations
   */
  getRawClient(): Vapi {
    return this.client;
  }
}

// Export singleton instance
export const vapiWebClient = new VapiWebClient();

// Export the raw client for direct access
export { vapiClient as rawVapiClient };
