"use server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export const getGoogleOauthToken = async () => {
  const { userId } = await auth();

  try {
    if (!userId) {
      throw new Error("User is not authenticated");
    }
    // Obtaining google access token from user account
    const provider = "google";
    const client = await clerkClient();
    if (!client) {
      throw new Error("Could not initialize Clerk client");
    }
    const clerkResponse = await client.users.getUserOauthAccessToken(
      userId,
      provider
    );

    const accessToken = clerkResponse?.data[0].token || "";
    if (!accessToken) {
      throw new Error("No access token found for the user");
    }

    // To set start date of the events 7 days before today
    const today = new Date();
    today.setDate(today.getDate() - 7); // 7 days ago
    const timeMin = today.toISOString();

    // Fetching calendar events from Google Calendar API
    const calendar = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!calendar.ok) {
      throw new Error(
        `Failed to fetch calendar events: ${calendar.statusText}`
      );
    }
    const events = await calendar.json();

    return {
      message: "Events retrieved successfully",
      events,
      accessToken,
    };
  } catch (error) {
    // Type guard jargon below
    return {
      message:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message?: string }).message
          : "An error occurred while retrieving the token",
      error: true,
    };
  }
};
