import React, { lazy, useState, useEffect } from "react";
import { useParams, useLocation } from "react-router";
import useSWR from "swr";
import { careSummary } from "../utils/api";
const GMap = lazy(() => import("../components/DistrictDashboard/GMap"));

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
  OXYGEN_TYPES_KEYS,
  ACTIVATED_DISTRICTS,
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
  const [oxygenData, setOxygen] = useState({});

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

  const filtered =
    facilityData.results &&
    processFacilities(facilityData.results, FACILITY_TYPES);
  const todayFiltered =
    filtered && filtered.filter((f) => f.date === dateString(date));
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
      setOxygen(data.results[0].data.inventory);
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
              {AVAILABILITY_TYPES_TOTAL_ORDERED.map(
                (k) =>
                  facilitiesTrivia.current[k.id].total !== 0 && (
                    <RadialCard
                      label={k.name}
                      count={facilitiesTrivia.current.count}
                      current={facilitiesTrivia.current[k.id]}
                      previous={facilitiesTrivia.previous[k.id]}
                      key={k.name}
                    />
                  )
              )}
            </div>

            <div className="grid-col-1 grid gap-6 mb-8 md:grid-cols-4">
              {AVAILABILITY_TYPES_ORDERED.map(
                (k) =>
                  facilitiesTrivia.current[k].total !== 0 && (
                    <RadialCard
                      label={AVAILABILITY_TYPES[k]}
                      count={facilitiesTrivia.current.count}
                      current={facilitiesTrivia.current[k]}
                      previous={facilitiesTrivia.previous[k]}
                      key={k}
                    />
                  )
              )}
            </div>
          </div>
        </section>
        <section className="my-8 px-6 py-4 dark:bg-gray-700 bg-white">
          <h2 className="text-green-500 text-lg font-bold">Patients</h2>
          <div className="mb-4 mt-8">
            <div className="grid-col-1 grid gap-6 mb-8 md:grid-cols-4">
              {Object.keys(PATIENT_TYPES).map(
                (k) =>
                  patientFacilitiesTrivia.current[`${k}`].total !== 0 && (
                    <div
                      key={k}
                      className="word-wrap pl-3 pr-2 py-2 break-words bg-gray-50 dark:bg-gray-800 rounded-md"
                    >
                      <p className="dark:text-gray-300 text-gray-500 text-lg font-semibold capitalize">
                        {k.split("_").join(" ")}
                      </p>
                      <h1 className="mb-2 mt-3 text-gray-800 dark:text-white text-3xl font-bold">
                        {patientFacilitiesTrivia.current[`${k}`].total}
                        {
                          <sup className="ml-1 dark:text-gray-500 text-gray-600 text-lg font-thin">
                            {patientFacilitiesTrivia.current[`${k}`].total -
                              patientFacilitiesTrivia.previous[`${k}`].total !==
                              0 &&
                              `${
                                patientFacilitiesTrivia.current[`${k}`].total -
                                  patientFacilitiesTrivia.previous[`${k}`]
                                    .total >
                                0
                                  ? "+"
                                  : "-"
                              } ${
                                patientFacilitiesTrivia.current[`${k}`].total
                              }`}
                          </sup>
                        }
                      </h1>
                    </div>
                  )
              )}
            </div>
          </div>
        </section>
        <section className="my-8 p-6 dark:bg-gray-700 bg-white">
          <h2 className="text-green-500 text-lg font-bold">Oxygen</h2>
          <div className="mb-4 mt-8">
            <div className="grid-col-1 grid gap-6 mb-8">
              {oxygenData &&
                Object.keys(OXYGEN_TYPES_KEYS).map(
                  (k) =>
                    oxygenData[k] && (
                      <div
                        key={k}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-md"
                      >
                        <div className="justify-butween flex items-center">
                          <div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                              focusable="false"
                              data-prefix="fas"
                              data-icon="weight"
                              className="pr-4 w-12 h-12 text-orange-500"
                              role="img"
                              viewBox="0 0 512 512"
                            >
                              <path
                                fill="currentColor"
                                d="M448 64h-25.98C438.44 92.28 448 125.01 448 160c0 105.87-86.13 192-192 192S64 265.87 64 160c0-34.99 9.56-67.72 25.98-96H64C28.71 64 0 92.71 0 128v320c0 35.29 28.71 64 64 64h384c35.29 0 64-28.71 64-64V128c0-35.29-28.71-64-64-64zM256 320c88.37 0 160-71.63 160-160S344.37 0 256 0 96 71.63 96 160s71.63 160 160 160zm-.3-151.94l33.58-78.36c3.5-8.17 12.94-11.92 21.03-8.41 8.12 3.48 11.88 12.89 8.41 21l-33.67 78.55C291.73 188 296 197.45 296 208c0 22.09-17.91 40-40 40s-40-17.91-40-40c0-21.98 17.76-39.77 39.7-39.94z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="dark:text-gray-400 text-sm font-semibold">
                              {oxygenData[k].item_name}
                            </p>
                            <p className="dark:text-white text-2xl font-bold">
                              {oxygenData[k].stock -
                                Math.floor(oxygenData[k].stock) !==
                              0
                                ? oxygenData[k].stock.toFixed(2)
                                : oxygenData[k].stock}
                            </p>
                            <p className="dark:text-gray-400 text-sm">
                              {oxygenData[k].unit}
                            </p>
                          </div>
                        </div>
                        <div className="justify-butween flex items-center">
                          <div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                              focusable="false"
                              data-prefix="fas"
                              data-icon="fire"
                              className="pr-4 w-12 h-12 text-orange-500"
                              role="img"
                              viewBox="0 0 384 512"
                            >
                              <path
                                fill="currentColor"
                                d="M216 23.86c0-23.8-30.65-32.77-44.15-13.04C48 191.85 224 200 224 288c0 35.63-29.11 64.46-64.85 63.99-35.17-.45-63.15-29.77-63.15-64.94v-85.51c0-21.7-26.47-32.23-41.43-16.5C27.8 213.16 0 261.33 0 320c0 105.87 86.13 192 192 192s192-86.13 192-192c0-170.29-168-193-168-296.14z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="dark:text-gray-400 text-sm font-semibold">
                              Burn Rate
                            </p>
                            <p className="dark:text-white text-2xl font-bold">
                              {oxygenData[k].burn_rate?.toFixed(2)}
                            </p>
                            <p className="dark:text-gray-400 text-sm">
                              Cylinders / hour
                            </p>
                          </div>
                        </div>
                        <div className="justify-butween flex items-center">
                          <div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4"
                              fill="currentColor"
                              className="pr-4 w-12 h-12 text-orange-500"
                              viewBox="0 0 16 16"
                            >
                              <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07A7.001 7.001 0 0 0 8 16a7 7 0 0 0 5.29-11.584.531.531 0 0 0 .013-.012l.354-.354.353.354a.5.5 0 1 0 .707-.707l-1.414-1.415a.5.5 0 1 0-.707.707l.354.354-.354.354a.717.717 0 0 0-.012.012A6.973 6.973 0 0 0 9 2.071V1h.5a.5.5 0 0 0 0-1h-3zm2 5.6V9a.5.5 0 0 1-.5.5H4.5a.5.5 0 0 1 0-1h3V5.6a.5.5 0 1 1 1 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="dark:text-gray-400 text-sm font-semibold">
                              Time to empty
                            </p>
                            <p className="dark:text-white text-2xl font-bold">
                              {(
                                oxygenData[k].stock / oxygenData[k].burn_rate
                              ).toFixed(2)}
                            </p>
                            <p className="dark:text-gray-400 text-sm">hours</p>
                          </div>
                        </div>
                      </div>
                    )
                )}
            </div>
          </div>
        </section>
        <section className="my-8 px-6 py-4 dark:bg-gray-700 bg-white">
          <h2 className="text-green-500 text-lg font-bold">Map</h2>
          <GMap
            className="mb-8 mt-6"
            facilities={todayFiltered}
            district={ACTIVATED_DISTRICTS[0]}
          />
        </section>
      </div>
    )
  );
}

export default Facility;
