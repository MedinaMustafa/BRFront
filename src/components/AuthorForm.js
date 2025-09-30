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

const AuthorForm = ({ isOpen, toggle, onSubmit, author, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    biography: "",
    birthDate: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && author) {
      setFormData({
        name: author.name || "",
        biography: author.biography || "",
        birthDate: author.birthDate ? new Date(author.birthDate).toISOString().split('T')[0] : ""
      });
    } else {
      setFormData({
        name: "",
        biography: "",
        birthDate: ""
      });
    }
  }, [isEdit, author, isOpen]);

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
      const submitData = {
        ...formData,
        birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : new Date().toISOString()
      };
      
      await onSubmit(submitData);
      
      // Reset form
      setFormData({
        name: "",
        biography: "",
        birthDate: ""
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
        {isEdit ? 'Edit Author' : 'Add New Author'}
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <FormGroup>
            <Label for="name">
              <i className="fas fa-user me-2"></i>
              Author Name *
            </Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Enter author name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
            />
          </FormGroup>

          <FormGroup>
            <Label for="biography">
              <i className="fas fa-book-open me-2"></i>
              Biography
            </Label>
            <Input
              type="textarea"
              name="biography"
              id="biography"
              placeholder="Enter author biography"
              value={formData.biography}
              onChange={handleInputChange}
              rows="4"
              disabled={isSubmitting}
            />
          </FormGroup>

          <FormGroup>
            <Label for="birthDate">
              <i className="fas fa-calendar me-2"></i>
              Birth Date
            </Label>
            <Input
              type="date"
              name="birthDate"
              id="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
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
                {isEdit ? 'Update Author' : 'Create Author'}
              </>
            )}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AuthorForm;
