import React, { useContext } from "react";
import useSWR from "swr";
import { AuthContext } from "../../context/AuthContext";
import { careSummary } from "../../utils/api";
import { TRIAGE_TYPES } from "../../utils/constants";
import { dateString, getNDateAfter } from "../../utils/utils";
import TimeseriesLineChart from "../Chart/TimeseriesLineChart";
import NoData from "../NoData";

function TriageTimeseries({ filterDistrict, filterFacilityTypes, dates }) {
  const { auth } = useContext(AuthContext);
  const { data, error } = useSWR(
    ["TriageTimeseries", dates, auth.token, filterDistrict.id],
    (url, dates, token, district) =>
      careSummary(
        token,
        "triage",
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
      Object.keys(TRIAGE_TYPES).forEach((k) => {
        acc[cur.date][k] += cur[k];
        acc[cur.date][k] += cur[k];
      });
      return acc;
    }
    let _t = {
      avg_patients_visited: 0,
      avg_patients_referred: 0,
      avg_patients_isolation: 0,
      total_patients_visited: 0,
      total_patients_referred: 0,
      total_patients_isolation: 0,
      avg_patients_home_quarantine: 0,
      total_patients_home_quarantine: 0,
    };
    Object.keys(TRIAGE_TYPES).forEach((k) => {
      _t[k] += cur[k];
      _t[k] += cur[k];
    });
    return {
      ...acc,
      [cur.date]: _t,
    };
  }, {});
  let lang = [
    "Patients visited",
    "Patients referred",
    "Patients isolation",
    "Patients home quarantine",
  ];
  const chartable = ["visited", "referred", "isolation", "home_quarantine"].map(
    (k, i) => ({
      name: lang[i],
      data: Object.entries(datewise)
        .reverse()
        .map(([d, value]) => ({
          date: d,
          avg: value["avg_patients_" + k],
          total: value["total_patients_" + k],
        })),
    })
  );

  return (
    <div className="min-w-full min-h-full">
      {filtered.length > 0 ? (
        chartable.map((s, i) => (
          <TimeseriesLineChart
            key={i}
            name={s.name}
            data={s.data}
            dataKeys={["avg", "total"]}
            colors={["var(--color-green-400)", "var(--color-green-500)"]}
          />
        ))
      ) : (
        <NoData />
      )}
    </div>
  );
}

export default TriageTimeseries;
