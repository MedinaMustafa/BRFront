import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Navbar, 
  NavbarBrand, 
  Nav, 
  NavItem, 
  NavLink as BootstrapNavLink,
  Button
} from "reactstrap";
import { useAuth0 } from "@auth0/auth0-react";

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth0();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const adminMenuItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: "fas fa-tachometer-alt"
    },
    {
      path: "/admin/books",
      label: "Manage Books",
      icon: "fas fa-book"
    },
    {
      path: "/admin/categories",
      label: "Manage Categories",
      icon: "fas fa-tags"
    },
    {
      path: "/admin/authors",
      label: "Manage Authors",
      icon: "fas fa-user-edit"
    },
    {
      path: "/admin/publishers",
      label: "Manage Publishers",
      icon: "fas fa-building"
    },
    {
      path: "/admin/events",
      label: "Manage Events",
      icon: "fas fa-calendar-alt"
    }
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="admin-layout">
      {/* Top Navigation */}
      <Navbar color="dark" dark expand="md" className="admin-navbar">
        <NavbarBrand href="/admin" className="text-white">
          <i className="fas fa-cog me-2"></i>
          Admin Panel
        </NavbarBrand>
        <Button 
          color="outline-light" 
          size="sm" 
          onClick={toggleSidebar}
          className="d-md-none"
        >
          <i className="fas fa-bars"></i>
        </Button>
        <div className="ms-auto d-flex align-items-center">
        </div>
      </Navbar>

      <div className="admin-body">
        {/* Sidebar */}
        <div 
          className={`admin-sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}
        >
          <div className="sidebar-content">
            <Nav vertical className="admin-nav">
              {adminMenuItems.map((item) => (
                <NavItem key={item.path}>
                  <BootstrapNavLink
                    tag={NavLink}
                    to={item.path}
                    className="admin-nav-link"
                    activeClassName="active"
                    exact={item.path === '/admin'}
                  >
                    <i className={`${item.icon} me-2`}></i>
                    {sidebarOpen && <span>{item.label}</span>}
                  </BootstrapNavLink>
                </NavItem>
              ))}
            </Nav>
          </div>
        </div>

        {/* Main Content */}
        <div className={`admin-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
          {children}
        </div>
      </div>

      <style>{`
        .admin-layout {
          min-height: calc(100vh - 56px);
          background-color: #f8f9fa;
          margin-top: 0;
          padding-top: 0;
        }
        
        .admin-navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-top: 0;
          margin-bottom: 0;
        }
        
        .admin-body {
          display: flex;
          min-height: calc(100vh - 56px);
          margin-top: 0;
          padding-top: 0;
        }
        
        .admin-sidebar {
          background-color: #343a40;
          min-height: calc(100vh - 56px);
          transition: all 0.3s ease;
          position: sticky;
          top: 56px;
          flex-shrink: 0;
        }
        
        .sidebar-open {
          width: 250px;
        }
        
        .sidebar-collapsed {
          width: 60px;
        }
        
        .sidebar-content {
          padding: 1rem 0;
        }
        
        .admin-nav {
          padding: 0;
        }
        
        .admin-nav-link {
          color: #adb5bd !important;
          padding: 0.75rem 1.5rem;
          display: flex;
          align-items: center;
          text-decoration: none;
          transition: all 0.3s ease;
          border-left: 3px solid transparent;
        }
        
        .admin-nav-link:hover {
          color: #fff !important;
          background-color: #495057;
          border-left-color: #007bff;
        }
        
        .admin-nav-link.active {
          color: #fff !important;
          background-color: #007bff;
          border-left-color: #0056b3;
        }
        
        .admin-main-content {
          flex: 1;
          padding: 1rem 1.5rem;
          min-height: calc(100vh - 56px);
          background-color: #f8f9fa;
          transition: all 0.3s ease;
        }
        
        .sidebar-collapsed .admin-nav-link span {
          display: none;
        }
        
        .sidebar-collapsed .admin-nav-link {
          justify-content: center;
        }
        
        @media (max-width: 768px) {
          .admin-sidebar {
            position: fixed;
            top: 56px;
            left: ${sidebarOpen ? '0' : '-100%'};
            width: 250px;
            z-index: 999;
            transition: left 0.3s ease;
          }
          
          .admin-main-content {
            padding: 1rem;
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
