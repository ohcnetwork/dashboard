import React from "react";
import { usePath, useRoutes } from "hookrouter";
import Navbar from "./components/Navbar.js";
import ReactMap from "./components/ReactMap.js";
import Login from "./components/Login";
import DistrictDashboard from "./components/DistrictDashboard";
import Hospitals from "./components/Hospitals";

const routes = {
  "/": () => <DistrictDashboard />,
  "/map": () => <ReactMap />,
  "/login": () => <Login />,
  "/hospitals": () => <Hospitals />,
};

function App() {
  const pages = useRoutes(routes);
  return (
    <div>
      {usePath() != "/map" ? (
        <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-gray-100">
          <Navbar />
          <main
            className="flex-1 overflow-y-auto pt-2 pb-6 focus:outline-none md:py-6"
            tabIndex="0"
          >
            <div className="flex-col">{pages}</div>
          </main>
        </div>
      ) : (
        <div className="h-screen flex-col bg-gray-200">{pages}</div>
      )}
    </div>
  );
}

export default App;
