import {
  api,
  createVapiResponse,
  createVapiErrorResponse,
  fetchAction,
} from "@/lib/api/utils";

export const handleUpdatePatientProfileAction = async (
  args: Record<string, unknown>,
  toolCallId: string
) => {
  const logPrefix = `[UPDATE_PROFILE][${toolCallId}]`;

  console.log(`${logPrefix} 🚀 Starting update patient profile action`);
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

  // Build update object with only provided fields
  const updateData: Record<string, unknown> = { email };
  console.log(`${logPrefix} 🔧 Building update data object...`);

  if (args.firstName !== undefined) {
    updateData.firstName = args.firstName as string;
    console.log(`${logPrefix} 📝 Added firstName:`, updateData.firstName);
  }
  if (args.lastName !== undefined) {
    updateData.lastName = args.lastName as string;
    console.log(`${logPrefix} 📝 Added lastName:`, updateData.lastName);
  }
  if (args.dateOfBirth !== undefined) {
    updateData.dateOfBirth = args.dateOfBirth as string;
    console.log(`${logPrefix} 📝 Added dateOfBirth:`, updateData.dateOfBirth);
  }
  if (args.gender !== undefined) {
    updateData.gender = args.gender as string;
    console.log(`${logPrefix} 📝 Added gender:`, updateData.gender);
  }
  if (args.phoneNumber !== undefined) {
    updateData.phoneNumber = args.phoneNumber as string;
    console.log(`${logPrefix} 📝 Added phoneNumber:`, updateData.phoneNumber);
  }

  if (args.address !== undefined) {
    const addressArg = args.address as Record<string, unknown>;
    const addressData: Record<string, unknown> = {};

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

    // Only include address if at least one field is provided
    if (Object.keys(addressData).length > 0) {
      updateData.address = addressData;
      console.log(
        `${logPrefix} 📝 Added address:`,
        JSON.stringify(updateData.address, null, 2)
      );
    }
  }

  if (args.communicationPreferences !== undefined) {
    const commPrefs = args.communicationPreferences as Record<string, unknown>;
    updateData.communicationPreferences = {
      email: commPrefs.email as boolean,
      sms: commPrefs.sms as boolean,
      phone: commPrefs.phone as boolean,
    };
    console.log(
      `${logPrefix} 📝 Added communicationPreferences:`,
      JSON.stringify(updateData.communicationPreferences, null, 2)
    );
  }

  if (args.emergencyContact !== undefined) {
    const emergencyArg = args.emergencyContact as Record<string, unknown>;
    updateData.emergencyContact = {
      name: emergencyArg.name as string,
      relationship: emergencyArg.relationship as string,
      phoneNumber: emergencyArg.phoneNumber as string,
    };
    console.log(
      `${logPrefix} 📝 Added emergencyContact:`,
      JSON.stringify(updateData.emergencyContact, null, 2)
    );
  }

  // Process medical history
  if (args.medicalHistory !== undefined) {
    const medHistArg = args.medicalHistory as Record<string, unknown>;
    updateData.medicalHistory = {
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
    console.log(
      `${logPrefix} 📝 Added medicalHistory:`,
      JSON.stringify(updateData.medicalHistory, null, 2)
    );
  }

  // Process insurance
  if (args.insurance !== undefined) {
    const insuranceArg = args.insurance as Record<string, unknown>;
    updateData.insurance = {
      provider: insuranceArg.provider as string,
      policyNumber: insuranceArg.policyNumber as string,
      groupNumber: insuranceArg.groupNumber as string | undefined,
      subscriberName: insuranceArg.subscriberName as string,
      relationshipToSubscriber: insuranceArg.relationshipToSubscriber as string,
    };
    console.log(
      `${logPrefix} 📝 Added insurance:`,
      JSON.stringify(updateData.insurance, null, 2)
    );
  }

  // Process consents
  if (args.consents !== undefined) {
    const consentsArg = args.consents as Record<string, unknown>;
    updateData.consents = {
      treatmentConsent: consentsArg.treatmentConsent as boolean,
      dataProcessingConsent: consentsArg.dataProcessingConsent as boolean,
      marketingConsent: consentsArg.marketingConsent as boolean,
      consentTimestamp: consentsArg.consentTimestamp as number,
    };
    console.log(
      `${logPrefix} 📝 Added consents:`,
      JSON.stringify(updateData.consents, null, 2)
    );
  }

  console.log(
    `${logPrefix} 📦 Final updateData prepared:`,
    JSON.stringify(updateData, null, 2)
  );
  console.log(
    `${logPrefix} 🔄 Calling Convex action: api.profiles.updatePatientProfileAction`
  );

  try {
    const updatedProfile = await fetchAction(
      api.profiles.updatePatientProfileAction,
      updateData as {
        email: string;
        firstName?: string;
        lastName?: string;
        dateOfBirth?: string;
        gender?: "male" | "female" | "other" | "prefer_not_to_say";
        phoneNumber?: string;
        address?: {
          street?: string;
          city?: string;
          state?: string;
          zipCode?: string;
          country?: string;
        };
        communicationPreferences?: {
          email: boolean;
          sms: boolean;
          phone: boolean;
        };
        emergencyContact?: {
          name: string;
          relationship: string;
          phoneNumber: string;
        };
        medicalHistory?: {
          allergies: string[];
          currentMedications: Array<{
            name: string;
            dosage: string;
            frequency: string;
          }>;
          chronicConditions: string[];
          previousSurgeries: Array<{
            procedure: string;
            year: string;
          }>;
          familyHistory?: string[];
        };
        insurance?: {
          provider: string;
          policyNumber: string;
          groupNumber?: string;
          subscriberName: string;
          relationshipToSubscriber: string;
        };
        consents?: {
          treatmentConsent: boolean;
          dataProcessingConsent: boolean;
          marketingConsent: boolean;
          consentTimestamp: number;
        };
      }
    );

    console.log(`${logPrefix} 🎉 Convex action completed successfully`);
    console.log(
      `${logPrefix} 📊 Action result:`,
      JSON.stringify(updatedProfile, null, 2)
    );

    if (!updatedProfile) {
      console.log(
        `${logPrefix} ❌ BUSINESS_ERROR: Profile not found or could not be updated`
      );
      const errorResponse = createVapiErrorResponse(
        toolCallId,
        "Profile not found or could not be updated"
      );
      console.log(
        `${logPrefix} ❌ Returning error response:`,
        JSON.stringify(errorResponse, null, 2)
      );
      return errorResponse;
    }

    console.log(
      `${logPrefix} ✅ Profile update successful, creating VAPI response`
    );

    // Create a clean response to avoid conversation cutting
    const successResponse = createVapiResponse(toolCallId, {
      ...updatedProfile,
      status: "updated",
      message: "Patient profile updated successfully",
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
      "Unable to update patient profile"
    );
    console.log(
      `${logPrefix} ❌ Returning error response:`,
      JSON.stringify(errorResponse, null, 2)
    );
    return errorResponse;
  }
};
