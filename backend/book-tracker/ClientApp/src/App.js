import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./views/Home";
import Profile from "./views/Profile";
import ExternalApi from "./views/ExternalApi";
import Library from "./views/Library";
import Books from "./views/Books";
import Book from "./views/Book";
import NewBook from "./views/NewBook";
import EditBook from "./views/EditBook";
import NewCollection from "./views/NewCollection";
import EditCollection from "./views/EditCollection";
import { useAuth0 } from "@auth0/auth0-react";
import history from "./utils/history";

// styles
import "./App.css";
import 'react-virtualized/styles.css'; // only needs to be imported once

// fontawesome
import initFontAwesome from "./utils/initFontAwesome";
initFontAwesome();

const App = () => {
  const { isLoading, error } = useAuth0();

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Router history={history}>
      <div id="app" className="d-flex flex-column h-100">
        <NavBar />
        <Container className="flex-grow-1 mt-5">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/profile" component={Profile} />
            <Route path="/library" component={Library} />
            <Route path="/books" component={Books} />
            <Route path="/book/new" component={NewBook} />
            <Route path="/book/:id/edit" component={EditBook} />
            <Route path="/book/:id" component={Book} />
            <Route path="/collection/new" component={NewCollection} />
            <Route path="/collection/:id/edit" component={EditCollection} />
          </Switch>
        </Container>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
