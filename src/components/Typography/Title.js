import React from "react";

export function PageTitle({ children }) {
  return (
    <h1 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
      {children}
    </h1>
  );
}

export function SectionTitle({ children }) {
  return (
    <h2 className="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
      {children}
    </h2>
  );
}
