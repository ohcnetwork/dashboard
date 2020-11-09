import React from "react";

export function Pill({ title, children }) {
  return (
    <div className="items-center dark:bg-gray-800 rounded-lg shadow-xs flex h-6 justify-between dark:text-gray-200">
      <span className="text-xxs font-medium leading-none mx-2 xl:text-sm">
        {title}
      </span>
      <div className="bg-green-500 rounded-lg flex text-sm h-full xl:text-base">
        {children}
      </div>
    </div>
  );
}
