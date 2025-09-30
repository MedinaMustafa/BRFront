import api from "../config/config";

class AuthorService {
  /**
   * Fetch all authors from the API
   * @returns {Promise<Array>} Array of authors
   */
  async getAllAuthors() {
    try {
      const response = await api.get("/Author");
      console.log("Authors fetched successfully:", response.data);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching authors:", error);
      throw error;
    }
  }

  /**
   * Get a single author by ID
   * @param {string} authorId - The ID of the author
   * @returns {Promise<Object>} Author object
   */
  async getAuthorById(authorId) {
    try {
      const response = await api.get(`/Author/${authorId}`);
      console.log("Author fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching author:", error);
      throw error;
    }
  }

  /**
   * Create a new author
   * @param {Object} authorData - Author data
   * @param {string} token - Auth0 access token
   * @returns {Promise<string>} Success message
   */
  async createAuthor(authorData, token = null) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await api.post("/Author", authorData, { headers });
      console.log("Author created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating author:", error);
      throw error;
    }
  }

  /**
   * Update an existing author
   * @param {string} authorId - The ID of the author to update
   * @param {Object} authorData - Updated author data
   * @param {string} token - Auth0 access token
   * @returns {Promise<string>} Success message
   */
  async updateAuthor(authorId, authorData, token = null) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await api.put(`/Author/${authorId}`, authorData, { headers });
      console.log("Author updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating author:", error);
      throw error;
    }
  }

  /**
   * Delete an author
   * @param {string} authorId - The ID of the author to delete
   * @param {string} token - Auth0 access token
   * @returns {Promise<string>} Success message
   */
  async deleteAuthor(authorId, token = null) {
    try {
      const headers = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await api.delete(`/Author/${authorId}`, { headers });
      console.log("Author deleted successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting author:", error);
      throw error;
    }
  }
}

// Export a singleton instance
export default new AuthorService();