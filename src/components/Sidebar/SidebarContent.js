import React from "react";
import { NavLink, Route } from "react-router-dom";

import { ReactComponent as CoronaSafeLogo } from "../../assets/icons/coronaSafeLogo.svg";
import routes from "../../routes/sidebar";
import SidebarSubmenu from "./SidebarSubmenu";

function SidebarContent() {
  return (
    <div className="flex flex-col justify-between py-4 min-h-full dark:text-gray-400 text-gray-500">
      <ul className="mt-2">
        {routes.map((route) =>
          route.routes ? (
            <SidebarSubmenu route={route} key={route.name} />
          ) : (
            <li className="relative px-6 py-3" key={route.name}>
              {route.href ? (
                <a
                  href={route.href}
                  className="dark:hover:text-gray-200 inline-flex items-center w-full hover:text-gray-800 text-sm font-semibold transition-colors duration-150"
                >
                  <span className="ml-4">{route.name}</span>
                </a>
              ) : (
                <NavLink
                  exact
                  to={route.path}
                  className="dark:hover:text-gray-200 inline-flex items-center w-full hover:text-gray-800 text-sm font-semibold transition-colors duration-150"
                  activeClassName="text-gray-800 dark:text-gray-100"
                >
                  <Route path={route.path} exact={route.exact}>
                    <span
                      className="absolute inset-y-0 left-0 w-1 bg-primary-500 rounded-br-lg rounded-tr-lg"
                      aria-hidden="true"
                    />
                  </Route>
                  <span className="ml-4">{route.name}</span>
                </NavLink>
              )}
            </li>
          )
        )}
      </ul>
      <ul className="px-6 space-y-1">
        <ul className="flex text-sm space-x-2">
          <li>
            <a href="https://github.com/tncwr/dashboard">Github</a>
          </li>
          <li>
            <a href="https://github.com/tncwr/dashboard/issues">Issues</a>
          </li>
          <li>
            <a href="https://github.com/tncwr">GitHub</a>
          </li>
          <li>
            <a href="mailto:info@coronasafe.network">Contact</a>
          </li>
        </ul>
        <li className="flex flex-col">
          <a
            href="https://github.com/tncwr/"
            className="inline-flex text-xs space-x-1"
          >
            <span>Copyright © 2021</span>
            <CoronaSafeLogo className="h-4" aria-hidden="true" />
          </a>
          <a
            href="https://github.com/tncwr/dashboard/blob/master/LICENSE"
            className="text-xxs"
          >
            Released under the MIT License
          </a>
        </li>
      </ul>
    </div>
  );
}

export default SidebarContent;
