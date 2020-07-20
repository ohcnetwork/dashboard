import React from "react";
import { XOctagon } from "react-feather";
import { useHistory } from "react-router-dom";

function Page404() {
  let history = useHistory();

  return (
    <div className="flex flex-col items-center">
      <XOctagon className="w-12 h-12 mt-8 text-purple-700" aria-hidden="true" />
      <h1 className="text-6xl font-semibold text-gray-700 dark:text-gray-200">
        404
      </h1>
      <p className="text-gray-700 dark:text-gray-300">
        Page not found.{" "}
        <button
          className="text-purple-600 hover:underline dark:text-purple-300"
          onClick={() => history.goBack()}
        >
          Go back
        </button>
        .
      </p>
    </div>
  );
}

export default Page404;
