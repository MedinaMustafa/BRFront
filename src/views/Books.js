import React, {useState, useEffect} from "react";
import { Container } from "reactstrap";
import api from "../config/config";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import BookCart from "../components/BookCart";

export const BooksComponent = () => {
  const { user } = useAuth0();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log("WHAT???")

  useEffect(() => {
    getRecommandetProducts();
  }, []);

  function getRecommandetProducts() {
    api
      .get("/Book")
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  if (loading) return <>Loading</>;
  if (books.length == 0) return  <p>Nothing found!</p>


  return (
    <Container className="mb-5 flex flex-col gap-10">
      <h2 className="text-3xl">Discover our Books</h2>
      <div class="grid grid-cols-1 sm:grid-cols-5 gap-6">
        {books.map((data, j) => {
          return <BookCart book={data} key={j} />;
        })}
      </div>
    </Container>
  );
};

export default withAuthenticationRequired(BooksComponent, {
  onRedirecting: () => <p>Loading</p>,
});
