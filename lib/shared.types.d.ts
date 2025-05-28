import { Assistant } from "@vapi-ai/server-sdk/api";

// Request Types

// Response Types
export type TGetAllAssistantsResponse = {
  success: boolean;
  status: number;
  data: Assistant[];
  message?: string;
  error?: Error;
};
