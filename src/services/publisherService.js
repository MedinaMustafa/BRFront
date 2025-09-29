import api from "../config/config";

class PublisherService {
  /**
   * Fetch all publishers from the API
   * @returns {Promise<Array>} Array of publishers
   */
  async getAllPublishers() {
    try {
      const response = await api.get("/Publisher");
      return response.data || [];
    } catch (error) {
      console.error("Error fetching publishers:", error);
      throw error;
    }
  }
}

// Export a singleton instance
export default new PublisherService();
