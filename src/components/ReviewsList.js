import React from "react";
import { Card, CardBody, Spinner } from "reactstrap";
import StarRating from "./StarRating";

const ReviewsList = ({ reviews, loading, error }) => {
  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner size="lg" color="primary" className="mb-3" />
        <p className="text-muted">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <i className="fas fa-exclamation-triangle fa-2x text-warning mb-3"></i>
        <p className="text-muted">Error loading reviews: {error}</p>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="fas fa-comments fa-3x text-muted mb-3"></i>
        <h5 className="text-muted">No reviews yet</h5>
        <p className="text-muted">Be the first to review this book!</p>
      </div>
    );
  }

  return (
    <div className="reviews-list">
      <h5 className="mb-4">
        <i className="fas fa-comments mr-2 text-primary"></i>
        Reviews ({reviews.length})
      </h5>
      
      <div className="space-y-3">
        {reviews.map((review) => (
          <Card 
            key={review.id} 
            className="mb-3"
            style={{ 
              borderRadius: '12px',
              border: '1px solid #e9ecef',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <CardBody className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="d-flex align-items-center">
                  <div 
                    className="d-flex align-items-center justify-content-center mr-3"
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#007bff',
                      borderRadius: '50%',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    {review.userName ? review.userName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h6 className="mb-1 font-weight-bold">
                      {review.userName || 'Anonymous User'}
                    </h6>
                    <StarRating rating={review.score} size="0.9rem" />
                  </div>
                </div>
              </div>
              
              <p className="mb-0 text-dark" style={{ lineHeight: '1.6' }}>
                {review.reviewText}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewsList;
