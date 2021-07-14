import React from "react";

const Main = ({ children }) => {
  return (
    <main className="h-full overflow-y-auto">
      <div className="container grid mx-auto px-6">{children}</div>
    </main>
  );
};

export default Main;
