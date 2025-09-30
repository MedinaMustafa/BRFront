import React, { useState, useEffect } from "react";
import { Button, Table, Modal, ModalHeader, ModalBody, Spinner, Alert } from "reactstrap";
import { toast } from "react-toastify";
import { useAuth0 } from "@auth0/auth0-react";
import eventService from "../services/eventService";
import EventForm from "./EventForm";

const EventManagement = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventService.getAllEvents();
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (formData) => {
    try {
      const token = await getAccessTokenSilently();
      await eventService.createEvent(formData, token);
      toast.success("Event created successfully");
      setIsCreateModalOpen(false);
      await fetchEvents();
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
      throw error;
    }
  };

  const openDeleteModal = (event) => {
    setSelectedEvent(event);
    setIsDeleteModalOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventStatus = (startDate) => {
    const now = new Date();
    const eventDate = new Date(startDate);
    
    if (eventDate.toDateString() === now.toDateString()) {
      return { status: 'Today', color: 'success' };
    } else if (eventDate > now) {
      return { status: 'Upcoming', color: 'primary' };
    } else {
      return { status: 'Past', color: 'secondary' };
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div>
          <Spinner size="lg" color="primary" />
        </div>
        <p className="mt-2">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert color="danger">
        <h4>Error</h4>
        <p>{error}</p>
        <Button color="primary" onClick={fetchEvents}>
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
          Add New Event
        </Button>
      </div>

      <Table striped responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date & Time</th>
            <th>Location</th>
            <th>Status</th>
            <th>Featured Books</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => {
            const eventStatus = getEventStatus(event.startDate);
            return (
              <tr key={event.id}>
                <td>
                  <strong>{event.name}</strong>
                  <br />
                  <small className="text-muted">{event.description}</small>
                </td>
                <td>
                  {formatDate(event.startDate)}
                </td>
                <td>
                  {event.location || <span className="text-muted">No location</span>}
                </td>
                <td>
                  <span className={`badge bg-${eventStatus.color}`}>
                    {eventStatus.status}
                  </span>
                </td>
                <td>
                  {event.books && event.books.length > 0 ? (
                    <div>
                      <small className="text-muted">
                        {event.books.length} book{event.books.length !== 1 ? 's' : ''}
                      </small>
                      <br />
                      <small>
                        {event.books.slice(0, 2).map(book => book.bookTitle).join(', ')}
                        {event.books.length > 2 && ` +${event.books.length - 2} more`}
                      </small>
                    </div>
                  ) : (
                    <span className="text-muted">No books</span>
                  )}
                </td>
                <td>
                  <div className="btn-group" role="group">
                    <Button 
                      color="info" 
                      size="sm" 
                      onClick={() => {/* TODO: Implement edit */}}
                      disabled
                    >
                      <i className="fas fa-edit me-1"></i>
                      Edit
                    </Button>
                    <Button 
                      color="danger" 
                      size="sm" 
                      onClick={() => openDeleteModal(event)}
                      disabled
                    >
                      <i className="fas fa-trash me-1"></i>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {events.length === 0 && (
        <div className="text-center py-4">
          <i className="fas fa-calendar-alt fa-3x text-muted mb-3"></i>
          <p className="text-muted">No events found. Add your first event!</p>
        </div>
      )}

      {/* Create Event Modal */}
      <EventForm
        isOpen={isCreateModalOpen}
        toggle={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateEvent}
        isEdit={false}
      />

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} toggle={() => setIsDeleteModalOpen(false)}>
        <ModalHeader toggle={() => setIsDeleteModalOpen(false)}>
          <i className="fas fa-exclamation-triangle text-danger me-2"></i>
          Confirm Delete
        </ModalHeader>
        <ModalBody>
          <p>Are you sure you want to delete the event <strong>"{selectedEvent?.name}"</strong>?</p>
          <p className="text-danger">
            <i className="fas fa-warning me-1"></i>
            This action cannot be undone.
          </p>
        </ModalBody>
        <div className="modal-footer">
          <Button color="secondary" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button color="danger" disabled>
            <i className="fas fa-trash me-1"></i>
            Delete Event (Coming Soon)
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default EventManagement;
