import React, { useState } from "react";
const img = require("../logo.svg");

export default function Navbar({ selected, setSelectedCB }) {
  const [showNav, setShowNav] = useState(false);
  const [showHospitalMenu, setShowHospitalMenu] = useState(false);
  const roomTypes = {
    1: "General Bed",
    2: "Hostel",
    3: "Single Room with Attached Bathroom",
    10: "ICU",
    20: "Ventilator",
  };
  return (
    <div>
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
            <div className="lg:w-0 lg:flex-1">
              <a href="#" className="flex">
                <img className="h-8 w-auto sm:h-10" src={img} alt="Workflow" />
              </a>
            </div>
            <div className="-mr-2 -my-2 md:hidden">
              <button
                onClick={(_) => setShowNav((showNav) => !showNav)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
            <nav className="hidden md:flex space-x-10">
              <div className="relative">
                {/* <!-- Item active: "text-gray-900", Item inactive: "text-gray-500" --> */}
                <button
                  type="button"
                  onClick={(_) =>
                    setShowHospitalMenu((menuState) => !menuState)
                  }
                  className="text-gray-500 group inline-flex items-center space-x-2 text-base leading-6 font-medium hover:text-gray-900 focus:outline-none focus:text-gray-900 transition ease-in-out duration-150"
                >
                  <span>Hospitals Beds</span>
                  {/* <!-- Item active: "text-gray-600", Item inactive: "text-gray-400" --> */}
                  <svg
                    className="text-gray-400 h-5 w-5 group-hover:text-gray-500 group-focus:text-gray-500 transition ease-in-out duration-150"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* <!--
            'Solutions' flyout menu, show/hide based on flyout menu state.

            Entering: "transition ease-out duration-200"
              From: "opacity-0 translate-y-1"
              To: "opacity-100 translate-y-0"
            Leaving: "transition ease-in duration-150"
              From: "opacity-100 translate-y-0"
              To: "opacity-0 translate-y-1"
          --> */}
                {showHospitalMenu && (
                  <div className="absolute -ml-4 mt-3 transform px-2 w-screen max-w-md sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2">
                    <div className="rounded-lg shadow-lg">
                      <div className="rounded-lg shadow-xs overflow-hidden">
                        <div className="z-20 relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                          {Object.entries(roomTypes).map(([id, name]) => (
                            <button
                              key={id}
                              onClick={(_) => {
                                setShowHospitalMenu(
                                  (showHospitalMenu) => !showHospitalMenu
                                );
                                setSelectedCB(id, name);
                              }}
                              className={
                                (selected.id === id ? "bg-gray-300" : "") +
                                " -m-3 p-3 flex items-start space-x-4 rounded-lg hover:bg-gray-100 transition ease-in-out duration-150"
                              }
                            >
                              <svg
                                className="flex-shrink-0 h-6 w-6 text-indigo-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                              </svg>
                              <div className="space-y-1">
                                <p className="text-base leading-6 font-medium text-gray-900">
                                  {name}
                                </p>
                                <p className="text-sm leading-5 text-gray-500">
                                  {name} Beds in the state
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* <a
                href="#"
                className="text-base leading-6 font-medium text-gray-500 hover:text-gray-900 focus:outline-none focus:text-gray-900 transition ease-in-out duration-150"
              >
                Pricing
              </a>
              <a
                href="#"
                className="text-base leading-6 font-medium text-gray-500 hover:text-gray-900 focus:outline-none focus:text-gray-900 transition ease-in-out duration-150"
              >
                Docs
              </a> */}
            </nav>
            <div className="hidden md:flex items-center justify-end space-x-8 md:flex-1 lg:w-0">
              <span className="inline-flex rounded-md shadow-sm">
                <a
                  href="#"
                  className="whitespace-no-wrap inline-flex items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
                >
                  Sign Out
                </a>
              </span>
            </div>
          </div>
        </div>

        {/* <!--
    Mobile menu, show/hide based on mobile menu state.

    Entering: "duration-200 ease-out"
      From: "opacity-0 scale-95"
      To: "opacity-100 scale-100"
    Leaving: "duration-100 ease-in"
      From: "opacity-100 scale-100"
      To: "opacity-0 scale-95"
  --> */}
        {showNav && (
          <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
            <div className="rounded-lg shadow-lg">
              <div className="rounded-lg shadow-xs bg-white divide-y-2 divide-gray-50">
                <div className="pt-5 pb-6 px-5 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <img className="h-8 w-auto" src={img} alt="Workflow" />
                    </div>
                    <div className="-mr-2">
                      <button
                        type="button"
                        onClick={(_) => setShowNav((showNav) => !showNav)}
                        className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                      >
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div>
                    <nav className="grid row-gap-8">
                      {Object.entries(roomTypes).map(([id, name]) => (
                        <a
                          key={id}
                          onClick={(_) => {
                            setShowNav((showNav) => !showNav);
                            setSelectedCB(id, name);
                          }}
                          className="-m-3 p-3 flex items-center space-x-3 rounded-md hover:bg-gray-100 transition ease-in-out duration-150"
                        >
                          <svg
                            className="flex-shrink-0 h-6 w-6 text-indigo-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                          <div className="text-base leading-6 font-medium text-gray-900">
                            {name}
                          </div>
                        </a>
                      ))}
                    </nav>
                  </div>
                </div>
                <div className="py-6 px-5 space-y-6">
                  <div className="grid grid-cols-2 row-gap-4 col-gap-8">
                    {/* <a
                    href="#"
                    className="text-base leading-6 font-medium text-gray-900 hover:text-gray-700 transition ease-in-out duration-150"
                  >
                    Pricing
                  </a>
                  <a
                    href="#"
                    className="text-base leading-6 font-medium text-gray-900 hover:text-gray-700 transition ease-in-out duration-150"
                  >
                    Docs
                  </a> */}
                  </div>
                  <div className="space-y-6">
                    <span className="w-full flex rounded-md shadow-sm">
                      <a
                        href="#"
                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
                      >
                        Sign Out
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
