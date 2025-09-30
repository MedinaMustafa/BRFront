import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const StarRating = ({ rating, maxRating = 5, size = "1rem", interactive = false, onRatingChange }) => {
  const handleStarClick = (starValue) => {
    if (interactive && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  return (
    <div className="d-flex align-items-center">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;
        const isHalfFilled = rating > index && rating < starValue;

        return (
          <FontAwesomeIcon
            key={index}
            icon="star"
            className={interactive ? 'star-interactive' : ''}
            style={{
              fontSize: size,
              color: isFilled ? '#ffc107' : isHalfFilled ? '#ffc107' : '#e4e5e9',
              cursor: interactive ? 'pointer' : 'default',
              marginRight: '2px',
              transition: 'color 0.2s ease',
              opacity: isHalfFilled ? 0.5 : 1
            }}
            onClick={() => handleStarClick(starValue)}
            onMouseEnter={(e) => {
              if (interactive) {
                e.target.style.color = '#ffc107';
              }
            }}
            onMouseLeave={(e) => {
              if (interactive && starValue > rating) {
                e.target.style.color = '#e4e5e9';
              }
            }}
          />
        );
      })}
      {rating > 0 && (
        <span className="ml-2 text-muted small">
          {rating.toFixed(1)} / {maxRating}
        </span>
      )}
    </div>
  );
};

export default StarRating;
