import React from "react";
import { useRouter } from "next/router";
import { XOctagon } from "react-feather";

const Page404 = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center">
      <XOctagon
        className="mt-8 w-12 h-12 text-primary-500"
        aria-hidden="true"
      />
      <h1 className="dark:text-gray-200 text-gray-700 text-6xl font-semibold">
        404
      </h1>
      <p className="dark:text-gray-300 text-gray-700">
        Page not found.{" "}
        <button
          type="button"
          className="dark:text-primary-400 text-primary-500 hover:underline"
          onClick={() => router.back()}
        >
          Go back
        </button>
        .
      </p>
    </div>
  );
}

export default Page404;
