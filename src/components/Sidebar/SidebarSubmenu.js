import { Transition } from "@windmill/react-ui";
import React, { useState } from "react";
import { ChevronDown } from "react-feather";
import { NavLink, Route } from "react-router-dom";

function SidebarSubmenu({ route }) {
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);

  function handleDropdownMenuClick() {
    setIsDropdownMenuOpen(!isDropdownMenuOpen);
  }

  return (
    <li className="relative px-6 py-3" key={route.name}>
      <Route path={route.path} exact={route.exact}>
        <span
          className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
          aria-hidden="true"
        ></span>
      </Route>
      <button
        className="inline-flex items-center justify-between w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
        onClick={handleDropdownMenuClick}
        aria-haspopup="true"
      >
        <span className="inline-flex items-center">
          <route.icon className="w-5 h-5" aria-hidden="true" />
          <span className="ml-4">{route.name}</span>
        </span>
        <ChevronDown className="w-4 h-4" aria-hidden="true" />
      </button>
      <Transition
        show={isDropdownMenuOpen}
        enter="transition-all ease-in-out duration-300"
        enterFrom="opacity-25 max-h-0"
        enterTo="opacity-100 max-h-xl"
        leave="transition-all ease-in-out duration-300"
        leaveFrom="opacity-100 max-h-xl"
        leaveTo="opacity-0 max-h-0"
      >
        <ul
          className="p-2 mt-2 space-y-2 overflow-hidden text-sm font-medium text-gray-500 rounded-md shadow-inner bg-gray-50 dark:text-gray-400 dark:bg-gray-900"
          aria-label="submenu"
        >
          {route.routes.map((r) => (
            <li
              className="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
              key={r.name}
            >
              <NavLink
                className="w-full"
                to={r.path}
                activeClassName="text-gray-800 dark:text-gray-100"
              >
                {r.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </Transition>
    </li>
  );
}

export default SidebarSubmenu;
