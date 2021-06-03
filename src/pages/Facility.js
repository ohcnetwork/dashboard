import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router";
import useSWR from "swr";
import { careSummary } from "../utils/api";

import {
  dateString,
  getNDateAfter,
  getNDateBefore,
  processFacilities,
} from "../utils/utils";
import RadialCard from "../components/Chart/RadialCard";
import {
  FACILITY_TYPES,
  PATIENT_TYPES,
  AVAILABILITY_TYPES,
  AVAILABILITY_TYPES_ORDERED,
  AVAILABILITY_TYPES_TOTAL_ORDERED,
} from "../utils/constants";

import { PageTitle } from "../components/Typography/Title";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const initialFacilitiesTrivia = {
  20: { total: 0, used: 0 },
  10: { total: 0, used: 0 },
  150: { total: 0, used: 0 },
  1: { total: 0, used: 0 },
  70: { total: 0, used: 0 },
  50: { total: 0, used: 0 },
  60: { total: 0, used: 0 },
  40: { total: 0, used: 0 },
  100: { total: 0, used: 0 },
  110: { total: 0, used: 0 },
  120: { total: 0, used: 0 },
  30: { total: 0, used: 0 },
  1111: { total: 0, used: 0 },
  2222: { total: 0, used: 0 },
  3333: { total: 0, used: 0 },
  4444: { total: 0, used: 0 },
  actualDischargedPatients: 0,
  actualLivePatients: 0,
  count: 0,
  oxygen: 0,
};

const initialPatientFacilitiesTrivia = {
  count: 0,
  icu: { total: 0, today: 0 },
  oxygen_bed: { total: 0, today: 0 },
  not_admitted: { total: 0, today: 0 },
  home_isolation: { total: 0, today: 0 },
  isolation_room: { total: 0, today: 0 },
  home_quarantine: { total: 0, today: 0 },
  paediatric_ward: { total: 0, today: 0 },
  gynaecology_ward: { total: 0, today: 0 },
  icu_with_invasive_ventilator: { total: 0, today: 0 },
  icu_with_non_invasive_ventilator: { total: 0, today: 0 },
};

function Facility() {
  const params = useParams();
  const facilityId = params.facilityId;
  // const date = Date.parse(query.get("date"));
  const date = new Date();
  const [patientData, setPatientData] = useState({});
  const [facilityData, setFacilityData] = useState({});
  const [patientLoading, setPatientLoading] = useState(true);
  const [facilityLoading, setFacilityLoading] = useState(true);

  const patientsFiltered =
    patientData.results &&
    processFacilities(patientData.results, FACILITY_TYPES);

  const patientFacilitiesTrivia =
    patientsFiltered &&
    patientsFiltered.reduce(
      (a, c) => {
        const key = c.date === dateString(date) ? "current" : "previous";
        a[key].count += 1;
        Object.keys(PATIENT_TYPES).forEach((k) => {
          a[key][k].today += c[`today_patients_${k}`] || 0;
          a[key][k].total += c[`total_patients_${k}`] || 0;
        });
        return a;
      },
      {
        current: JSON.parse(JSON.stringify(initialPatientFacilitiesTrivia)),
        previous: JSON.parse(JSON.stringify(initialPatientFacilitiesTrivia)),
      }
    );

  console.log(patientFacilitiesTrivia);

  const filtered =
    facilityData.results &&
    processFacilities(facilityData.results, FACILITY_TYPES);
  const facilitiesTrivia =
    filtered &&
    filtered.reduce(
      (a, c) => {
        const key = c.date === dateString(date) ? "current" : "previous";
        a[key].count += 1;
        a[key].oxygen += c.oxygenCapacity || 0;
        a[key].actualLivePatients += c.actualLivePatients || 0;
        a[key].actualDischargedPatients += c.actualDischargedPatients || 0;
        Object.keys(AVAILABILITY_TYPES).forEach((k) => {
          a[key][k].used += c.capacity[k]?.current_capacity || 0;
          a[key][k].total += c.capacity[k]?.total_capacity || 0;
        });

        AVAILABILITY_TYPES_TOTAL_ORDERED.forEach((k) => {
          let current_covid = c.capacity[k.covid]?.current_capacity || 0;
          let current_non_covid =
            c.capacity[k.non_covid]?.current_capacity || 0;
          let total_covid = c.capacity[k.covid]?.total_capacity || 0;
          let total_non_covid = c.capacity[k.non_covid]?.total_capacity || 0;
          a[key][k.id].used += current_covid + current_non_covid;
          a[key][k.id].total += total_covid + total_non_covid;
        });

        return a;
      },
      {
        current: JSON.parse(JSON.stringify(initialFacilitiesTrivia)),
        previous: JSON.parse(JSON.stringify(initialFacilitiesTrivia)),
      }
    );

  useEffect(() => {
    careSummary(
      "patient",
      dateString(getNDateBefore(date, 1)),
      dateString(getNDateAfter(date, 1)),
      "",
      2000,
      facilityId
    ).then((data) => {
      setPatientData(data);
      setPatientLoading(false);
    });
    careSummary(
      "facility",
      dateString(getNDateBefore(date, 1)),
      dateString(getNDateAfter(date, 1)),
      "",
      2000,
      facilityId
    ).then((data) => {
      setFacilityData(data);
      setFacilityLoading(false);
    });
  }, []);

  // bedData = patientData.results[0].data;
  return (
    !facilityLoading &&
    !patientLoading && (
      <div className="h-fulle w-full dark:text-white">
        <div className="flex flex-col items-start justify-center mt-4">
          <h1 className="mb-3 mt-6 text-3xl font-bold">
            {facilityData.results[0].facility.name}
          </h1>

          <div className="w -full flex flex-wrap items-center justify-start">
            <div style={{ width: "50%" }} className="my-2 text-sm">
              <span className="font-semibold">Phone: </span>
              {facilityData.results[0].facility.phone_number}
            </div>
            <div style={{ width: "50%" }} className="my-2 text-sm">
              <span className="font-semibold">Facility Type: </span>
              {facilityData.results[0].facility.facility_type}
            </div>
            <div style={{ width: "50%" }} className="my-2 text-sm">
              <span className="font-semibold">Address: </span>
              {facilityData.results[0].facility.address}
            </div>
            <div style={{ width: "50%" }} className="my-2 text-sm">
              <span className="font-semibold">Local Body: </span>
              {facilityData.results[0].facility.local_body_object.name}
            </div>
            <div style={{ width: "50%" }} className="my-2 text-sm">
              <span className="font-semibold">Ward: </span>
              {`${facilityData.results[0].facility.ward_object.number}, ${facilityData.results[0].facility.ward_object.name}`}
            </div>
            <div style={{ width: "50%" }} className="my-2 text-sm">
              <span className="font-semibold">District: </span>
              {facilityData.results[0].facility.district_object.name}
            </div>
          </div>
        </div>
        <section className="my-8 px-6 py-4 dark:bg-gray-700 bg-white">
          <h2 className="text-green-500 text-lg font-bold">Capacity</h2>
          <div className="mb-4 mt-8">
            <div className="grid-col-1 grid gap-6 mb-8 md:grid-cols-4">
              {AVAILABILITY_TYPES_TOTAL_ORDERED.map((k) => (
                <RadialCard
                  label={k.name}
                  count={facilitiesTrivia.current.count}
                  current={facilitiesTrivia.current[k.id]}
                  previous={facilitiesTrivia.previous[k.id]}
                  key={k.name}
                />
              ))}
            </div>

            <div className="grid-col-1 grid gap-6 mb-8 md:grid-cols-4">
              {AVAILABILITY_TYPES_ORDERED.map((k) => (
                <RadialCard
                  label={AVAILABILITY_TYPES[k]}
                  count={facilitiesTrivia.current.count}
                  current={facilitiesTrivia.current[k]}
                  previous={facilitiesTrivia.previous[k]}
                  key={k}
                />
              ))}
            </div>
          </div>
        </section>
        <section className="my-8 px-6 py-4 dark:bg-gray-700 bg-white">
          <h2 className="text-green-500 text-lg font-bold">Patients</h2>
          <div className="mb-4 mt-8">
            <div className="grid-col-1 grid gap-6 mb-8 md:grid-cols-4">
              {Object.keys(PATIENT_TYPES).map((k) => (
                <div class="word-wrap pl-3 pr-2 py-2 break-words bg-gray-50 dark:bg-gray-800">
                  <p className="dark:text-gray-300 text-gray-500 text-lg font-semibold capitalize">
                    {k.split("_").join(" ")}
                  </p>
                  <h1 className="mb-2 mt-3 text-gray-800 dark:text-white text-3xl font-bold">
                    {patientFacilitiesTrivia.previous[`${k}`].total}
                    <sup className="ml-1 dark:text-gray-500 text-gray-600 text-lg font-thin">
                      +1
                    </sup>
                  </h1>
                </div>
              ))}
            </div>
          </div>
        </section>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Total</th>
              <th>Used</th>
              <th>Vacant</th>
            </tr>
          </thead>
          <tbody>
            {facilityData.results[0].data.availability.map((bedItem) => {
              return (
                <tr key={bedItem.id}>
                  <td>{bedItem.room_type}</td>
                  <td>{bedItem.total_capacity}</td>
                  <td>{bedItem.current_capacity}</td>
                  <td>{bedItem.total_capacity - bedItem.current_capacity}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <h2>Patient Occupancy</h2>
        <table>
          <thead>
            <tr>
              <th>Bed Type</th>
              <th>Occupancy</th>
              <th>Expected Oxygen Consumption</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Oxygen Bed</td>
              <td>{patientData.total_patients_bed_with_oxygen_support}</td>
              <td>
                {patientData.total_patients_bed_with_oxygen_support *
                  7.4 *
                  8.778}{" "}
                m<sup>3</sup>/ hr
              </td>
            </tr>
            <tr>
              <td>ICU with Oxygen</td>
              <td>{patientData.total_patients_icu_with_oxygen_support}</td>
              <td>
                {patientData.total_patients_icu_with_oxygen_support *
                  10 *
                  8.778}{" "}
                m<sup>3</sup>/ hr
              </td>
            </tr>
            <tr>
              <td>Ventilator</td>
              <td>
                {patientData.total_patients_icu_with_invasive_ventilator +
                  patientData.total_patients_icu_with_non_invasive_ventilator}
              </td>
              <td>
                {(patientData.total_patients_icu_with_invasive_ventilator +
                  patientData.total_patients_icu_with_non_invasive_ventilator) *
                  48 *
                  8.778}{" "}
                m<sup>3</sup>/ hr
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  );
}

export default Facility;
