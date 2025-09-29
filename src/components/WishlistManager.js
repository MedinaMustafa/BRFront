import React, { useState } from "react";
import { Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Alert } from "reactstrap";
import { useWishlists } from "../hooks";
import { toast } from "react-toastify";

const WishlistManager = () => {
  const { wishlists, loading, error, createWishlist, deleteWishlist } = useWishlists();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [wishlistToDelete, setWishlistToDelete] = useState(null);

  const handleCreateWishlist = async (e) => {
    e.preventDefault();
    if (!newWishlistName.trim()) {
      toast.error("Wishlist name is required");
      return;
    }

    setIsCreating(true);
    try {
      await createWishlist({ name: newWishlistName.trim() });
      toast.success("Wishlist created successfully!");
      setNewWishlistName("");
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating wishlist:", error);
      toast.error("Failed to create wishlist");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteWishlist = async () => {
    if (!wishlistToDelete) return;

    console.log("Attempting to delete wishlist:", wishlistToDelete);
    console.log("Wishlist ID:", wishlistToDelete.id);
    console.log("Wishlist ID type:", typeof wishlistToDelete.id);

    setIsDeleting(true);
    try {
      await deleteWishlist(wishlistToDelete.id);
      toast.success("Wishlist deleted successfully!");
      setIsDeleteModalOpen(false);
      setWishlistToDelete(null);
    } catch (error) {
      console.error("Error deleting wishlist:", error);
      toast.error("Failed to delete wishlist");
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteModal = (wishlist) => {
    setWishlistToDelete(wishlist);
    setIsDeleteModalOpen(true);
  };

  if (loading) return <div>Loading wishlists...</div>;
  if (error) return <Alert color="danger">Error: {error}</Alert>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">My Wishlists</h3>
          <p className="text-muted mb-0">Organize your books into custom collections</p>
        </div>
        <Button
          color="primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <i className="fas fa-plus mr-2"></i>
          Create New Wishlist
        </Button>
      </div>

      {wishlists.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-heart fa-3x text-muted mb-3"></i>
          <h5 className="text-muted">No wishlists yet</h5>
          <p className="text-muted">Create your first wishlist to start organizing your books!</p>
          <Button
            color="primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <i className="fas fa-plus mr-2"></i>
            Create Your First Wishlist
          </Button>
        </div>
      ) : (
        <Table striped responsive>
          <thead>
            <tr>
              <th>Wishlist Name</th>
              <th>Books Count</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {wishlists.map((wishlist) => (
              <tr key={wishlist.id}>
                <td>
                  <div className="d-flex align-items-center">
                    <i className="fas fa-heart text-primary mr-2"></i>
                    <strong>{wishlist.name}</strong>
                  </div>
                </td>
                <td>
                  <span className="badge badge-primary">
                    {wishlist.books?.length || 0} books
                  </span>
                </td>
                <td>
                  <small className="text-muted">
                    {wishlist.books?.length > 0 
                      ? new Date(wishlist.books[0].addedDate).toLocaleDateString()
                      : 'No books yet'
                    }
                  </small>
                </td>
                <td>
                  <div className="btn-group" role="group">
                    <Button
                      color="info"
                      size="sm"
                      onClick={() => {
                        // Navigate to wishlist details
                        window.location.href = `/wishlist/${wishlist.id}`;
                      }}
                    >
                      <i className="fas fa-eye mr-1"></i>
                      View
                    </Button>
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => openDeleteModal(wishlist)}
                    >
                      <i className="fas fa-trash mr-1"></i>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Create Wishlist Modal */}
      <Modal isOpen={isCreateModalOpen} toggle={() => setIsCreateModalOpen(false)}>
        <ModalHeader toggle={() => setIsCreateModalOpen(false)}>
          Create New Wishlist
        </ModalHeader>
        <Form onSubmit={handleCreateWishlist}>
          <ModalBody>
            <FormGroup>
              <Label for="wishlistName">Wishlist Name</Label>
              <Input
                type="text"
                name="wishlistName"
                id="wishlistName"
                value={newWishlistName}
                onChange={(e) => setNewWishlistName(e.target.value)}
                placeholder="e.g., My Favorites, To Read, Bookshelf"
                required
              />
              <small className="form-text text-muted">
                Choose a descriptive name for your wishlist
              </small>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" type="submit" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Wishlist"}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} toggle={() => setIsDeleteModalOpen(false)}>
        <ModalHeader toggle={() => setIsDeleteModalOpen(false)}>
          Confirm Delete
        </ModalHeader>
        <ModalBody>
          <p>Are you sure you want to delete the wishlist <strong>"{wishlistToDelete?.name}"</strong>?</p>
          <p className="text-danger">This action cannot be undone and will remove all books from this wishlist.</p>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button color="danger" onClick={handleDeleteWishlist} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Wishlist"}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default WishlistManager;
