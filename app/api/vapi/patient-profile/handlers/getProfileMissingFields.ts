import {
  api,
  createVapiResponse,
  createVapiErrorResponse,
  fetchQuery,
} from "@/lib/api/utils";

export const handleGetProfileMissingFields = async (
  args: Record<string, unknown>,
  toolCallId: string
) => {
  const logPrefix = `[MISSING_FIELDS][${toolCallId}]`;

  console.log(`${logPrefix} 🚀 Starting get profile missing fields query`);
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
    `${logPrefix} 🔍 Calling Convex query: api.profiles.getProfileMissingFields`
  );

  try {
    const missingFields = await fetchQuery(
      api.profiles.getProfileMissingFields,
      {
        email,
      }
    );

    console.log(`${logPrefix} 🎉 Convex query completed successfully`);
    console.log(
      `${logPrefix} 📊 Query result:`,
      JSON.stringify(missingFields, null, 2)
    );

    if (!missingFields) {
      console.log(
        `${logPrefix} ❌ BUSINESS_ERROR: Unable to get missing fields for email: ${email}`
      );
      const errorResponse = createVapiErrorResponse(
        toolCallId,
        "Unable to get missing fields"
      );
      console.log(
        `${logPrefix} ❌ Returning error response:`,
        JSON.stringify(errorResponse, null, 2)
      );
      return errorResponse;
    }

    console.log(
      `${logPrefix} ✅ Missing fields retrieved successfully, creating VAPI response`
    );
    const successResponse = createVapiResponse(toolCallId, missingFields);
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
      "Unable to get missing fields"
    );
    console.log(
      `${logPrefix} ❌ Returning error response:`,
      JSON.stringify(errorResponse, null, 2)
    );
    return errorResponse;
  }
};
