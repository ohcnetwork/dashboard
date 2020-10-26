import React from "react";

export function Pill({ title, children }) {
  return (
    <div className="flex items-center rounded-lg shadow-xs dark:bg-gray-800 dark:text-gray-200">
      <span className="mx-2 font-medium leading-none text-xxs xl:text-sm">
        {title}
      </span>
      <div className="flex h-full text-sm bg-green-500 rounded-lg xl:text-base">
        {children}
      </div>
    </div>
  );
}
