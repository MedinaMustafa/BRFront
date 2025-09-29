import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { useParams, useHistory } from "react-router-dom";
import { useWishlists } from "../hooks";
import { bookService } from "../services";
import BookCart from "./BookCart";

const WishlistViewer = () => {
  const { wishlistId } = useParams();
  const history = useHistory();
  const { wishlists, loading, error } = useWishlists();
  const [wishlist, setWishlist] = useState(null);
  const [books, setBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(false);

  useEffect(() => {
    if (wishlistId && wishlists.length > 0) {
      const foundWishlist = wishlists.find(w => w.id === wishlistId);
      if (foundWishlist) {
        setWishlist(foundWishlist);
        fetchBooksDetails(foundWishlist.books || []);
      }
    }
  }, [wishlistId, wishlists]);

  const fetchBooksDetails = async (wishlistBooks) => {
    if (wishlistBooks.length === 0) {
      setBooks([]);
      return;
    }

    setBooksLoading(true);
    try {
      const bookPromises = wishlistBooks.map(async (wishlistBook) => {
        try {
          const book = await bookService.getBookById(wishlistBook.bookId);
          return {
            ...book,
            addedDate: wishlistBook.addedDate,
            wishlistId: wishlistBook.wishlistId
          };
        } catch (error) {
          console.error(`Error fetching book ${wishlistBook.bookId}:`, error);
          return null;
        }
      });

      const booksData = await Promise.all(bookPromises);
      setBooks(booksData.filter(book => book !== null));
    } catch (error) {
      console.error("Error fetching books details:", error);
    } finally {
      setBooksLoading(false);
    }
  };

  return (
    <Container className="mb-5" style={{ minHeight: '400px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-3xl">
          {loading ? "Loading..." : wishlist ? wishlist.name : "Wishlist"}
        </h2>
        <Button
          color="link"
          onClick={() => history.push("/wishlists")}
          className="p-0"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to My Wishlists
        </Button>
      </div>
      
      <div style={{ minHeight: '200px' }}>
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <p>Error: {error}</p>
        ) : !wishlist ? (
          <p>Wishlist not found</p>
        ) : booksLoading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading books...</span>
            </div>
          </div>
        ) : books.length === 0 ? (
          <p>Nothing found!</p>
        ) : (
          <Row>
            {books.map((book, index) => (
              <Col key={book.id} md="6" lg="4" xl="3" className="mb-4">
                <BookCart book={book} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </Container>
  );
};

export default WishlistViewer;
