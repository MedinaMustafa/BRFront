import React from "react";
import { Container, Row, Col } from "reactstrap";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import BookCart from "../components/BookCart";
import { useBooks } from "../hooks";

export const BooksComponent = () => {
  const { user } = useAuth0();
  const { books, loading, error } = useBooks();

  if (loading) return <>Loading</>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Container className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-3xl">Discover our Books</h2>
      </div>
      
      {books.length === 0 ? (
        <p>Nothing found!</p>
      ) : (
        <Row>
          {books.map((data, j) => (
            <Col key={j} md="6" lg="4" xl="3" className="mb-4">
              <BookCart book={data} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default withAuthenticationRequired(BooksComponent, {
  onRedirecting: () => <p>Loading</p>,
});
