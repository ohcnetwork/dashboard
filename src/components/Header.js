import { WindmillContext } from "@saanuregh/react-ui";
import React, { useContext } from "react";
import { Menu, Moon, Sun } from "react-feather";
import { useHistory } from "react-router-dom";

import { SidebarContext } from "../context/SidebarContext";

function Header() {
  const { mode, toggleMode } = useContext(WindmillContext);
  const { toggleSidebar } = useContext(SidebarContext);
  const history = useHistory();

  return (
    <header className="dark:bg-gray-800 bg-white shadow-md h-12 overflow-hidden py-2 z-40">
      <div className="flex justify-between px-2 dark:text-green-400 text-green-500">
        <div className="flex flex-shrink-0 justify-between">
          <button
            type="button"
            className="focus:shadow-outline-green rounded-md mr-2 focus:outline-none p-1 md:mr-6"
            onClick={toggleSidebar}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Care Dashboard"
            className="hidden mr-1 md:block"
            onClick={() => {
              history.push("/");
            }}
          >
            <span className="flex text-2xl subpixel-antialiased font-black leading-none">
              Care Dashboard
            </span>
          </button>
        </div>
        <div className="flex flex-shrink-0 justify-between space-x-6">
          <button
            type="button"
            className="focus:shadow-outline-green rounded-md focus:outline-none p-1"
            onClick={toggleMode}
            aria-label="Toggle color mode"
          >
            {mode === "dark" ? (
              <Sun className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Moon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
