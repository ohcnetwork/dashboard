import { WindmillContext } from "@windmill/react-ui";
import React, { useContext } from "react";
import { Menu, Moon, Sun } from "react-feather";
import { useHistory } from "react-router-dom";

import { SidebarContext } from "../context/SidebarContext";

function Header() {
  const { mode, toggleMode } = useContext(WindmillContext);
  const { toggleSidebar } = useContext(SidebarContext);
  const history = useHistory();

  return (
    <header className="z-40 py-2 h-12 dark:bg-gray-800 bg-white shadow-md overflow-hidden">
      <div className="flex justify-between px-2 dark:text-green-400 text-green-500">
        <div className="flex flex-shrink-0 justify-between">
          <button
            type="button"
            className="focus:shadow-outline-green mr-2 p-1 rounded-md focus:outline-none md:mr-6"
            onClick={toggleSidebar}
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
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
            className="focus:shadow-outline-green p-1 rounded-md focus:outline-none"
            onClick={toggleMode}
            aria-label="Toggle color mode"
          >
            {mode === "dark" ? (
              <Sun className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Moon className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
