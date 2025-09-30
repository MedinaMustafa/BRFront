import api from "../config/config";

class EventService {
  /**
   * Fetch all events from the API
   * @param {string} token - Auth0 access token
   * @returns {Promise<Array>} Array of events
   */
  async getAllEvents(token = null) {
    try {
      const headers = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await api.get("/Event", { headers });
      console.log("Events fetched successfully:", response.data);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  }

  /**
   * Get a single event by ID
   * @param {string} eventId - The ID of the event
   * @param {string} token - Auth0 access token
   * @returns {Promise<Object>} Event object
   */
  async getEventById(eventId, token = null) {
    try {
      const headers = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await api.get(`/Event/${eventId}`, { headers });
      console.log("Event fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching event:", error);
      throw error;
    }
  }

  /**
   * Create a new event
   * @param {Object} eventData - Event data
   * @param {string} token - Auth0 access token
   * @returns {Promise<string>} Success message
   */
  async createEvent(eventData, token = null) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await api.post("/Event", eventData, { headers });
      console.log("Event created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  }

  /**
   * Add a book to an event
   * @param {string} eventId - The ID of the event
   * @param {string} bookId - The ID of the book
   * @param {string} token - Auth0 access token
   * @returns {Promise<string>} Success message
   */
  async addBookToEvent(eventId, bookId, token = null) {
    try {
      const headers = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await api.post(`/Event/${eventId}/books/${bookId}`, {}, { headers });
      console.log("Book added to event successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding book to event:", error);
      throw error;
    }
  }

  /**
   * Remove a book from an event
   * @param {string} eventId - The ID of the event
   * @param {string} bookId - The ID of the book
   * @param {string} token - Auth0 access token
   * @returns {Promise<string>} Success message
   */
  async removeBookFromEvent(eventId, bookId, token = null) {
    try {
      const headers = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await api.delete(`/Event/${eventId}/books/${bookId}`, { headers });
      console.log("Book removed from event successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error removing book from event:", error);
      throw error;
    }
  }
}

// Export a singleton instance
const eventService = new EventService();
export default eventService;
