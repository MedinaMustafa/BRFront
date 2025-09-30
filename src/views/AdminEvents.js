import React from "react";
import { Card, CardBody, CardHeader } from "reactstrap";
import EventManagement from "../components/EventManagement";

const AdminEvents = () => {
  return (
    <div className="admin-events">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">
          <i className="fas fa-calendar-alt me-2"></i>
          Manage Events
        </h1>
        <div className="text-muted">
          <i className="fas fa-info-circle me-1"></i>
          Create, edit, and manage book events and announcements
        </div>
      </div>

      <Card>
        <CardHeader>
          <h5 className="mb-0">
            <i className="fas fa-calendar-check me-2"></i>
            Events & Announcements
          </h5>
        </CardHeader>
        <CardBody>
          <EventManagement />
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminEvents;
