// Medical Ticket Router - handles routing for medical ticket operations
import { createVapiErrorResponse } from "@/lib/api/utils";
import {
  handleCreateMedicalTicket,
  handleCheckMedicalTicketStatus,
} from "./handlers";

export const routeMedicalTicketFunction = async (
  functionName: string,
  args: Record<string, unknown>,
  toolCallId: string
) => {
  const logPrefix = `[MEDICAL_TICKET_ROUTER][${toolCallId}]`;

  console.log(`${logPrefix} 🚀 Starting function routing`);
  console.log(`${logPrefix} 🎯 Function name:`, functionName);
  console.log(`${logPrefix} 📥 Args:`, JSON.stringify(args, null, 2));
  console.log(`${logPrefix} 🔑 Tool call ID:`, toolCallId);

  switch (functionName) {
    case "createMedicalTicket":
      console.log(`${logPrefix} ✅ Routing to: handleCreateMedicalTicket`);
      return await handleCreateMedicalTicket(args, toolCallId);

    case "checkMedicalTicketStatus":
      console.log(`${logPrefix} ✅ Routing to: handleCheckMedicalTicketStatus`);
      return await handleCheckMedicalTicketStatus(args, toolCallId);

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
