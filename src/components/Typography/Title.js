import React from "react";

export function PageTitle({ children }) {
  return (
    <h1 className="text-2xl font-semibold my-6 dark:text-gray-200 text-gray-700">
      {children}
    </h1>
  );
}

export function SectionTitle({ children }) {
  return (
    <h2 className="text-lg font-semibold mb-4 dark:text-gray-300 text-gray-600">
      {children}
    </h2>
  );
}
