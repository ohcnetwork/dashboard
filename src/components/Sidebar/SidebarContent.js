import React from "react";
import { NavLink, Route } from "react-router-dom";

import routes from "../../routes/sidebar";
import SidebarSubmenu from "./SidebarSubmenu";

function SidebarContent() {
  return (
    <div className="py-4 dark:text-gray-400 text-gray-500">
      <ul className="mt-2">
        {routes.map((route) =>
          route.routes ? (
            <SidebarSubmenu route={route} key={route.name} />
          ) : (
            <li className="px-6 py-3 relative" key={route.name}>
              <NavLink
                exact
                to={route.path}
                className="dark:hover:text-gray-200 items-center inline-flex text-sm font-semibold hover:text-gray-800 duration-150 transition-colors w-full"
                activeClassName="text-gray-800 dark:text-gray-100"
              >
                <Route path={route.path} exact={route.exact}>
                  <span
                    className="bg-green-500 rounded-br-lg rounded-tr-lg inset-y-0 left-0 absolute w-1"
                    aria-hidden="true"
                  />
                </Route>
                <route.icon className="h-5 w-5" aria-hidden="true" />
                <span className="ml-4">{route.name}</span>
              </NavLink>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default SidebarContent;
