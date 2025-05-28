import {
  api,
  createVapiResponse,
  createVapiErrorResponse,
  fetchQuery,
  convertToConvexId,
} from "@/lib/api/utils";
import { Id } from "@/convex/_generated/dataModel";

export const handleCheckMedicalTicketStatus = async (
  args: Record<string, unknown>,
  toolCallId: string
) => {
  const logPrefix = `[CHECK_TICKET_STATUS][${toolCallId}]`;

  console.log(
    `${logPrefix} 🚀 Starting check medical ticket status query with polling`
  );
  console.log(
    `${logPrefix} 📥 Raw args received:`,
    JSON.stringify(args, null, 2)
  );

  const ticketIdString = convertToConvexId(args.ticketId);
  console.log(`${logPrefix} 📧 Extracted ticket ID:`, ticketIdString);

  if (!ticketIdString) {
    console.log(`${logPrefix} ❌ VALIDATION_ERROR: Ticket ID is required`);
    const errorResponse = createVapiErrorResponse(
      toolCallId,
      "Ticket ID is required"
    );
    console.log(
      `${logPrefix} ❌ Returning error response:`,
      JSON.stringify(errorResponse, null, 2)
    );
    return errorResponse;
  }

  const ticketId = ticketIdString as Id<"medicalTickets">;

  console.log(`${logPrefix} ✅ Ticket ID validation passed`);
  console.log(`${logPrefix} 🔄 Starting polling for ticket resolution...`);

  // Polling configuration
  const POLL_INTERVAL_MS = 5000; // 5 seconds
  const MAX_WAIT_TIME_MS = 10 * 60 * 1000; // 10 minutes
  const startTime = Date.now();

  try {
    while (true) {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;

      // Check if we've exceeded the maximum wait time
      if (elapsedTime >= MAX_WAIT_TIME_MS) {
        console.log(
          `${logPrefix} ⏰ TIMEOUT: Maximum wait time of 10 minutes exceeded`
        );
        const errorResponse = createVapiErrorResponse(
          toolCallId,
          "Medical ticket review is taking longer than expected. Please try again later or contact support."
        );
        console.log(
          `${logPrefix} ❌ Returning timeout error response:`,
          JSON.stringify(errorResponse, null, 2)
        );
        return errorResponse;
      }

      console.log(
        `${logPrefix} 🔍 Polling ticket status (elapsed: ${Math.round(elapsedTime / 1000)}s)`
      );

      try {
        const { status: ticketStatus, ticket } = await fetchQuery(
          api.medicalTickets.checkMedicalTicketStatus,
          {
            ticketId,
          }
        );

        console.log(`${logPrefix} 📊 Current ticket status:`, ticketStatus);

        if (!ticketStatus) {
          console.log(
            `${logPrefix} ❌ CONVEX_QUERY_ERROR: Ticket status not found`
          );
          const errorResponse = createVapiErrorResponse(
            toolCallId,
            "Ticket not found"
          );
          console.log(
            `${logPrefix} ❌ Returning error response:`,
            JSON.stringify(errorResponse, null, 2)
          );
          return errorResponse;
        }

        // Check if ticket is resolved (completed or cancelled)
        if (ticketStatus === "completed" || ticketStatus === "cancelled") {
          console.log(
            `${logPrefix} ✅ Ticket resolved with status: ${ticketStatus}`
          );
          console.log(
            `${logPrefix} 📊 Final ticket data:`,
            JSON.stringify(ticket, null, 2)
          );

          const successResponse = createVapiResponse(toolCallId, {
            ticketStatus,
            ticket,
            resolvedAt: new Date().toISOString(),
            totalWaitTime: Math.round(elapsedTime / 1000),
          });
          console.log(
            `${logPrefix} 🎯 Final success response:`,
            JSON.stringify(successResponse, null, 2)
          );
          return successResponse;
        }

        // Ticket is still in progress or on hold, continue polling
        console.log(
          `${logPrefix} ⏳ Ticket still ${ticketStatus}, continuing to poll...`
        );
      } catch (queryError) {
        console.log(
          `${logPrefix} ❌ CONVEX_QUERY_ERROR during polling: Error occurred during Convex query`
        );
        console.error(`${logPrefix} ❌ Query error details:`, queryError);

        // Return error immediately on network/query issues
        const errorResponse = createVapiErrorResponse(
          toolCallId,
          "Network error while checking ticket status. Please try again."
        );
        console.log(
          `${logPrefix} ❌ Returning network error response:`,
          JSON.stringify(errorResponse, null, 2)
        );
        return errorResponse;
      }

      // Wait before next poll (only if we haven't exceeded max time)
      if (elapsedTime + POLL_INTERVAL_MS < MAX_WAIT_TIME_MS) {
        console.log(
          `${logPrefix} ⏸️ Waiting ${POLL_INTERVAL_MS / 1000}s before next poll...`
        );
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      }
    }
  } catch (error) {
    console.log(
      `${logPrefix} ❌ UNEXPECTED_ERROR: Unexpected error during polling`
    );
    console.error(`${logPrefix} ❌ Error details:`, error);
    console.error(
      `${logPrefix} ❌ Error stack:`,
      error instanceof Error ? error.stack : "No stack trace"
    );

    const errorResponse = createVapiErrorResponse(
      toolCallId,
      "An unexpected error occurred while checking ticket status"
    );
    console.log(
      `${logPrefix} ❌ Returning unexpected error response:`,
      JSON.stringify(errorResponse, null, 2)
    );
    return errorResponse;
  }
};
