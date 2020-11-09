import { Backdrop, Transition } from "@windmill/react-ui";
import React, { useContext } from "react";

import { SidebarContext } from "../../context/SidebarContext";
import SidebarContent from "./SidebarContent";

function Sidebar() {
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);

  return (
    <Transition show={isSidebarOpen}>
      <>
        <Transition
          enter="transition ease-in-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-in-out duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Backdrop onClick={closeSidebar} />
        </Transition>

        <Transition
          enter="transition ease-in-out duration-150"
          enterFrom="opacity-0 transform -translate-x-20"
          enterTo="opacity-100"
          leave="transition ease-in-out duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0 transform -translate-x-20"
        >
          <aside className="dark:bg-gray-800 bg-white flex-shrink-0 inset-y-0 mt-10 overflow-y-auto fixed w-64 z-50">
            <SidebarContent />
          </aside>
        </Transition>
      </>
    </Transition>
  );
}

export default Sidebar;
