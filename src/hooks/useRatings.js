import { useState, useEffect, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { ratingService } from "../services";

export const useRatings = (bookId) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    if (!bookId) return;
    
    setLoading(true);
    setError(null);
    try {
      let token = null;
      if (isAuthenticated) {
        token = await getAccessTokenSilently();
      }
      
      const [reviewsData, avgData] = await Promise.all([
        ratingService.getReviewsForBook(bookId, token),
        ratingService.getAverageRating(bookId, token)
      ]);
      
      setReviews(reviewsData);
      setAverageRating(avgData.averageRating || 0);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(err.message || "Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  }, [bookId, isAuthenticated, getAccessTokenSilently]);

  const addReview = useCallback(async (reviewData) => {
    if (!isAuthenticated) {
      throw new Error("You must be logged in to add a review");
    }

    try {
      const token = await getAccessTokenSilently();
      await ratingService.addReview(reviewData, token);
      await fetchReviews(); // Refresh the reviews
    } catch (err) {
      console.error("Error adding review:", err);
      throw err;
    }
  }, [isAuthenticated, getAccessTokenSilently, fetchReviews]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return {
    reviews,
    averageRating,
    loading,
    error,
    addReview,
    fetchReviews
  };
};
