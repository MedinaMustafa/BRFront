import api from "../config/config";

class CategoryService {
  /**
   * Fetch all categories from the API
   * @returns {Promise<Array>} Array of categories
   */
  async getAllCategories() {
    try {
      const response = await api.get("/Category");
      return response.data || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }
}

// Export a singleton instance
export default new CategoryService();
