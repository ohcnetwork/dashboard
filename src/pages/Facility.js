import React, { lazy, useState, useEffect } from "react";
import { useParams } from "react-router";
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
import FacilityInfo from "../components/Facility/FacilityInfo";

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
        <FacilityInfo facilityData={facilityData} />
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
