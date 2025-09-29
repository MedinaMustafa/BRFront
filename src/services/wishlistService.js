import api from "../config/config";

class WishlistService {
  async getAllWishlists(token = null) {
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await api.get("/Wishlist", { headers });
      return response.data || [];
    } catch (error) {
      console.error("Error fetching wishlists:", error);
      throw error;
    }
  }

  async createWishlist(wishlistData, token = null) {
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await api.post("/Wishlist", wishlistData, { headers });
      return response.data;
    } catch (error) {
      console.error("Error creating wishlist:", error);
      throw error;
    }
  }

  async addBookToWishlist(wishlistId, bookId, token = null) {
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await api.post(`/Wishlist/${wishlistId}/books/${bookId}`, {}, { headers });
      return response.data;
    } catch (error) {
      console.error("Error adding book to wishlist:", error);
      throw error;
    }
  }

  async removeBookFromWishlist(wishlistId, bookId, token = null) {
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await api.delete(`/Wishlist/${wishlistId}/books/${bookId}`, { headers });
      return response.data;
    } catch (error) {
      console.error("Error removing book from wishlist:", error);
      throw error;
    }
  }

  async deleteWishlist(wishlistId, token = null) {
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await api.delete(`/Wishlist/${wishlistId}`, { headers });
      return response.data;
    } catch (error) {
      console.error("Error deleting wishlist:", error);
      throw error;
    }
  }
}

export default new WishlistService();
