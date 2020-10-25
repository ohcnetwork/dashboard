import { Button } from "@saanuregh/react-ui";
import * as dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { lazy, Suspense, useContext, useState } from "react";
import { ArrowRight } from "react-feather";
import { animated, useTransition } from "react-spring";
import useSWR from "swr";
import { AuthContext } from "../../context/AuthContext";
import { careSummary } from "../../utils/api";
import {
  AVAILABILITY_TYPES,
  AVAILABILITY_TYPES_ORDERED,
} from "../../utils/constants";
import { dateString, getNDateAfter, getNDateBefore } from "../../utils/utils";
import RadialCard from "../Chart/RadialCard";
import { Pill } from "../Pill/Pill";
import { ValuePill } from "../Pill/ValuePill";
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
    actualLivePatients: 0,
    actualDischargedPatients: 0,
    1: { total: 0, used: 0 },
    2: { total: 0, used: 0 },
    3: { total: 0, used: 0 },
    10: { total: 0, used: 0 },
    20: { total: 0, used: 0 },
    30: { total: 0, used: 0 },
    40: { total: 0, used: 0 },
    50: { total: 0, used: 0 },
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

  const facilities = data.results.map(
    ({ data: facility, created_date, modified_date }) => ({
      date: dateString(new Date(created_date)),
      id: facility.id,
      name: facility.name,
      districtId: facility.district,
      location: facility.location,
      address: facility.address,
      phone_number: facility.phone_number,
      facilityType: facility.facility_type || "Unknown",
      oxygenCapacity: facility.oxygen_capacity,
      modifiedDate: facility.availability.length
        ? Math.max(
            ...facility.availability.map((a) => new Date(a.modified_date))
          )
        : facility.modified_date,
      capacity: facility.availability.reduce((cAcc, cCur) => {
        return {
          ...cAcc,
          [cCur.room_type]: cCur,
        };
      }, {}),
      actualLivePatients: facility.actual_live_patients,
      actualDischargedPatients: facility.actual_discharged_patients,
    })
  );
  const filteredFacilities = facilities.filter((f) =>
    filterFacilityTypes.includes(f.facilityType)
  );
  const facilitiesTrivia = filteredFacilities.reduce(
    (a, c) => {
      let key = c.date === dateString(date) ? "current" : "previous";
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
          <ValuePill
            title={"Facility Count"}
            value={facilitiesTrivia.current.count}
          />
          <ValuePill
            title={"Oxygen Capacity"}
            value={facilitiesTrivia.current.oxygen}
          />
          <ValuePill
            title={"Live Patients"}
            value={facilitiesTrivia.current.actualLivePatients}
          />
          <ValuePill
            title={"Discharged Patients"}
            value={facilitiesTrivia.current.actualDischargedPatients}
          />
          <Pill title={"Forecast"}>
            <Button
              size="small"
              onClick={() => setForecast(true)}
              className="bg-transparent shadow-xs"
            >
              <ArrowRight className="h-4" />
            </Button>
          </Pill>
        </div>
        <div className="grid grid-cols-4 gap-6 mb-8">
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
              "Live Patients",
              "Discharged Patients",
              ...AVAILABILITY_TYPES_ORDERED.map((k) => AVAILABILITY_TYPES[k]),
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
                  c.actualLivePatients,
                  c.actualDischargedPatients,
                  ...AVAILABILITY_TYPES_ORDERED.map((i) =>
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
                    ...AVAILABILITY_TYPES_ORDERED.reduce((t, x) => {
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
