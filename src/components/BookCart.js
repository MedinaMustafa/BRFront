import { NavLink } from "react-router-dom";
// import Stars from "../general/Stars";

import {
  Button,
} from "reactstrap";
import { toast } from "react-toastify";
import api from "../config/config";

function BookCart({ book }) {

  function addBookshelf() {
    api
    .post("/UserBooks/Add", book.id)
    .then((response) => {
      toast.success(response.data);
    })
    .catch((error) => {
      toast.error("Book is already in your collection!");
    })
    .finally(() => {
    });

  }

  return (
    <div
      className="flex flex-col gap-2 relative max-w-sm rounded overflow-hidden bg-white"
    >
      <NavLink to={`/book/${book.id}`}>
        <img
          className="w-full h-[200px] object-cover"
          src={book.coverImageUrl} //thumbnail
          alt={book.title}
        />
        <div>
          <span className="absolute top-2 left-2 bg-red-800 rounded-md px-2 text-white">
            {book.category}
          </span>
          <div className="font-bold text-xl">{book.title}</div>
          <p className="text-gray-700 text-base">{book.author}</p>
          <p>{book.publicationYear}</p>
        </div>
        {/* {<Stars no={3} />} */}
      </NavLink>
      <Button onClick={() => addBookshelf()}>Add to bookshelf</Button>
    </div>
  );
}

export default BookCart;
