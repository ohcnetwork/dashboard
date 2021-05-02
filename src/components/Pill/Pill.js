import React from "react";

export function Pill({ title, children }) {
  return (
    <div className="flex items-center justify-between h-6 dark:text-gray-200 dark:bg-gray-800 rounded-lg shadow-xs">
      <span className="mx-2 text-xxs font-medium leading-none xl:text-sm">
        {title}
      </span>
      <div className="flex h-full text-sm bg-green-500 rounded-lg xl:text-base">
        {children}
      </div>
    </div>
  );
}
