import React, { useMemo, useState } from "react";

const ACCESS_TOKEN = "care_access_token";
const REFRESH_TOKEN = "care_refresh_token";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  let token = localStorage.getItem(ACCESS_TOKEN);
  let refresh = localStorage.getItem(REFRESH_TOKEN);
  let logged = token && refresh ? true : false;
  let userData = {};

  const [auth, setAuth] = useState({ logged, token, refresh, userData });

  function login(token, refresh, userData) {
    localStorage.setItem(ACCESS_TOKEN, token);
    localStorage.setItem(REFRESH_TOKEN, refresh);
    setAuth({ logged: true, token, refresh, userData });
  }

  function logout() {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
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
