import React, { useEffect, useState } from "react";
import { navigate } from "hookrouter";
import Moment from "react-moment";
import { getCapacitySummary } from "../utils/api";

export default function Hospitals() {
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

  return (
    <div id="mapid" className="max-w-7xl mx-auto">
      <div>
        <div className="relative inline-block text-left">
          <div>
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
                      <span
                        key={d.id}
                        onClick={() => {
                          setShowDropDown(!showDropDown);
                          setFilterDistrict(d);
                        }}
                        className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 cursor-pointer"
                        role="menuitem"
                      >
                        {d.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col mt-4">
          <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider text-center">
                      Ventilator
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider text-center">
                      ICU
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider text-center">
                      Bed
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider text-center">
                      Room
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {facilityData.map((facility, index) => {
                    if (
                      filterDistrict &&
                      facility.districtId !== filterDistrict.id
                    ) {
                      return React.null;
                    }

                    return (
                      <tr key={index} className="bg-white ">
                        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                          {facility.name}
                          <div className="flex">
                            <div className="font-semibold textgray-900 mr-4 ">
                              {facility.facilityType}
                            </div>
                            <div>
                              <Moment
                                date={
                                  Object.values(facility.capacity)
                                    .map((a) => Date.parse(a.modified_date))
                                    .sort((a, b) => b - a)[0]
                                }
                                fromNow
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500 text-center">
                          {facility.capacity[20]?.current_capacity || 0}/
                          {facility.capacity[20]?.total_capacity || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500 text-center">
                          {facility.capacity[10]?.current_capacity || 0}/
                          {facility.capacity[10]?.total_capacity || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500 text-center">
                          {facility.capacity[1]?.current_capacity || 0}/
                          {facility.capacity[1]?.total_capacity || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500 text-center">
                          {facility.capacity[3]?.current_capacity || 0}/
                          {facility.capacity[3]?.total_capacity || 0}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            { moreAvailable &&
              <ul class="flex w-full p-4">
                <li class="mx-auto px-3 py-2 bg-gray-200 text-gray-500 rounded-lg">
                    <a class="flex items-center font-bold" href="#more">
                        <span class="mx-1">more</span>
                    </a>
                </li>
              </ul> }
          </div>
        </div>
      </div>
    </div>
  );
}
