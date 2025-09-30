import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Spinner } from "reactstrap";
import { useWishlists } from "../hooks";
import { toast } from "react-toastify";

const WishlistDropdown = ({ book, onBookAdded }) => {
  const { wishlists, loading, error, addBookToWishlist, createWishlist, fetchWishlists } = useWishlists();
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState("");
  const [isAdding, setIsAdding] = useState(false);


  const handleAddToWishlist = async (wishlistId) => {
    setIsAdding(true);
    try {
      await addBookToWishlist(wishlistId, book.id);
      toast.success(`Book added to wishlist successfully!`);
      // Refresh wishlist data to update indicators
      await fetchWishlists();
      if (onBookAdded) {
        onBookAdded();
      }
      // Close the wishlist modal after successful addition
      setIsWishlistModalOpen(false);
    } catch (error) {
      console.error("Error adding book to wishlist:", error);
      toast.error("Failed to add book to wishlist");
    } finally {
      setIsAdding(false);
    }
  };

  const handleCreateWishlist = async (e) => {
    e.preventDefault();
    if (!newWishlistName.trim()) {
      toast.error("Wishlist name is required");
      return;
    }

    try {
      await createWishlist({ name: newWishlistName.trim() });
      toast.success("Collection created successfully!");
      setNewWishlistName("");
      setIsCreateModalOpen(false);
      // Reopen the wishlist selection modal to show the new collection
      setIsWishlistModalOpen(true);
      // The createWishlist function already calls fetchWishlists() internally
    } catch (error) {
      console.error("Error creating wishlist:", error);
      toast.error("Failed to create wishlist");
    }
  };

  if (loading) {
    return (
      <Button color="primary" disabled>
        <Spinner size="sm" className="mr-2" />
        Loading...
      </Button>
    );
  }

  if (error) {
    return (
      <Button color="warning" disabled>
        <i className="fas fa-exclamation-triangle mr-2"></i>
        Error: {error}
      </Button>
    );
  }

  return (
    <>
      <Button 
        color="primary" 
        onClick={() => setIsWishlistModalOpen(true)}
        disabled={isAdding}
      >
        <i className="fas fa-heart mr-2"></i>
        Add to Wishlist ({wishlists.length})
      </Button>

      {/* Wishlist Selection Modal */}
      <Modal 
        isOpen={isWishlistModalOpen} 
        toggle={() => setIsWishlistModalOpen(false)}
        centered
        size="md"
        style={{ maxWidth: '500px' }}
        className="rounded-modal"
      >
        <ModalHeader 
          toggle={() => setIsWishlistModalOpen(false)}
          style={{ 
            borderRadius: '15px 15px 0 0',
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #dee2e6'
          }}
        >
          <i className="fas fa-heart mr-2 text-primary"></i>
          Add to Collection
        </ModalHeader>
        <ModalBody 
          style={{ 
            padding: '20px',
            maxHeight: '400px',
            overflowY: 'auto'
          }}
        >
          {/* Create New Collection Option - First */}
          <div 
            className="d-flex align-items-center p-3 mb-2 border rounded"
            style={{ 
              cursor: 'pointer',
              borderRadius: '10px',
              backgroundColor: '#e3f2fd',
              border: '2px dashed #2196f3',
              transition: 'all 0.2s ease'
            }}
            onClick={() => {
              setIsWishlistModalOpen(false);
              setIsCreateModalOpen(true);
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#bbdefb';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#e3f2fd';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <div 
              className="d-flex align-items-center justify-content-center mr-3"
              style={{
                width: '50px',
                height: '50px',
                backgroundColor: '#2196f3',
                borderRadius: '12px',
                color: 'white'
              }}
            >
              <i className="fas fa-plus fa-lg"></i>
            </div>
            <div className="flex-grow-1">
              <h6 className="mb-1 font-weight-bold text-primary">
                Create New Collection
              </h6>
              <small className="text-muted">
                Start a new collection for your books
              </small>
            </div>
            <i className="fas fa-chevron-right text-muted"></i>
          </div>

          {/* Existing Collections */}
          {wishlists.length === 0 ? (
            <div className="text-center py-4">
              <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
              <p className="text-muted">No collections yet</p>
              <small className="text-muted">Create your first collection above</small>
            </div>
          ) : (
            <div>
              <h6 className="text-muted mb-3 font-weight-bold">
                <i className="fas fa-folder mr-2"></i>
                Your Collections
              </h6>
              {wishlists.map((wishlist) => (
                <div 
                  key={wishlist.id}
                  className="d-flex align-items-center p-3 mb-2 border rounded"
                  style={{ 
                    cursor: isAdding ? 'not-allowed' : 'pointer',
                    borderRadius: '10px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    transition: 'all 0.2s ease',
                    opacity: isAdding ? 0.6 : 1
                  }}
                  onClick={() => !isAdding && handleAddToWishlist(wishlist.id)}
                  onMouseEnter={(e) => {
                    if (!isAdding) {
                      e.target.style.backgroundColor = '#e9ecef';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isAdding) {
                      e.target.style.backgroundColor = '#f8f9fa';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  <div 
                    className="d-flex align-items-center justify-content-center mr-3"
                    style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: '#6c757d',
                      borderRadius: '12px',
                      color: 'white'
                    }}
                  >
                    <i className="fas fa-folder fa-lg"></i>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-1 font-weight-bold">
                      {wishlist.name}
                    </h6>
                    <small className="text-muted">
                      {wishlist.books?.length || 0} books
                    </small>
                  </div>
                  {isAdding ? (
                    <Spinner size="sm" color="primary" />
                  ) : (
                    <i className="fas fa-chevron-right text-muted"></i>
                  )}
                </div>
              ))}
            </div>
          )}
        </ModalBody>
      </Modal>

      {/* Create Wishlist Modal */}
      <Modal 
        isOpen={isCreateModalOpen} 
        toggle={() => setIsCreateModalOpen(false)}
        centered
        size="md"
        style={{ maxWidth: '450px' }}
        className="rounded-modal"
      >
        <ModalHeader 
          toggle={() => setIsCreateModalOpen(false)}
          style={{ 
            borderRadius: '15px 15px 0 0',
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #dee2e6'
          }}
        >
          <i className="fas fa-plus mr-2 text-primary"></i>
          Create New Collection
        </ModalHeader>
        <Form onSubmit={handleCreateWishlist}>
          <ModalBody style={{ padding: '25px' }}>
            <FormGroup>
              <Label for="wishlistName" className="font-weight-bold">
                <i className="fas fa-folder mr-2"></i>
                Collection Name
              </Label>
              <Input
                type="text"
                name="wishlistName"
                id="wishlistName"
                value={newWishlistName}
                onChange={(e) => setNewWishlistName(e.target.value)}
                placeholder="e.g., My Favorites, To Read, Sci-Fi Collection"
                required
                style={{
                  borderRadius: '10px',
                  border: '2px solid #dee2e6',
                  padding: '12px 15px',
                  fontSize: '16px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2196f3';
                  e.target.style.boxShadow = '0 0 0 0.2rem rgba(33, 150, 243, 0.25)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#dee2e6';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <small className="form-text text-muted mt-2">
                <i className="fas fa-info-circle mr-1"></i>
                Choose a descriptive name for your book collection
              </small>
            </FormGroup>
          </ModalBody>
          <ModalFooter 
            style={{ 
              borderTop: '1px solid #dee2e6',
              borderRadius: '0 0 15px 15px',
              backgroundColor: '#f8f9fa'
            }}
          >
            <Button 
              color="secondary" 
              onClick={() => setIsCreateModalOpen(false)}
              style={{ borderRadius: '8px' }}
            >
              Cancel
            </Button>
            <Button 
              color="primary" 
              type="submit"
              style={{ borderRadius: '8px' }}
            >
              <i className="fas fa-plus mr-2"></i>
              Create Collection
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};

export default WishlistDropdown;
