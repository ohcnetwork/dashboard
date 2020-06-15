import React from "react";
import { useRoutes } from "hookrouter";
import Navbar from "./components/Navbar.js";
import ReactMap from "./components/ReactMap.js";
import Login from "./components/Login";

const routes = {
  "/": () => <ReactMap />,
  "/login": () => <Login />,
};

function App() {
  const pages = useRoutes(routes);
  return (
    <div>
      {/* <Navbar /> */}
      <div className="h-screen flex-col bg-gray-200">{pages}</div>
    </div>
  );
}

export default App;
