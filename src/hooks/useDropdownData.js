import { useState, useEffect, useCallback } from "react";
import { categoryService, authorService, publisherService } from "../services";

/**
 * Custom hook for managing dropdown data (categories, authors, publishers)
 * @returns {Object} - { categories, authors, publishers, loading, error, fetchAllData }
 */
export const useDropdownData = () => {
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  /**
   * Fetch all dropdown data
   */
  const fetchAllData = useCallback(async () => {
    if (hasFetched) return; // Don't fetch if already fetched
    
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching dropdown data...");
      
      // Fetch all data in parallel since endpoints are now anonymous
      const [categoriesData, authorsData, publishersData] = await Promise.all([
        categoryService.getAllCategories(),
        authorService.getAllAuthors(),
        publisherService.getAllPublishers()
      ]);
      
      console.log("Dropdown data fetched successfully:", {
        categories: categoriesData.length,
        authors: authorsData.length,
        publishers: publishersData.length
      });
      
      setCategories(categoriesData);
      setAuthors(authorsData);
      setPublishers(publishersData);
      setHasFetched(true);
    } catch (err) {
      console.error("Error fetching dropdown data:", err);
      setError(err.message || "Failed to fetch dropdown data");
    } finally {
      setLoading(false);
    }
  }, [hasFetched]);

  return {
    categories,
    authors,
    publishers,
    loading,
    error,
    fetchAllData
  };
};
