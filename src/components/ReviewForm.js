import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input, Alert, Spinner } from "reactstrap";
import StarRating from "./StarRating";
import { toast } from "react-toastify";

const ReviewForm = ({ bookId, onReviewSubmitted, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (!reviewText.trim()) {
      setError("Please write a review");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onReviewSubmitted({
        bookId: bookId,
        score: rating,
        reviewText: reviewText.trim()
      });
      
      toast.success("Review submitted successfully!");
      
      // Reset form
      setRating(0);
      setReviewText("");
      
      if (onCancel) {
        onCancel();
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      setError(err.message || "Failed to submit review");
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="p-4 border rounded"
      style={{ 
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        border: '1px solid #dee2e6'
      }}
    >
      <h5 className="mb-3">
        <i className="fas fa-star mr-2 text-warning"></i>
        Write a Review
      </h5>
      
      {error && (
        <Alert color="danger" className="mb-3">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label className="font-weight-bold">
            <i className="fas fa-star mr-2"></i>
            Your Rating
          </Label>
          <div className="mt-2">
            <StarRating 
              rating={rating} 
              interactive={true} 
              onRatingChange={setRating}
              size="1.5rem"
            />
          </div>
        </FormGroup>

        <FormGroup>
          <Label for="reviewText" className="font-weight-bold">
            <i className="fas fa-comment mr-2"></i>
            Your Review
          </Label>
          <Input
            type="textarea"
            name="reviewText"
            id="reviewText"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your thoughts about this book..."
            rows="4"
            style={{
              borderRadius: '8px',
              border: '2px solid #dee2e6'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#007bff';
              e.target.style.boxShadow = '0 0 0 0.2rem rgba(0, 123, 255, 0.25)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#dee2e6';
              e.target.style.boxShadow = 'none';
            }}
          />
        </FormGroup>

        <div className="d-flex justify-content-end gap-2">
          {onCancel && (
            <Button 
              type="button" 
              color="secondary" 
              onClick={onCancel}
              style={{ borderRadius: '8px' }}
            >
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            color="primary" 
            disabled={isSubmitting}
            style={{ borderRadius: '8px' }}
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane mr-2"></i>
                Submit Review
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ReviewForm;
