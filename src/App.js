import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./views/Home";
import Profile from "./views/Profile";
import ExternalApi from "./views/ExternalApi";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import history from "./utils/history";

// styles
import "./App.css";

// fontawesome
import initFontAwesome from "./utils/initFontAwesome";
import Books from "./views/Books";
import BookDetails from "./views/BookDetails";
import BooksByCategory from "./views/BooksByCategory";
import AdminLayout from "./views/AdminLayout";
import AdminDashboard from "./views/AdminDashboard";
import AdminBooks from "./views/AdminBooks";
import AdminCategories from "./views/AdminCategories";
import ProtectedAdmin from "./components/ProtectedAdmin";
import MyWishlists from "./views/MyWishlists";
import WishlistDetails from "./views/WishlistDetails";
initFontAwesome();

const App = () => {
  const { isLoading, error } = useAuth0();

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return ;
  }

  return (
    <Router history={history}>
      <div id="app" className="d-flex flex-column h-100">
        <NavBar />
        <Switch>
          {/* Admin Routes - Full Layout (No Footer) */}
          <Route path="/admin" exact>
            <ProtectedAdmin>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedAdmin>
          </Route>
          <Route path="/admin/books">
            <ProtectedAdmin>
              <AdminLayout>
                <AdminBooks />
              </AdminLayout>
            </ProtectedAdmin>
          </Route>
          <Route path="/admin/categories">
            <ProtectedAdmin>
              <AdminLayout>
                <AdminCategories />
              </AdminLayout>
            </ProtectedAdmin>
          </Route>
          
          {/* Regular Routes - With Container and Footer */}
          <Route path="/" exact>
            <Container className="flex-grow-1 mt-5">
              <Home />
            </Container>
            <Footer />
          </Route>
          <Route path="/profile">
            <Container className="flex-grow-1 mt-5">
              <Profile />
            </Container>
            <Footer />
          </Route>
          <Route path="/books/category/:categoryId">
            <Container className="flex-grow-1 mt-5">
              <BooksByCategory />
            </Container>
            <Footer />
          </Route>
          <Route path="/books" exact>
            <Container className="flex-grow-1 mt-5">
              <Books />
            </Container>
            <Footer />
          </Route>
          <Route path="/book/:id">
            <Container className="flex-grow-1 mt-5">
              <BookDetails />
            </Container>
            <Footer />
          </Route>
          <Route path="/external-api">
            <Container className="flex-grow-1 mt-5">
              <ExternalApi />
            </Container>
            <Footer />
          </Route>
          <Route path="/wishlists" exact>
            <Container className="flex-grow-1 mt-5">
              <MyWishlists />
            </Container>
            <Footer />
          </Route>
          <Route path="/wishlist/:wishlistId">
            <Container className="flex-grow-1 mt-5">
              <WishlistDetails />
            </Container>
            <Footer />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
