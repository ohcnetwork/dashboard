import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { carePatientSummary } from "../../utils/api";
import { patientTypes } from "../../utils/constants";
import { dateString, getNDateAfter, getNDateBefore } from "../../utils/utils";
import TimeseriesBarChart from "../Chart/TimeseriesBarChart";

function PatientTimeseries({ filterDistrict, filterFacilityTypes, dates }) {
  const { auth } = useContext(AuthContext);
  const [facilities, setFacilities] = useState([]);
  const [chartable, setChartable] = useState([]);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    carePatientSummary(
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
    let _data = Object.entries(dictionary).reverse();
    let _chartable = Object.keys(patientTypes).map((k) => ({
      name: patientTypes[k],
      data: _data.map(([d, value]) => ({
        date: d,
        today: value[k].today,
        total: value[k].total,
      })),
    }));
    setChartable(_chartable);
  }, [facilities, filterDistrict, filterFacilityTypes]);

  return (
    <div>
      {!empty ? (
        <div className="min-w-full min-h-full">
          {chartable.map((s, i) => (
            <TimeseriesBarChart
              key={i}
              name={s.name + "s"}
              data={s.data}
              dataKeys={["today", "total"]}
              colors={["#955df5", "#7e3af2"]}
            />
          ))}
        </div>
      ) : (
        <div>No Data</div>
      )}
    </div>
  );
}

export default PatientTimeseries;
