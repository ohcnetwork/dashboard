import React, { useContext } from "react";
import useSWR from "swr";
import { AuthContext } from "../../context/AuthContext";
import { careSummary } from "../../utils/api";
import { testsTypes } from "../../utils/constants";
import { dateString, getNDateAfter } from "../../utils/utils";
import TimeseriesLineChart from "../Chart/TimeseriesLineChart";
import NoData from "../NoData";

function TestsTimeseries({ filterDistrict, filterFacilityTypes, dates }) {
  const { auth } = useContext(AuthContext);
  const token = auth.token;
  const { data, error } = useSWR(
    ["TestsTimeseries", dates, auth.token, filterDistrict.id],
    (url, dates, token, district) =>
      careSummary(
        token,
        "tests",
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
      Object.keys(testsTypes).forEach((k) => {
        acc[cur.date][k] += cur[k];
        acc[cur.date][k] += cur[k];
      });
      return acc;
    }
    let _t = {
      result_awaited: 0,
      test_discarded: 0,
      total_patients: 0,
      result_negative: 0,
      result_positive: 0,
    };
    Object.keys(testsTypes).forEach((k) => {
      _t[k] += cur[k];
      _t[k] += cur[k];
    });
    return {
      ...acc,
      [cur.date]: _t,
    };
  }, {});
  const chartable = {
    name: "Tests",
    data: Object.entries(datewise)
      .reverse()
      .map(([d, value]) => ({
        date: d,
        ...value,
      })),
  };
  return (
    <div className="min-w-full min-h-full">
      {filtered.length > 0 ? (
        <TimeseriesLineChart
          name={chartable.name + "s"}
          data={chartable.data}
          dataKeys={[
            "result_awaited",
            "test_discarded",
            "total_patients",
            "result_negative",
            "result_positive",
          ]}
          colors={["green", "red", "purple", "orange", "blue"]}
        />
      ) : (
        <NoData />
      )}
    </div>
  );
}

export default TestsTimeseries;
