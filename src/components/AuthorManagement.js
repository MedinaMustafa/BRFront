import React, { useState, useEffect } from "react";
import { Button, Table, Modal, ModalHeader, ModalBody, Spinner, Alert } from "reactstrap";
import { toast } from "react-toastify";
import { useAuth0 } from "@auth0/auth0-react";
import authorService from "../services/authorService";
import AuthorForm from "./AuthorForm";

const AuthorManagement = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await authorService.getAllAuthors();
      setAuthors(data);
    } catch (err) {
      console.error("Error fetching authors:", err);
      setError("Failed to load authors");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAuthor = async (formData) => {
    try {
      const token = await getAccessTokenSilently();
      await authorService.createAuthor(formData, token);
      toast.success("Author created successfully");
      setIsCreateModalOpen(false);
      await fetchAuthors();
    } catch (error) {
      console.error("Error creating author:", error);
      toast.error("Failed to create author");
      throw error;
    }
  };

  const handleEditAuthor = async (formData) => {
    try {
      const token = await getAccessTokenSilently();
      await authorService.updateAuthor(selectedAuthor.id, formData, token);
      toast.success("Author updated successfully");
      setIsEditModalOpen(false);
      setSelectedAuthor(null);
      await fetchAuthors();
    } catch (error) {
      console.error("Error updating author:", error);
      toast.error("Failed to update author");
      throw error;
    }
  };

  const handleDeleteAuthor = async () => {
    try {
      const token = await getAccessTokenSilently();
      await authorService.deleteAuthor(selectedAuthor.id, token);
      toast.success("Author deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedAuthor(null);
      await fetchAuthors();
    } catch (error) {
      console.error("Error deleting author:", error);
      toast.error("Failed to delete author");
    }
  };

  const openEditModal = (author) => {
    setSelectedAuthor(author);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (author) => {
    setSelectedAuthor(author);
    setIsDeleteModalOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div>
          <Spinner size="lg" color="primary" />
        </div>
        <p className="mt-2">Loading authors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert color="danger">
        <h4>Error</h4>
        <p>{error}</p>
        <Button color="primary" onClick={fetchAuthors}>
          Try Again
        </Button>
      </Alert>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-end mb-4">
        <Button 
          color="primary" 
          onClick={() => setIsCreateModalOpen(true)}
        >
          <i className="fas fa-plus me-2"></i>
          Add New Author
        </Button>
      </div>

      <Table striped responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Biography</th>
            <th>Birth Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author) => (
            <tr key={author.id}>
              <td>
                <strong>{author.name}</strong>
              </td>
              <td>
                <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {author.biography || "No biography available"}
                </div>
              </td>
              <td>
                {formatDate(author.birthDate)}
              </td>
              <td>
                <div className="btn-group" role="group">
                  <Button 
                    color="info" 
                    size="sm" 
                    onClick={() => openEditModal(author)}
                  >
                    <i className="fas fa-edit me-1"></i>
                    Edit
                  </Button>
                  <Button 
                    color="danger" 
                    size="sm" 
                    onClick={() => openDeleteModal(author)}
                  >
                    <i className="fas fa-trash me-1"></i>
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {authors.length === 0 && (
        <div className="text-center py-4">
          <i className="fas fa-user-edit fa-3x text-muted mb-3"></i>
          <p className="text-muted">No authors found. Add your first author!</p>
        </div>
      )}

      {/* Create Author Modal */}
      <AuthorForm
        isOpen={isCreateModalOpen}
        toggle={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateAuthor}
        isEdit={false}
      />

      {/* Edit Author Modal */}
      <AuthorForm
        isOpen={isEditModalOpen}
        toggle={() => {
          setIsEditModalOpen(false);
          setSelectedAuthor(null);
        }}
        onSubmit={handleEditAuthor}
        author={selectedAuthor}
        isEdit={true}
      />

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} toggle={() => setIsDeleteModalOpen(false)}>
        <ModalHeader toggle={() => setIsDeleteModalOpen(false)}>
          <i className="fas fa-exclamation-triangle text-danger me-2"></i>
          Confirm Delete
        </ModalHeader>
        <ModalBody>
          <p>Are you sure you want to delete the author <strong>"{selectedAuthor?.name}"</strong>?</p>
          <p className="text-danger">
            <i className="fas fa-warning me-1"></i>
            This action cannot be undone and may affect books associated with this author.
          </p>
        </ModalBody>
        <div className="modal-footer">
          <Button color="secondary" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button color="danger" onClick={handleDeleteAuthor}>
            <i className="fas fa-trash me-1"></i>
            Delete Author
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AuthorManagement;
