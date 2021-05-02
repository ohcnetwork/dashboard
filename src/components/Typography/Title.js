import React from "react";

export function PageTitle({ children }) {
  return (
    <h1 className="my-6 dark:text-gray-200 text-gray-700 text-2xl font-semibold">
      {children}
    </h1>
  );
}

export function SectionTitle({ children }) {
  return (
    <h2 className="mb-4 dark:text-gray-300 text-gray-600 text-lg font-semibold">
      {children}
    </h2>
  );
}
