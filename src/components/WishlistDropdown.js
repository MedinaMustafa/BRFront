import React, { useState, useEffect } from "react";
import { Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from "reactstrap";
import { useWishlists } from "../hooks";
import { toast } from "react-toastify";

const WishlistDropdown = ({ book, onBookAdded }) => {
  const { wishlists, loading, error, addBookToWishlist, createWishlist, fetchWishlists } = useWishlists();
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
      toast.success("Wishlist created successfully!");
      setNewWishlistName("");
      setIsCreateModalOpen(false);
      // The createWishlist function already calls fetchWishlists() internally
    } catch (error) {
      console.error("Error creating wishlist:", error);
      toast.error("Failed to create wishlist");
    }
  };

  if (loading) {
    return (
      <Button color="primary" disabled>
        <i className="fas fa-spinner fa-spin mr-2"></i>
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
      <UncontrolledDropdown>
        <DropdownToggle color="primary" caret>
          <i className="fas fa-heart mr-2"></i>
          Add to Wishlist ({wishlists.length})
        </DropdownToggle>
        <DropdownMenu 
          style={{ 
            zIndex: 9999,
            position: 'absolute',
            top: '100%',
            left: 0,
            minWidth: '200px'
          }}
        >
          {wishlists.length === 0 ? (
            <DropdownItem disabled>
              <i className="fas fa-info-circle mr-2"></i>
              No wishlists found
            </DropdownItem>
          ) : (
            wishlists.map((wishlist) => (
              <DropdownItem
                key={wishlist.id}
                onClick={() => handleAddToWishlist(wishlist.id)}
                disabled={isAdding}
              >
                <i className="fas fa-list mr-2"></i>
                {wishlist.name}
                <span className="text-muted ml-2">({wishlist.books?.length || 0} books)</span>
              </DropdownItem>
            ))
          )}
          <DropdownItem divider />
          <DropdownItem onClick={() => setIsCreateModalOpen(true)}>
            <i className="fas fa-plus mr-2"></i>
            Create New Wishlist
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>

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
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Create Wishlist
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};

export default WishlistDropdown;
