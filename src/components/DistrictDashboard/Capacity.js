import { Button } from "@windmill/react-ui";
import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { lazy, Suspense, useState, useMemo } from "react";
import { ArrowRight } from "react-feather";
import { animated, useTransition } from "react-spring";
import useSWR from "swr";

import { careSummary } from "../../utils/api";
import {
  AVAILABILITY_TYPES,
  AVAILABILITY_TYPES_ORDERED,
  AVAILABILITY_TYPES_PROXY,
  AVAILABILITY_TYPES_TOTAL_ORDERED,
  GOVT_FACILITY_TYPES,
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
import GenericTable from "./GenericTable";

const CapacityForecast = lazy(() => import("./CapacityForecast"));
const GMap = lazy(() => import("../DistrictDashboard/GMap"));
dayjs.extend(relativeTime);

const positiveVal = (value) => (value < 0 ? 0 : value);

const showBedsTypes = (ids, c) => {
  const data = ids.reduce((acc, i) => {
    const total = Number.parseInt(c.capacity[i]?.total_capacity || 0);
    const current = Number.parseInt(c.capacity[i]?.current_capacity || 0);
    const vacant = total - current;
    const critical = total > 0 && vacant / total < 0.2;
    return [
      ...acc,
      { title: AVAILABILITY_TYPES_PROXY[i], total, current, vacant },
    ];
  }, []);
  const total = positiveVal(data[0].total + data[1].total);
  const current = positiveVal(data[0].current + data[1].current);
  const vacant = positiveVal(data[0].vacant + data[1].vacant);
  const title = "Total";
  const critical = total > 0 && vacant / total < 0.2;
  if (data[0].total === 0 && data[1].total === 0) return React.null;
  return (
    <table className="table-auto w-full">
      <thead>
        <tr className="py-px text-xxs border-b space-x-4">
          <th />
          <th>Total</th>
          <th>Used</th>
          <th>Vacant</th>
        </tr>
      </thead>
      <tbody>
        {[...data, { total, current, vacant, critical, title }].map(
          ({ total, current, vacant, critical, title }, i) => (
            <tr
              key={i}
              className={clsx(
                "py-px text-xs border-b",
                data === 0 && "opacity-50",
                critical && "text-red-600"
              )}
            >
              <td className="text-xxs">{title}</td>
              <td>{total}</td>
              <td>{current}</td>
              <td>{vacant}</td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
};

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

function Capacity({ filterDistrict, filterFacilityTypes, date }) {
  const [forecast, setForecast] = useState(false);
  const { data } = useSWR(
    ["Capacity", date, filterDistrict.id],
    (url, date, district) =>
      careSummary(
        "facility",
        dateString(getNDateBefore(date, 1)),
        dateString(getNDateAfter(date, 1)),
        district
      )
  );
  const {
    facilitiesTrivia,
    exported,
    tableData,
    todayFiltered,
  } = useMemo(() => {
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

        AVAILABILITY_TYPES_TOTAL_ORDERED.forEach((k) => {
          let current_covid = c.capacity[k.covid]?.current_capacity || 0;
          let current_non_covid =
            c.capacity[k.non_covid]?.current_capacity || 0;
          let total_covid = c.capacity[k.covid]?.total_capacity || 0;
          let total_non_covid = c.capacity[k.non_covid]?.total_capacity || 0;
          a[key][k.id].used += current_covid + current_non_covid;
          a[key][k.id].total += total_covid + total_non_covid;
        });

        return a;
      },
      {
        current: JSON.parse(JSON.stringify(initialFacilitiesTrivia)),
        previous: JSON.parse(JSON.stringify(initialFacilitiesTrivia)),
      }
    );
    const exported = {
      data: filtered.reduce((a, c) => {
        if (c.date !== dateString(date)) {
          return a;
        }
        return [
          ...a,
          {
            "Govt/Pvt": GOVT_FACILITY_TYPES.includes(c.facilityType)
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
    };
    const tableData = filtered.reduce((a, c) => {
      if (c.date !== dateString(date)) {
        return a;
      }
      return [
        ...a,
        [
          [c.name, c.facilityType, c.phoneNumber, c.id],
          dayjs(c.modifiedDate).fromNow(),
          c.oxygenCapacity,
          `${c.actualLivePatients}/${c.actualDischargedPatients}`,
          showBedsTypes([1, 30], c),
          showBedsTypes([150, 120], c),
          showBedsTypes([10, 110], c),
          showBedsTypes([20, 100], c),
        ],
      ];
    }, []);
    const todayFiltered = filtered.filter((f) => f.date === dateString(date));
    return { facilitiesTrivia, exported, tableData, todayFiltered };
  }, [data, filterFacilityTypes]);

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
        <div className="grid gap-1 grid-rows-none mb-8 sm:grid-flow-col-dense sm:grid-rows-1 sm:place-content-end">
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
              className="w-full bg-transparent shadow-xs"
            >
              <ArrowRight className="h-4" />
            </Button>
          </Pill>
        </div>

        <div className="grid-col-1 grid gap-6 mb-8 md:grid-cols-4">
          {AVAILABILITY_TYPES_TOTAL_ORDERED.map((k) => (
            <RadialCard
              label={k.name}
              count={facilitiesTrivia.current.count}
              current={facilitiesTrivia.current[k.id]}
              previous={facilitiesTrivia.previous[k.id]}
              key={k.name}
            />
          ))}
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
          <GenericTable
            className="mb-8"
            columns={[
              "Name",
              "Last Updated",
              "Oxygen",
              "Patients/\nDischarged",
              "Ordinary Beds",
              "Oxygen Beds",
              "ICU",
              "Ventilators",
            ]}
            data={tableData}
            exported={exported}
          />
        </Suspense>
        <div id="capacity-map">
          <SectionTitle>Map</SectionTitle>
        </div>
        <Suspense fallback={<ThemedSuspense />}>
          <GMap
            className="mb-8"
            facilities={todayFiltered}
            district={filterDistrict}
          />
        </Suspense>
      </animated.div>
    )
  );
}

export default Capacity;
