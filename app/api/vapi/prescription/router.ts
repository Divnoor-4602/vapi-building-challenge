// Prescription Router - handles routing for prescription operations
import { createVapiErrorResponse } from "@/lib/api/utils";
import { handleGetPrescription } from "./handlers";

export const routePrescriptionFunction = async (
  functionName: string,
  args: Record<string, unknown>,
  toolCallId: string
) => {
  const logPrefix = `[PRESCRIPTION_ROUTER][${toolCallId}]`;

  console.log(`${logPrefix} 🚀 Starting function routing`);
  console.log(`${logPrefix} 🎯 Function name:`, functionName);
  console.log(`${logPrefix} 📥 Args:`, JSON.stringify(args, null, 2));
  console.log(`${logPrefix} 🔑 Tool call ID:`, toolCallId);

  switch (functionName) {
    case "getPrescription":
      console.log(`${logPrefix} ✅ Routing to: handleGetPrescription`);
      return await handleGetPrescription(args, toolCallId);

    default:
      console.log(
        `${logPrefix} ❌ ROUTING_ERROR: Unknown function name: ${functionName}`
      );
      const errorResponse = createVapiErrorResponse(
        toolCallId,
        `Unknown function: ${functionName}`
      );
      console.log(
        `${logPrefix} ❌ Returning error response:`,
        JSON.stringify(errorResponse, null, 2)
      );
      return errorResponse;
  }
};
