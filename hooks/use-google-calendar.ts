import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { getGoogleOauthToken } from "@/lib/actions/clerk.action";
import { EventInput } from "@fullcalendar/core";

interface GoogleCalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  location?: string;
  start?: {
    dateTime?: string;
    date?: string;
  };
  end?: {
    dateTime?: string;
    date?: string;
  };
  htmlLink?: string;
}

interface UseGoogleCalendarReturn {
  events: EventInput[];
  isLoading: boolean;
  error: string | null;
  hasGoogleAccount: boolean;
  refetchEvents: () => Promise<void>;
}

export const useGoogleCalendar = (): UseGoogleCalendarReturn => {
  const { user, isLoaded } = useUser();
  const [events, setEvents] = useState<EventInput[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasGoogleAccount = Boolean(
    user?.externalAccounts.find((account) => account.provider === "google")
  );

  const fetchEvents = useCallback(async () => {
    if (!user || !isLoaded || !hasGoogleAccount) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await getGoogleOauthToken();

      if (response?.error) {
        setError(response.message || "Failed to fetch calendar events");
        return;
      }

      if (response.events?.items) {
        const formattedEvents = response.events.items
          .map((event: GoogleCalendarEvent) => {
            if (!event.start) return null;

            return {
              id: event.id,
              title: event.summary || "No Title",
              start: new Date(
                event.start.dateTime || event.start.date || new Date()
              ),
              end: new Date(
                event.end?.dateTime || event.end?.date || new Date()
              ),
              allDay: !event.end?.dateTime,
              description: event.description,
              location: event.location,
              backgroundColor: "#B7410E",
              textColor: "#ffffff",
              borderColor: "#B7410E",
              url: event.htmlLink,
            } as EventInput;
          })
          .filter(
            (event: EventInput | null): event is EventInput => event !== null
          );

        setEvents(formattedEvents);
      }
    } catch (error) {
      setError("Failed to fetch calendar events");
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, isLoaded, hasGoogleAccount]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    isLoading,
    error,
    hasGoogleAccount,
    refetchEvents: fetchEvents,
  };
};
