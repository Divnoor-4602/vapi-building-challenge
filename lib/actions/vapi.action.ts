"use server";

import { getServerEnv } from "../schema";
import { vapiServer } from "../vapi/vapiServer";

// get the squads for the medical flow details
export const getMedicalFlowSquad = async () => {
  try {
    const serverEnv = getServerEnv();
    const squads = await vapiServer.squads.get(
      serverEnv.VAPI_PATIENT_FLOW_SQUAD_ID
    );
    return { squads };
  } catch (error) {
    console.error("Error fetching VAPI squads:", error);
    throw error;
  }
};

// update squad configuration for silent transfers
export const updateSquadForSilentTransfers = async () => {
  try {
    const serverEnv = getServerEnv();

    // Update squad configuration with empty messages for silent transfers
    const updatedSquad = await vapiServer.squads.update(
      serverEnv.VAPI_PATIENT_FLOW_SQUAD_ID,
      {
        members: [
          {
            assistantId: "your-maddie-1-assistant-id", // Replace with actual ID
            assistantDestinations: [
              {
                message: "", // Empty string for silent transfer
                description: "Transfer to medical review specialist",
                type: "assistant",
                assistantName: "Maddie 2 - Medical Ticket Expert",
              },
            ],
          },
          {
            assistantId: "your-maddie-2-assistant-id", // Replace with actual ID
            assistantDestinations: [
              {
                message: "", // Empty string for silent transfer
                description: "Transfer to appointment scheduler",
                type: "assistant",
                assistantName: "Peg - Appointment Scheduler",
              },
              {
                message: "", // Empty string for silent transfer
                description: "Transfer to pharmacy specialist",
                type: "assistant",
                assistantName: "Anna - Pharmacy Specialist",
              },
            ],
          },
          {
            assistantId: "your-peg-assistant-id", // Replace with actual ID
            assistantDestinations: [],
          },
          {
            assistantId: "your-anna-assistant-id", // Replace with actual ID
            assistantDestinations: [],
          },
        ],
      }
    );

    return { success: true, squad: updatedSquad };
  } catch (error) {
    console.error("Error updating squad for silent transfers:", error);
    throw error;
  }
};

// initiate a call with the medical flow squad
export const createMedicalFlowCall = async (name: string, number: string) => {
  try {
    const serverEnv = getServerEnv();
    const call = await vapiServer.calls.create({
      customer: {
        name,
        number,
      },
      name: "Medical Flow Call",
      squadId: serverEnv.VAPI_PATIENT_FLOW_SQUAD_ID,
      phoneNumberId: serverEnv.VAPI_PATIENT_FLOW_SQUAD_NUMBER,
    });

    return call;
  } catch (error) {
    console.error("Error creating medical flow call:", error);
    throw error;
  }
};
