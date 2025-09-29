import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Container, Row, Col, Button } from "reactstrap";
import { useBooks } from "../hooks";
import { bookService } from "../services";
import { categoryService } from "../services";
import BookCart from "../components/BookCart";

const BooksByCategory = () => {
  const { categoryId } = useParams();
  const history = useHistory();
  const { addBookToBookshelf } = useBooks();
  const [books, setBooks] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooksAndCategory = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Fetching books for category ID:", categoryId);
        
        // Fetch books by category and category info in parallel
        const [booksData, categoriesData] = await Promise.all([
          bookService.getBooksByCategory(categoryId),
          categoryService.getAllCategories()
        ]);
        
        console.log("Books data received:", booksData);
        console.log("Categories data received:", categoriesData);
        
        setBooks(booksData);
        
        // Find the category name
        const foundCategory = categoriesData.find(cat => cat.id === categoryId);
        console.log("Found category:", foundCategory);
        setCategory(foundCategory);
        
      } catch (err) {
        console.error("Error fetching books by category:", err);
        console.error("Error details:", {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          url: err.config?.url
        });
        setError(`Failed to load books for this category: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchBooksAndCategory();
    }
  }, [categoryId]);

  const handleAddToBookshelf = async (book) => {
    try {
      await addBookToBookshelf(book);
    } catch (error) {
      console.error("Error adding book to bookshelf:", error);
    }
  };

  if (loading) return <>Loading</>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Container className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-3xl">
            {category ? `${category.name} Books` : "Category Books"}
          </h2>
          <Button 
            color="link" 
            onClick={() => history.push("/books")}
            className="p-0"
          >
            ← Back to All Books
          </Button>
        </div>
      </div>
      
      {books.length === 0 ? (
        <p>Nothing found!</p>
      ) : (
        <Row>
          {books.map((book, j) => (
            <Col key={j} md="6" lg="4" xl="3" className="mb-4">
              <BookCart book={book} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default BooksByCategory;
