import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";

const http = httpRouter();

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const event = await validateRequest(request);
      if (!event) {
        return new Response(
          JSON.stringify({ error: "Invalid webhook signature" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      switch (event.type) {
        case "user.created": // intentional fallthrough
        case "user.updated":
          await ctx.runMutation(internal.users.upsertFromClerk, {
            data: event.data,
          });
          break;

        case "user.deleted": {
          const clerkUserId = event.data.id;
          if (typeof clerkUserId === "string") {
            await ctx.runMutation(internal.users.deleteFromClerk, {
              clerkUserId,
            });
          } else {
            console.error("Invalid clerkUserId in user.deleted event");
            return new Response(JSON.stringify({ error: "Invalid user ID" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }
          break;
        }
        default:
          console.log("Ignored Clerk webhook event", event.type);
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Webhook processing error:", error);
      return new Response(
        JSON.stringify({
          error: "Webhook processing failed",
          message: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }),
});

// Health check endpoint
http.route({
  path: "/health",
  method: "GET",
  handler: httpAction(async () => {
    return new Response(
      JSON.stringify({
        status: "healthy",
        timestamp: Date.now(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }),
});

async function validateRequest(req: Request): Promise<WebhookEvent | null> {
  try {
    const payloadString = await req.text();

    const svixId = req.headers.get("svix-id");
    const svixTimestamp = req.headers.get("svix-timestamp");
    const svixSignature = req.headers.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error("Missing required Svix headers");
      return null;
    }

    const svixHeaders = {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    };

    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("Missing CLERK_WEBHOOK_SECRET environment variable");
      return null;
    }

    const wh = new Webhook(webhookSecret);
    return wh.verify(payloadString, svixHeaders) as WebhookEvent;
  } catch (error) {
    console.error("Error verifying webhook event:", error);
    return null;
  }
}

export default http;
