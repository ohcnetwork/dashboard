import React, { useMemo, useState } from "react";
import Cookies from "js-cookie";

const ACCESS_TOKEN = "care_access_token";
const REFRESH_TOKEN = "care_refresh_token";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  let token = Cookies.get(ACCESS_TOKEN);
  let refresh = Cookies.get(REFRESH_TOKEN);
  let logged = token && refresh ? true : false;
  let userData = {};

  const [auth, setAuth] = useState({ logged, token, refresh, userData });

  function login(token, refresh, userData) {
    Cookies.set(ACCESS_TOKEN, token);
    Cookies.set(REFRESH_TOKEN, refresh);
    setAuth({ logged: true, token, refresh, userData });
  }

  function logout() {
    Cookies.remove(ACCESS_TOKEN);
    Cookies.remove(REFRESH_TOKEN);
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
