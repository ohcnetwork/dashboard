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

import { FACILITY_TYPES } from "../utils/constants";

import { PageTitle } from "../components/Typography/Title";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Facility() {
  const params = useParams();
  const facilityId = params.facilityId;
  // const date = Date.parse(query.get("date"));
  const date = new Date();
  const [patientData, setPatientData] = useState({});
  const [facilityData, setFacilityData] = useState({});
  const [patientLoading, setPatientLoading] = useState(true);
  const [facilityLoading, setFacilityLoading] = useState(true);

  useEffect(() => {
    careSummary(
      "patient",
      dateString(getNDateBefore(date, 1)),
      dateString(getNDateAfter(date, 1)),
      "",
      2000,
      facilityId
    ).then((data) => {
      setPatientData(data.results[0].data);
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
      <div className="overflow-hidden md:overflow-auto">
        <PageTitle>{facilityData.results[0].facility.name}</PageTitle>
        <div>{facilityData.results[0].facility.facility_type}</div>
        <div>{facilityData.results[0].facility.phone_number}</div>
        <h2>Capacity</h2>
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
                  <td>{bedItem.room_type_text}</td>
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
                  10 *
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
