import {
  api,
  createVapiErrorResponse,
  createVapiResponse,
  fetchAction,
  validatePatientIds,
} from "@/lib/api/utils";

export const handleCreatePatient = async (
  args: Record<string, unknown>,
  toolCallId: string
) => {
  const logPrefix = `[CREATE_PATIENT][${toolCallId}]`;

  console.log(`${logPrefix} 🚀 Starting create patient action`);
  console.log(
    `${logPrefix} 📥 Raw args received:`,
    JSON.stringify(args, null, 2)
  );

  // Validate and convert required ID fields
  const { isValid, convertedIds, errors } = validatePatientIds(args, logPrefix);

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

  const { userId, profileId } = convertedIds;

  // Extract required fields
  const chiefComplaint = args.chiefComplaint as string;

  console.log(`${logPrefix} 📝 Extracted required fields:`, {
    userId: !!userId,
    profileId: !!profileId,
    chiefComplaint: !!chiefComplaint,
  });

  if (!chiefComplaint) {
    console.log(`${logPrefix} ❌ VALIDATION_ERROR: Missing chiefComplaint`);
    const errorResponse = createVapiErrorResponse(
      toolCallId,
      "Missing required field: chiefComplaint is required"
    );
    console.log(
      `${logPrefix} ❌ Returning error response:`,
      JSON.stringify(errorResponse, null, 2)
    );
    return errorResponse;
  }

  console.log(`${logPrefix} ✅ Required field validation passed`);

  // Process current symptoms
  const currentSymptoms = args.currentSymptoms
    ? (args.currentSymptoms as Array<{
        symptom: string;
        severity: "mild" | "moderate" | "severe";
        duration: string;
        notes?: string;
      }>)
    : [];

  console.log(
    `${logPrefix} 🏥 Current symptoms:`,
    JSON.stringify(currentSymptoms, null, 2)
  );

  // Process optional fields
  const requiresFollowUp = args.requiresFollowUp as boolean | undefined;
  const followUpNotes = args.followUpNotes as string | undefined;

  const actionArgs = {
    userId: userId!,
    profileId: profileId!,
    chiefComplaint,
    currentSymptoms,
    requiresFollowUp,
    followUpNotes,
  };

  console.log(
    `${logPrefix} 📦 Final action args prepared:`,
    JSON.stringify(actionArgs, null, 2)
  );
  console.log(
    `${logPrefix} 🔄 Calling Convex action: api.patients.createPatientAction`
  );

  try {
    const patientId = await fetchAction(
      api.patients.createPatientAction,
      actionArgs
    );

    console.log(`${logPrefix} 🎉 Convex action completed successfully`);
    console.log(`${logPrefix} 📊 Action result:`, patientId);

    if (!patientId) {
      console.log(
        `${logPrefix} ❌ BUSINESS_ERROR: Patient creation returned null`
      );
      const errorResponse = createVapiErrorResponse(
        toolCallId,
        "Unable to create patient record"
      );
      console.log(
        `${logPrefix} ❌ Returning error response:`,
        JSON.stringify(errorResponse, null, 2)
      );
      return errorResponse;
    }

    console.log(
      `${logPrefix} ✅ Patient creation successful, creating VAPI response`
    );

    // Create a clean, simple response to avoid conversation cutting
    const successResponse = createVapiResponse(toolCallId, {
      patientId,
      status: "created",
      message: "Patient record created successfully",
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
      "Unable to create patient record"
    );
    console.log(
      `${logPrefix} ❌ Returning error response:`,
      JSON.stringify(errorResponse, null, 2)
    );
    return errorResponse;
  }
};
