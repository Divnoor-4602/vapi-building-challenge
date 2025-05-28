import { createVapiErrorResponse } from "@/lib/api/utils";
import {
  handleCheckPatientProfile,
  handleCreatePatientProfileAction,
  handleGetProfileMissingFields,
  handleUpdatePatientProfileAction,
  handleCreatePatient,
} from "./handlers";

export const routePatientProfileFunction = async (
  functionName: string,
  args: Record<string, unknown>,
  toolCallId: string
) => {
  const logPrefix = `[PATIENT_PROFILE_ROUTER][${toolCallId}]`;

  console.log(`${logPrefix} 🚀 Starting function routing`);
  console.log(`${logPrefix} 🎯 Function name:`, functionName);
  console.log(`${logPrefix} 📥 Args:`, JSON.stringify(args, null, 2));
  console.log(`${logPrefix} 🔑 Tool call ID:`, toolCallId);

  switch (functionName) {
    case "checkPatientProfile":
      console.log(`${logPrefix} ✅ Routing to: handleCheckPatientProfile`);
      return await handleCheckPatientProfile(args, toolCallId);

    case "createPatientProfile":
      console.log(
        `${logPrefix} ✅ Routing to: handleCreatePatientProfileAction`
      );
      return await handleCreatePatientProfileAction(args, toolCallId);

    case "updatePatientProfile":
      console.log(
        `${logPrefix} ✅ Routing to: handleUpdatePatientProfileAction`
      );
      return await handleUpdatePatientProfileAction(args, toolCallId);

    case "getProfileMissingFields":
      console.log(`${logPrefix} ✅ Routing to: handleGetProfileMissingFields`);
      return await handleGetProfileMissingFields(args, toolCallId);

    case "createPatient":
      console.log(`${logPrefix} ✅ Routing to: handleCreatePatient`);
      return await handleCreatePatient(args, toolCallId);

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
  checkPatientProfile: handleCheckPatientProfile,
  createPatientProfileAction: handleCreatePatientProfileAction,
  updatePatientProfileAction: handleUpdatePatientProfileAction,
  getProfileMissingFields: handleGetProfileMissingFields,
  createPatient: handleCreatePatient,
};
