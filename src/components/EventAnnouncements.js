import React from "react";
import { Card, CardBody, CardHeader, Badge, Button, Spinner } from "reactstrap";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useEvents } from "../hooks";

const EventAnnouncements = () => {
  const { user, isAuthenticated } = useAuth0();
  const { loading, error, getCurrentEvents, getUpcomingEvents, getRecentEvents } = useEvents();
  
  // Check if user is admin
  const isAdmin = isAuthenticated && user && user['https://lab1.com/roles'] && 
    user['https://lab1.com/roles'].includes('Admin');

  if (loading) {
    return (
      <Card className="mb-4">
        <CardHeader>
          <h5 className="mb-0">
            <i className="fas fa-calendar-alt me-2"></i>
            Events & Announcements
          </h5>
        </CardHeader>
        <CardBody className="text-center py-4">
          <div>
            <Spinner size="sm" color="primary" />
          </div>
          <p className="mt-2 text-muted mb-0">Loading events...</p>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mb-4">
        <CardHeader>
          <h5 className="mb-0">
            <i className="fas fa-calendar-alt me-2"></i>
            Events & Announcements
          </h5>
        </CardHeader>
        <CardBody className="text-center py-4">
          <i className="fas fa-exclamation-triangle text-warning fa-2x mb-2"></i>
          <p className="text-muted mb-0">No Recent Events</p>
        </CardBody>
      </Card>
    );
  }

  const currentEvents = getCurrentEvents();
  const upcomingEvents = getUpcomingEvents().slice(0, 3); // Show max 3 upcoming
  const recentEvents = getRecentEvents().slice(0, 2); // Show max 2 recent

  // If no events to show, don't render the component
  if (currentEvents.length === 0 && upcomingEvents.length === 0 && recentEvents.length === 0) {
    return null;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isToday = (dateString) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    return today.toDateString() === eventDate.toDateString();
  };

  const EventCard = ({ event, type }) => (
    <Card className="mb-3 border-0 shadow-sm">
      <CardBody className="p-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center mb-1">
              <h6 className="mb-0 me-2">{event.name}</h6>
              {type === 'current' && (
                <Badge color="success" className="me-2">
                  <i className="fas fa-play me-1"></i>
                  Live Now
                </Badge>
              )}
              {type === 'upcoming' && (
                <Badge color="primary" className="me-2">
                  <i className="fas fa-clock me-1"></i>
                  Upcoming
                </Badge>
              )}
              {type === 'recent' && (
                <Badge color="secondary" className="me-2">
                  <i className="fas fa-check me-1"></i>
                  Recent
                </Badge>
              )}
            </div>
            <div className="text-muted small mb-2">
              <i className="fas fa-calendar me-1"></i>
              {formatDate(event.startDate)}
              {isToday(event.startDate) && (
                <span className="ms-2">
                  <i className="fas fa-clock me-1"></i>
                  {formatTime(event.startDate)}
                </span>
              )}
            </div>
            {event.location && (
              <div className="text-muted small mb-2">
                <i className="fas fa-map-marker-alt me-1"></i>
                {event.location}
              </div>
            )}
            <p className="mb-2 small">{event.description}</p>
            {event.books && event.books.length > 0 && (
              <div className="small">
                <i className="fas fa-book me-1 text-primary"></i>
                <span className="text-muted">Featured books: </span>
                {event.books.slice(0, 3).map((book, index) => (
                  <span key={book.bookId}>
                    {index > 0 && ", "}
                    <span className="text-primary">{book.bookTitle}</span>
                  </span>
                ))}
                {event.books.length > 3 && (
                  <span className="text-muted"> and {event.books.length - 3} more</span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <Card className="mb-4">
      <CardHeader className="bg-primary text-white">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="fas fa-calendar-alt me-2"></i>
            Events & Announcements
          </h5>
           {isAdmin ? (
             <Button color="light" size="sm" outline tag={Link} to="/admin/events">
               <i className="fas fa-cog me-1"></i>
               Manage Events
             </Button>
           ) : (
             <Button color="light" size="sm" outline>
               <i className="fas fa-eye me-1"></i>
               View All
             </Button>
           )}
        </div>
      </CardHeader>
      <CardBody>
        {/* Current Events */}
        {currentEvents.length > 0 && (
          <div className="mb-4">
            <h6 className="text-success mb-3">
              <i className="fas fa-broadcast-tower me-2"></i>
              Happening Now
            </h6>
            {currentEvents.map(event => (
              <EventCard key={event.id} event={event} type="current" />
            ))}
          </div>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="mb-4">
            <h6 className="text-primary mb-3">
              <i className="fas fa-calendar-plus me-2"></i>
              Coming Up
            </h6>
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} type="upcoming" />
            ))}
          </div>
        )}

        {/* Recent Events */}
        {recentEvents.length > 0 && (
          <div>
            <h6 className="text-secondary mb-3">
              <i className="fas fa-history me-2"></i>
              Recently Concluded
            </h6>
            {recentEvents.map(event => (
              <EventCard key={event.id} event={event} type="recent" />
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-4 pt-3 border-top">
          <p className="text-muted small mb-2">
            Stay updated with our latest book events and literary gatherings
          </p>
          <Button color="primary" size="sm" outline>
            <i className="fas fa-bell me-1"></i>
            Subscribe to Notifications
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default EventAnnouncements;
