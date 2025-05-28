import {
  api,
  createVapiErrorResponse,
  createVapiResponse,
  fetchAction,
  validateMedicalTicketIds,
} from "@/lib/api/utils";

export const handleCreateMedicalTicket = async (
  args: Record<string, unknown>,
  toolCallId: string
) => {
  const logPrefix = `[CREATE_MEDICAL_TICKET][${toolCallId}]`;

  console.log(`${logPrefix} 🚀 Starting create medical ticket action`);
  console.log(
    `${logPrefix} 📥 Raw args received:`,
    JSON.stringify(args, null, 2)
  );

  // Validate and convert required ID fields
  const { isValid, convertedIds, errors } = validateMedicalTicketIds(
    args,
    logPrefix
  );

  if (!isValid) {
    console.log(`${logPrefix} ❌ VALIDATION_ERROR: ${errors.join(", ")}`);
    const errorResponse = createVapiErrorResponse(
      toolCallId,
      `Missing or invalid required fields: ${errors.join(", ")}`
    );
    console.log(
      `${logPrefix} ❌ Returning error response:`,
      JSON.stringify(errorResponse, null, 2)
    );
    return errorResponse;
  }

  const { userId, profileId, patientId } = convertedIds;

  // Extract optional fields
  const status = args.status as
    | "cancelled"
    | "completed"
    | "in_progress"
    | "on_hold"
    | undefined;
  const nextSteps = args.nextSteps as
    | "vapi_appointment"
    | "vapi_prescription"
    | undefined;

  console.log(`${logPrefix} 📝 Extracted optional fields:`, {
    status: status || "in_progress (default)",
    nextSteps: nextSteps || "undefined (to be determined by medical staff)",
  });

  console.log(`${logPrefix} ✅ Required field validation passed`);

  // Process optional fields
  const notes = args.notes as string | undefined;

  const actionArgs = {
    userId: userId!,
    profileId: profileId!,
    patientId: patientId!,
    status,
    nextSteps,
    notes,
  };

  console.log(
    `${logPrefix} 📦 Final action args prepared:`,
    JSON.stringify(actionArgs, null, 2)
  );
  console.log(
    `${logPrefix} 🔄 Calling Convex action: api.medicalTickets.createMedicalTicketAction`
  );

  try {
    const ticketId = await fetchAction(
      api.medicalTickets.createMedicalTicketAction,
      actionArgs
    );

    console.log(`${logPrefix} 🎉 Convex action completed successfully`);
    console.log(`${logPrefix} 📊 Action result:`, ticketId);

    if (!ticketId) {
      console.log(
        `${logPrefix} ❌ BUSINESS_ERROR: Medical ticket creation returned null`
      );
      const errorResponse = createVapiErrorResponse(
        toolCallId,
        "Unable to create medical ticket"
      );
      console.log(
        `${logPrefix} ❌ Returning error response:`,
        JSON.stringify(errorResponse, null, 2)
      );
      return errorResponse;
    }

    console.log(
      `${logPrefix} ✅ Medical ticket creation successful, creating VAPI response`
    );

    // Create a clean, simple response to avoid conversation cutting
    const successResponse = createVapiResponse(toolCallId, {
      ticketId,
      status: "created",
      message: "Medical ticket created successfully",
    });

    console.log(
      `${logPrefix} 🎯 Final success response:`,
      JSON.stringify(successResponse, null, 2)
    );
    return successResponse;
  } catch (error) {
    console.log(
      `${logPrefix} ❌ CONVEX_ACTION_ERROR: Error occurred during Convex action`
    );
    console.error(`${logPrefix} ❌ Error details:`, error);
    console.error(
      `${logPrefix} ❌ Error stack:`,
      error instanceof Error ? error.stack : "No stack trace"
    );

    const errorResponse = createVapiErrorResponse(
      toolCallId,
      "Unable to create medical ticket"
    );
    console.log(
      `${logPrefix} ❌ Returning error response:`,
      JSON.stringify(errorResponse, null, 2)
    );
    return errorResponse;
  }
};
