import React, { useContext } from "react";
import useSWR from "swr";
import { AuthContext } from "../../context/AuthContext";
import { careSummary } from "../../utils/api";
import { PATIENT_TYPES } from "../../utils/constants";
import { dateString, getNDateAfter } from "../../utils/utils";
import TimeseriesBarChart from "../Chart/TimeseriesBarChart";
import NoData from "../NoData";

function PatientTimeseries({ filterDistrict, filterFacilityTypes, dates }) {
  const { auth } = useContext(AuthContext);
  const { data, error } = useSWR(
    ["PatientTimeseries", dates, auth.token, filterDistrict.id],
    (url, dates, token, district) =>
      careSummary(
        token,
        "patient",
        dateString(dates[0]),
        dateString(getNDateAfter(dates[1], 1)),
        district
      ).then((r) => r)
  );

  const facilities = data.results.map(({ data, facility, created_date }) => ({
    date: dateString(new Date(created_date)),
    ...data,
    id: facility.id,
    facilityType: facility.facility_type || "Unknown",
    location: facility.location,
  }));
  const filtered = facilities.filter((f) =>
    filterFacilityTypes.includes(f.facilityType)
  );
  const datewise = filtered.reduce((acc, cur) => {
    if (acc[cur.date]) {
      Object.keys(PATIENT_TYPES).forEach((k) => {
        acc[cur.date][k].today += cur["today_patients_" + k];
        acc[cur.date][k].total += cur["total_patients_" + k];
      });
      return acc;
    }
    let _t = {
      ventilator: { total: 0, today: 0 },
      icu: { total: 0, today: 0 },
      isolation: { total: 0, today: 0 },
      home_quarantine: { total: 0, today: 0 },
    };
    Object.keys(PATIENT_TYPES).forEach((k) => {
      _t[k].today += cur["today_patients_" + k];
      _t[k].total += cur["total_patients_" + k];
    });
    return {
      ...acc,
      [cur.date]: _t,
    };
  }, {});
  const chartable = Object.keys(PATIENT_TYPES).map((k) => ({
    name: PATIENT_TYPES[k],
    data: Object.entries(datewise)
      .reverse()
      .map(([d, value]) => ({
        date: d,
        today: value[k].today,
        total: value[k].total,
      })),
  }));

  return (
    <div className="min-w-full min-h-full">
      {filtered.length > 0 ? (
        chartable.map((s, i) => (
          <TimeseriesBarChart
            key={i}
            name={s.name}
            data={s.data}
            dataKeys={["today", "total"]}
            colors={["#955df5", "#7e3af2"]}
          />
        ))
      ) : (
        <NoData />
      )}
    </div>
  );
}

export default PatientTimeseries;
