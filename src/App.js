import React, { lazy } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

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
          <PublicRoute path="/" component={Layout} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
