import {
  api,
  createVapiResponse,
  createVapiErrorResponse,
  fetchAction,
} from "@/lib/api/utils";

export const handleCreatePatientProfileAction = async (
  args: Record<string, unknown>,
  toolCallId: string
) => {
  const logPrefix = `[CREATE_PROFILE][${toolCallId}]`;

  console.log(`${logPrefix} 🚀 Starting create patient profile action`);
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

  const firstName = args.firstName as string;
  const lastName = args.lastName as string;
  const dateOfBirth = args.dateOfBirth as string;
  const gender = args.gender as string;
  const phoneNumber = args.phoneNumber as string;

  console.log(`${logPrefix} 📝 Extracted required fields:`, {
    firstName: !!firstName,
    lastName: !!lastName,
    dateOfBirth: !!dateOfBirth,
    gender: !!gender,
    phoneNumber: !!phoneNumber,
  });

  if (!firstName || !lastName || !dateOfBirth || !gender || !phoneNumber) {
    console.log(`${logPrefix} ❌ VALIDATION_ERROR: Missing required fields`);
    console.log(`${logPrefix} ❌ Field validation:`, {
      firstName: !!firstName,
      lastName: !!lastName,
      dateOfBirth: !!dateOfBirth,
      gender: !!gender,
      phoneNumber: !!phoneNumber,
    });
    const errorResponse = createVapiErrorResponse(
      toolCallId,
      "Missing required fields"
    );
    console.log(
      `${logPrefix} ❌ Returning error response:`,
      JSON.stringify(errorResponse, null, 2)
    );
    return errorResponse;
  }

  console.log(`${logPrefix} ✅ Required field validation passed`);

  const address = args.address
    ? (() => {
        const addressArg = args.address as Record<string, unknown>;
        const addressData: {
          street?: string;
          city?: string;
          state?: string;
          zipCode?: string;
          country?: string;
        } = {};

        if (addressArg.street !== undefined)
          addressData.street = addressArg.street as string;
        if (addressArg.city !== undefined)
          addressData.city = addressArg.city as string;
        if (addressArg.state !== undefined)
          addressData.state = addressArg.state as string;
        if (addressArg.zipCode !== undefined)
          addressData.zipCode = addressArg.zipCode as string;
        if (addressArg.country !== undefined)
          addressData.country = addressArg.country as string;

        // Only return address object if at least one field is provided
        return Object.keys(addressData).length > 0 ? addressData : undefined;
      })()
    : undefined;

  if (address) {
    console.log(
      `${logPrefix} 📍 Address provided:`,
      JSON.stringify(address, null, 2)
    );
  } else {
    console.log(`${logPrefix} 📍 No address provided`);
  }

  const communicationPreferences = args.communicationPreferences
    ? {
        email: (args.communicationPreferences as Record<string, unknown>)
          ?.email as boolean,
        sms: (args.communicationPreferences as Record<string, unknown>)
          ?.sms as boolean,
        phone: (args.communicationPreferences as Record<string, unknown>)
          ?.phone as boolean,
      }
    : undefined;

  if (communicationPreferences) {
    console.log(
      `${logPrefix} 📞 Communication preferences provided:`,
      JSON.stringify(communicationPreferences, null, 2)
    );
  } else {
    console.log(`${logPrefix} 📞 No communication preferences provided`);
  }

  const emergencyContact = args.emergencyContact
    ? {
        name:
          ((args.emergencyContact as Record<string, unknown>)
            ?.name as string) || "",
        relationship:
          ((args.emergencyContact as Record<string, unknown>)
            ?.relationship as string) || "",
        phoneNumber:
          ((args.emergencyContact as Record<string, unknown>)
            ?.phoneNumber as string) || "",
      }
    : undefined;

  if (emergencyContact) {
    console.log(
      `${logPrefix} 🚨 Emergency contact provided:`,
      JSON.stringify(emergencyContact, null, 2)
    );
  } else {
    console.log(`${logPrefix} 🚨 No emergency contact provided`);
  }

  // Process medical history
  const medicalHistory = args.medicalHistory
    ? (() => {
        const medHistArg = args.medicalHistory as Record<string, unknown>;
        return {
          allergies: (medHistArg.allergies as string[]) || [],
          currentMedications:
            (medHistArg.currentMedications as Array<{
              name: string;
              dosage: string;
              frequency: string;
            }>) || [],
          chronicConditions: (medHistArg.chronicConditions as string[]) || [],
          previousSurgeries:
            (medHistArg.previousSurgeries as Array<{
              procedure: string;
              year: string;
            }>) || [],
          familyHistory: medHistArg.familyHistory as string[] | undefined,
        };
      })()
    : undefined;

  if (medicalHistory) {
    console.log(
      `${logPrefix} 🏥 Medical history provided:`,
      JSON.stringify(medicalHistory, null, 2)
    );
  } else {
    console.log(`${logPrefix} 🏥 No medical history provided`);
  }

  // Process insurance
  const insurance = args.insurance
    ? {
        provider:
          ((args.insurance as Record<string, unknown>)?.provider as string) ||
          "",
        policyNumber:
          ((args.insurance as Record<string, unknown>)
            ?.policyNumber as string) || "",
        groupNumber: (args.insurance as Record<string, unknown>)
          ?.groupNumber as string | undefined,
        subscriberName:
          ((args.insurance as Record<string, unknown>)
            ?.subscriberName as string) || "",
        relationshipToSubscriber:
          ((args.insurance as Record<string, unknown>)
            ?.relationshipToSubscriber as string) || "",
      }
    : undefined;

  if (insurance) {
    console.log(
      `${logPrefix} 💳 Insurance provided:`,
      JSON.stringify(insurance, null, 2)
    );
  } else {
    console.log(`${logPrefix} 💳 No insurance provided`);
  }

  // Process consents
  const consents = args.consents
    ? {
        treatmentConsent:
          ((args.consents as Record<string, unknown>)
            ?.treatmentConsent as boolean) || false,
        dataProcessingConsent:
          ((args.consents as Record<string, unknown>)
            ?.dataProcessingConsent as boolean) || false,
        marketingConsent:
          ((args.consents as Record<string, unknown>)
            ?.marketingConsent as boolean) || false,
        consentTimestamp:
          ((args.consents as Record<string, unknown>)
            ?.consentTimestamp as number) || Date.now(),
      }
    : undefined;

  if (consents) {
    console.log(
      `${logPrefix} 📋 Consents provided:`,
      JSON.stringify(consents, null, 2)
    );
  } else {
    console.log(`${logPrefix} 📋 No consents provided`);
  }

  const actionArgs = {
    email,
    firstName,
    lastName,
    dateOfBirth,
    gender: gender as "male" | "female" | "other" | "prefer_not_to_say",
    phoneNumber,
    address,
    communicationPreferences,
    emergencyContact,
    medicalHistory,
    insurance,
    consents,
  };

  console.log(
    `${logPrefix} 📦 Final action args prepared:`,
    JSON.stringify(actionArgs, null, 2)
  );
  console.log(
    `${logPrefix} 🔄 Calling Convex action: api.profiles.createPatientProfileAction`
  );

  try {
    const newPatientProfile = await fetchAction(
      api.profiles.createPatientProfileAction,
      actionArgs
    );

    console.log(`${logPrefix} 🎉 Convex action completed successfully`);
    console.log(
      `${logPrefix} 📊 Action result:`,
      JSON.stringify(newPatientProfile, null, 2)
    );

    if (!newPatientProfile) {
      console.log(
        `${logPrefix} ❌ BUSINESS_ERROR: Profile creation returned null`
      );
      const errorResponse = createVapiErrorResponse(
        toolCallId,
        "Unable to create patient profile"
      );
      console.log(
        `${logPrefix} ❌ Returning error response:`,
        JSON.stringify(errorResponse, null, 2)
      );
      return errorResponse;
    }

    console.log(
      `${logPrefix} ✅ Profile creation successful, creating VAPI response`
    );

    // Create a clean response to avoid conversation cutting
    const successResponse = createVapiResponse(toolCallId, {
      ...newPatientProfile,
      status: "created",
      message: "Patient profile created successfully",
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
      "Unable to create patient profile"
    );
    console.log(
      `${logPrefix} ❌ Returning error response:`,
      JSON.stringify(errorResponse, null, 2)
    );
    return errorResponse;
  }
};
