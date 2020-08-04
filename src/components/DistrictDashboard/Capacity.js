import { Button } from "@windmill/react-ui";
import * as dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { lazy, Suspense, useContext, useState } from "react";
import { ArrowRight } from "react-feather";
import { animated, config, useSpring, useTransition } from "react-spring";
import useSWR from "swr";
import { AuthContext } from "../../context/AuthContext";
import { careSummary } from "../../utils/api";
import { AVAILABILITY_TYPES } from "../../utils/constants";
import { dateString, getNDateAfter, getNDateBefore } from "../../utils/utils";
import RadialCard from "../Chart/RadialCard";
import ThemedSuspense from "../ThemedSuspense";
import { SectionTitle } from "../Typography/Title";
const FacilityTable = lazy(() => import("./FacilityTable"));
const CapacityForecast = lazy(() => import("./CapacityForecast"));
const Map = lazy(() => import("../DistrictDashboard/Map"));
dayjs.extend(relativeTime);

function Capacity({ filterDistrict, filterFacilityTypes, date }) {
  const initialFacilitiesTrivia = {
    count: 0,
    oxygen: 0,
    ventilator: { total: 0, used: 0 },
    icu: { total: 0, used: 0 },
    room: { total: 0, used: 0 },
    bed: { total: 0, used: 0 },
  };

  const { auth } = useContext(AuthContext);
  const [forecast, setForecast] = useState(false);
  const { data, error } = useSWR(
    ["Capacity", date, auth.token, filterDistrict.id],
    (url, date, token, district) =>
      careSummary(
        token,
        "facility",
        dateString(getNDateBefore(date, 1)),
        dateString(getNDateAfter(date, 1)),
        district
      ).then((r) => r)
  );

  const facilities = data.results.map(({ data: facility, created_date }) => ({
    date: dateString(new Date(created_date)),
    id: facility.id,
    name: facility.name,
    districtId: facility.district,
    location: facility.location,
    address: facility.address,
    phone_number: facility.phone_number,
    facilityType: facility.facility_type || "Unknown",
    oxygenCapacity: facility.oxygen_capacity,
    modifiedDate: Math.max(
      ...facility.availability.map((a) => new Date(a.modified_date))
    ),
    capacity: facility.availability.reduce((cAcc, cCur) => {
      return {
        ...cAcc,
        [cCur.room_type]: cCur,
      };
    }, {}),
  }));
  const filteredFacilities = facilities.filter((f) =>
    filterFacilityTypes.includes(f.facilityType)
  );
  const facilitiesTrivia = filteredFacilities.reduce(
    (a, c) => {
      let key = c.date === dateString(date) ? "current" : "previous";
      a[key].count += 1;
      a[key].oxygen += c.oxygenCapacity || 0;
      Object.keys(AVAILABILITY_TYPES).forEach((k) => {
        a[key][AVAILABILITY_TYPES[k].toLowerCase()].used +=
          c.capacity[k]?.current_capacity || 0;
        a[key][AVAILABILITY_TYPES[k].toLowerCase()].total +=
          c.capacity[k]?.total_capacity || 0;
      });
      return a;
    },
    {
      current: JSON.parse(JSON.stringify(initialFacilitiesTrivia)),
      previous: JSON.parse(JSON.stringify(initialFacilitiesTrivia)),
    }
  );

  const { count, oxygen } = useSpring({
    from: { count: 0, oxygen: 0 },
    to: {
      count: facilitiesTrivia.current.count || 0,
      oxygen: facilitiesTrivia.current.oxygen || 0,
    },
    delay: 0,
    config: config.slow,
  });

  const transitions = useTransition(forecast, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
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
        <div className="flex flex-row justify-end h-6 mb-8 space-x-2">
          <div className="flex items-center rounded-lg shadow-xs dark:bg-gray-800 dark:text-gray-200">
            <span className="mx-2 text-sm font-medium leading-none">
              Facility Count
            </span>
            <div className="flex items-center h-full bg-purple-600 rounded-lg">
              <animated.span className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium leading-5 text-white align-bottom rounded-md shadow-xs">
                {count.interpolate((x) => Math.round(x))}
              </animated.span>
            </div>
          </div>
          <div className="flex items-center rounded-lg shadow-xs dark:bg-gray-800 dark:text-gray-200">
            <span className="mx-2 text-sm font-medium leading-none">
              Oxygen Capacity
            </span>
            <div className="flex items-center h-full bg-purple-600 rounded-lg">
              <animated.span className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium leading-5 text-white align-bottom rounded-md shadow-xs">
                {oxygen.interpolate((x) => Math.round(x))}
              </animated.span>
            </div>
          </div>
          <div className="flex items-center rounded-lg shadow-xs dark:bg-gray-800 dark:text-gray-200">
            <span className="mx-2 text-sm font-medium leading-none">
              Forecast
            </span>
            <div className="flex h-full bg-purple-600 rounded-lg">
              <Button
                size="small"
                onClick={() => setForecast(true)}
                className="shadow-xs"
              >
                <ArrowRight className="h-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
          {Object.values(AVAILABILITY_TYPES).map((k) => (
            <RadialCard
              label={k + "s used"}
              dataKey={k.toLowerCase()}
              data={facilitiesTrivia}
              key={k.toLowerCase()}
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
              ...Object.values(AVAILABILITY_TYPES).reverse(),
            ]}
            data={filteredFacilities.reduce((a, c) => {
              if (c.date !== dateString(date)) {
                return a;
              }
              return [
                ...a,
                [
                  [c.name, c.facilityType, c.phone_number],
                  dayjs(c.modifiedDate).fromNow(),
                  c.oxygenCapacity,
                  ...Object.keys(AVAILABILITY_TYPES)
                    .reverse()
                    .map((i) =>
                      c.capacity[i]?.total_capacity
                        ? `${c.capacity[i]?.current_capacity}/${c.capacity[i]?.total_capacity}`
                        : "-"
                    ),
                ],
              ];
            }, [])}
            exported={{
              filename: "capacity_export.csv",
              data: filteredFacilities.reduce((a, c) => {
                if (c.date !== dateString(date)) {
                  return a;
                }
                return [
                  ...a,
                  {
                    "Hospital/CFLTC Name": c.name,
                    "Hospital/CFLTC Address": c.address,
                    "Govt/Pvt": c.facilityType.startsWith("Govt")
                      ? "Govt"
                      : "Pvt",
                    "Hops/CFLTC":
                      c.facilityType === "First Line Treatment Centre"
                        ? "CFLTC"
                        : "Hops",
                    Mobile: c.phone_number,
                    ...Object.keys(AVAILABILITY_TYPES).reduce((t, x) => {
                      let y = { ...t };
                      y[`Current ${AVAILABILITY_TYPES[x]}`] =
                        c.capacity[x]?.current_capacity || 0;
                      y[`Total ${AVAILABILITY_TYPES[x]}`] =
                        c.capacity[x]?.total_capacity || 0;
                      return y;
                    }, {}),
                  },
                ];
              }, []),
            }}
          ></FacilityTable>
        </Suspense>

        <SectionTitle>Map</SectionTitle>
        <Suspense fallback={<ThemedSuspense />}>
          <Map
            className="mb-8"
            facilities={filteredFacilities.filter(
              (f) => f.date === dateString(date)
            )}
            district={filterDistrict.name}
          ></Map>
        </Suspense>
      </animated.div>
    )
  );
}

export default Capacity;
