import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";
import { getAuthHeaders } from "../lib/api";

/**
 * Hook for calendar events: fetch, save, delete.
 */
export const useCalendarEvents = () => {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        `${API_BASE_URL}/calendar/events/my`,
        {},
        { headers: getAuthHeaders() }
      );

      const formattedEvents = response.data.map((event) => ({
        id: event.id,
        title: event.title,
        start: event.startDateTime,
        end: event.endDateTime,
        extendedProps: {
          description: event.description,
          priority: event.priority,
          createdByUserId: event.createdByUserId,
          createdByUserName: event.createdByUserName,
          teamId: event.teamId,
          teamName: event.teamName,
          participants: event.participants,
          createdAt: event.createdAt,
          updatedAt: event.updatedAt,
        },
      }));

      setCurrentEvents(formattedEvents);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("Greška pri učitavanju događaja");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

  const timeoutRef = useRef(null);
  const debouncedFetch = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(fetchMyEvents, 1000);
  }, [fetchMyEvents]);

  return {
    currentEvents,
    loading,
    error,
    setError,
    fetchMyEvents,
    debouncedFetch,
  };
};
