import React, { useContext } from "react";
import { LogOut, Menu, Moon, Sun } from "react-feather";
import { WindmillContext } from "@windmill/react-ui";
import { ReactComponent as CoronaSafeLogo } from "../assets/icons/coronaSafeLogo.svg";
import { AuthContext } from "../context/AuthContext";
import { SidebarContext } from "../context/SidebarContext";
import { useHistory } from "react-router-dom";

function Header() {
  const { auth, logout } = useContext(AuthContext);
  const { mode, toggleMode } = useContext(WindmillContext);
  const { toggleSidebar } = useContext(SidebarContext);
  let history = useHistory();

  return (
    <header className="z-40 h-12 py-2 overflow-hidden bg-white shadow-md dark:bg-gray-800">
      <div className="flex justify-between px-2 text-purple-600 dark:text-purple-300">
        <div className="flex justify-between flex-shrink-0">
          <button
            className="mr-6 rounded-md focus:outline-none focus:shadow-outline-purple"
            onClick={toggleSidebar}
            aria-label="Menu"
          >
            <Menu className="w-6 h-6" aria-hidden="true" />
          </button>
          <button
            aria-label="Care Dashboard"
            className="mr-1"
            onClick={() => {
              history.push("/");
            }}
          >
            <span className="flex text-xl font-black leading-none">
              Care Dashboard
            </span>
          </button>
          <span className="flex self-center mr-1 text-xs leading-none">
            from
          </span>
          <button aria-label="CoronaSafe">
            <CoronaSafeLogo className="w-20 h-6 " aria-hidden="true" />
          </button>
        </div>
        <div className="flex justify-between flex-shrink-0 space-x-6">
          <div className="flex flex-col leading-none text-right">
            <p className="text-sm font-medium">
              {auth.userData.first_name} {auth.userData.last_name}
            </p>
            <p className="text-xs">{auth.userData.username}</p>
          </div>
          <button
            className="rounded-md focus:outline-none focus:shadow-outline-purple"
            onClick={toggleMode}
            aria-label="Toggle color mode"
          >
            {mode === "dark" ? (
              <Sun className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Moon className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
          <button
            className="rounded-md focus:outline-none focus:shadow-outline-purple"
            onClick={() => logout()}
            aria-label="Logout"
          >
            <LogOut className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
