import React, { useEffect, useState } from "react";
import { navigate } from "hookrouter";
import Moment from "react-moment";
import { getCapacitySummary } from "../utils/api";

export default function DistrictDashboard() {
  const [facilityData, setFacilityData] = useState([]);
  const [moreAvailable, setMoreAvailable] = useState(true);
  const [showDropDown, setShowDropDown] = useState(false);
  const [filterDistrict, setFilterDistrict] = useState({
    id: 7,
    name: "Ernakulam",
  });
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 3);

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

  const roomTypes = {
    1: "General Bed",
    2: "Hostel",
    3: "Single Room with Attached Bathroom",
    10: "ICU",
    20: "Ventilator",
  };
  useEffect(() => {
    getCapacitySummary()
      .then((summary) => {
        const dictionary = summary.results.reduce((acc, {data: facility}) => {
          if(acc[facility.id]){
            setMoreAvailable(false);
            return acc;
          }

          return {
            ...acc,
            [facility.id]: {
              name: facility.name,
              districtId: facility.district,
              district: facility.district_object?.name || "Unknown",
              location: facility.location,
              oxygenCapacity: facility.oxygen_capacity,
              localbody: facility.local_body_object?.name || "Unknown",
              modified: facility.modified_date,
              capacity: facility.availability.reduce((cAcc, cCur) => {
                return {
                  ...cAcc,
                  [cCur.room_type]: cCur,
                };
              }, {}),
              roomModified: facility.availability.reduce((cAcc, cCur) => {
                return {
                  ...cAcc,
                  [cCur.room_type]: cCur,
                };
              }, {}),
            }
          }
        },{})
        setFacilityData(Object.values(dictionary));
      })
      .catch((ex) => {
        console.error("Data Unavailable", ex);
        navigate("/login");
      });
  }, []);

  let filteredFacilities = facilityData.filter(
    (f) => f.districtId === filterDistrict.id
  );

  let totalVentilator = filteredFacilities
    .map((f) => f.capacity[20]?.total_capacity || 0)
    .reduce((a, b) => a + b, 0);
  let totalIcu = filteredFacilities
    .map((f) => f.capacity[10]?.total_capacity || 0)
    .reduce((a, b) => a + b, 0);
  let totalBed = filteredFacilities
    .map((f) => f.capacity[1]?.total_capacity || 0)
    .reduce((a, b) => a + b, 0);
  let totalRoom = filteredFacilities
    .map((f) => f.capacity[3]?.total_capacity || 0)
    .reduce((a, b) => a + b, 0);

  let ventilatorUsed = filteredFacilities
    .map((f) => f.capacity[20]?.current_capacity || 0)
    .reduce((a, b) => a + b, 0);
  let icuUsed = filteredFacilities
    .map((f) => f.capacity[10]?.current_capacity || 0)
    .reduce((a, b) => a + b, 0);
  let bedUsed = filteredFacilities
    .map((f) => f.capacity[1]?.current_capacity || 0)
    .reduce((a, b) => a + b, 0);
  let roomUsed = filteredFacilities
    .map((f) => f.capacity[3]?.current_capacity || 0)
    .reduce((a, b) => a + b, 0);

  return (
    <div id="mapid" className="max-w-7xl mx-auto">
      <div>
        <div className="relative inline-block text-left">
          <div className="m-4">
            <span className="rounded-md shadow-sm">
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
                id="options-menu"
                aria-haspopup="true"
                aria-expanded="true"
                onClick={() => setShowDropDown(!showDropDown)}
              >
                {filterDistrict.name}
                <svg
                  className="-mr-1 ml-2 h-5 w-5"
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
            </span>
          </div>

          {showDropDown && (
            <div className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg transition ease-out duration-100">
              <div className="rounded-md bg-white shadow-xs">
                <div className="py-1">
                  {districts.map((d) => {
                    return (
                      <a
                        key={d.id}
                        onClick={() => {
                          setShowDropDown(!showDropDown);
                          setFilterDistrict(d);
                        }}
                        className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                        role="menuitem"
                      >
                        {d.name}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="bg-gray-50 pt-12 sm:pt-16">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl leading-9 font-extrabold text-gray-900 sm:text-4xl sm:leading-10">
                {filterDistrict.name} District Dashboard
              </h2>
              <p className="mt-3 text-xl leading-7 text-gray-500 sm:mt-4">
                Capacity Management Dashboard
              </p>
            </div>
          </div>
          <div className="mt-10 pb-12 bg-white sm:pb-16">
            <div>
              <div className=" max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto pt-4">
                  <dl className="rounded-lg bg-white shadow-lg mt-6">
                    <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r sm:border-t">
                      <dt
                        className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500"
                        id="item-1"
                      >
                        Hospitals
                      </dt>
                      <dd
                        className="order-1 text-5xl leading-none font-extrabold text-indigo-600"
                        aria-describedby="item-1"
                      >
                        {filteredFacilities.length}
                      </dd>
                    </div>

                    <div className="sm:grid sm:grid-cols-2 ">
                      <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r sm:border-t">
                        <dt
                          className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500"
                          id="item-1"
                        >
                          Ventilators
                        </dt>
                        <dd
                          className="order-1 text-5xl leading-none font-extrabold text-indigo-600"
                          aria-describedby="item-1"
                        >
                          {Math.round((ventilatorUsed / totalVentilator) * 100)}
                          %
                        </dd>
                      </div>
                      <div className="flex flex-col border-t border-b border-gray-100 p-6 text-center sm:border-0 sm:border-l sm:border-r sm:border-t">
                        <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                          ICU
                        </dt>
                        <dd className="order-1 text-5xl leading-none font-extrabold text-indigo-600">
                          {Math.round((icuUsed / totalIcu) * 100)}%
                        </dd>
                      </div>
                      <div className="flex flex-col border-t border-b border-gray-100 p-6 text-center sm:border-0 sm:border-l sm:border-r sm:border-t">
                        <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                          Beds
                        </dt>
                        <dd className="order-1 text-5xl leading-none font-extrabold text-indigo-600">
                          {Math.round((bedUsed / totalBed) * 100)}%
                        </dd>
                      </div>
                      <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l sm:border-t">
                        <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                          Room
                        </dt>
                        <dd className="order-1 text-5xl leading-none font-extrabold text-indigo-600">
                          {Math.round((roomUsed / totalRoom) * 100)}%
                        </dd>
                      </div>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 font-bold text-3xl mx-2">Capacity</div>
        <div className="flex flex-col md:flex-row justify-between mt-4">
          <div className="w-full md:w-1/4 mt-4">
            <div className="bg-white overflow-hidden shadow rounded-lg mx-2">
              <div className="px-4 py-5 sm:p-6 text-4xl font-semibold text-center">
                {totalVentilator}
              </div>
              <span className="px-4 py-1 bg-green-400 rounded-r text-white shadow">
                Total
              </span>
              <div className="bg-gray-50 px-4 py-4 sm:px-6 text-center -mt-3">
                Number of Ventilators
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg mx-2 mt-4">
              <div className="px-4 py-5 sm:p-6   text-4xl font-semibold text-center">
                {ventilatorUsed}
              </div>
              <span className="px-4 py-1 bg-blue-400 rounded-r text-white shadow">
                Used
              </span>
              <div className="bg-gray-50 px-4 py-4 sm:px-6 text-center -mt-3">
                Number of Ventilators
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/4 mt-4">
            <div className="bg-white overflow-hidden shadow rounded-lg mx-2">
              <div className="px-4 py-5 sm:p-6   text-4xl font-semibold text-center">
                {totalIcu}
              </div>
              <span className="px-4 py-1 bg-green-400 rounded-r text-white shadow">
                Total
              </span>
              <div className="bg-gray-50 px-4 py-4 sm:px-6 text-center -mt-3">
                Number of ICU's
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg mx-2 mt-4">
              <div className="px-4 py-5 sm:p-6   text-4xl font-semibold text-center">
                {icuUsed}
              </div>
              <span className="px-4 py-1 bg-blue-400 rounded-r text-white shadow">
                Used
              </span>
              <div className="bg-gray-50 px-4 py-4 sm:px-6 text-center -mt-3">
                Number of Ventilators
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/4 mt-4">
            <div className="bg-white overflow-hidden shadow rounded-lg mx-2">
              <div className="px-4 py-5 sm:p-6   text-4xl font-semibold text-center">
                {totalRoom}
              </div>
              <span className="px-4 py-1 bg-green-400 rounded-r text-white shadow">
                Total
              </span>
              <div className="bg-gray-50 px-4 py-4 sm:px-6 text-center -mt-3">
                Number of Rooms
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg mx-2 mt-4">
              <div className="px-4 py-5 sm:p-6   text-4xl font-semibold text-center">
                {roomUsed}
              </div>
              <span className="px-4 py-1 bg-blue-400 rounded-r text-white shadow">
                Used
              </span>
              <div className="bg-gray-50 px-4 py-4 sm:px-6 text-center -mt-3">
                Number of Rooms
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/4 mt-4">
            <div className="bg-white overflow-hidden shadow rounded-lg mx-2">
              <div className="px-4 py-5 sm:p-6   text-4xl font-semibold text-center">
                {totalBed}
              </div>
              <span className="px-4 py-1 bg-green-400 rounded-r text-white shadow">
                Total
              </span>
              <div className="bg-gray-50 px-4 py-4 sm:px-6 text-center -mt-3">
                Number of Beds
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg mx-2 mt-4">
              <div className="px-4 py-5 sm:p-6   text-4xl font-semibold text-center">
                {bedUsed}
              </div>
              <span className="px-4 py-1 bg-blue-400 rounded-r text-white shadow">
                Used
              </span>
              <div className="bg-gray-50 px-4 py-4 sm:px-6 text-center -mt-3">
                Number of Beds
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
