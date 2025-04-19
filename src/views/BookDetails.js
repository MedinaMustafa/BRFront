import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../config/config";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

const BookDetails = () => {
  const { user } = useAuth0();
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addReview, setAddReview] = useState(false);

  console.log("id",id);
  useEffect(() => {
    getRecommandetProducts();
  }, [id]);

  function getRecommandetProducts() {
    api
      .get(`/Book/${id}`)
      .then((response) => {
        console.log(
          "resource", response
        )
        setBook(response.data);
      })
      .catch((error) => {
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  if(loading) return <>Loading</>;
  if(!book) return <>Invalid Book</>;

  return (
    <div className="container m-auto mt-10">
      <div className="gap-10 rounded border bg-white mx-auto px-4 py-8 flex flex-col md:flex-row">
        <div className="flex-none w-full md:w-1/3 h-[350px] overflow-hidden">
          <img
            src={book.coverImageUrl}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-grow ml-0 md:ml-8">
          <h1 className="text-3xl font-bold mt-4 md:mt-0">{book.title}</h1>
          <p className="mt-2 text-gray-700">{book.description}</p>
          <p className="mt-2">
            <strong>Average Rating:</strong> {book.rateAvg}
          </p>
          <p className="mt-2">
            <strong>Category:</strong> {book.categoryName}
          </p>
          <p className="mt-2">
            <strong>Publisher:</strong> {book.publisherName}
          </p>
       <button className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={()=>setAddReview(true)}>
            Rate This Book
          </button>
        </div>
      </div>
      {/* {addReview && (
        <Modal close={() => setAddReview(false)}>
          <CreateRating close={() => setAddReview(false)}/>
        </Modal>
      )}
      <Recommandation /> */}
    </div>
  );
};

export default withAuthenticationRequired(BookDetails, {
  onRedirecting: () => <p>Loading</p>,
});
