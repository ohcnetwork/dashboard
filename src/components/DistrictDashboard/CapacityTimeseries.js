import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { careFacilitySummary } from "../../utils/api";
import { availabilityTypes } from "../../utils/constants";
import { dateString, getNDateAfter, getNDateBefore } from "../../utils/utils";
import TimeseriesBarChart from "../Chart/TimeseriesBarChart";
import NoData from "../NoData";
import ThemedSuspense from "../ThemedSuspense";

function CapacityTimeseries({ filterDistrict, filterFacilityTypes, dates }) {
  const { auth } = useContext(AuthContext);
  const [facilities, setFacilities] = useState([]);
  const [chartable, setChartable] = useState([]);
  const [empty, setEmpty] = useState(false);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    careFacilitySummary(
      auth.token,
      dateString(getNDateBefore(dates[0], 1)),
      dateString(getNDateAfter(dates[1], 1))
    )
      .then((resp) => {
        setFacilities(
          resp.results.map(({ data: facility, created_date: date }) => ({
            date: dateString(new Date(date)),
            id: facility.id,
            name: facility.name,
            districtId: facility.district,
            facilityType: facility.facility_type || "Unknown",
            oxygenCapacity: facility.oxygen_capacity,
            capacity: facility.availability.reduce((cAcc, cCur) => {
              return {
                ...cAcc,
                [cCur.room_type]: cCur,
              };
            }, {}),
          }))
        );
        setFetched(true);
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
        f.districtId === filterDistrict.id &&
        filterFacilityTypes.includes(f.facilityType)
    );
    if (_f.length == 0) {
      setEmpty(true);
      return;
    }
    setEmpty(false);
    const dictionary = _f.reduce((acc, cur) => {
      if (acc[cur.date]) {
        acc[cur.date].oxygen.total += cur.oxygenCapacity || 0;
        Object.keys(availabilityTypes).forEach((k) => {
          let key = availabilityTypes[k].toLowerCase();
          acc[cur.date][key].used += cur.capacity[k]?.current_capacity || 0;
          acc[cur.date][key].total += cur.capacity[k]?.total_capacity || 0;
        });
        return acc;
      }
      let _t = {
        oxygen: { total: cur.oxygenCapacity, used: 0 },
        ventilator: { total: 0, used: 0 },
        icu: { total: 0, used: 0 },
        room: { total: 0, used: 0 },
        bed: { total: 0, used: 0 },
      };
      Object.keys(availabilityTypes).forEach((k) => {
        let key = availabilityTypes[k].toLowerCase();
        _t[key].used += cur.capacity[k]?.current_capacity || 0;
        _t[key].total += cur.capacity[k]?.total_capacity || 0;
      });
      return {
        ...acc,
        [cur.date]: _t,
      };
    }, {});
    let _data = Object.entries(dictionary).reverse();
    let _chartable = Object.values(availabilityTypes).map((k) => ({
      name: k,
      data: _data.map(([d, value]) => ({
        date: d,
        used: value[k.toLowerCase()].used,
        total: value[k.toLowerCase()].total,
      })),
    }));
    setChartable(_chartable);
  }, [facilities, filterDistrict, filterFacilityTypes]);

  return fetched ? (
    !empty ? (
      <div className="min-w-full min-h-full">
        {chartable.map((s, i) => (
          <TimeseriesBarChart
            key={i}
            name={s.name + "s"}
            data={s.data}
            dataKeys={["used", "total"]}
            colors={["#955df5", "#7e3af2"]}
          />
        ))}
      </div>
    ) : (
      <NoData />
    )
  ) : (
    <ThemedSuspense />
  );
}

export default CapacityTimeseries;
