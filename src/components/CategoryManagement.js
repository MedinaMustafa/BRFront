import React, { useState } from "react";
import { Button, Table, Badge, Modal, ModalHeader, ModalBody } from "reactstrap";
import { toast } from "react-toastify";
import { useCategories } from "../hooks";
import CategoryForm from "./CategoryForm";

const CategoryManagement = () => {
  const { categories, loading, error, createCategory, updateCategory, deleteCategory } = useCategories();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCreateCategory = async (formData) => {
    return await createCategory(formData);
  };

  const handleEditCategory = async (formData) => {
    return await updateCategory(selectedCategory.id, formData);
  };

  const handleDeleteCategory = async () => {
    try {
      await deleteCategory(selectedCategory.id);
      toast.success("Category deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="d-flex justify-content-end mb-4">
        <Button 
          color="primary" 
          onClick={() => setIsCreateModalOpen(true)}
        >
          Add New Category
        </Button>
      </div>

      <Table striped responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>
                <strong>{category.name}</strong>
              </td>
              <td>
                {category.description || "No description"}
              </td>
              <td>
                <div className="btn-group" role="group">
                  <Button 
                    color="info" 
                    size="sm" 
                    onClick={() => openEditModal(category)}
                  >
                    Edit
                  </Button>
                  <Button 
                    color="danger" 
                    size="sm" 
                    onClick={() => openDeleteModal(category)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {categories.length === 0 && (
        <div className="text-center py-4">
          <p className="text-muted">No categories found. Add your first category!</p>
        </div>
      )}

      {/* Create Category Modal */}
      <CategoryForm
        isOpen={isCreateModalOpen}
        toggle={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCategory}
        isEdit={false}
      />

      {/* Edit Category Modal */}
      <CategoryForm
        isOpen={isEditModalOpen}
        toggle={() => {
          setIsEditModalOpen(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleEditCategory}
        category={selectedCategory}
        isEdit={true}
      />

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} toggle={() => setIsDeleteModalOpen(false)}>
        <ModalHeader toggle={() => setIsDeleteModalOpen(false)}>
          Confirm Delete
        </ModalHeader>
        <ModalBody>
          <p>Are you sure you want to delete the category <strong>"{selectedCategory?.name}"</strong>?</p>
          <p className="text-danger">This action cannot be undone.</p>
        </ModalBody>
        <div className="modal-footer">
          <Button color="secondary" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button color="danger" onClick={handleDeleteCategory}>
            Delete Category
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
