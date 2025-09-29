import api from "../config/config";

class CategoryManagementService {
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

  /**
   * Get a category by ID
   * @param {string|number} categoryId - The ID of the category
   * @returns {Promise<Object>} Category data
   */
  async getCategoryById(categoryId) {
    try {
      const response = await api.get(`/Category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching category:", error);
      throw error;
    }
  }

  /**
   * Create a new category
   * @param {Object} categoryData - Category data
   * @param {string} token - Auth0 access token
   * @returns {Promise<string>} Success message
   */
  async createCategory(categoryData, token = null) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await api.post("/Category", categoryData, { headers });
      console.log("Category created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  /**
   * Update a category
   * @param {string|number} categoryId - The ID of the category to update
   * @param {Object} categoryData - Updated category data
   * @param {string} token - Auth0 access token
   * @returns {Promise<string>} Success message
   */
  async updateCategory(categoryId, categoryData, token = null) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await api.put(`/Category/${categoryId}`, categoryData, { headers });
      console.log("Category updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  }

  /**
   * Delete a category
   * @param {string|number} categoryId - The ID of the category to delete
   * @param {string} token - Auth0 access token
   * @returns {Promise<string>} Success message
   */
  async deleteCategory(categoryId, token = null) {
    try {
      const headers = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await api.delete(`/Category/${categoryId}`, { headers });
      console.log("Category deleted successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }
}

// Export a singleton instance
export default new CategoryManagementService();
