import React from "react";

function ThemedSuspense({ className }) {
  return (
    <div className={`flex justify-center p-6 overflow-hidden ${className}`}>
      <div className="flex self-center lds-ripple">
        <div />
        <div />
      </div>
    </div>
  );
}

export default ThemedSuspense;
