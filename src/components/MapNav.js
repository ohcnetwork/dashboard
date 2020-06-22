import React, { useState } from "react";
import {A} from "hookrouter";
const img = require("../logo.svg");

export default function MapNav({
  selected,
  setSelectedCB,
  selectedDistrict,
  setSelectedDistrict,
}) {
  const [showNav, setShowNav] = useState(false);
  const [showHospitalMenu, setShowHospitalMenu] = useState(false);
  const [showDistrictMenu, setShowDistrictMenu] = useState(false);
  const roomTypes = {
    1: "General Bed",
    2: "Hostel",
    3: "Single Room with Attached Bathroom",
    10: "ICU",
    20: "Ventilator",
  };

  const districts = [
    { id: 1, name: "Thiruvananthapuram" },
    { id: 2, name: "Kollam" },
    { id: 3, name: "Pathanamthitta" },
    { id: 4, name: "Alappuzha" },
    { id: 5, name: "Kottayam" },
    { id: 6, name: "Idukki" },
    { id: 7, name: "Ernakulam" },
    { id: 8, name: "Thrissur" },
    { id: 9, name: "Palakkad" },
    { id: 10, name: "Malappuram" },
    { id: 11, name: "Kozhikode" },
    { id: 12, name: "Wayanad" },
    { id: 13, name: "Kannur" },
    { id: 14, name: "Kasaragod" },
  ];
  return (
    <div>
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
            <div className="lg:w-0 lg:flex-1">
              <A href="/" className="flex">
                <img className="h-8 w-auto sm:h-10" src={img} alt="Workflow" />
              </A>
            </div>
            <div className="-mr-2 -my-2 md:hidden">
              <span
                onClick={(_) => setShowNav((showNav) => !showNav)}
                type="button"
                className="cursor-pointer inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
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
              </span>
            </div>
            <nav className="hidden md:flex space-x-10">
              <div className="relative">
                {/* <!-- Item active: "text-gray-900", Item inactive: "text-gray-500" --> */}
                <span
                  onClick={(_) =>
                    setShowHospitalMenu((menuState) => !menuState)
                  }
                  className="cursor-pointer text-gray-500 group inline-flex items-center space-x-2 text-base leading-6 font-medium hover:text-gray-900 focus:outline-none focus:text-gray-900 transition ease-in-out duration-150"
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
                </span>
                {showHospitalMenu && (
                  <div className="absolute -ml-4 mt-3 transform px-2 w-screen max-w-md sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2">
                    <div className="rounded-lg shadow-lg">
                      <div className="rounded-lg shadow-xs overflow-hidden">
                        <div className="z-20 relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                          {Object.entries(roomTypes).map(([id, name]) => (
                            <span
                              key={id}
                              onClick={(_) => {
                                setShowHospitalMenu(
                                  (showHospitalMenu) => !showHospitalMenu
                                );
                                setSelectedCB(id, name);
                              }}
                              className={
                                (selected.id === id ? "bg-gray-300" : "") +
                                " cursor-pointer -m-3 p-3 flex items-start space-x-4 rounded-lg hover:bg-gray-100 transition ease-in-out duration-150"
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
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </nav>

            <nav className="hidden md:flex space-x-10">
              <div className="relative">
                {/* <!-- Item active: "text-gray-900", Item inactive: "text-gray-500" --> */}
                <span
                  type="button"
                  onClick={(_) =>
                    setShowDistrictMenu((menuState) => !menuState)
                  }
                  className="cursor-pointer text-gray-500 group inline-flex items-center space-x-2 text-base leading-6 font-medium hover:text-gray-900 focus:outline-none focus:text-gray-900 transition ease-in-out duration-150"
                >
                  <span>District</span>
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
                </span>
                {showDistrictMenu && (
                  <div className="absolute -ml-4 mt-3 transform px-2 w-screen max-w-md sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2">
                    <div className="rounded-lg shadow-lg">
                      <div className="rounded-lg shadow-xs overflow-hidden">
                        <div className="z-20 relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                          {districts.map(({ id, name }) => (
                            <span
                              key={id}
                              onClick={(_) => {
                                setShowDistrictMenu((menuState) => !menuState);
                                setSelectedDistrict({ id, name });
                              }}
                              className={
                                (selected.id === id ? "bg-gray-300" : "") +
                                " cursor-pointer -m-3 p-3 flex items-start space-x-4 rounded-lg hover:bg-gray-100 transition ease-in-out duration-150"
                              }
                            >
                              <svg
                                className="flex-shrink-0 h-6 w-6 text-indigo-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
                              </svg>
                              <div className="space-y-1">
                                <p className="text-base leading-6 font-medium text-gray-900">
                                  {name}
                                </p>
                              </div>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </nav>
            <div className="hidden md:flex items-center justify-end space-x-8 md:flex-1 lg:w-0">
              <span className="inline-flex rounded-md shadow-sm">
                <button
                  href="#"
                  className="whitespace-no-wrap inline-flex items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
                >
                  Sign Out
                </button>
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
                      <img className="h-8 w-auto" src={img} alt="Coronasafe" />
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
                    <span className="text-xl py-2 font-bold">Type</span>
                    <nav className="grid row-gap-8 mb-4">
                      {Object.entries(roomTypes).map(([id, name]) => (
                        <span
                          key={id}
                          onClick={(_) => {
                            setShowNav((showNav) => !showNav);
                            setSelectedCB(id, name);
                          }}
                          className="cursor-pointer -m-3 p-3 flex items-center space-x-3 rounded-md hover:bg-gray-100 transition ease-in-out duration-150"
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
                        </span>
                      ))}
                    </nav>
                    <span className="text-xl p-2 font-bold mt-4">District</span>
                    <nav className="grid row-gap-8 mt-4">
                      {districts.map(({ id, name }) => (
                        <button
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
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>

                <div className="py-6 px-5 space-y-6">
                  <div className="grid grid-cols-2 row-gap-4 col-gap-8"></div>
                  <div className="space-y-6">
                    <span className="w-full flex rounded-md shadow-sm">
                      <button
                        href="#"
                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
                      >
                        Sign Out
                      </button>
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
