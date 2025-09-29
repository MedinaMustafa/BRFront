import React from "react";
import CategoryManagement from "../components/CategoryManagement";

const AdminCategories = () => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Category Management</h1>
          <p className="text-muted mb-0">Manage all categories in the system</p>
        </div>
      </div>
      <CategoryManagement />
    </div>
  );
};

export default AdminCategories;
