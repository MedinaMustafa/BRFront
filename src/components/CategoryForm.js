import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { toast } from "react-toastify";

const CategoryForm = ({ isOpen, toggle, onSubmit, category = null, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const [loading, setLoading] = useState(false);

  // Reset form when modal opens/closes or category changes
  useEffect(() => {
    if (isOpen) {
      if (isEdit && category) {
        console.log("Initializing edit form with category data:", {
          name: category.name,
          description: category.description
        });
        setFormData({
          name: category.name || "",
          description: category.description || ""
        });
      } else {
        setFormData({
          name: "",
          description: ""
        });
      }
    }
  }, [isOpen, isEdit, category]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation: Name is required
      if (!formData.name.trim()) {
        toast.error("Category name is required");
        setLoading(false);
        return;
      }

      console.log("Submitting category form data:", {
        isEdit: isEdit,
        categoryId: category?.id,
        name: formData.name,
        description: formData.description
      });

      const message = await onSubmit(formData);
      toast.success(message);
      toggle(); // Close modal
    } catch (error) {
      console.error("Error submitting form:", error);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      toast.error(error.response?.data?.message || error.message || "An error occurred while saving the category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        {isEdit ? "Edit Category" : "Add New Category"}
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <FormGroup>
            <Label for="name">Category Name *</Label>
            <Input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={{ marginLeft: '20px', width: '300px' }}
            />
          </FormGroup>

          <FormGroup>
            <Label for="description">Description</Label>
            <Input
              type="textarea"
              name="description"
              id="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              style={{ marginLeft: '20px', width: '300px' }}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle} disabled={loading}>
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={loading}>
            {loading ? "Saving..." : (isEdit ? "Update Category" : "Create Category")}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default CategoryForm;
