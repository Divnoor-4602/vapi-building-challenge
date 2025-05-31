import { createVapiErrorResponse } from "@/lib/api/utils";
import { handleCreateAppointment, handleGetDoctor } from "./handlers";

export const routeAppointmentFunction = async (
  functionName: string,
  args: Record<string, unknown>,
  toolCallId: string
) => {
  const logPrefix = `[APPOINTMENT_ROUTER][${toolCallId}]`;

  console.log(`${logPrefix} 🚀 Starting function routing`);
  console.log(`${logPrefix} 🎯 Function name:`, functionName);
  console.log(`${logPrefix} 📥 Args:`, JSON.stringify(args, null, 2));
  console.log(`${logPrefix} 🔑 Tool call ID:`, toolCallId);

  switch (functionName) {
    case "createAppointment":
      console.log(`${logPrefix} ✅ Routing to: handleCreateAppointment`);
      return await handleCreateAppointment(args, toolCallId);

    case "getDoctor":
      console.log(`${logPrefix} ✅ Routing to: handleGetDoctor`);
      return await handleGetDoctor(args, toolCallId);

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

export const functionHandlers = {
  createAppointment: handleCreateAppointment,
  getDoctor: handleGetDoctor,
};
