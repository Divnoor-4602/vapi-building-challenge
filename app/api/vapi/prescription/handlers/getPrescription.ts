import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import {
  convertToConvexId,
  createVapiResponse,
  createVapiErrorResponse,
} from "@/lib/api/utils";
import { Id } from "@/convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface GetPrescriptionRequest {
  ticketId: string;
}

interface GetPrescriptionResponse {
  status: "success" | "error";
  message: string;
  prescription?: {
    id: string;
    medication: string;
    dosage: string;
    frequency: string;
    instructions: string;
    notes?: string;
    patientName?: string;
  };
}

export async function handleGetPrescription(
  args: Record<string, unknown>,
  toolCallId: string
) {
  const logPrefix = `[GET_PRESCRIPTION][${toolCallId}]`;

  try {
    console.log(`${logPrefix} 🚀 Starting prescription retrieval`);
    console.log(`${logPrefix} 📥 Args:`, JSON.stringify(args, null, 2));

    const data = args as unknown as GetPrescriptionRequest;

    if (!data.ticketId) {
      console.log(`${logPrefix} ❌ Missing ticketId`);
      return createVapiErrorResponse(toolCallId, "ticketId is required");
    }

    console.log(
      `${logPrefix} 🎫 Getting prescription for ticket:`,
      data.ticketId
    );

    // Convert string ID to Convex ID
    const ticketIdString = convertToConvexId(data.ticketId);
    if (!ticketIdString) {
      console.log(`${logPrefix} ❌ Invalid ticket ID format:`, data.ticketId);
      return createVapiErrorResponse(toolCallId, "Invalid ticket ID format");
    }

    const ticketId = ticketIdString as Id<"medicalTickets">;

    // First, try to get existing prescription
    let prescriptionData = await convex.query(
      api.prescriptions.getPrescription,
      {
        ticketId,
      }
    );

    // If no prescription exists, create a test prescription
    if (!prescriptionData) {
      console.log(
        `${logPrefix} 📝 No prescription found, creating test prescription...`
      );

      try {
        const prescriptionId = await convex.mutation(
          api.prescriptions.createTestPrescription,
          {
            ticketId,
          }
        );

        console.log(
          `${logPrefix} ✅ Created test prescription:`,
          prescriptionId
        );

        // Now get the created prescription
        prescriptionData = await convex.query(
          api.prescriptions.getPrescription,
          {
            ticketId,
          }
        );
      } catch (createError) {
        console.error(
          `${logPrefix} ❌ Error creating test prescription:`,
          createError
        );
        return createVapiErrorResponse(
          toolCallId,
          "Failed to create prescription for this ticket"
        );
      }
    }

    if (!prescriptionData) {
      console.log(`${logPrefix} ❌ Unable to retrieve prescription details`);
      return createVapiErrorResponse(
        toolCallId,
        "Unable to retrieve prescription details"
      );
    }

    const { prescription, patient } = prescriptionData;

    const response: GetPrescriptionResponse = {
      status: "success",
      message: "Prescription details retrieved successfully",
      prescription: {
        id: prescription._id,
        medication: prescription.prescriptionDetails.medication,
        dosage: prescription.prescriptionDetails.dosage,
        frequency: prescription.prescriptionDetails.frequency,
        instructions: prescription.prescriptionDetails.instructions,
        notes: prescription.notes,
        patientName: `Patient ID: ${patient._id}`, // For testing, using patient ID as name
      },
    };

    console.log(
      `${logPrefix} ✅ Successfully retrieved prescription:`,
      response.prescription?.medication
    );
    return createVapiResponse(toolCallId, response);
  } catch (error) {
    console.error(`${logPrefix} ❌ Error in handleGetPrescription:`, error);
    return createVapiErrorResponse(
      toolCallId,
      "Failed to retrieve prescription details"
    );
  }
}
