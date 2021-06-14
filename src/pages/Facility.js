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
  ACTIVATED_DISTRICTS,
} from "../utils/constants";
import Capacity from "../components/Facility/Capacity";
import Patients from "../components/Facility/Patients";
import Oxygen from "../components/Facility/Oxygen";
import ExpectedBurnRate from "../components/Facility/ExpectedBurnRate";

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
        <ExpectedBurnRate patientData={patientData} />
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
