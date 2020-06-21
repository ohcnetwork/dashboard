import React, { useEffect, useState } from "react";
import { navigate } from "hookrouter";
import Moment from "react-moment";
import { getCapacitySummary } from "../utils/api";

export default function DistrictDashboard() {
  const [facilityData, setFacilityData] = useState([]);
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
        setFacilityData(
          Object.values(summary).map((facility) => {
            return {
              name: facility.name,
              districtId: facility.district,
              district: facility.district_object?.name || "Unknown",
              location: facility.location,
              oxygenCapacity: facility.oxygen_capacity,
              localbody: facility.local_body_object?.name || "Unknown",
              modified: facility.modified_date,
              facilityType: facility.facility_type,
              capacity: facility.availability.reduce((cAcc, cCur) => {
                return {
                  ...cAcc,
                  [cCur.room_type]: cCur,
                };
              }, {}),
            };
          })
        );
      })
      .catch((ex) => {
        console.error("Data Unavailable", ex);
        navigate("/login");
      });
  }, []);

  let filteredFacilities = facilityData.filter(
    (f) => f.districtId === filterDistrict.id
  );

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

        <div className="mt-4 font-bold text-3xl mx-2">Capacity</div>
        <div className="flex justify-between max-w-5xl mt-4">
          <div class="bg-white overflow-hidden shadow rounded-lg w-1/4 mx-2">
            <div class="px-4 py-5 sm:p-6   text-4xl font-semibold text-center">
              {filteredFacilities
                .map((f) => f.capacity[20]?.total_capacity || 0)
                .reduce((a, b) => a + b, 0)}
            </div>
            <div class="bg-gray-50 px-4 py-4 sm:px-6   text-center">
              Number of Ventilators
            </div>
          </div>
          <div class="bg-white overflow-hidden shadow rounded-lg w-1/4 mx-2">
            <div class="px-4 py-5 sm:p-6   text-4xl font-semibold text-center">
              {filteredFacilities
                .map((f) => f.capacity[10]?.total_capacity || 0)
                .reduce((a, b) => a + b, 0)}
            </div>
            <div class="bg-gray-50 px-4 py-4 sm:px-6   text-center">
              Number of ICU's
            </div>
          </div>
          <div class="bg-white overflow-hidden shadow rounded-lg w-1/4 mx-2">
            <div class="px-4 py-5 sm:p-6   text-4xl font-semibold text-center">
              {filteredFacilities
                .map((f) => f.capacity[1]?.total_capacity || 0)
                .reduce((a, b) => a + b, 0)}
            </div>
            <div class="bg-gray-50 px-4 py-4 sm:px-6   text-center">
              Number of Beds
            </div>
          </div>
          <div class="bg-white overflow-hidden shadow rounded-lg w-1/4 mx-2">
            <div class="px-4 py-5 sm:p-6   text-4xl font-semibold text-center">
              {filteredFacilities
                .map((f) => f.capacity[3]?.total_capacity || 0)
                .reduce((a, b) => a + b, 0)}
            </div>
            <div class="bg-gray-50 px-4 py-4 sm:px-6   text-center">
              Number of Rooms
            </div>
          </div>
        </div>
        <div className="mt-4 font-bold text-3xl mx-2">Occupied</div>
        <div className="flex justify-between max-w-5xl mt-2">
          <div class="bg-white overflow-hidden shadow rounded-lg w-1/4 mx-2">
            <div class="px-4 py-5 sm:p-6   text-4xl font-semibold text-center">
              {filteredFacilities
                .map((f) => f.capacity[20]?.current_capacity || 0)
                .reduce((a, b) => a + b, 0)}
            </div>
            <div class="bg-gray-50 px-4 py-4 sm:px-6   text-center">
              Number of Ventilators
            </div>
          </div>
          <div class="bg-white overflow-hidden shadow rounded-lg w-1/4 mx-2">
            <div class="px-4 py-5 sm:p-6   text-4xl font-semibold text-center">
              {filteredFacilities
                .map((f) => f.capacity[10]?.current_capacity || 0)
                .reduce((a, b) => a + b, 0)}
            </div>
            <div class="bg-gray-50 px-4 py-4 sm:px-6   text-center">
              Number of ICU's
            </div>
          </div>
          <div class="bg-white overflow-hidden shadow rounded-lg w-1/4 mx-2">
            <div class="px-4 py-5 sm:p-6   text-4xl font-semibold text-center">
              {filteredFacilities
                .map((f) => f.capacity[1]?.current_capacity || 0)
                .reduce((a, b) => a + b, 0)}
            </div>
            <div class="bg-gray-50 px-4 py-4 sm:px-6   text-center">
              Number of Beds
            </div>
          </div>
          <div class="bg-white overflow-hidden shadow rounded-lg w-1/4 mx-2">
            <div class="px-4 py-5 sm:p-6   text-4xl font-semibold text-center">
              {filteredFacilities
                .map((f) => f.capacity[3]?.current_capacity || 0)
                .reduce((a, b) => a + b, 0)}
            </div>
            <div class="bg-gray-50 px-4 py-4 sm:px-6   text-center">
              Number of Rooms
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
