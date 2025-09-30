import React, { useState, useEffect } from "react";
import { Button, Table, Modal, ModalHeader, ModalBody, Spinner, Alert } from "reactstrap";
import { toast } from "react-toastify";
import { useAuth0 } from "@auth0/auth0-react";
import publisherService from "../services/publisherService";
import PublisherForm from "./PublisherForm";

const PublisherManagement = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState(null);

  useEffect(() => {
    fetchPublishers();
  }, []);

  const fetchPublishers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await publisherService.getAllPublishers();
      setPublishers(data);
    } catch (err) {
      console.error("Error fetching publishers:", err);
      setError("Failed to load publishers");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePublisher = async (formData) => {
    try {
      const token = await getAccessTokenSilently();
      await publisherService.createPublisher(formData, token);
      toast.success("Publisher created successfully");
      setIsCreateModalOpen(false);
      await fetchPublishers();
    } catch (error) {
      console.error("Error creating publisher:", error);
      toast.error("Failed to create publisher");
      throw error;
    }
  };

  const handleEditPublisher = async (formData) => {
    try {
      const token = await getAccessTokenSilently();
      await publisherService.updatePublisher(selectedPublisher.id, formData, token);
      toast.success("Publisher updated successfully");
      setIsEditModalOpen(false);
      setSelectedPublisher(null);
      await fetchPublishers();
    } catch (error) {
      console.error("Error updating publisher:", error);
      toast.error("Failed to update publisher");
      throw error;
    }
  };

  const handleDeletePublisher = async () => {
    try {
      const token = await getAccessTokenSilently();
      await publisherService.deletePublisher(selectedPublisher.id, token);
      toast.success("Publisher deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedPublisher(null);
      await fetchPublishers();
    } catch (error) {
      console.error("Error deleting publisher:", error);
      toast.error("Failed to delete publisher");
    }
  };

  const openEditModal = (publisher) => {
    setSelectedPublisher(publisher);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (publisher) => {
    setSelectedPublisher(publisher);
    setIsDeleteModalOpen(true);
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div>
          <Spinner size="lg" color="primary" />
        </div>
        <p className="mt-2">Loading publishers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert color="danger">
        <h4>Error</h4>
        <p>{error}</p>
        <Button color="primary" onClick={fetchPublishers}>
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
          Add New Publisher
        </Button>
      </div>

      <Table striped responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Website</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {publishers.map((publisher) => (
            <tr key={publisher.id}>
              <td>
                <strong>{publisher.name}</strong>
              </td>
              <td>
                {publisher.website ? (
                  <a 
                    href={publisher.website.startsWith('http') ? publisher.website : `https://${publisher.website}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary"
                  >
                    <i className="fas fa-external-link-alt me-1"></i>
                    {publisher.website}
                  </a>
                ) : (
                  <span className="text-muted">No website</span>
                )}
              </td>
              <td>
                <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {publisher.address || "No address provided"}
                </div>
              </td>
              <td>
                <div className="btn-group" role="group">
                  <Button 
                    color="info" 
                    size="sm" 
                    onClick={() => openEditModal(publisher)}
                  >
                    <i className="fas fa-edit me-1"></i>
                    Edit
                  </Button>
                  <Button 
                    color="danger" 
                    size="sm" 
                    onClick={() => openDeleteModal(publisher)}
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

      {publishers.length === 0 && (
        <div className="text-center py-4">
          <i className="fas fa-building fa-3x text-muted mb-3"></i>
          <p className="text-muted">No publishers found. Add your first publisher!</p>
        </div>
      )}

      {/* Create Publisher Modal */}
      <PublisherForm
        isOpen={isCreateModalOpen}
        toggle={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePublisher}
        isEdit={false}
      />

      {/* Edit Publisher Modal */}
      <PublisherForm
        isOpen={isEditModalOpen}
        toggle={() => {
          setIsEditModalOpen(false);
          setSelectedPublisher(null);
        }}
        onSubmit={handleEditPublisher}
        publisher={selectedPublisher}
        isEdit={true}
      />

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} toggle={() => setIsDeleteModalOpen(false)}>
        <ModalHeader toggle={() => setIsDeleteModalOpen(false)}>
          <i className="fas fa-exclamation-triangle text-danger me-2"></i>
          Confirm Delete
        </ModalHeader>
        <ModalBody>
          <p>Are you sure you want to delete the publisher <strong>"{selectedPublisher?.name}"</strong>?</p>
          <p className="text-danger">
            <i className="fas fa-warning me-1"></i>
            This action cannot be undone and may affect books associated with this publisher.
          </p>
        </ModalBody>
        <div className="modal-footer">
          <Button color="secondary" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button color="danger" onClick={handleDeletePublisher}>
            <i className="fas fa-trash me-1"></i>
            Delete Publisher
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default PublisherManagement;
