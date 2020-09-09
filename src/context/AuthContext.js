import React, { useMemo, useState } from "react";
import Store from "store";

const ACCESS_TOKEN = "care_access_token";
const REFRESH_TOKEN = "care_refresh_token";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  let token = Store.get(ACCESS_TOKEN);
  let refresh = Store.get(REFRESH_TOKEN);
  let logged = token && refresh ? true : false;
  let userData = {};

  const [auth, setAuth] = useState({ logged, token, refresh, userData });

  function login(token, refresh, userData) {
    Store.set(ACCESS_TOKEN, token);
    Store.set(REFRESH_TOKEN, refresh);
    setAuth({ logged: true, token, refresh, userData });
  }

  function logout() {
    Store.remove(ACCESS_TOKEN);
    Store.remove(REFRESH_TOKEN);
    setAuth({ logged: false });
  }

  const value = useMemo(
    () => ({
      auth,
      login,
      logout,
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
