import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, CardTitle, Row, Col, Button, Spinner } from "reactstrap";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import bookService from "../services/bookService";
import authorService from "../services/authorService";
import publisherService from "../services/publisherService";
import eventService from "../services/eventService";
import { useCategories } from "../hooks";

const AdminDashboard = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [stats, setStats] = useState({
    books: 0,
    authors: 0,
    publishers: 0,
    categories: 0,
    events: 0
  });
  const [loading, setLoading] = useState(true);
  const { categories } = useCategories();

  useEffect(() => {
    fetchStats();
  }, [categories]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Get access token for admin requests
      const token = await getAccessTokenSilently();
      
      // Fetch all data in parallel
      const [booksData, authorsData, publishersData, eventsData] = await Promise.all([
        bookService.getAllBooks(),
        authorService.getAllAuthors(),
        publisherService.getAllPublishers(),
        eventService.getAllEvents(token).catch(() => []) // Fallback to empty array if events fail
      ]);

      setStats({
        books: booksData.length,
        authors: authorsData.length,
        publishers: publishersData.length,
        categories: categories.length,
        events: eventsData.length
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats = [
    {
      title: "Total Books",
      value: loading ? "..." : stats.books.toString(),
      icon: "fas fa-book",
      color: "primary",
      link: "/admin/books"
    },
    {
      title: "Total Authors",
      value: loading ? "..." : stats.authors.toString(),
      icon: "fas fa-user-edit",
      color: "success",
      link: "/admin/authors"
    },
    {
      title: "Total Publishers",
      value: loading ? "..." : stats.publishers.toString(),
      icon: "fas fa-building",
      color: "info",
      link: "/admin/publishers"
    },
    {
      title: "Total Categories",
      value: loading ? "..." : stats.categories.toString(),
      icon: "fas fa-tags",
      color: "warning",
      link: "/admin/categories"
    },
    {
      title: "Total Events",
      value: loading ? "..." : stats.events.toString(),
      icon: "fas fa-calendar-alt",
      color: "secondary",
      link: "/admin/events"
    }
  ];


  return (
    <div className="admin-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Admin Dashboard</h1>
        <div className="d-flex align-items-center gap-3">
          <Button 
            color="outline-primary" 
            size="sm" 
            onClick={fetchStats}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Refreshing...
              </>
            ) : (
              <>
                <i className="fas fa-sync-alt me-2"></i>
                Refresh Stats
              </>
            )}
          </Button>
          <div className="text-muted">
            <i className="fas fa-calendar-alt me-2"></i>
            {new Date().toLocaleDateString()}
          </div>
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
        {dashboardStats.map((stat, index) => (
          <Col md={6} lg={3} key={index} className="mb-3">
            <Card className="h-100 border-0 shadow-sm">
              <CardBody>
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className={`rounded-circle p-3 bg-${stat.color} text-white`}>
                      <i className={`${stat.icon} fa-lg`}></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <div className="text-muted small">{stat.title}</div>
                    <div className="h4 mb-0 font-weight-bold">{stat.value}</div>
                  </div>
                </div>
                <div className="mt-3">
                  <Button 
                    tag={Link} 
                    to={stat.link} 
                    color={stat.color} 
                    size="sm" 
                    outline
                    className="w-100"
                  >
                    <i className="fas fa-arrow-right me-1"></i>
                    Manage
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick Actions */}
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
