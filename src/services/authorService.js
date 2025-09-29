import api from "../config/config";

class AuthorService {
  /**
   * Fetch all authors from the API
   * @returns {Promise<Array>} Array of authors
   */
  async getAllAuthors() {
    try {
      const response = await api.get("/Author");
      return response.data || [];
    } catch (error) {
      console.error("Error fetching authors:", error);
      throw error;
    }
  }
}

// Export a singleton instance
export default new AuthorService();
