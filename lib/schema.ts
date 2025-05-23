import { z } from "zod";

// Environment variables schema
export const envSchema = z.object({
  CONVEX_DEPLOYMENT: z.string().min(1),
  NEXT_PUBLIC_CONVEX_URL: z.string().url(),
  NEXT_PUBLIC_CLERK_FRONTEND_API_URL: z.string().url(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  PINECONE_API_KEY: z.string().min(1),
  CLERK_WEBHOOK_SECRET: z.string().min(1),
  VAPI_PRIVATE_KEY: z.string().min(1),
  NEXT_PUBLIC_VAPI_API_KEY: z.string().min(1),
  VAPI_ORG_ID: z.string().min(1),
});

// Parse and validate environment variables
export const env = envSchema.parse(process.env);

// Type for the environment variables
export type Env = z.infer<typeof envSchema>;
