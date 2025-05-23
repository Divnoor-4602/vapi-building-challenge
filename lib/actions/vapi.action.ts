"use server";

import { TGetAllAssistantsResponse } from "../shared.types";
import { vapiServer } from "../vapi/vapiServer";

export const getAllAssistants =
  async (): Promise<TGetAllAssistantsResponse> => {
    try {
      const getAllAgents = await vapiServer.assistants.list();

      return {
        success: true,
        status: 200,
        data: getAllAgents,
      };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        status: 500,
        data: [],
        message: "Failed to get all assistants",
        error: error as Error,
      };
    }
  };
