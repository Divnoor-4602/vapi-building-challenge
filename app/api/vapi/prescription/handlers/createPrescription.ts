import {
  api,
  createVapiResponse,
  createVapiErrorResponse,
  fetchMutation,
  fetchQuery,
  convertToConvexId,
} from "@/lib/api/utils";
import { Id } from "@/convex/_generated/dataModel";

interface ICreatePrescriptionResponse {
  prescriptionId: string;
  status: "created";
  message: "Prescription created successfully";
  prescriptionObject: {
    _id: string;
    _creationTime: number;
    patientId: string;
    ticketId: string;
    prescriptionDetails: {
      medication: string;
      dosage: string;
      frequency: string;
      instructions: string;
    };
    notes?: string;
  };
}

export const handleCreatePrescription = async (
  args: Record<string, unknown>,
  toolCallId: string
) => {
  const logPrefix = `[CREATE_PRESCRIPTION][${toolCallId}]`;

  console.log(`${logPrefix} 🚀 Starting create prescription action`);
  console.log(
    `${logPrefix} 📥 Raw args received:`,
    JSON.stringify(args, null, 2)
  );

  // Validate and convert required ID fields
  const patientId = convertToConvexId(args.patientId);
  const ticketId = convertToConvexId(args.ticketId);

  console.log(`${logPrefix} 📝 Extracted ID fields:`, {
    patientId: !!patientId,
    ticketId: !!ticketId,
  });

  // Validate required IDs
  const errors: string[] = [];
  if (!patientId) {
    errors.push("patientId is required and must be a valid patients ID");
  }
  if (!ticketId) {
    errors.push("ticketId is required and must be a valid medicalTickets ID");
  }

  if (errors.length > 0) {
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

  // Extract and validate prescription details
  const prescriptionDetails = args.prescriptionDetails as
    | {
        medication: string;
        dosage: string;
        frequency: string;
        instructions: string;
      }
    | undefined;

  console.log(`${logPrefix} 💊 Prescription details:`, {
    hasDetails: !!prescriptionDetails,
    medication: prescriptionDetails?.medication ? "provided" : "missing",
    dosage: prescriptionDetails?.dosage ? "provided" : "missing",
    frequency: prescriptionDetails?.frequency ? "provided" : "missing",
    instructions: prescriptionDetails?.instructions ? "provided" : "missing",
  });

  // Validate prescription details structure and content
  if (!prescriptionDetails) {
    console.log(
      `${logPrefix} ❌ VALIDATION_ERROR: Missing prescriptionDetails`
    );
    const errorResponse = createVapiErrorResponse(
      toolCallId,
      "prescriptionDetails is required"
    );
    return errorResponse;
  }

  const detailErrors: string[] = [];
  if (
    !prescriptionDetails.medication ||
    prescriptionDetails.medication.trim() === ""
  ) {
    detailErrors.push("medication is required and cannot be empty");
  }
  if (!prescriptionDetails.dosage || prescriptionDetails.dosage.trim() === "") {
    detailErrors.push("dosage is required and cannot be empty");
  }
  if (
    !prescriptionDetails.frequency ||
    prescriptionDetails.frequency.trim() === ""
  ) {
    detailErrors.push("frequency is required and cannot be empty");
  }
  if (
    !prescriptionDetails.instructions ||
    prescriptionDetails.instructions.trim() === ""
  ) {
    detailErrors.push("instructions is required and cannot be empty");
  }

  if (detailErrors.length > 0) {
    console.log(
      `${logPrefix} ❌ PRESCRIPTION_VALIDATION_ERROR: ${detailErrors.join(", ")}`
    );
    const errorResponse = createVapiErrorResponse(
      toolCallId,
      `Invalid prescription details: ${detailErrors.join(", ")}`
    );
    return errorResponse;
  }

  console.log(`${logPrefix} ✅ Prescription details validation passed`);

  // Extract optional notes
  const notes = args.notes as string | undefined;
  if (notes) {
    console.log(`${logPrefix} 📝 Notes provided:`, notes.length, "characters");
  }

  console.log(`${logPrefix} ✅ All validation passed`);

  // Prepare arguments for Convex mutation
  const mutationArgs = {
    patientId: patientId as Id<"patients">,
    ticketId: ticketId as Id<"medicalTickets">,
    prescriptionDetails: {
      medication: prescriptionDetails.medication.trim(),
      dosage: prescriptionDetails.dosage.trim(),
      frequency: prescriptionDetails.frequency.trim(),
      instructions: prescriptionDetails.instructions.trim(),
    },
    notes: notes?.trim(),
  };

  console.log(
    `${logPrefix} 📦 Final mutation args prepared:`,
    JSON.stringify(mutationArgs, null, 2)
  );
  console.log(
    `${logPrefix} 🔄 Calling Convex mutation: api.prescriptions.createPrescription`
  );

  try {
    // Create the prescription using the existing Convex mutation
    const prescriptionId = await fetchMutation(
      api.prescriptions.createPrescription,
      mutationArgs
    );

    console.log(`${logPrefix} 🎉 Convex mutation completed successfully`);
    console.log(`${logPrefix} 📊 Prescription ID:`, prescriptionId);

    if (!prescriptionId) {
      console.log(
        `${logPrefix} ❌ BUSINESS_ERROR: Prescription creation returned null`
      );
      const errorResponse = createVapiErrorResponse(
        toolCallId,
        "Unable to create prescription record"
      );
      return errorResponse;
    }

    // Retrieve the created prescription to return full details
    console.log(`${logPrefix} 🔍 Fetching created prescription details`);
    const prescriptionData = await fetchQuery(
      api.prescriptions.getPrescription,
      {
        ticketId: ticketId as Id<"medicalTickets">,
      }
    );

    if (!prescriptionData || !prescriptionData.prescription) {
      console.log(
        `${logPrefix} ❌ RETRIEVAL_ERROR: Failed to retrieve created prescription`
      );
      const errorResponse = createVapiErrorResponse(
        toolCallId,
        "Prescription created but failed to retrieve details"
      );
      return errorResponse;
    }

    const { prescription } = prescriptionData;

    console.log(
      `${logPrefix} ✅ Prescription creation successful, creating VAPI response`
    );

    // Create the success response with full prescription object
    const successResponse = createVapiResponse(toolCallId, {
      prescriptionId: prescription._id,
      status: "created",
      message: "Prescription created successfully",
      prescriptionObject: {
        _id: prescription._id,
        _creationTime: prescription._creationTime,
        patientId: prescription.patientId,
        ticketId: prescription.ticketId,
        prescriptionDetails: prescription.prescriptionDetails,
        notes: prescription.notes,
      },
    } as ICreatePrescriptionResponse);

    console.log(
      `${logPrefix} 🎯 Final success response:`,
      JSON.stringify(successResponse, null, 2)
    );
    return successResponse;
  } catch (error) {
    console.log(
      `${logPrefix} ❌ CONVEX_MUTATION_ERROR: Error occurred during prescription creation`
    );
    console.error(`${logPrefix} ❌ Error details:`, error);
    console.error(
      `${logPrefix} ❌ Error stack:`,
      error instanceof Error ? error.stack : "No stack trace"
    );

    // Handle specific error messages from Convex mutation
    let errorMessage = "Unable to create prescription";
    if (error instanceof Error) {
      if (error.message.includes("already exists")) {
        errorMessage = "A prescription already exists for this medical ticket";
      } else if (error.message.includes("not found")) {
        errorMessage = "Patient or medical ticket not found";
      }
    }

    const errorResponse = createVapiErrorResponse(toolCallId, errorMessage);
    console.log(
      `${logPrefix} ❌ Returning error response:`,
      JSON.stringify(errorResponse, null, 2)
    );
    return errorResponse;
  }
};
