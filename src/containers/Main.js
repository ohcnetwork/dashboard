import React from "react";

function Main({ children }) {
  return (
    <main className="h-full light:bg-gray-50 dark:bg-transparent overflow-y-auto">
      <div className="container grid mx-auto px-6">{children}</div>
    </main>
  );
}

export default Main;
