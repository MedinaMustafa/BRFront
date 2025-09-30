import api from "../config/config";

class PublisherService {
  /**
   * Fetch all publishers from the API
   * @returns {Promise<Array>} Array of publishers
   */
  async getAllPublishers() {
    try {
      const response = await api.get("/Publisher");
      console.log("Publishers fetched successfully:", response.data);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching publishers:", error);
      throw error;
    }
  }

  /**
   * Get a single publisher by ID
   * @param {string} publisherId - The ID of the publisher
   * @returns {Promise<Object>} Publisher object
   */
  async getPublisherById(publisherId) {
    try {
      const response = await api.get(`/Publisher/${publisherId}`);
      console.log("Publisher fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching publisher:", error);
      throw error;
    }
  }

  /**
   * Create a new publisher
   * @param {Object} publisherData - Publisher data
   * @param {string} token - Auth0 access token
   * @returns {Promise<string>} Success message
   */
  async createPublisher(publisherData, token = null) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await api.post("/Publisher", publisherData, { headers });
      console.log("Publisher created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating publisher:", error);
      throw error;
    }
  }

  /**
   * Update an existing publisher
   * @param {string} publisherId - The ID of the publisher to update
   * @param {Object} publisherData - Updated publisher data
   * @param {string} token - Auth0 access token
   * @returns {Promise<string>} Success message
   */
  async updatePublisher(publisherId, publisherData, token = null) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await api.put(`/Publisher/${publisherId}`, publisherData, { headers });
      console.log("Publisher updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating publisher:", error);
      throw error;
    }
  }

  /**
   * Delete a publisher
   * @param {string} publisherId - The ID of the publisher to delete
   * @param {string} token - Auth0 access token
   * @returns {Promise<string>} Success message
   */
  async deletePublisher(publisherId, token = null) {
    try {
      const headers = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await api.delete(`/Publisher/${publisherId}`, { headers });
      console.log("Publisher deleted successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting publisher:", error);
      throw error;
    }
  }
}

// Export a singleton instance
export default new PublisherService();