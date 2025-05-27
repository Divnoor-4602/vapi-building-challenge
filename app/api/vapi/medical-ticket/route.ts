import {
  NextRequest,
  createCorsHandler,
  createApiResponse,
  createErrorResponse,
  extractVapiToolCall,
} from "@/lib/api/utils";
import { routeMedicalTicketFunction } from "./router";

// Handle CORS preflight requests
export const OPTIONS = createCorsHandler();

export async function POST(req: NextRequest) {
  const logPrefix = "[MEDICAL_TICKET_ROUTE]";

  console.log(`${logPrefix} 🚀 Received medical ticket request`);

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
    const result = await routeMedicalTicketFunction(
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
