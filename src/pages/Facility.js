import React, { lazy, useState, useEffect } from "react";
import { useParams, useLocation } from "react-router";
import { careSummary } from "../utils/api";
const GMap = lazy(() => import("../components/DistrictDashboard/GMap"));

import {
  dateString,
  getNDateAfter,
  getNDateBefore,
  processFacilities,
} from "../utils/utils";

import {
  FACILITY_TYPES,
  PATIENT_TYPES,
  OXYGEN_TYPES_KEYS,
  ACTIVATED_DISTRICTS,
} from "../utils/constants";
import Capacity from "../components/Facility/Capacity";
import Patients from "../components/Facility/Patients";
import Oxygen from "../components/Facility/Oxygen";


function useQuery() {
  return new URLSearchParams(useLocation().search);
}


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

  const filtered =
    facilityData.results &&
    processFacilities(facilityData.results, FACILITY_TYPES);
  const todayFiltered =
    filtered && filtered.filter((f) => f.date === dateString(date));


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
            {facilityData?.results[0]?.facility.name}
          </h1>

          <div className="w -full flex flex-wrap items-center justify-start">
            {facilityData?.results[0]?.facility?.phone_number && (
              <div style={{ width: "50%" }} className="my-2 text-sm">
                <span className="font-semibold">Phone: </span>
                {facilityData?.results[0]?.facility?.phone_number}
              </div>
            )}
            {facilityData?.results[0]?.facility?.facility_type && (
              <div style={{ width: "50%" }} className="my-2 text-sm">
                <span className="font-semibold">Facility Type: </span>
                {facilityData?.results[0]?.facility?.facility_type}
              </div>
            )}
            {facilityData?.results[0]?.facility?.address && (
              <div style={{ width: "50%" }} className="my-2 text-sm">
                <span className="font-semibold">Address: </span>
                {facilityData?.results[0]?.facility?.address}
              </div>
            )}
            {facilityData?.results[0]?.facility?.local_body_object?.name && (
              <div style={{ width: "50%" }} className="my-2 text-sm">
                <span className="font-semibold">Local Body: </span>
                {facilityData?.results[0]?.facility?.local_body_object?.name}
              </div>
            )}
            {facilityData?.results[0]?.facility?.ward_object && (
              <div style={{ width: "50%" }} className="my-2 text-sm">
                <span className="font-semibold">Ward: </span>
                {`${facilityData?.results[0]?.facility?.ward_object?.number || ""
                  }, ${facilityData?.results[0]?.facility?.ward_object?.name || ""
                  }`}
              </div>
            )}
            {facilityData?.results[0]?.district_object && (
              <div style={{ width: "50%" }} className="my-2 text-sm">
                <span className="font-semibold">District: </span>
                {facilityData?.results[0]?.district_object?.name}
              </div>
            )}
          </div>
        </div>
        <Capacity filtered={filtered} date={date} />
        <Patients patientsFiltered={patientsFiltered} date={date} />
        <Oxygen oxygenData={oxygenData} />
        <section className="my-8 px-6 py-4 dark:bg-gray-700 bg-white">
          <h2 className="text-green-500 text-lg font-bold">
            Expected Burn Rate
          </h2>
          <div className="grid-col-1 grid gap-6 mb-4 mt-8 md:grid-cols-3">
            {patientData.results[0].data
              .total_patients_bed_with_oxygen_support !== 0 && (
                <div
                  key={"OXYGEN_BED"}
                  className="word-wrap flex flex-col pb-3 pl-3 pr-4 pt-6 break-words bg-gray-50 dark:bg-gray-800 rounded-md space-x-3"
                >
                  <div>
                    <p className="ml-4 dark:text-gray-300 text-gray-500 text-lg font-semibold capitalize">
                      {"Oxygen Bed"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="fire"
                      className="w-10 h-10 text-orange-500"
                      role="img"
                      viewBox="0 0 384 512"
                    >
                      <path
                        fill="currentColor"
                        d="M216 23.86c0-23.8-30.65-32.77-44.15-13.04C48 191.85 224 200 224 288c0 35.63-29.11 64.46-64.85 63.99-35.17-.45-63.15-29.77-63.15-64.94v-85.51c0-21.7-26.47-32.23-41.43-16.5C27.8 213.16 0 261.33 0 320c0 105.87 86.13 192 192 192s192-86.13 192-192c0-170.29-168-193-168-296.14z"
                      />
                    </svg>
                    <h1 className="mb-2 mt-3 text-gray-800 dark:text-white text-3xl font-bold">
                      {patientData.results[0].data
                        .total_patients_bed_with_oxygen_support *
                        7.4 *
                        8.778}
                      <span className="ml-1 text-lg font-bold">
                        m<sup>3</sup>/hr
                      </span>
                      {
                        <sup className="ml-1 dark:text-gray-500 text-gray-600 text-lg">
                          {`${patientData.results[0].data.total_patients_bed_with_oxygen_support}`}
                        </sup>
                      }
                    </h1>
                  </div>
                </div>
              )}
            {patientData.results[0].data
              .total_patients_icu_with_oxygen_support !== 0 && (
                <div
                  key={"ICU"}
                  className="word-wrap flex flex-col pb-3 pl-3 pr-4 pt-6 break-words bg-gray-50 dark:bg-gray-800 rounded-md space-x-3"
                >
                  <div>
                    <p className="ml-4 dark:text-gray-300 text-gray-500 text-lg font-semibold capitalize">
                      {"ICU"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="fire"
                      className="w-10 h-10 text-orange-500"
                      role="img"
                      viewBox="0 0 384 512"
                    >
                      <path
                        fill="currentColor"
                        d="M216 23.86c0-23.8-30.65-32.77-44.15-13.04C48 191.85 224 200 224 288c0 35.63-29.11 64.46-64.85 63.99-35.17-.45-63.15-29.77-63.15-64.94v-85.51c0-21.7-26.47-32.23-41.43-16.5C27.8 213.16 0 261.33 0 320c0 105.87 86.13 192 192 192s192-86.13 192-192c0-170.29-168-193-168-296.14z"
                      />
                    </svg>
                    <h1 className="mb-2 mt-3 text-gray-800 dark:text-white text-3xl font-bold">
                      {patientData.results[0].data
                        .total_patients_icu_with_oxygen_support *
                        10 *
                        8.778}
                      <span className="ml-1 text-lg font-bold">
                        m<sup>3</sup>/hr
                      </span>
                      {
                        <sup className="ml-1 dark:text-gray-500 text-gray-600 text-lg">
                          {`${patientData.results[0].data.total_patients_icu_with_oxygen_support}`}
                        </sup>
                      }
                    </h1>
                  </div>
                </div>
              )}
            {patientData.results[0].data
              .total_patients_icu_with_invasive_ventilator +
              patientData.results[0].data
                .total_patients_icu_with_non_invasive_ventilator !==
              0 && (
                <div
                  key={"Ventilator"}
                  className="word-wrap flex flex-col pb-3 pl-3 pr-4 pt-6 break-words bg-gray-50 dark:bg-gray-800 rounded-md space-x-3"
                >
                  <div>
                    <p className="ml-4 dark:text-gray-300 text-gray-500 text-lg font-semibold capitalize">
                      {"Ventilator"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="fire"
                      className="w-10 h-10 text-orange-500"
                      role="img"
                      viewBox="0 0 384 512"
                    >
                      <path
                        fill="currentColor"
                        d="M216 23.86c0-23.8-30.65-32.77-44.15-13.04C48 191.85 224 200 224 288c0 35.63-29.11 64.46-64.85 63.99-35.17-.45-63.15-29.77-63.15-64.94v-85.51c0-21.7-26.47-32.23-41.43-16.5C27.8 213.16 0 261.33 0 320c0 105.87 86.13 192 192 192s192-86.13 192-192c0-170.29-168-193-168-296.14z"
                      />
                    </svg>
                    <h1 className="mb-2 mt-3 text-gray-800 dark:text-white text-3xl font-bold">
                      {(patientData.results[0].data
                        .total_patients_icu_with_invasive_ventilator +
                        patientData.results[0].data
                          .total_patients_icu_with_non_invasive_ventilator) *
                        10 *
                        8.778}
                      <span className="ml-1 text-lg font-bold">
                        m<sup>3</sup>/hr
                      </span>
                      {
                        <sup className="ml-1 dark:text-gray-500 text-gray-600 text-lg">
                          {patientData.results[0].data
                            .total_patients_icu_with_invasive_ventilator +
                            patientData.results[0].data
                              .total_patients_icu_with_non_invasive_ventilator}
                        </sup>
                      }
                    </h1>
                  </div>
                </div>
              )}
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
