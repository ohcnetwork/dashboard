import React, { useContext } from "react";
import useSWR from "swr";
import { AuthContext } from "../../context/AuthContext";
import { carePatientSummary } from "../../utils/api";
import { patientTypes } from "../../utils/constants";
import { dateString, getNDateAfter } from "../../utils/utils";
import TimeseriesBarChart from "../Chart/TimeseriesBarChart";
import NoData from "../NoData";

function PatientTimeseries({ filterDistrict, filterFacilityTypes, dates }) {
  const { auth } = useContext(AuthContext);
  const token = auth.token;
  const { data, error } = useSWR(
    ["PatientTimeseries", dates, token],
    (url, dates, token) =>
      carePatientSummary(
        token,
        dateString(dates[0]),
        dateString(getNDateAfter(dates[1], 1))
      ).then((r) => r),
    { suspense: true, loadingTimeout: 10000 }
  );

  const facilities = data.results.map(({ data, facility, created_date }) => ({
    date: dateString(new Date(created_date)),
    ...data,
    id: facility.id,
    facilityType: facility.facility_type || "Unknown",
    location: facility.location,
  }));
  const filtered = facilities.filter(
    (f) =>
      f.district === filterDistrict.name &&
      filterFacilityTypes.includes(f.facilityType)
  );
  const datewise = filtered.reduce((acc, cur) => {
    if (acc[cur.date]) {
      Object.keys(patientTypes).forEach((k) => {
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
    Object.keys(patientTypes).forEach((k) => {
      _t[k].today += cur["today_patients_" + k];
      _t[k].total += cur["total_patients_" + k];
    });
    return {
      ...acc,
      [cur.date]: _t,
    };
  }, {});
  const chartable = Object.keys(patientTypes).map((k) => ({
    name: patientTypes[k],
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
            name={s.name + "s"}
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
