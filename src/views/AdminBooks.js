import React from "react";
import BookManagement from "../components/BookManagement";

const AdminBooks = () => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Book Management</h1>
          <p className="text-muted mb-0">Manage all books in the system</p>
        </div>
      </div>
      <BookManagement />
    </div>
  );
};

export default AdminBooks;
