import React from "react";
import { XOctagon } from "react-feather";
import { useHistory } from "react-router-dom";

function Page404() {
  const history = useHistory();

  return (
    <div className="items-center flex flex-col">
      <XOctagon className="h-12 mt-8 text-green-500 w-12" aria-hidden="true" />
      <h1 className="text-6xl font-semibold dark:text-gray-200 text-gray-700">
        404
      </h1>
      <p className="dark:text-gray-300 text-gray-700">
        Page not found.{" "}
        <button
          type="button"
          className="dark:text-green-400 text-green-500 hover:underline"
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
