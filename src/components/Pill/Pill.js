import React from "react";

export function Pill({ title, children }) {
  return (
    <div className="flex items-center rounded-lg shadow-xs dark:bg-gray-800 dark:text-gray-200">
      <span className="mx-2 text-sm font-medium leading-none">{title}</span>
      <div className="flex h-full bg-purple-600 rounded-lg">{children}</div>
    </div>
  );
}
