import React from "react";
import {
  ORDINARY,
  OXYGEN,
  ICU,
  VENTILATOR,
  AVAILABILITY_TYPES,
  AVAILABILITY_TYPES_ORDERED,
  AVAILABILITY_TYPES_TOTAL_ORDERED,
} from "../../utils/constants";
import { dateString } from "../../utils/utils";
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

const highestExistingCard = (cards) => {
  let index = 0;
  cards.forEach((c, i) => {
    if (c.name && i > index) index = i;
  });

  return index;
};

const typeOfBed = (index) => {
  if (index % 4 == 1) return "Ordinary";
  if (index % 4 == 2) return "Oxygen";
  if (index % 4 == 3) return "ICU";
  if (index % 4 == 0) return "Ventilator";
};

const renderCapacityCards = (facilitiesTrivia) => {
  let ordinary = 0,
    oxygen = 1,
    icu = 2,
    ventilator = 3,
    cards = new Array(16).fill({});

  AVAILABILITY_TYPES_TOTAL_ORDERED.forEach((bed) => {
    if (!facilitiesTrivia?.current[bed.id]?.total) return;
    if (ORDINARY.includes(bed.id)) {
      cards[ordinary] = {
        name: bed.name,
        current: facilitiesTrivia.current[bed.id],
        previous: facilitiesTrivia.previous[bed.id],
        col: "col-start-1",
      };
      ordinary += 4;
    } else if (OXYGEN.includes(bed.id)) {
      cards[oxygen] = {
        name: bed.name,
        current: facilitiesTrivia.current[bed.id],
        previous: facilitiesTrivia.previous[bed.id],
        col: "col-start-2",
      };
      oxygen += 4;
    } else if (ICU.includes(bed.id)) {
      cards[icu] = {
        name: bed.name,
        current: facilitiesTrivia.current[bed.id],
        previous: facilitiesTrivia.previous[bed.id],
        col: "col-start-3",
      };
      icu += 4;
    } else if (VENTILATOR.includes(bed.id)) {
      cards[ventilator] = {
        name: bed.name,
        current: facilitiesTrivia.current[bed.id],
        previous: facilitiesTrivia.previous[bed.id],
        col: "col-start-4",
      };
      ventilator += 4;
    }
  });

  AVAILABILITY_TYPES_ORDERED.forEach((bedId) => {
    if (!facilitiesTrivia?.current[bedId]?.total) return;
    if (ORDINARY.includes(bedId)) {
      cards[ordinary] = {
        name: AVAILABILITY_TYPES[bedId],
        current: facilitiesTrivia.current[bedId],
        previous: facilitiesTrivia.previous[bedId],
        col: "col-start-1",
      };
      ordinary += 4;
    } else if (OXYGEN.includes(bedId)) {
      cards[oxygen] = {
        name: AVAILABILITY_TYPES[bedId],
        current: facilitiesTrivia.current[bedId],
        previous: facilitiesTrivia.previous[bedId],
        col: "col-start-2",
      };
      oxygen += 4;
    } else if (ICU.includes(bedId)) {
      cards[icu] = {
        name: AVAILABILITY_TYPES[bedId],
        current: facilitiesTrivia.current[bedId],
        previous: facilitiesTrivia.previous[bedId],
        col: "col-start-3",
      };
      icu += 4;
    } else if (VENTILATOR.includes(bedId)) {
      cards[ventilator] = {
        name: AVAILABILITY_TYPES[bedId],
        current: facilitiesTrivia.current[bedId],
        previous: facilitiesTrivia.previous[bedId],
        col: "col-start-4",
      };
      ventilator += 4;
    }
  });

  return cards.map((card, index) =>
    card.name ? (
      <RadialCard
        label={card.name}
        count={facilitiesTrivia.current.count}
        current={card.current}
        previous={card.previous}
        key={card.name}
        col={card.col}
      />
    ) : (
      index < highestExistingCard(cards) && (
        <div
          key={index}
          className="flex items-center justify-center w-full h-full text-gray-400 dark:text-gray-500 text-xs font-bold bg-gray-100 dark:bg-transparent border dark:border-gray-900 rounded-md md:text-sm"
        >
          {`No ${typeOfBed(index + 1)} Bed`}
        </div>
      )
    )
  );
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

  return (
    <section className="my-8 px-6 py-4 dark:bg-gray-700 bg-white">
      <h2 className="text-green-500 text-lg font-bold">Capacity</h2>
      <div className="mb-4 mt-8">
        {/* <div className="grid-col-1 grid gap-6 mb-8 md:grid-cols-4">
        {AVAILABILITY_TYPES_TOTAL_ORDERED.map(
          (k) =>
            facilitiesTrivia?.current[k.id]?.total ? (
              <RadialCard
                label={k.name}
                count={facilitiesTrivia.current.count}
                current={facilitiesTrivia.current[k.id]}
                previous={facilitiesTrivia.previous[k.id]}
                key={k.name}
              />
            )
              : null
        )}
      </div> */}

        <div className="grid-col-1 grid gap-6 mb-8 md:grid-cols-4">
          {renderCapacityCards(facilitiesTrivia)}
          {/* {AVAILABILITY_TYPES_ORDERED.map(
          (k) =>
            facilitiesTrivia.current[k].total ? (
              <RadialCard
                label={AVAILABILITY_TYPES[k]}
                count={facilitiesTrivia.current.count}
                current={facilitiesTrivia.current[k]}
                previous={facilitiesTrivia.previous[k]}
                key={k}
              />
            ) : null
        )} */}
        </div>
      </div>
    </section>
  );
};

export default Capacity;
