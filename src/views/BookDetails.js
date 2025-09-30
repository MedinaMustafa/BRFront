import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Card, CardBody, Button, Spinner, Alert } from "reactstrap";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import api from "../config/config";
import { useRatings } from "../hooks";
import StarRating from "../components/StarRating";
import ReviewForm from "../components/ReviewForm";
import ReviewsList from "../components/ReviewsList";
import WishlistDropdown from "../components/WishlistDropdown";
import BookWishlistIndicator from "../components/BookWishlistIndicator";

const BookDetails = () => {
  const { user, isAuthenticated } = useAuth0();
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [error, setError] = useState(null);

  const { 
    reviews, 
    averageRating, 
    loading: ratingsLoading, 
    error: ratingsError, 
    addReview 
  } = useRatings(id);

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/Book/${id}`);
      setBook(response.data);
    } catch (err) {
      console.error("Error fetching book details:", err);
      setError("Failed to load book details");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = async (reviewData) => {
    await addReview(reviewData);
    setShowReviewForm(false);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner size="lg" color="primary" />
        <p className="mt-3 text-muted">Loading book details...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <Alert color="danger" className="text-center">
        <i className="fas fa-exclamation-triangle mr-2"></i>
        {error || "Book not found"}
      </Alert>
    );
  }

  return (
    <div>
      {/* Book Details Section */}
      <Card className="mb-4" style={{ borderRadius: '15px', overflow: 'hidden' }}>
        <CardBody className="p-4">
          <Row>
            <Col md={4}>
              <div 
                className="book-cover-container"
                style={{
                  height: '400px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}
              >
                <img
                  src={book.coverImageUrl}
                  alt={book.title}
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </Col>
            <Col md={8}>
              <div className="book-info pl-md-4">
                <h1 className="display-4 font-weight-bold mb-3">{book.title}</h1>
                
                {/* Average Rating */}
                <div className="mb-3">
                  <StarRating rating={averageRating} size="1.2rem" />
                  <span className="ml-2 text-muted">
                    ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                  </span>
                </div>

                <div className="book-metadata mb-4">
                  <p className="mb-2">
                    <i className="fas fa-user mr-2 text-primary"></i>
                    <strong>Author:</strong> {book.author}
                  </p>
                  <p className="mb-2">
                    <i className="fas fa-tag mr-2 text-primary"></i>
                    <strong>Category:</strong> {book.categoryName}
                  </p>
                  <p className="mb-2">
                    <i className="fas fa-building mr-2 text-primary"></i>
                    <strong>Publisher:</strong> {book.publisherName}
                  </p>
                  <p className="mb-2">
                    <i className="fas fa-calendar mr-2 text-primary"></i>
                    <strong>Publication Year:</strong> {book.publicationYear}
                  </p>
                  <p className="mb-2">
                    <i className="fas fa-calendar mr-2 text-primary"></i>
                    <strong>Description:</strong> {book.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {isAuthenticated && (
                    <>
                      <Button 
                        color="primary" 
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        style={{ borderRadius: '8px' }}
                      >
                        <i className="fas fa-star mr-2"></i>
                        {showReviewForm ? 'Cancel Review' : 'Write Review'}
                      </Button>
                      <WishlistDropdown book={book} />
                    </>
                  )}
                </div>

                {/* Wishlist Indicator */}
                {isAuthenticated && <BookWishlistIndicator book={book} />}
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Review Form */}
      {showReviewForm && isAuthenticated && (
        <Card className="mb-4" style={{ borderRadius: '15px' }}>
          <CardBody>
            <ReviewForm 
              bookId={id}
              onReviewSubmitted={handleReviewSubmitted}
              onCancel={() => setShowReviewForm(false)}
            />
          </CardBody>
        </Card>
      )}

      {/* Reviews Section */}
      <Card style={{ borderRadius: '15px' }}>
        <CardBody className="p-4">
          <ReviewsList 
            reviews={reviews}
            loading={ratingsLoading}
            error={ratingsError}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default withAuthenticationRequired(BookDetails, {
  onRedirecting: () => <p>Loading</p>,
});
