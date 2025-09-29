import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { toast } from "react-toastify";
import { useDropdownData } from "../hooks";

const BookForm = ({ isOpen, toggle, onSubmit, book = null, isEdit = false }) => {
  const { categories, authors, publishers, loading: dropdownLoading, error: dropdownError, fetchAllData } = useDropdownData();
  
  const [formData, setFormData] = useState({
    title: "",
    isbn: "",
    description: "",
    publishedDate: "",
    categoryId: "",
    authorId: "",
    publisherId: "",
    coverImage: null
  });

  const [loading, setLoading] = useState(false);

  // Fetch dropdown data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAllData();
    }
  }, [isOpen, fetchAllData]);

  // Reset form when modal opens/closes or book changes
  useEffect(() => {
    if (isOpen) {
      if (isEdit && book) {
        console.log("Initializing edit form with book data:", {
          title: book.title,
          categoryId: book.categoryId,
          authorId: book.authorId,
          publisherId: book.publisherId
        });
        setFormData({
          title: book.title || "",
          isbn: book.isbn || "",
          description: book.description || "",
          publishedDate: book.publishedDate ? new Date(book.publishedDate).toISOString().split('T')[0] : "",
          categoryId: book.categoryId || "", // Now available from updated BookReadDTO
          authorId: book.authorId || "", // Now available from updated BookReadDTO
          publisherId: book.publisherId || "", // Now available from updated BookReadDTO
          coverImage: null // Keep existing image, don't require new one for edits
        });
      } else {
        setFormData({
          title: "",
          isbn: "",
          description: "",
          publishedDate: "",
          categoryId: "",
          authorId: "",
          publisherId: "",
          coverImage: null
        });
      }
    }
  }, [isOpen, isEdit, book]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "coverImage") {
      setFormData(prev => ({
        ...prev,
        [name]: files[0] || null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation: Check if published date is in the future
      if (formData.publishedDate) {
        const publishedDate = new Date(formData.publishedDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
        
        if (publishedDate > today) {
          toast.error("Published date cannot be in the future");
          setLoading(false);
          return;
        }
      }

      // Validation: Cover image is required for new books
      if (!isEdit && !formData.coverImage) {
        toast.error("Cover image is required");
        setLoading(false);
        return;
      }

      // Validation: Category is required for both new books and updates
      if (!formData.categoryId) {
        toast.error("Please select a category");
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      // Use capitalized field names to match backend DTO
      formDataToSend.append("Title", formData.title);
      formDataToSend.append("ISBN", formData.isbn);
      formDataToSend.append("Description", formData.description);
      formDataToSend.append("PublishedDate", formData.publishedDate);
      
      // CategoryId is now always available from dropdown selection
      if (formData.categoryId) {
        formDataToSend.append("CategoryId", formData.categoryId);
      }
      
      if (formData.authorId) {
        formDataToSend.append("AuthorId", formData.authorId);
      }
      if (formData.publisherId) {
        formDataToSend.append("PublisherId", formData.publisherId);
      }
      if (formData.coverImage) {
        formDataToSend.append("CoverImage", formData.coverImage);
      }

      console.log("Submitting form data:", {
        isEdit: isEdit,
        bookId: book?.id,
        title: formData.title,
        isbn: formData.isbn,
        description: formData.description,
        publishedDate: formData.publishedDate,
        categoryId: formData.categoryId,
        authorId: formData.authorId,
        publisherId: formData.publisherId,
        hasCoverImage: !!formData.coverImage
      });

      const message = await onSubmit(formDataToSend);
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
      toast.error(error.response?.data?.message || error.message || "An error occurred while saving the book");
    } finally {
      setLoading(false);
    }
  };

  // Show error if dropdown data failed to load
  if (dropdownError) {
    return (
      <Modal isOpen={isOpen} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}>
          {isEdit ? "Edit Book" : "Add New Book"}
        </ModalHeader>
        <ModalBody>
          <div className="alert alert-danger">
            <strong>Error loading form data:</strong> {dropdownError}
            <br />
            <Button color="primary" size="sm" onClick={fetchAllData} className="mt-2">
              Retry
            </Button>
          </div>
        </ModalBody>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        {isEdit ? "Edit Book" : "Add New Book"}
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <FormGroup>
            <Label for="title">Title *</Label>
            <Input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              style={{ marginLeft: '20px', width: '300px' }}
            />
          </FormGroup>

          <FormGroup>
            <Label for="isbn">ISBN *</Label>
            <Input
              type="text"
              name="isbn"
              id="isbn"
              value={formData.isbn}
              onChange={handleInputChange}
              required
              style={{ marginLeft: '20px', width: '300px' }}
            />
          </FormGroup>

          <FormGroup>
            <Label for="description">Description *</Label>
            <Input
              type="textarea"
              name="description"
              id="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              required
              style={{ marginLeft: '20px', width: '300px' }}
            />
          </FormGroup>

          <FormGroup>
            <Label for="publishedDate">Published Date *</Label>
            <Input
              type="date"
              name="publishedDate"
              id="publishedDate"
              value={formData.publishedDate}
              onChange={handleInputChange}
              max={new Date().toISOString().split('T')[0]} // Prevent future dates
              required
              style={{ marginLeft: '20px', width: '300px' }}
            />
            <small className="text-muted" style={{ marginLeft: '20px' }}>Cannot be in the future</small>
          </FormGroup>

          <FormGroup>
            <Label for="categoryId">
              Category <span className="text-danger">*</span>
            </Label>
            <Input
              type="select"
              name="categoryId"
              id="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              required
              disabled={dropdownLoading}
              style={{ marginLeft: '20px', width: '300px' }}
            >
              <option value=""></option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Input>
            {dropdownLoading && (
              <small className="text-muted" style={{ marginLeft: '20px' }}>Loading categories...</small>
            )}
          </FormGroup>

          <FormGroup>
            <Label for="authorId">Author</Label>
            <Input
              type="select"
              name="authorId"
              id="authorId"
              value={formData.authorId}
              onChange={handleInputChange}
              disabled={dropdownLoading}
              style={{ marginLeft: '20px', width: '300px' }}
            >
              <option value=""></option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </Input>
            {dropdownLoading && (
              <small className="text-muted" style={{ marginLeft: '20px' }}>Loading authors...</small>
            )}
          </FormGroup>

          <FormGroup>
            <Label for="publisherId">Publisher</Label>
            <Input
              type="select"
              name="publisherId"
              id="publisherId"
              value={formData.publisherId}
              onChange={handleInputChange}
              disabled={dropdownLoading}
              style={{ marginLeft: '20px', width: '300px' }}
            >
              <option value=""></option>
              {publishers.map((publisher) => (
                <option key={publisher.id} value={publisher.id}>
                  {publisher.name}
                </option>
              ))}
            </Input>
            {dropdownLoading && (
              <small className="text-muted" style={{ marginLeft: '20px' }}>Loading publishers...</small>
            )}
          </FormGroup>

          <FormGroup>
            <Label for="coverImage">
              Cover Image {!isEdit && <span className="text-danger">*</span>}
            </Label>
            <Input
              type="file"
              name="coverImage"
              id="coverImage"
              accept="image/*"
              onChange={handleInputChange}
              required={!isEdit} // Required only for new books
              style={{ marginLeft: '20px', width: '300px' }}
            />
            {!isEdit && (
              <small className="text-muted" style={{ marginLeft: '20px' }}>Cover image is required for new books</small>
            )}
            {isEdit && book?.coverImageUrl && (
              <div className="mt-2" style={{ marginLeft: '20px' }}>
                <small>Current image:</small>
                <br />
                <img
                  src={book.coverImageUrl}
                  alt="Current cover"
                  style={{ maxWidth: "100px", maxHeight: "100px" }}
                />
              </div>
            )}
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle} disabled={loading}>
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={loading}>
            {loading ? "Saving..." : (isEdit ? "Update Book" : "Create Book")}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default BookForm;
