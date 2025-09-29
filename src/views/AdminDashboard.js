import React from "react";
import { Card, CardBody, CardHeader, CardTitle, Row, Col, Button } from "reactstrap";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const dashboardStats = [
    {
      title: "Total Books",
      value: "0",
      icon: "fas fa-book",
      color: "primary",
      link: "/admin/books"
    }
  ];


  return (
    <div className="admin-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Admin Dashboard</h1>
        <div className="text-muted">
          <i className="fas fa-calendar-alt me-2"></i>
          {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Welcome Message */}
      <Card className="mb-4">
        <CardBody>
          <div className="d-flex align-items-center">
            <div className="flex-shrink-0">
              <i className="fas fa-tachometer-alt fa-2x text-primary"></i>
            </div>
            <div className="flex-grow-1 ms-3">
              <h4 className="mb-1">Welcome to the Admin Panel</h4>
              <p className="text-muted mb-0">
                Manage your book rating system efficiently. Use the sidebar to navigate to different sections.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={12}>
          <h5 className="mb-3">System Overview</h5>
        </Col>
        {dashboardStats.map((stat, index) => (
          <Col key={index} md={6} lg={4} xl={3} className="mb-3">
            <Card className={`border-left-${stat.color} h-100`}>
              <CardBody className="text-center">
                <div className={`text-${stat.color} mb-2`}>
                  <i className={`${stat.icon} fa-2x`}></i>
                </div>
                <h3 className="mb-1">{stat.value}</h3>
                <p className="text-muted mb-2">{stat.title}</p>
                <Button 
                  color={stat.color} 
                  size="sm" 
                  tag={Link} 
                  to={stat.link}
                  className="w-100"
                >
                  Manage
                </Button>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>


      {/* Recent Activity Placeholder */}
      <Row className="mt-4">
        <Col md={12}>
          <Card>
            <CardHeader>
              <CardTitle className="mb-0">
                <i className="fas fa-clock me-2"></i>
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="text-center text-muted py-4">
                <i className="fas fa-chart-line fa-3x mb-3"></i>
                <p>Activity tracking will be implemented here</p>
                <small>This will show recent admin actions and system events</small>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <style jsx>{`
        .border-left-primary {
          border-left: 4px solid #007bff !important;
        }
        .border-left-success {
          border-left: 4px solid #28a745 !important;
        }
        .border-left-info {
          border-left: 4px solid #17a2b8 !important;
        }
        .border-left-warning {
          border-left: 4px solid #ffc107 !important;
        }
        .border-left-secondary {
          border-left: 4px solid #6c757d !important;
        }
        .border-left-danger {
          border-left: 4px solid #dc3545 !important;
        }
        .hover-card {
          transition: transform 0.2s ease-in-out;
        }
        .hover-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
