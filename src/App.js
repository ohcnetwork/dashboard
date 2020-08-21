import React, { lazy, useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import AccessibleNavigationAnnouncer from "./components/AccessibleNavigationAnnouncer";
import ThemedSuspense from "./components/ThemedSuspense";
import { AuthContext } from "./context/AuthContext";
import { careGetCurrentUser, careRefreshToken } from "./utils/api";
const Layout = lazy(() => import("./containers/Layout"));
const Login = lazy(() => import("./pages/Login"));

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { auth } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={(props) =>
        auth.logged ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
};

const PublicRoute = ({ component: Component, ...rest }) => {
  const { auth } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={(props) =>
        !auth.logged ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        )
      }
    />
  );
};

function App() {
  const [ready, setReady] = useState(false);
  const { auth, logout, login } = useContext(AuthContext);

  useEffect(() => {
    if (!ready) {
      if (auth.logged) {
        careRefreshToken(auth.token, auth.refresh)
          .then((lresp) => {
            careGetCurrentUser(lresp.access)
              .then((uresp) => {
                login(lresp.access, lresp.refresh, uresp);
                setReady(true);
              })
              .catch((e) => {
                throw e;
              });
          })
          .catch((ex) => {
            logout();
            setReady(true);
          });
      } else {
        setReady(true);
      }
    }
  }, []);

  return (
    <>
      {!ready ? (
        <ThemedSuspense className="min-h-screen my-auto dark:bg-gray-900" />
      ) : (
        <Router>
          <AccessibleNavigationAnnouncer />
          <Switch>
            <PublicRoute path="/login" component={Login} />
            <PrivateRoute path="/app" component={Layout} />
            <Redirect exact from="/" to="/app" />
          </Switch>
        </Router>
      )}
    </>
  );
}

export default App;
