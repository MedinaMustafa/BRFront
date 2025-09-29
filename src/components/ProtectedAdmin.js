import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Alert, Button } from "reactstrap";

const ProtectedAdmin = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  console.log("ProtectedAdmin - Auth Status:", {
    isAuthenticated,
    isLoading,
    user: user ? {
      name: user.name,
      email: user.email,
      roles: user['https://lab1.com/roles']
    } : null
  });

  if (isLoading) {
    return <Container className="mt-5"><p>Loading...</p></Container>;
  }

  if (!isAuthenticated) {
    return (
      <Container className="mt-5">
        <Alert color="danger">
          <h4>Access Denied</h4>
          <p>You must be logged in to access the admin panel.</p>
        </Alert>
      </Container>
    );
  }

  // Check if user has admin role
  const isAdmin = user && user['https://lab1.com/roles'] && 
    user['https://lab1.com/roles'].includes('Admin');

  console.log("Admin check:", {
    hasUser: !!user,
    hasRoles: !!user?.['https://lab1.com/roles'],
    roles: user?.['https://lab1.com/roles'],
    isAdmin
  });

  if (!isAdmin) {
    return (
      <Container className="mt-5">
        <Alert color="warning">
          <h4>Access Denied</h4>
          <p>You must be an administrator to access this section.</p>
        </Alert>
      </Container>
    );
  }

  return children;
};

export default ProtectedAdmin;
