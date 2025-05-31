import {
  api,
  createVapiErrorResponse,
  createVapiResponse,
  fetchQuery,
} from "@/lib/api/utils";

export const handleGetDoctor = async (
  args: Record<string, unknown>,
  toolCallId: string
) => {
  const logPrefix = `[GET_DOCTOR][${toolCallId}]`;

  console.log(`${logPrefix} 🚀 Starting get doctor query`);
  console.log(
    `${logPrefix} 📥 Raw args received:`,
    JSON.stringify(args, null, 2)
  );

  try {
    // Get all available doctors
    console.log(`${logPrefix} 🔍 Looking up available doctors`);
    const doctors = await fetchQuery(api.users.getUsersByUserType, {
      userType: "doctor",
    });

    if (!doctors || doctors.length === 0) {
      console.log(
        `${logPrefix} ❌ NO_DOCTORS: No doctors available in the system`
      );
      const errorResponse = createVapiErrorResponse(
        toolCallId,
        "No doctors available in the system"
      );
      return errorResponse;
    }

    // Return the first available doctor (primary doctor)
    const primaryDoctor = doctors[0];
    console.log(`${logPrefix} ✅ Found primary doctor: ${primaryDoctor.email}`);

    // Create a clean response with doctor information
    const successResponse = createVapiResponse(toolCallId, {
      doctor: {
        _id: primaryDoctor._id,
        name: primaryDoctor.name,
        email: primaryDoctor.email,
        userType: primaryDoctor.userType,
        isActive: primaryDoctor.isActive,
      },
      totalDoctors: doctors.length,
      status: "success",
      message: "Doctor information retrieved successfully",
    });

    console.log(
      `${logPrefix} 🎯 Final success response:`,
      JSON.stringify(successResponse, null, 2)
    );
    return successResponse;
  } catch (error) {
    console.log(
      `${logPrefix} ❌ QUERY_ERROR: Error occurred during doctor lookup`
    );
    console.error(`${logPrefix} ❌ Error details:`, error);
    console.error(
      `${logPrefix} ❌ Error stack:`,
      error instanceof Error ? error.stack : "No stack trace"
    );

    const errorResponse = createVapiErrorResponse(
      toolCallId,
      "Unable to retrieve doctor information"
    );
    console.log(
      `${logPrefix} ❌ Returning error response:`,
      JSON.stringify(errorResponse, null, 2)
    );
    return errorResponse;
  }
};
