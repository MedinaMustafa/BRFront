import { useState, useEffect, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { bookService } from "../services";

/**
 * Custom hook for managing books data and operations
 * @returns {Object} - { books, loading, error, fetchBooks, addBookToBookshelf }
 */
export const useBooks = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all books from the API
   */
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const booksData = await bookService.getAllBooks();
      setBooks(booksData);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError(err.message || "Failed to fetch books");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get a single book by ID
   * @param {string|number} bookId - The ID of the book
   * @returns {Promise<Object>} Book object
   */
  const getBookById = useCallback(async (bookId) => {
    try {
      const book = await bookService.getBookById(bookId);
      return book;
    } catch (err) {
      console.error("Error fetching book:", err);
      throw err;
    }
  }, []);

  /**
   * Create a new book
   * @param {FormData} bookData - FormData containing book information
   * @returns {Promise<string>} Success message
   */
  const createBook = useCallback(async (bookData) => {
    try {
      let token = null;
      if (isAuthenticated) {
        token = await getAccessTokenSilently();
      }
      const message = await bookService.createBook(bookData, token);
      // Refresh the books list after creating
      await fetchBooks();
      return message;
    } catch (err) {
      console.error("Error creating book:", err);
      throw err;
    }
  }, [fetchBooks, isAuthenticated, getAccessTokenSilently]);

  /**
   * Update an existing book
   * @param {string|number} bookId - The ID of the book to update
   * @param {FormData} bookData - FormData containing updated book information
   * @returns {Promise<string>} Success message
   */
  const updateBook = useCallback(async (bookId, bookData) => {
    try {
      let token = null;
      if (isAuthenticated) {
        token = await getAccessTokenSilently();
      }
      const message = await bookService.updateBook(bookId, bookData, token);
      // Refresh the books list after updating
      await fetchBooks();
      return message;
    } catch (err) {
      console.error("Error updating book:", err);
      throw err;
    }
  }, [fetchBooks, isAuthenticated, getAccessTokenSilently]);

  /**
   * Delete a book
   * @param {string|number} bookId - The ID of the book to delete
   * @returns {Promise<string>} Success message
   */
  const deleteBook = useCallback(async (bookId) => {
    try {
      let token = null;
      if (isAuthenticated) {
        token = await getAccessTokenSilently();
      }
      const message = await bookService.deleteBook(bookId, token);
      // Refresh the books list after deleting
      await fetchBooks();
      return message;
    } catch (err) {
      console.error("Error deleting book:", err);
      throw err;
    }
  }, [fetchBooks, isAuthenticated, getAccessTokenSilently]);


  // Auto-fetch books when hook is first used
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return {
    books,
    loading,
    error,
    fetchBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
  };
};
