import React, { useState, useEffect } from "react";
import { Badge } from "reactstrap";
import { useWishlists } from "../hooks";

const BookWishlistIndicator = ({ book }) => {
  const { wishlists, loading } = useWishlists();
  const [bookWishlists, setBookWishlists] = useState([]);

  useEffect(() => {
    if (wishlists.length > 0 && book) {
      // Find which wishlists contain this book
      const containingWishlists = wishlists.filter(wishlist => 
        wishlist.books && wishlist.books.some(wishlistBook => 
          wishlistBook.bookId === book.id
        )
      );
      setBookWishlists(containingWishlists);
    } else {
      setBookWishlists([]);
    }
  }, [wishlists, book]);

  if (loading) {
    return (
      <div className="mt-2">
        <small className="text-muted">
          <i className="fas fa-spinner fa-spin mr-1"></i>
          Loading wishlist status...
        </small>
      </div>
    );
  }

  if (bookWishlists.length === 0) {
    return (
      <div className="mt-2">
        <small className="text-muted">
          <i className="fas fa-heart-o mr-1"></i>
          Not in any wishlist
        </small>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <small className="text-muted d-block mb-1">
        <i className="fas fa-heart mr-1"></i>
        In wishlists:
      </small>
      <div className="d-flex flex-wrap gap-1">
        {bookWishlists.map((wishlist) => (
          <Badge 
            key={wishlist.id} 
            color="primary" 
            pill 
            className="small"
          >
            <i className="fas fa-list mr-1"></i>
            {wishlist.name}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default BookWishlistIndicator;
