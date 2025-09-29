import React, { useState } from "react";
import { Button, Table, Badge, Modal, ModalHeader, ModalBody } from "reactstrap";
import { toast } from "react-toastify";
import { useBooks } from "../hooks";
import BookForm from "./BookForm";

const BookManagement = () => {
  const { books, loading, error, createBook, updateBook, deleteBook } = useBooks();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const handleCreateBook = async (formData) => {
    return await createBook(formData);
  };

  const handleEditBook = async (formData) => {
    return await updateBook(selectedBook.id, formData);
  };

  const handleDeleteBook = async () => {
    try {
      await deleteBook(selectedBook.id);
      toast.success("Book deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedBook(null);
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Failed to delete book");
    }
  };

  const openEditModal = (book) => {
    setSelectedBook(book);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (book) => {
    setSelectedBook(book);
    setIsDeleteModalOpen(true);
  };

  if (loading) return <div>Loading books...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="d-flex justify-content-end mb-4">
        <Button 
          color="primary" 
          onClick={() => setIsCreateModalOpen(true)}
        >
          Add New Book
        </Button>
      </div>

      <Table striped responsive>
        <thead>
          <tr>
            <th>Cover</th>
            <th>Title</th>
            <th>ISBN</th>
            <th>Author</th>
            <th>Category</th>
            <th>Published Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>
                {book.coverImageUrl ? (
                  <img 
                    src={book.coverImageUrl} 
                    alt={book.title}
                    style={{ width: "50px", height: "70px", objectFit: "cover" }}
                  />
                ) : (
                  <div 
                    style={{ 
                      width: "50px", 
                      height: "70px", 
                      backgroundColor: "#f8f9fa",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      color: "#6c757d"
                    }}
                  >
                    No Image
                  </div>
                )}
              </td>
              <td>
                <strong>{book.title}</strong>
                <br />
                <small className="text-muted">{book.description?.substring(0, 50)}...</small>
              </td>
              <td>{book.isbn}</td>
              <td>{book.authorName || "N/A"}</td>
              <td>
                <Badge color="info">{book.categoryName || "N/A"}</Badge>
              </td>
              <td>
                {book.publishedDate ? new Date(book.publishedDate).toLocaleDateString() : "N/A"}
              </td>
              <td>
                <div className="btn-group" role="group">
                  <Button 
                    color="info" 
                    size="sm" 
                    onClick={() => openEditModal(book)}
                  >
                    Edit
                  </Button>
                  <Button 
                    color="danger" 
                    size="sm" 
                    onClick={() => openDeleteModal(book)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {books.length === 0 && (
        <div className="text-center py-4">
          <p className="text-muted">No books found. Add your first book!</p>
        </div>
      )}

      {/* Create Book Modal */}
      <BookForm
        isOpen={isCreateModalOpen}
        toggle={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateBook}
        isEdit={false}
      />

      {/* Edit Book Modal */}
      <BookForm
        isOpen={isEditModalOpen}
        toggle={() => {
          setIsEditModalOpen(false);
          setSelectedBook(null);
        }}
        onSubmit={handleEditBook}
        book={selectedBook}
        isEdit={true}
      />

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} toggle={() => setIsDeleteModalOpen(false)}>
        <ModalHeader toggle={() => setIsDeleteModalOpen(false)}>
          Confirm Delete
        </ModalHeader>
        <ModalBody>
          <p>Are you sure you want to delete the book <strong>"{selectedBook?.title}"</strong>?</p>
          <p className="text-danger">This action cannot be undone.</p>
        </ModalBody>
        <div className="modal-footer">
          <Button color="secondary" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button color="danger" onClick={handleDeleteBook}>
            Delete Book
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default BookManagement;
