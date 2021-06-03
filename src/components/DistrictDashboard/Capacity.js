import { Button, Pagination, Input } from "@windmill/react-ui";
import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { lazy, Suspense, useEffect, useState, useMemo } from "react";
import { ArrowRight } from "react-feather";
import { animated, useTransition } from "react-spring";
import useSWR from "swr";
import { CSVLink } from "react-csv";
import fuzzysort from "fuzzysort";

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
import { CapacityCard } from "../Cards/CapacityCard";
import RadialCard from "../Chart/RadialCard";
import { Pill } from "../Pill/Pill";
import { ValuePill } from "../Pill/ValuePill";
import ThemedSuspense from "../ThemedSuspense";
import { SectionTitle } from "../Typography/Title";

const CapacityForecast = lazy(() => import("./CapacityForecast"));
const GMap = lazy(() => import("../DistrictDashboard/GMap"));
dayjs.extend(relativeTime);

const positiveVal = (value) => (value < 0 ? 0 : value);

const getCapacityBedData = (ids, facility) => {
  return ids.map((i) => {
    const total = Number.parseInt(facility.capacity[i]?.total_capacity || 0);
    const current = Number.parseInt(
      facility.capacity[i]?.current_capacity || 0
    );
    const vacant = total - current;
    return {
      used: current,
      total: total,
      vacant: vacant,
    };
  });
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
    todayFiltered,
    capacityCardData,
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

    const capacityCardData = filtered.reduce((acc, facility) => {
      if (facility.date !== dateString(date)) {
        return acc;
      }
      return [
        ...acc,
        {
          facility_name: facility.name,
          facility_type: facility.facilityType,
          phone_number: facility.phoneNumber,
          last_updated: dayjs(facility.modifiedDate).fromNow(),
          patient_discharged: `${facility.actualLivePatients || 0}/${
            facility.actualDischargedPatients || 0
          }`,
          covid: getCapacityBedData([30, 120, 110, 100], facility),
          non_covid: getCapacityBedData([1, 150, 10, 20], facility),
        },
      ];
    }, []);

    const todayFiltered = filtered.filter((f) => f.date === dateString(date));
    return {
      facilitiesTrivia,
      exported,
      todayFiltered,
      capacityCardData,
    };
  }, [data, filterFacilityTypes]);

  const transitions = useTransition(forecast, null, {
    enter: { opacity: 1 },
    from: { opacity: 0 },
    leave: { opacity: 0 },
  });

  const resultsPerPage = 10;
  const [filteredData, setFilteredData] = useState(capacityCardData);
  const [page, setPage] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setFilteredData(
      searchTerm
        ? capacityCardData.filter((v) =>
            fuzzysort
              .go(
                searchTerm,
                capacityCardData.map((d) => ({ ...d, 0: d.facility_name })),
                { key: "0" }
              )
              .map((v) => v.target)
              .includes(v.facility_name)
          )
        : capacityCardData
    );
  }, [capacityCardData, searchTerm]);

  useEffect(() => {
    setTableData(
      filteredData.slice((page - 1) * resultsPerPage, page * resultsPerPage)
    );
  }, [filteredData, page]);

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

        <div id="facility-capacity-cards" className="mb-16 mt-16">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <SectionTitle>Facilities</SectionTitle>
            <div className="flex max-w-full space-x-4">
              {exported && (
                <CSVLink data={exported.data} filename={exported.filename}>
                  <Button block>Export</Button>
                </CSVLink>
              )}
              <Input
                className="sw-40 rounded-lg sm:w-auto"
                placeholder={"Search Facility"}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>

          {tableData.map((data, index) => (
            <CapacityCard
              key={index}
              data={data}
              key={data.facility_name}
              key={data.external_id}
            />
          ))}
          <Pagination
            totalResults={filteredData.length}
            resultsPerPage={resultsPerPage}
            label="Navigation"
            onChange={setPage}
          />
        </div>

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
