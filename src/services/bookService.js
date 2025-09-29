import api from "../config/config";

class BookService {
  /**
   * Fetch all books from the API
   * @returns {Promise<Array>} Array of books
   */
  async getAllBooks() {
    try {
      const response = await api.get("/Book");
      console.log("Books fetched successfully:", response.data);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  }

  /**
   * Get a single book by ID
   * @param {string|number} bookId - The ID of the book
   * @returns {Promise<Object>} Book object
   */
  async getBookById(bookId) {
    try {
      const response = await api.get(`/Book/${bookId}`);
      console.log("Book fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching book:", error);
      throw error;
    }
  }

  /**
   * Get books by category
   * @param {string|number} categoryId - The ID of the category
   * @returns {Promise<Array>} Array of books in the category
   */
  async getBooksByCategory(categoryId) {
    try {
      console.log("Making request to:", `/Book/category/${categoryId}`);
      const response = await api.get(`/Book/category/${categoryId}`);
      console.log("Books by category fetched successfully:", response.data);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching books by category:", error);
      console.error("Request URL:", `/Book/category/${categoryId}`);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      throw error;
    }
  }

  /**
   * Create a new book
   * @param {FormData} bookData - FormData containing book information
   * @param {string} token - Auth0 access token
   * @returns {Promise<string>} Success message
   */
  async createBook(bookData, token = null) {
    try {
      const headers = {
        'Content-Type': 'multipart/form-data',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await api.post("/Book", bookData, { headers });
      console.log("Book created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating book:", error);
      throw error;
    }
  }

  /**
   * Update an existing book
   * @param {string|number} bookId - The ID of the book to update
   * @param {FormData} bookData - FormData containing updated book information
   * @param {string} token - Auth0 access token
   * @returns {Promise<string>} Success message
   */
  async updateBook(bookId, bookData, token = null) {
    try {
      const headers = {
        'Content-Type': 'multipart/form-data',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await api.put(`/Book/${bookId}`, bookData, { headers });
      console.log("Book updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating book:", error);
      throw error;
    }
  }

  /**
   * Delete a book
   * @param {string|number} bookId - The ID of the book to delete
   * @param {string} token - Auth0 access token
   * @returns {Promise<string>} Success message
   */
  async deleteBook(bookId, token = null) {
    try {
      const headers = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await api.delete(`/Book/${bookId}`, { headers });
      console.log("Book deleted successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting book:", error);
      throw error;
    }
  }

}

// Export a singleton instance
export default new BookService();
