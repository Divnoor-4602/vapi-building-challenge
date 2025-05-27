import { NextResponse } from "next/server";
import { Id } from "@/convex/_generated/dataModel";

// Common imports for API routes
export { NextRequest } from "next/server";
export { fetchQuery, fetchMutation, fetchAction } from "convex/nextjs";
export { api } from "@/convex/_generated/api";

// Re-export NextResponse for convenience
export { NextResponse };

// CORS configuration
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Standard CORS preflight handler
export function createCorsHandler() {
  return function OPTIONS() {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders,
    });
  };
}

// Helper function to create API responses with CORS headers
export function createApiResponse(
  data: unknown,
  options: {
    status?: number;
    headers?: Record<string, string>;
  } = {}
) {
  const { status = 200, headers: additionalHeaders = {} } = options;

  return NextResponse.json(data, {
    status,
    headers: {
      ...corsHeaders,
      ...additionalHeaders,
    },
  });
}

// Helper function to create error responses with CORS headers
export function createErrorResponse(
  error: string | { error: string; [key: string]: unknown },
  status: number = 500
) {
  const errorData = typeof error === "string" ? { error } : error;

  return NextResponse.json(errorData, {
    status,
    headers: corsHeaders,
  });
}

// Helper to extract tool call data from VAPI request
export function extractVapiToolCall(body: Record<string, unknown>) {
  const message = body?.message as Record<string, unknown> | undefined;
  const toolCallList = message?.toolCallList as unknown[] | undefined;
  const toolCall = toolCallList?.[0] as Record<string, unknown> | undefined;
  const functionObj = toolCall?.function as Record<string, unknown> | undefined;

  return {
    arguments: (functionObj?.arguments as Record<string, unknown>) || {},
    toolCallId: (toolCall?.id as string) || "",
    functionName: (functionObj?.name as string) || "",
  };
}

// Helper to create VAPI response format (for both success and error)
export function createVapiResponse(
  toolCallId: string,
  result: unknown,
  isError: boolean = false
) {
  return {
    results: [
      {
        toolCallId,
        result: isError
          ? (result as string)
          : {
              type: "object",
              object: result,
            },
      },
    ],
  };
}

// Helper to create VAPI error response
export function createVapiErrorResponse(
  toolCallId: string,
  errorMessage: string
) {
  return createVapiResponse(toolCallId, `Error: ${errorMessage}`, true);
}

// Helper to safely convert string to Convex ID type
export function convertToConvexId(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  return value.trim();
}

// Helper to validate required ID fields for medical ticket creation
export function validateMedicalTicketIds(
  args: Record<string, unknown>,
  logPrefix: string
): {
  isValid: boolean;
  convertedIds: {
    userId: Id<"users"> | null;
    profileId: Id<"profiles"> | null;
    patientId: Id<"patients"> | null;
  };
  errors: string[];
} {
  const errors: string[] = [];

  const userId = convertToConvexId(args.userId);
  const profileId = convertToConvexId(args.profileId);
  const patientId = convertToConvexId(args.patientId);

  if (!userId) {
    errors.push("userId is required and must be a valid users ID");
    console.log(`${logPrefix} ❌ Invalid userId:`, args.userId);
  } else {
    console.log(`${logPrefix} ✅ Converted userId:`, userId);
  }

  if (!profileId) {
    errors.push("profileId is required and must be a valid profiles ID");
    console.log(`${logPrefix} ❌ Invalid profileId:`, args.profileId);
  } else {
    console.log(`${logPrefix} ✅ Converted profileId:`, profileId);
  }

  if (!patientId) {
    errors.push("patientId is required and must be a valid patients ID");
    console.log(`${logPrefix} ❌ Invalid patientId:`, args.patientId);
  } else {
    console.log(`${logPrefix} ✅ Converted patientId:`, patientId);
  }

  return {
    isValid: errors.length === 0,
    convertedIds: {
      userId: userId as Id<"users"> | null,
      profileId: profileId as Id<"profiles"> | null,
      patientId: patientId as Id<"patients"> | null,
    },
    errors,
  };
}

// Helper to validate patient creation IDs
export function validatePatientIds(
  args: Record<string, unknown>,
  logPrefix: string
): {
  isValid: boolean;
  convertedIds: {
    userId: Id<"users"> | null;
    profileId: Id<"profiles"> | null;
  };
  errors: string[];
} {
  const errors: string[] = [];

  const userId = convertToConvexId(args.userId);
  const profileId = convertToConvexId(args.profileId);

  if (!userId) {
    errors.push("userId is required and must be a valid users ID");
    console.log(`${logPrefix} ❌ Invalid userId:`, args.userId);
  } else {
    console.log(`${logPrefix} ✅ Converted userId:`, userId);
  }

  if (!profileId) {
    errors.push("profileId is required and must be a valid profiles ID");
    console.log(`${logPrefix} ❌ Invalid profileId:`, args.profileId);
  } else {
    console.log(`${logPrefix} ✅ Converted profileId:`, profileId);
  }

  return {
    isValid: errors.length === 0,
    convertedIds: {
      userId: userId as Id<"users"> | null,
      profileId: profileId as Id<"profiles"> | null,
    },
    errors,
  };
}
