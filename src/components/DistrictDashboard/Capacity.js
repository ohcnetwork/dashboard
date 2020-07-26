import { Button } from "@windmill/react-ui";
import * as dayjs from "dayjs";
import "dayjs/locale/en-in";
import React, { lazy, Suspense, useContext, useState } from "react";
import { ArrowRight } from "react-feather";
import { animated, config, useSpring, useTransition } from "react-spring";
import useSWR from "swr";
import { AuthContext } from "../../context/AuthContext";
import { careSummary } from "../../utils/api";
import { availabilityTypes } from "../../utils/constants";
import { dateString, getNDateAfter, getNDateBefore } from "../../utils/utils";
import RadialCard from "../Chart/RadialCard";
import ThemedSuspense from "../ThemedSuspense";
import { SectionTitle } from "../Typography/Title";
import FacilityTable from "./FacilityTable";
const CapacityForecast = lazy(() => import("./CapacityForecast"));
const Map = lazy(() => import("../DistrictDashboard/Map"));

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
    facilityType: facility.facility_type || "Unknown",
    oxygenCapacity: facility.oxygen_capacity,
    modifiedDate: facility.modified_date,
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
      Object.keys(availabilityTypes).forEach((k) => {
        a[key][availabilityTypes[k].toLowerCase()].used +=
          c.capacity[k]?.current_capacity || 0;
        a[key][availabilityTypes[k].toLowerCase()].total +=
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
          {Object.values(availabilityTypes).map((k) => (
            <RadialCard
              label={k + "s used"}
              dataKey={k.toLowerCase()}
              data={facilitiesTrivia}
              key={k.toLowerCase()}
            />
          ))}
        </div>
        <FacilityTable
          className="mb-8"
          columns={[
            "Name",
            "Last Updated",
            "Oxygen",
            ...Object.values(availabilityTypes).reverse(),
          ]}
          data={filteredFacilities.reduce((a, c) => {
            if (c.date !== dateString(date)) {
              return a;
            }
            return [
              ...a,
              [
                [c.name, c.facilityType],
                dayjs(c.modifiedDate)
                  .locale("en-in")
                  .format("h:mm:ssA DD/MM/YYYY"),
                c.oxygenCapacity,
                ...Object.keys(availabilityTypes)
                  .reverse()
                  .map((i) =>
                    c.capacity[i]?.total_capacity
                      ? `${c.capacity[i]?.current_capacity}/${c.capacity[i]?.total_capacity}`
                      : "-"
                  ),
              ],
            ];
          }, [])}
        ></FacilityTable>
        <SectionTitle>Map</SectionTitle>
        <Suspense fallback={ThemedSuspense} >
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
