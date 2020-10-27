import { Button } from "@saanuregh/react-ui";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { lazy, Suspense, useState } from "react";
import { ArrowRight } from "react-feather";
import { animated, useTransition } from "react-spring";
import useSWR from "swr";

import { careSummary } from "../../utils/api";
import {
  AVAILABILITY_TYPES,
  AVAILABILITY_TYPES_ORDERED,
  AVAILABILITY_TYPES_PROXY,
} from "../../utils/constants";
import {
  dateString,
  getNDateAfter,
  getNDateBefore,
  processFacilities,
} from "../../utils/utils";
import RadialCard from "../Chart/RadialCard";
import { Pill } from "../Pill/Pill";
import { ValuePill } from "../Pill/ValuePill";
import ThemedSuspense from "../ThemedSuspense";
import { SectionTitle } from "../Typography/Title";

const FacilityTable = lazy(() => import("./FacilityTable"));
const CapacityForecast = lazy(() => import("./CapacityForecast"));
const Map = lazy(() => import("../DistrictDashboard/Map"));
dayjs.extend(relativeTime);

const showBedsTypes = (ids, c) => {
  return (
    <table className="table-auto w-full">
      <thead>
        <tr className="border-b text-xxs py-px space-x-4">
          <th />
          <th>Total</th>
          <th>Used</th>
          <th>Vacant</th>
        </tr>
      </thead>
      <tbody>
        {ids.map((i) => {
          return (
            <tr className="border-b text-xs py-px" key={i}>
              <td className="text-xxs">{AVAILABILITY_TYPES_PROXY[i]}</td>
              <td>{c.capacity[i]?.total_capacity || "0"}</td>
              <td>{c.capacity[i]?.current_capacity || "0"}</td>
              <td>
                {(c.capacity[i]?.total_capacity || 0) -
                  c.capacity[i]?.current_capacity || 0}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

function Capacity({ filterDistrict, filterFacilityTypes, date }) {
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
    actualDischargedPatients: 0,
    actualLivePatients: 0,
    count: 0,
    oxygen: 0,
  };

  const [forecast, setForecast] = useState(false);
  const { data } = useSWR(
    ["Capacity", date, filterDistrict.id],
    (url, date, district) =>
      careSummary(
        "facility",
        dateString(getNDateBefore(date, 1)),
        dateString(getNDateAfter(date, 1)),
        district
      ).then((r) => r)
  );
  const filtered = processFacilities(data.results, filterFacilityTypes);
  const facilitiesTrivia = filtered.reduce(
    (a, c) => {
      const key = c.date === dateString(date) ? "current" : "previous";
      a[key].count += 1;
      a[key].oxygen += c.oxygenCapacity || 0;
      a[key].actualLivePatients += c.actualLivePatients || 0;
      a[key].actualDischargedPatients += c.actualDischargedPatients || 0;
      Object.keys(AVAILABILITY_TYPES).forEach((k) => {
        a[key][k].used += c.capacity[k]?.current_capacity || 0;
        a[key][k].total += c.capacity[k]?.total_capacity || 0;
      });
      return a;
    },
    {
      current: JSON.parse(JSON.stringify(initialFacilitiesTrivia)),
      previous: JSON.parse(JSON.stringify(initialFacilitiesTrivia)),
    }
  );

  const transitions = useTransition(forecast, null, {
    enter: { opacity: 1 },
    from: { opacity: 0 },
    leave: { opacity: 0 },
  });

  return transitions.map(({ item, key, props }) =>
    item ? (
      <animated.div key={key} style={props}>
        <CapacityForecast
          filterDistrict={filterDistrict}
          filterFacilityTypes={filterFacilityTypes}
          date={date}
          setForecast={setForecast}
        />
      </animated.div>
    ) : (
      <animated.div key={key} style={props}>
        <div className="flex flex-row-reverse mb-8 overflow-y-auto pb-4 space-x-2 md:flex-row md:h-6 md:justify-end md:pb-0">
          <ValuePill
            title="Facility Count"
            value={facilitiesTrivia.current.count}
          />
          <ValuePill
            title="Oxygen Capacity"
            value={facilitiesTrivia.current.oxygen}
          />
          <ValuePill
            title="Live Patients"
            value={facilitiesTrivia.current.actualLivePatients}
          />
          <ValuePill
            title="Discharged Patients"
            value={facilitiesTrivia.current.actualDischargedPatients}
          />
          <Pill title="Forecast">
            <Button
              size="small"
              onClick={() => setForecast(true)}
              className="bg-transparent shadow-xs w-full"
            >
              <ArrowRight className="h-4" />
            </Button>
          </Pill>
        </div>
        <div className="grid-col-1 grid gap-6 mb-8 md:grid-cols-4">
          {AVAILABILITY_TYPES_ORDERED.map((k) => (
            <RadialCard
              label={AVAILABILITY_TYPES[k]}
              count={facilitiesTrivia.current.count}
              current={facilitiesTrivia.current[k]}
              previous={facilitiesTrivia.previous[k]}
              key={k}
            />
          ))}
        </div>
        <Suspense fallback={<ThemedSuspense />}>
          <FacilityTable
            className="mb-8"
            columns={[
              "Name",
              "Last Updated",
              "Oxygen",
              "Patients/\nDischarged",
              "Ventilators",
              "ICU",
              "Oxygen Beds",
              "Ordinary Beds",
            ]}
            data={filtered.reduce((a, c) => {
              if (c.date !== dateString(date)) {
                return a;
              }
              return [
                ...a,
                [
                  [c.name, c.facilityType, c.phoneNumber],
                  dayjs(c.modifiedDate).fromNow(),
                  c.oxygenCapacity,
                  `${c.actualLivePatients}/${c.actualDischargedPatients}`,
                  showBedsTypes([20, 100, 70], c),
                  showBedsTypes([10, 110, 50], c),
                  showBedsTypes([150, 120, 60], c),
                  showBedsTypes([1, 30, 60], c),
                ],
              ];
            }, [])}
            exported={{
              data: filtered.reduce((a, c) => {
                if (c.date !== dateString(date)) {
                  return a;
                }
                return [
                  ...a,
                  {
                    "Govt/Pvt": c.facilityType.startsWith("Govt")
                      ? "Govt"
                      : "Pvt",
                    "Hops/CFLTC":
                      c.facilityType === "First Line Treatment Centre"
                        ? "CFLTC"
                        : "Hops",
                    "Hospital/CFLTC Address": c.address,
                    "Hospital/CFLTC Name": c.name,
                    Mobile: c.phoneNumber,
                    ...AVAILABILITY_TYPES_ORDERED.reduce((t, x) => {
                      const y = { ...t };
                      y[`Current ${AVAILABILITY_TYPES[x]}`] =
                        c.capacity[x]?.current_capacity || 0;
                      y[`Total ${AVAILABILITY_TYPES[x]}`] =
                        c.capacity[x]?.total_capacity || 0;
                      return y;
                    }, {}),
                  },
                ];
              }, []),
              filename: "capacity_export.csv",
            }}
          />
        </Suspense>

        <SectionTitle>Map</SectionTitle>
        <Suspense fallback={<ThemedSuspense />}>
          <Map
            className="mb-8"
            facilities={filtered.filter((f) => f.date === dateString(date))}
            district={filterDistrict.name}
          />
        </Suspense>
      </animated.div>
    )
  );
}

export default Capacity;
