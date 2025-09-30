import React from "react";
import { Card, CardBody, CardHeader } from "reactstrap";
import PublisherManagement from "../components/PublisherManagement";

const AdminPublishers = () => {
  return (
    <div className="admin-publishers">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">
          <i className="fas fa-building me-2"></i>
          Manage Publishers
        </h1>
        <div className="text-muted">
          <i className="fas fa-info-circle me-1"></i>
          Create, edit, and manage book publishers
        </div>
      </div>

      <Card>
        <CardHeader>
          <h5 className="mb-0">
            <i className="fas fa-industry me-2"></i>
            Publishers
          </h5>
        </CardHeader>
        <CardBody>
          <PublisherManagement />
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminPublishers;
