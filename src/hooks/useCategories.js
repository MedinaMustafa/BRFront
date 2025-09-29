import { useState, useEffect, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import categoryManagementService from "../services/categoryManagementService";

export const useCategories = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all categories
   */
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const categoriesData = await categoryManagementService.getAllCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get a category by ID
   * @param {string|number} categoryId - The ID of the category
   * @returns {Promise<Object>} Category data
   */
  const getCategoryById = useCallback(async (categoryId) => {
    try {
      return await categoryManagementService.getCategoryById(categoryId);
    } catch (err) {
      console.error("Error fetching category:", err);
      throw err;
    }
  }, []);

  /**
   * Create a new category
   * @param {Object} categoryData - Category data
   * @returns {Promise<string>} Success message
   */
  const createCategory = useCallback(async (categoryData) => {
    try {
      let token = null;
      if (isAuthenticated) {
        token = await getAccessTokenSilently();
      }
      const message = await categoryManagementService.createCategory(categoryData, token);
      await fetchCategories(); // Refresh the categories list
      return message;
    } catch (err) {
      console.error("Error creating category:", err);
      throw err;
    }
  }, [fetchCategories, isAuthenticated, getAccessTokenSilently]);

  /**
   * Update a category
   * @param {string|number} categoryId - The ID of the category to update
   * @param {Object} categoryData - Updated category data
   * @returns {Promise<string>} Success message
   */
  const updateCategory = useCallback(async (categoryId, categoryData) => {
    try {
      let token = null;
      if (isAuthenticated) {
        token = await getAccessTokenSilently();
      }
      const message = await categoryManagementService.updateCategory(categoryId, categoryData, token);
      await fetchCategories(); // Refresh the categories list
      return message;
    } catch (err) {
      console.error("Error updating category:", err);
      throw err;
    }
  }, [fetchCategories, isAuthenticated, getAccessTokenSilently]);

  /**
   * Delete a category
   * @param {string|number} categoryId - The ID of the category to delete
   * @returns {Promise<string>} Success message
   */
  const deleteCategory = useCallback(async (categoryId) => {
    try {
      let token = null;
      if (isAuthenticated) {
        token = await getAccessTokenSilently();
      }
      const message = await categoryManagementService.deleteCategory(categoryId, token);
      await fetchCategories(); // Refresh the categories list
      return message;
    } catch (err) {
      console.error("Error deleting category:", err);
      throw err;
    }
  }, [fetchCategories, isAuthenticated, getAccessTokenSilently]);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
  };
};
