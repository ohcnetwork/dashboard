import React, { useEffect, useState } from "react";
import { navigate } from "hookrouter";
import Moment from "react-moment";
import { getCapacitySummary } from "../utils/api";

export default function Hospitals() {
  const [facilityData, setFacilityData] = useState([]);
  const [filterDistrict, setFilterDistrict] = useState();
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 3);

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
            };
          })
        );
      })
      .catch((ex) => {
        console.error("Data Unavailable", ex);
        navigate("/login");
      });
  }, []);

  return (
    <div id="mapid" className="max-w-7xl mx-auto">
      <div>
        <div class="flex flex-col">
          <div class="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div class="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
              <table class="min-w-full">
                <thead>
                  <tr>
                    <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Ventilator
                    </th>
                    <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      ICU
                    </th>
                    <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      General Bed
                    </th>
                    <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Single Room with Attached Bathroom
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {console.log(facilityData)}
                  {facilityData.map((facility, index) => {
                    if (
                      filterDistrict &&
                      facility.districtId !== filterDistrict.id
                    ) {
                      console.log(filterDistrict.id + "");
                      return React.null;
                    }

                    // districtId: 1
                    // district: "Thiruvananthapuram"
                    // location: {latitude: 8.5156194, longitude: 76.9355771}
                    // oxygenCapacity: 4000
                    // localbody: "Unknown"
                    // modified: "2020-05-12T15:43:01.859315+05:30"
                    // capacity:
                    // 1:
                    // id: "81b8586d-1a45-4c17-8ea4-70ba6c45bb3b"
                    // room_type_text: "General Bed"
                    // modified_date: "2020-05-12T15:43:02.316165+05:30"
                    // room_type: 1
                    // total_capacity: 360
                    // current_capacity: 260

                    return (
                      <tr class="bg-white ">
                        <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                          {facility.name}
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                          {facility.capacity[20]?.current_capacity || 0}/
                          {facility.capacity[20]?.total_capacity || 0}
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                          {facility.capacity[10]?.current_capacity || 0}/
                          {facility.capacity[10]?.total_capacity || 0}
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                          {facility.capacity[1]?.current_capacity || 0}/
                          {facility.capacity[1]?.total_capacity || 0}
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                          {facility.capacity[3]?.current_capacity || 0}/
                          {facility.capacity[3]?.total_capacity || 0}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
