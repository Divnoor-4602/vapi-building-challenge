import { Assistant } from "@vapi-ai/server-sdk/api";

export type TGetAllAssistantsResponse = {
  success: boolean;
  status: number;
  data: Assistant[];
  message?: string;
  error?: Error;
};
