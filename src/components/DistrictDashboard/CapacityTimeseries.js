import React, { useContext } from "react";
import useSWR from "swr";
import { AuthContext } from "../../context/AuthContext";
import { careSummary } from "../../utils/api";
import { AVAILABILITY_TYPES } from "../../utils/constants";
import { dateString, getNDateAfter } from "../../utils/utils";
import TimeseriesBarChart from "../Chart/TimeseriesBarChart";
import NoData from "../NoData";

function CapacityTimeseries({ filterDistrict, filterFacilityTypes, dates }) {
  const { auth } = useContext(AuthContext);
  const { data, error } = useSWR(
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
      acc[cur.date].oxygen.total += cur.oxygenCapacity || 0;
      Object.keys(AVAILABILITY_TYPES).forEach((k) => {
        let key = AVAILABILITY_TYPES[k].toLowerCase();
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
    Object.keys(AVAILABILITY_TYPES).forEach((k) => {
      let key = AVAILABILITY_TYPES[k].toLowerCase();
      _t[key].used += cur.capacity[k]?.current_capacity || 0;
      _t[key].total += cur.capacity[k]?.total_capacity || 0;
    });
    return {
      ...acc,
      [cur.date]: _t,
    };
  }, {});
  const chartable = Object.values(AVAILABILITY_TYPES).map((k) => ({
    name: k,
    data: Object.entries(datewise)
      .reverse()
      .map(([d, value]) => ({
        date: d,
        used: value[k.toLowerCase()].used,
        total: value[k.toLowerCase()].total,
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
            dataKeys={["used", "total"]}
            colors={["#955df5", "#7e3af2"]}
          />
        ))
      ) : (
        <NoData />
      )}
    </div>
  );
}

export default CapacityTimeseries;
