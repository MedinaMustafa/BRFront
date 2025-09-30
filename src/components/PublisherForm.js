import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner
} from "reactstrap";

const PublisherForm = ({ isOpen, toggle, onSubmit, publisher, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    address: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && publisher) {
      setFormData({
        name: publisher.name || "",
        website: publisher.website || "",
        address: publisher.address || ""
      });
    } else {
      setFormData({
        name: "",
        website: "",
        address: ""
      });
    }
  }, [isEdit, publisher, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      
      // Reset form
      setFormData({
        name: "",
        website: "",
        address: ""
      });
      
      toggle();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        <i className={`fas ${isEdit ? 'fa-edit' : 'fa-plus'} me-2`}></i>
        {isEdit ? 'Edit Publisher' : 'Add New Publisher'}
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <FormGroup>
            <Label for="name">
              <i className="fas fa-building me-2"></i>
              Publisher Name *
            </Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Enter publisher name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
            />
          </FormGroup>

          <FormGroup>
            <Label for="website">
              <i className="fas fa-globe me-2"></i>
              Website
            </Label>
            <Input
              type="url"
              name="website"
              id="website"
              placeholder="https://example.com"
              value={formData.website}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </FormGroup>

          <FormGroup>
            <Label for="address">
              <i className="fas fa-map-marker-alt me-2"></i>
              Address
            </Label>
            <Input
              type="textarea"
              name="address"
              id="address"
              placeholder="Enter publisher address"
              value={formData.address}
              onChange={handleInputChange}
              rows="3"
              disabled={isSubmitting}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button 
            color="secondary" 
            onClick={toggle}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            color="primary" 
            type="submit"
            disabled={isSubmitting || !formData.name.trim()}
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" className="me-2" />
                {isEdit ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <i className={`fas ${isEdit ? 'fa-save' : 'fa-plus'} me-2`}></i>
                {isEdit ? 'Update Publisher' : 'Create Publisher'}
              </>
            )}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default PublisherForm;
