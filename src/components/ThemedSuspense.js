import React from "react";

function ThemedSuspense() {
  return (
    <div className="flex justify-center w-full h-screen p-6 overflow-hidden dark:bg-gray-900">
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default ThemedSuspense;
