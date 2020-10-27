import React, { lazy } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import AccessibleNavigationAnnouncer from "./components/AccessibleNavigationAnnouncer";

const Layout = lazy(() => import("./containers/Layout"));

function PublicRoute({ component: Component, ...rest }) {
  return <Route {...rest} render={(props) => <Component {...props} />} />;
}

function App() {
  return (
    <>
      <Router>
        <AccessibleNavigationAnnouncer />
        <Switch>
          <PublicRoute path="/app" component={Layout} />
          <Redirect exact from="/" to="/app" />
        </Switch>
      </Router>
    </>
  );
}

export default App;
