import React from "react";
import { Card, CardBody, CardHeader } from "reactstrap";
import AuthorManagement from "../components/AuthorManagement";

const AdminAuthors = () => {
  return (
    <div className="admin-authors">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">
          <i className="fas fa-user-edit me-2"></i>
          Manage Authors
        </h1>
        <div className="text-muted">
          <i className="fas fa-info-circle me-1"></i>
          Create, edit, and manage book authors
        </div>
      </div>

      <Card>
        <CardHeader>
          <h5 className="mb-0">
            <i className="fas fa-users me-2"></i>
            Authors
          </h5>
        </CardHeader>
        <CardBody>
          <AuthorManagement />
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminAuthors;
