import React from "react"
import {
  AVAILABILITY_TYPES,
  AVAILABILITY_TYPES_ORDERED,
  AVAILABILITY_TYPES_TOTAL_ORDERED,
} from "../../utils/constants"
import {
  dateString,
} from "../../utils/utils";
import RadialCard from "../Chart/RadialCard";

const initialFacilitiesTrivia = {
  20: { total: 0, used: 0 },
  10: { total: 0, used: 0 },
  150: { total: 0, used: 0 },
  1: { total: 0, used: 0 },
  70: { total: 0, used: 0 },
  50: { total: 0, used: 0 },
  60: { total: 0, used: 0 },
  40: { total: 0, used: 0 },
  100: { total: 0, used: 0 },
  110: { total: 0, used: 0 },
  120: { total: 0, used: 0 },
  30: { total: 0, used: 0 },
  1111: { total: 0, used: 0 },
  2222: { total: 0, used: 0 },
  3333: { total: 0, used: 0 },
  4444: { total: 0, used: 0 },
  actualDischargedPatients: 0,
  actualLivePatients: 0,
  count: 0,
  oxygen: 0,
};

const Capacity = ({ filtered, date }) => {

  const facilitiesTrivia =
    filtered &&
    filtered.reduce(
      (a, c) => {
        const key = c.date === dateString(date) ? "current" : "previous";
        if (a[key]) {
          a[key].count += 1;
          a[key].oxygen += c.oxygenCapacity || 0;
          a[key].actualLivePatients += c.actualLivePatients || 0;
          a[key].actualDischargedPatients += c.actualDischargedPatients || 0;
          Object.keys(AVAILABILITY_TYPES).forEach((k) => {
            a[key][k].used += c.capacity[k]?.current_capacity || 0;
            a[key][k].total += c.capacity[k]?.total_capacity || 0;
          });

          AVAILABILITY_TYPES_TOTAL_ORDERED.forEach((k) => {
            let current_covid = c.capacity[k.covid]?.current_capacity || 0;
            let current_non_covid =
              c.capacity[k.non_covid]?.current_capacity || 0;
            let total_covid = c.capacity[k.covid]?.total_capacity || 0;
            let total_non_covid = c.capacity[k.non_covid]?.total_capacity || 0;
            a[key][k.id].used += current_covid + current_non_covid;
            a[key][k.id].total += total_covid + total_non_covid;
          });
        }
        return a;
      },
      {
        current: JSON.parse(JSON.stringify(initialFacilitiesTrivia)),
        previous: JSON.parse(JSON.stringify(initialFacilitiesTrivia)),
      }
    );


  return (<section className="my-8 px-6 py-4 dark:bg-gray-700 bg-white">
    <h2 className="text-green-500 text-lg font-bold">Capacity</h2>
    <div className="mb-4 mt-8">
      <div className="grid-col-1 grid gap-6 mb-8 md:grid-cols-4">
        {AVAILABILITY_TYPES_TOTAL_ORDERED.map(
          (k) =>
            facilitiesTrivia?.current[k.id]?.total !== 0 && (
              <RadialCard
                label={k.name}
                count={facilitiesTrivia.current.count}
                current={facilitiesTrivia.current[k.id]}
                previous={facilitiesTrivia.previous[k.id]}
                key={k.name}
              />
            )
        )}
      </div>

      <div className="grid-col-1 grid gap-6 mb-8 md:grid-cols-4">
        {AVAILABILITY_TYPES_ORDERED.map(
          (k) =>
            facilitiesTrivia.current[k].total !== 0 && (
              <RadialCard
                label={AVAILABILITY_TYPES[k]}
                count={facilitiesTrivia.current.count}
                current={facilitiesTrivia.current[k]}
                previous={facilitiesTrivia.previous[k]}
                key={k}
              />
            )
        )}
      </div>
    </div>
  </section>)
}

export default Capacity
