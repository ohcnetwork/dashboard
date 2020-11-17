import React, { useMemo } from "react";
import useSWR from "swr";

import { careSummary } from "../../utils/api";
import { PATIENT_TYPES } from "../../utils/constants";
import {
  dateString,
  getNDateAfter,
  processFacilities,
} from "../../utils/utils";
import TimeseriesBarChart from "../Chart/TimeseriesBarChart";
import NoData from "../NoData";

function PatientTimeseries({ filterDistrict, filterFacilityTypes, dates }) {
  const { data } = useSWR(
    ["PatientTimeseries", dates, filterDistrict.id],
    (url, dates, district) =>
      careSummary(
        "patient",
        dateString(dates[0]),
        dateString(getNDateAfter(dates[1], 1)),
        district
      )
  );

  const { filtered, chartable } = useMemo(() => {
    const filtered = processFacilities(data.results, filterFacilityTypes);
    const datewise = filtered.reduce((acc, cur) => {
      if (acc[cur.date]) {
        Object.keys(PATIENT_TYPES).forEach((k) => {
          acc[cur.date][k].today += cur[`today_patients_${k}`];
          acc[cur.date][k].total += cur[`total_patients_${k}`];
        });
        return acc;
      }
      const _t = {
        icu: { total: 0, today: 0 },
        not_admitted: { total: 0, today: 0 },
        home_isolation: { total: 0, today: 0 },
        isolation_room: { total: 0, today: 0 },
        home_quarantine: { total: 0, today: 0 },
        paediatric_ward: { total: 0, today: 0 },
        gynaecology_ward: { total: 0, today: 0 },
        icu_with_oxygen_support: { total: 0, today: 0 },
        icu_with_invasive_ventilator: { total: 0, today: 0 },
        icu_with_non_invasive_ventilator: { total: 0, today: 0 },
      };
      Object.keys(PATIENT_TYPES).forEach((k) => {
        _t[k].today += cur[`today_patients_${k}`];
        _t[k].total += cur[`total_patients_${k}`];
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
    return { filtered, chartable };
  }, [data, filterFacilityTypes]);

  return (
    <div className="min-w-full min-h-full">
      {filtered.length > 0 ? (
        chartable.map((s, i) => (
          <TimeseriesBarChart
            key={i}
            name={s.name}
            data={s.data}
            dataKeys={["today", "total"]}
            colors={["var(--color-green-400)", "var(--color-green-500)"]}
          />
        ))
      ) : (
        <NoData />
      )}
    </div>
  );
}

export default PatientTimeseries;
