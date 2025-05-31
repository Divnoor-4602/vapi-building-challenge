import {
  api,
  createVapiErrorResponse,
  createVapiResponse,
  fetchAction,
  fetchQuery,
} from "@/lib/api/utils";

export const handleCreateAppointment = async (
  args: Record<string, unknown>,
  toolCallId: string
) => {
  const logPrefix = `[CREATE_APPOINTMENT][${toolCallId}]`;

  console.log(`${logPrefix} 🚀 Starting create appointment action`);
  console.log(
    `${logPrefix} 📥 Raw args received:`,
    JSON.stringify(args, null, 2)
  );

  // Extract required fields from args
  const patientEmail = args.patientEmail as string;
  const summary = args.summary as string;
  const startDateTime = args.startDateTime as string;
  const endDateTime = args.endDateTime as string;
  const timeZone = args.timeZone as string;
  const notes = args.notes as string | undefined;

  console.log(`${logPrefix} 📝 Extracted fields:`, {
    patientEmail: !!patientEmail,
    summary: !!summary,
    startDateTime: !!startDateTime,
    endDateTime: !!endDateTime,
    timeZone: !!timeZone,
    notes: !!notes,
  });

  // Validate required fields
  if (
    !patientEmail ||
    !summary ||
    !startDateTime ||
    !endDateTime ||
    !timeZone
  ) {
    const missing = [];
    if (!patientEmail) missing.push("patientEmail");
    if (!summary) missing.push("summary");
    if (!startDateTime) missing.push("startDateTime");
    if (!endDateTime) missing.push("endDateTime");
    if (!timeZone) missing.push("timeZone");

    console.log(
      `${logPrefix} ❌ VALIDATION_ERROR: Missing required fields: ${missing.join(", ")}`
    );
    const errorResponse = createVapiErrorResponse(
      toolCallId,
      `Missing required fields: ${missing.join(", ")}`
    );
    console.log(
      `${logPrefix} ❌ Returning error response:`,
      JSON.stringify(errorResponse, null, 2)
    );
    return errorResponse;
  }

  console.log(`${logPrefix} ✅ Required field validation passed`);

  try {
    // 1. Find user by email
    console.log(`${logPrefix} 🔍 Looking up user by email: ${patientEmail}`);
    const userProfile = await fetchQuery(api.profiles.getUserProfileByEmail, {
      email: patientEmail,
    });

    if (!userProfile || !userProfile.user) {
      console.log(
        `${logPrefix} ❌ USER_NOT_FOUND: User not found with email: ${patientEmail}`
      );
      const errorResponse = createVapiErrorResponse(
        toolCallId,
        `User not found with email: ${patientEmail}`
      );
      return errorResponse;
    }

    if (!userProfile.profile) {
      console.log(
        `${logPrefix} ❌ PROFILE_NOT_FOUND: User profile not found for email: ${patientEmail}`
      );
      const errorResponse = createVapiErrorResponse(
        toolCallId,
        `User profile not found for email: ${patientEmail}`
      );
      return errorResponse;
    }

    const { user, profile } = userProfile;
    console.log(
      `${logPrefix} ✅ Found user and profile for email: ${patientEmail}`
    );

    // 2. Find the first doctor
    console.log(`${logPrefix} 🔍 Looking up doctors`);
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

    const doctor = doctors[0];
    console.log(`${logPrefix} ✅ Found doctor: ${doctor.email}`);

    // 3. Create or get patient record
    console.log(`${logPrefix} 🏥 Creating patient record`);
    const patientArgs = {
      userId: user._id,
      profileId: profile._id,
      chiefComplaint: summary || "Appointment booking",
      currentSymptoms: [],
    };

    const patientId = await fetchAction(
      api.patients.createPatientAction,
      patientArgs
    );

    if (!patientId) {
      console.log(
        `${logPrefix} ❌ PATIENT_CREATION_FAILED: Failed to create patient record`
      );
      const errorResponse = createVapiErrorResponse(
        toolCallId,
        "Failed to create patient record"
      );
      return errorResponse;
    }

    console.log(`${logPrefix} ✅ Created patient record: ${patientId}`);

    // 4. Create the appointment
    console.log(`${logPrefix} 📅 Creating appointment`);
    const appointmentArgs = {
      doctorId: doctor._id,
      patientId: user._id,
      profileId: profile._id,
      patientRecordId: patientId,
      summary,
      startDateTime,
      endDateTime,
      timeZone,
      attendees: [doctor.email, user.email],
      notes,
    };

    const appointmentResult = await fetchAction(
      api.appointments.createAppointmentAction,
      appointmentArgs
    );

    console.log(`${logPrefix} 🎉 Convex action completed successfully`);
    console.log(
      `${logPrefix} 📊 Action result:`,
      JSON.stringify(appointmentResult, null, 2)
    );

    if (!appointmentResult || !appointmentResult.appointmentId) {
      console.log(
        `${logPrefix} ❌ BUSINESS_ERROR: Appointment creation returned invalid result`
      );
      const errorResponse = createVapiErrorResponse(
        toolCallId,
        "Unable to create appointment"
      );
      return errorResponse;
    }

    // 5. Get the created appointment details
    const createdAppointment = await fetchQuery(
      api.appointments.getAppointmentById,
      { appointmentId: appointmentResult.appointmentId }
    );

    if (!createdAppointment) {
      console.log(
        `${logPrefix} ❌ APPOINTMENT_RETRIEVAL_FAILED: Failed to retrieve created appointment`
      );
      const errorResponse = createVapiErrorResponse(
        toolCallId,
        "Failed to retrieve created appointment"
      );
      return errorResponse;
    }

    console.log(
      `${logPrefix} ✅ Appointment creation successful, creating VAPI response`
    );

    // Create a clean, simple response to avoid conversation cutting
    const successResponse = createVapiResponse(toolCallId, {
      appointment: {
        _id: createdAppointment._id,
        summary: createdAppointment.summary,
        startDateTime: createdAppointment.startDateTime,
        endDateTime: createdAppointment.endDateTime,
        doctorId: createdAppointment.doctorId,
        patientId: createdAppointment.patientId,
        status: createdAppointment.status,
      },
      status: "created",
      message: "Appointment booked successfully",
    });

    console.log(
      `${logPrefix} 🎯 Final success response:`,
      JSON.stringify(successResponse, null, 2)
    );
    return successResponse;
  } catch (error) {
    console.log(
      `${logPrefix} ❌ CONVEX_ACTION_ERROR: Error occurred during appointment creation`
    );
    console.error(`${logPrefix} ❌ Error details:`, error);
    console.error(
      `${logPrefix} ❌ Error stack:`,
      error instanceof Error ? error.stack : "No stack trace"
    );

    const errorResponse = createVapiErrorResponse(
      toolCallId,
      "Unable to create appointment"
    );
    console.log(
      `${logPrefix} ❌ Returning error response:`,
      JSON.stringify(errorResponse, null, 2)
    );
    return errorResponse;
  }
};
