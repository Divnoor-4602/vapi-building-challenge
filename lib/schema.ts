import { z } from "zod";

// Client-side environment variables (NEXT_PUBLIC_*)
const clientEnvSchema = z.object({
  NEXT_PUBLIC_CONVEX_URL: z.string().url(),
  NEXT_PUBLIC_CLERK_FRONTEND_API_URL: z.string().url(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_VAPI_API_KEY: z.string().min(1),
});

// Server-side environment variables
const serverEnvSchema = z.object({
  CONVEX_DEPLOYMENT: z.string().min(1),
  PINECONE_API_KEY: z.string().min(1),
  CLERK_WEBHOOK_SECRET: z.string().min(1),
  VAPI_PRIVATE_KEY: z.string().min(1),
  VAPI_ORG_ID: z.string().min(1),
  VAPI_PATIENT_FLOW_SQUAD_ID: z.string().min(1),
  VAPI_PATIENT_FLOW_SQUAD_NUMBER: z.string().min(1),
});

// Combined schema for when we need all variables (server-side only)
export const envSchema = clientEnvSchema.merge(serverEnvSchema);

// Function to get environment variables safely
function getEnv() {
  const isServer = typeof window === "undefined";

  if (isServer) {
    // Server-side: validate all environment variables
    return envSchema.parse(process.env);
  } else {
    // Client-side: only validate public environment variables
    return clientEnvSchema.parse({
      NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
      NEXT_PUBLIC_CLERK_FRONTEND_API_URL:
        process.env.NEXT_PUBLIC_CLERK_FRONTEND_API_URL,
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      NEXT_PUBLIC_VAPI_API_KEY: process.env.NEXT_PUBLIC_VAPI_API_KEY,
    });
  }
}

// Function to get server-only environment variables
export function getServerEnv() {
  if (typeof window !== "undefined") {
    throw new Error(
      "Server environment variables cannot be accessed on the client side"
    );
  }
  return envSchema.parse(process.env);
}

// Parse and validate environment variables
export const env = getEnv();

// Type for the environment variables
export type Env = z.infer<typeof envSchema>;
