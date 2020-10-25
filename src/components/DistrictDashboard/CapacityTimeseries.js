import React, { useContext } from "react";
import useSWR from "swr";

import { AuthContext } from "../../context/AuthContext";
import { careSummary } from "../../utils/api";
import {
  AVAILABILITY_TYPES,
  AVAILABILITY_TYPES_ORDERED,
} from "../../utils/constants";
import { dateString, getNDateAfter } from "../../utils/utils";
import TimeseriesBarChart from "../Chart/TimeseriesBarChart";
import TimeseriesLineChart from "../Chart/TimeseriesLineChart";
import NoData from "../NoData";

function CapacityTimeseries({ filterDistrict, filterFacilityTypes, dates }) {
  const { auth } = useContext(AuthContext);
  const { data } = useSWR(
    ["CapacityTimeseries", dates, auth.token, filterDistrict.id],
    (url, dates, token, district) =>
      careSummary(
        token,
        "facility",
        dateString(dates[0]),
        dateString(getNDateAfter(dates[1], 1)),
        district
      ).then((r) => r)
  );
  const facilities = data.results.map(
    ({ data: facility, created_date: date }) => ({
      date: dateString(new Date(date)),
      id: facility.id,
      name: facility.name,
      districtId: facility.district,
      facilityType: facility.facility_type || "Unknown",
      oxygenCapacity: facility.oxygen_capacity,
      actualLivePatients: facility.actual_live_patients,
      actualDischargedPatients: facility.actual_discharged_patients,
      capacity: facility.availability.reduce((cAcc, cCur) => {
        return {
          ...cAcc,
          [cCur.room_type]: cCur,
        };
      }, {}),
    })
  );
  const filtered = facilities.filter((f) =>
    filterFacilityTypes.includes(f.facilityType)
  );
  const datewise = filtered.reduce((acc, cur) => {
    if (acc[cur.date]) {
      acc[cur.date].oxygen += cur.oxygenCapacity || 0;
      acc[cur.date].actualLivePatients += cur.actualLivePatients || 0;
      acc[cur.date].actualDischargedPatients +=
        cur.actualDischargedPatients || 0;
      Object.keys(AVAILABILITY_TYPES).forEach((k) => {
        acc[cur.date][k].used += cur.capacity[k]?.current_capacity || 0;
        acc[cur.date][k].total += cur.capacity[k]?.total_capacity || 0;
      });
      return acc;
    }
    const _t = {
      oxygen: cur.oxygenCapacity,
      actualLivePatients: cur.actualLivePatients,
      actualDischargedPatients: cur.actualDischargedPatients,
      1: { total: 0, used: 0 },
      2: { total: 0, used: 0 },
      3: { total: 0, used: 0 },
      10: { total: 0, used: 0 },
      20: { total: 0, used: 0 },
      30: { total: 0, used: 0 },
      40: { total: 0, used: 0 },
      50: { total: 0, used: 0 },
    };
    _t.oxygen += cur.oxygenCapacity;
    Object.keys(AVAILABILITY_TYPES).forEach((k) => {
      _t[k].used += cur.capacity[k]?.current_capacity || 0;
      _t[k].total += cur.capacity[k]?.total_capacity || 0;
    });
    return {
      ...acc,
      [cur.date]: _t,
    };
  }, {});
  const chartable = AVAILABILITY_TYPES_ORDERED.map((k) => ({
    name: AVAILABILITY_TYPES[k],
    data: Object.entries(datewise)
      .reverse()
      .map(([d, value]) => ({
        date: d,
        used: value[k].used,
        total: value[k].total,
      })),
  }));
  const chartableOxygen = {
    name: "Oxygen",
    data: Object.entries(datewise)
      .reverse()
      .map(([d, value]) => ({
        date: d,
        oxygen: value.oxygen,
      })),
  };
  const chartablePatient = {
    name: "Patients",
    data: Object.entries(datewise)
      .reverse()
      .map(([d, value]) => ({
        date: d,
        live: value.actualLivePatients,
        discharged: value.actualDischargedPatients,
      })),
  };
  return (
    <div className="min-w-full min-h-full">
      {filtered.length > 0 ? (
        <>
          {chartable.map((s, i) => (
            <TimeseriesBarChart
              key={i}
              name={s.name}
              data={s.data}
              dataKeys={["used", "total"]}
              colors={["var(--color-green-400)", "var(--color-green-500)"]}
            />
          ))}
          <TimeseriesLineChart
            name={chartableOxygen.name}
            data={chartableOxygen.data}
            dataKeys={["oxygen"]}
            colors={["var(--color-green-500)"]}
          />
          <TimeseriesLineChart
            name={chartablePatient.name}
            data={chartablePatient.data}
            dataKeys={["live", "discharged"]}
            colors={["var(--color-green-500)", "var(--color-green-400)"]}
          />
        </>
      ) : (
        <NoData />
      )}
    </div>
  );
}

export default CapacityTimeseries;
