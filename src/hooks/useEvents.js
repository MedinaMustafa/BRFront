import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import eventService from "../services/eventService";

export const useEvents = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let token = null;
      if (isAuthenticated) {
        try {
          token = await getAccessTokenSilently();
        } catch (tokenError) {
          console.warn("Could not get access token:", tokenError);
        }
      }
      
      const data = await eventService.getAllEvents(token);
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Get upcoming events (events that haven't started yet)
  const getUpcomingEvents = () => {
    const now = new Date();
    return events.filter(event => new Date(event.startDate) > now);
  };

  // Get current events (events happening today)
  const getCurrentEvents = () => {
    const today = new Date();
    const todayStr = today.toDateString();
    return events.filter(event => new Date(event.startDate).toDateString() === todayStr);
  };

  // Get recent events (events from the last 7 days)
  const getRecentEvents = () => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate >= sevenDaysAgo && eventDate <= now;
    });
  };

  return {
    events,
    loading,
    error,
    fetchEvents,
    getUpcomingEvents,
    getCurrentEvents,
    getRecentEvents
  };
};
