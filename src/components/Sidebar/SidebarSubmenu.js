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
          className="absolute inset-y-0 left-0 w-1 bg-green-500 rounded-br-lg rounded-tr-lg"
          aria-hidden="true"
        />
      </Route>
      <button
        type="button"
        className="dark:hover:text-gray-200 inline-flex items-center justify-between w-full hover:text-gray-800 text-sm font-semibold transition-colors duration-150"
        onClick={handleDropdownMenuClick}
        aria-haspopup="true"
      >
        <span className="inline-flex items-center">
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
          className="mt-2 p-2 dark:text-gray-400 text-gray-500 text-sm font-medium bg-gray-50 dark:bg-gray-900 rounded-md shadow-inner overflow-hidden space-y-2"
          aria-label="submenu"
        >
          {route.routes.map((r) => (
            <li
              className="dark:hover:text-gray-200 px-2 py-1 hover:text-gray-800 transition-colors duration-150"
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
