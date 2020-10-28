import { Transition } from "@saanuregh/react-ui";
import React, { useState } from "react";
import { ChevronDown } from "react-feather";
import { NavLink, Route } from "react-router-dom";

function SidebarSubmenu({ route }) {
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);

  function handleDropdownMenuClick() {
    setIsDropdownMenuOpen(!isDropdownMenuOpen);
  }

  return (
    <li className="px-6 py-3 relative" key={route.name}>
      <Route path={route.path} exact={route.exact}>
        <span
          className="bg-green-500 rounded-br-lg rounded-tr-lg inset-y-0 left-0 absolute w-1"
          aria-hidden="true"
        />
      </Route>
      <button
        type="button"
        className="dark:hover:text-gray-200 items-center inline-flex text-sm font-semibold justify-between hover:text-gray-800 duration-150 transition-colors w-full"
        onClick={handleDropdownMenuClick}
        aria-haspopup="true"
      >
        <span className="items-center inline-flex">
          <span className="ml-4">{route.name}</span>
        </span>
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
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
          className="bg-gray-50 dark:bg-gray-900 rounded-md shadow-inner text-sm font-medium mt-2 overflow-hidden p-2 space-y-2 dark:text-gray-400 text-gray-500"
          aria-label="submenu"
        >
          {route.routes.map((r) => (
            <li
              className="dark:hover:text-gray-200 px-2 py-1 hover:text-gray-800 duration-150 transition-colors"
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
