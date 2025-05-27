import {
  api,
  createVapiResponse,
  createVapiErrorResponse,
  fetchQuery,
} from "@/lib/api/utils";

export const handleCheckPatientProfile = async (
  args: Record<string, unknown>,
  toolCallId: string
) => {
  const logPrefix = `[CHECK_PROFILE][${toolCallId}]`;

  console.log(`${logPrefix} 🚀 Starting check patient profile query`);
  console.log(
    `${logPrefix} 📥 Raw args received:`,
    JSON.stringify(args, null, 2)
  );

  const email = args.email as string;
  console.log(`${logPrefix} 📧 Extracted email:`, email);

  if (!email) {
    console.log(`${logPrefix} ❌ VALIDATION_ERROR: Email is required`);
    const errorResponse = createVapiErrorResponse(
      toolCallId,
      "Email is required"
    );
    console.log(
      `${logPrefix} ❌ Returning error response:`,
      JSON.stringify(errorResponse, null, 2)
    );
    return errorResponse;
  }

  console.log(`${logPrefix} ✅ Email validation passed`);
  console.log(
    `${logPrefix} 🔍 Calling Convex query: api.profiles.getUserProfileByEmail`
  );

  try {
    const userProfile = await fetchQuery(api.profiles.getUserProfileByEmail, {
      email,
    });

    console.log(`${logPrefix} 🎉 Convex query completed successfully`);
    console.log(
      `${logPrefix} 📊 Query result:`,
      JSON.stringify(userProfile, null, 2)
    );

    if (!userProfile) {
      console.log(
        `${logPrefix} ❌ BUSINESS_ERROR: User profile not found for email: ${email}`
      );
      const errorResponse = createVapiErrorResponse(
        toolCallId,
        "User profile not found"
      );
      console.log(
        `${logPrefix} ❌ Returning error response:`,
        JSON.stringify(errorResponse, null, 2)
      );
      return errorResponse;
    }

    console.log(
      `${logPrefix} ✅ Profile found successfully, creating VAPI response`
    );
    const successResponse = createVapiResponse(toolCallId, userProfile);
    console.log(
      `${logPrefix} 🎯 Final success response:`,
      JSON.stringify(successResponse, null, 2)
    );
    return successResponse;
  } catch (error) {
    console.log(
      `${logPrefix} ❌ CONVEX_QUERY_ERROR: Error occurred during Convex query`
    );
    console.error(`${logPrefix} ❌ Error details:`, error);
    console.error(
      `${logPrefix} ❌ Error stack:`,
      error instanceof Error ? error.stack : "No stack trace"
    );

    const errorResponse = createVapiErrorResponse(
      toolCallId,
      "Unable to check patient profile"
    );
    console.log(
      `${logPrefix} ❌ Returning error response:`,
      JSON.stringify(errorResponse, null, 2)
    );
    return errorResponse;
  }
};
