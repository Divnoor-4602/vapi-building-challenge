// Appointment API Route
// This route handles appointment operations using Convex actions for third-party integration:
// - **createAppointment**: Create new appointment booking with doctor assignment (action)

import {
  NextRequest,
  createCorsHandler,
  createApiResponse,
  createErrorResponse,
  extractVapiToolCall,
} from "@/lib/api/utils";
import { routeAppointmentFunction } from "./router";

// Handle CORS preflight requests
export const OPTIONS = createCorsHandler();

/**
 * This route handles appointment operations including:
 * - Creating new appointment bookings (action)
 *
 * Uses Convex actions for mutations to properly handle third-party API integration
 */
export async function POST(req: NextRequest) {
  const logPrefix = "[APPOINTMENT_ROUTE]";

  console.log(`${logPrefix} 🚀 Received appointment request`);

  try {
    const body = await req.json();
    console.log(`${logPrefix} 📥 Request body:`, JSON.stringify(body, null, 2));

    // Extract function call data using the helper
    const {
      arguments: args,
      toolCallId,
      functionName,
    } = extractVapiToolCall(body);

    console.log(`${logPrefix} 🎯 Function name:`, functionName);
    console.log(`${logPrefix} 🔑 Tool call ID:`, toolCallId);
    console.log(`${logPrefix} 📋 Arguments:`, JSON.stringify(args, null, 2));

    if (!functionName || !toolCallId) {
      console.log(`${logPrefix} ❌ Missing function name or tool call ID`);
      return createErrorResponse("Missing function name or tool call ID", 400);
    }

    // Route to appropriate handler
    const result = await routeAppointmentFunction(
      functionName,
      args,
      toolCallId
    );

    console.log(`${logPrefix} ✅ Function execution completed`);
    console.log(`${logPrefix} 📤 Response:`, JSON.stringify(result, null, 2));

    return createApiResponse(result);
  } catch (error) {
    console.error(`${logPrefix} ❌ Error processing request:`, error);
    return createErrorResponse("Internal server error", 500);
  }
}
