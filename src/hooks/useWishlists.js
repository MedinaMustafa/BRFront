import { useState, useEffect, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { wishlistService } from "../services";

export const useWishlists = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWishlists = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessTokenSilently();
      const data = await wishlistService.getAllWishlists(token);
      setWishlists(data);
    } catch (err) {
      console.error("Error fetching wishlists:", err);
      setError(err.message || "Failed to fetch wishlists");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  const createWishlist = useCallback(async (wishlistData) => {
    try {
      const token = await getAccessTokenSilently();
      const message = await wishlistService.createWishlist(wishlistData, token);
      await fetchWishlists(); // Refresh the list
      return message;
    } catch (err) {
      console.error("Error creating wishlist:", err);
      throw err;
    }
  }, [fetchWishlists, getAccessTokenSilently]);

  const addBookToWishlist = useCallback(async (wishlistId, bookId) => {
    try {
      const token = await getAccessTokenSilently();
      await wishlistService.addBookToWishlist(wishlistId, bookId, token);
      await fetchWishlists(); // Refresh the list
    } catch (err) {
      console.error("Error adding book to wishlist:", err);
      throw err;
    }
  }, [fetchWishlists, getAccessTokenSilently]);

  const removeBookFromWishlist = useCallback(async (wishlistId, bookId) => {
    try {
      const token = await getAccessTokenSilently();
      await wishlistService.removeBookFromWishlist(wishlistId, bookId, token);
      await fetchWishlists(); // Refresh the list
    } catch (err) {
      console.error("Error removing book from wishlist:", err);
      throw err;
    }
  }, [fetchWishlists, getAccessTokenSilently]);

  const deleteWishlist = useCallback(async (wishlistId) => {
    try {
      const token = await getAccessTokenSilently();
      await wishlistService.deleteWishlist(wishlistId, token);
      await fetchWishlists(); // Refresh the list
    } catch (err) {
      console.error("Error deleting wishlist:", err);
      throw err;
    }
  }, [fetchWishlists, getAccessTokenSilently]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlists();
    }
  }, [isAuthenticated, fetchWishlists]);

  return {
    wishlists,
    loading,
    error,
    fetchWishlists,
    createWishlist,
    addBookToWishlist,
    removeBookFromWishlist,
    deleteWishlist
  };
};
