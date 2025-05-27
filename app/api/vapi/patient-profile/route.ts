// Patient Profile API Route
// This route handles patient profile operations using Convex actions for third-party integration:
// - **checkPatientProfile**: Verify if patient profile exists using email (query)
// - **createPatientProfile**: Create new patient profile with collected demographics (action)
// - **updatePatientProfile**: Update existing patient profile with provided information (action)
// - **getProfileMissingFields**: Get list of missing fields from an existing profile (query)
// - **createPatient**: Create patient record with visit-specific information (action)
// - **createMedicalTicket**: Create a medical ticket with user-specific information and medical history (action)

import {
  NextRequest,
  createCorsHandler,
  createApiResponse,
  createErrorResponse,
  extractVapiToolCall,
} from "@/lib/api/utils";
import { routePatientProfileFunction } from "./router";

// Handle CORS preflight requests
export const OPTIONS = createCorsHandler();

/**
 * This route handles patient profile operations including:
 * - Checking if a patient profile exists (query)
 * - Creating new patient profiles (action)
 * - Updating existing patient profiles (action)
 * - Getting missing fields from profiles (query)
 * - Creating patient records for visits (action)
 * - Creating medical tickets for patients (action)
 *
 * Uses Convex actions for mutations to properly handle third-party API integration
 */
export async function POST(req: NextRequest) {
  const logPrefix = "[PATIENT_PROFILE_ROUTE]";

  console.log(`${logPrefix} 🚀 Received patient profile request`);

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
    const result = await routePatientProfileFunction(
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
