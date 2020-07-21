import React, { useContext, useEffect, useState } from "react";

import { Card, CardBody } from "windmill-react-ui";
import { AuthContext } from "../../context/AuthContext";
import { careTestsSummary } from "../../utils/api";
import { testsTypes } from "../../utils/constants";
import { dateString, getNDateAfter, getNDateBefore } from "../../utils/utils";
import TimeseriesLineChart from "../Chart/TimeseriesLineChart";

function TestsTimeseries({ filterDistrict, filterFacilityTypes, dates }) {
  const { auth } = useContext(AuthContext);
  const [facilities, setFacilities] = useState([]);
  const [chartable, setChartable] = useState(null);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    careTestsSummary(
      auth.token,
      dateString(getNDateBefore(dates[0], 1)),
      dateString(getNDateAfter(dates[1], 1))
    )
      .then((resp) => {
        setFacilities(
          resp.results.map(({ data, facility, created_date }) => ({
            date: dateString(new Date(created_date)),
            ...data,
            id: facility.id,
            facilityType: facility.facility_type || "Unknown",
            location: facility.location,
          }))
        );
      })
      .catch((ex) => {
        console.error("Data Unavailable", ex);
      });
  }, [dates]);

  useEffect(() => {
    if (facilities.length == 0) {
      return;
    }
    let _f = facilities.filter(
      (f) =>
        f.district === filterDistrict.name &&
        filterFacilityTypes.includes(f.facilityType)
    );
    if (_f.length == 0) {
      setEmpty(true);
      return;
    }
    setEmpty(false);
    const dictionary = _f.reduce((acc, cur) => {
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
    let _data = Object.entries(dictionary).reverse();
    let _chartable = {
      name: "Tests",
      data: _data.map(([d, value]) => ({
        date: d,
        ...value,
      })),
    };
    setChartable(_chartable);
  }, [facilities, filterDistrict, filterFacilityTypes]);

  return (
    <div>
      {!empty ? (
        chartable && (
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
        )
      ) : (
        <div>No Data</div>
      )}
    </div>
  );
}

export default TestsTimeseries;
