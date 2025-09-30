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

const EventForm = ({ isOpen, toggle, onSubmit, event, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    startDate: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && event) {
      setFormData({
        name: event.name || "",
        location: event.location || "",
        startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : "",
        description: event.description || ""
      });
    } else {
      setFormData({
        name: "",
        location: "",
        startDate: "",
        description: ""
      });
    }
  }, [isEdit, event, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.startDate) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const submitData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString()
      };
      
      await onSubmit(submitData);
      
      // Reset form
      setFormData({
        name: "",
        location: "",
        startDate: "",
        description: ""
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
        {isEdit ? 'Edit Event' : 'Add New Event'}
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <FormGroup>
            <Label for="name">
              <i className="fas fa-calendar-alt me-2"></i>
              Event Name *
            </Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Enter event name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
            />
          </FormGroup>

          <FormGroup>
            <Label for="startDate">
              <i className="fas fa-clock me-2"></i>
              Date & Time *
            </Label>
            <Input
              type="datetime-local"
              name="startDate"
              id="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
            />
          </FormGroup>

          <FormGroup>
            <Label for="location">
              <i className="fas fa-map-marker-alt me-2"></i>
              Location
            </Label>
            <Input
              type="text"
              name="location"
              id="location"
              placeholder="Enter event location"
              value={formData.location}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </FormGroup>

          <FormGroup>
            <Label for="description">
              <i className="fas fa-align-left me-2"></i>
              Description
            </Label>
            <Input
              type="textarea"
              name="description"
              id="description"
              placeholder="Enter event description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
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
            disabled={isSubmitting || !formData.name.trim() || !formData.startDate}
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" className="me-2" />
                {isEdit ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <i className={`fas ${isEdit ? 'fa-save' : 'fa-plus'} me-2`}></i>
                {isEdit ? 'Update Event' : 'Create Event'}
              </>
            )}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default EventForm;
