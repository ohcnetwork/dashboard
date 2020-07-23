import * as dayjs from "dayjs";
import "dayjs/locale/en-in";
import React, { useContext } from "react";
import { animated, config, useSpring } from "react-spring";
import useSWR from "swr";
import { AuthContext } from "../../context/AuthContext";
import { careFacilitySummary } from "../../utils/api";
import { availabilityTypes } from "../../utils/constants";
import { dateString, getNDateAfter, getNDateBefore } from "../../utils/utils";
import RadialCard from "../Chart/RadialCard";
import Map from "../DistrictDashboard/Map";
import { SectionTitle } from "../Typography/Title";
import FacilityTable from "./FacilityTable";

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
  const token = auth.token;
  const { data, error } = useSWR(
    ["Capacity", date, token],
    (url, date, token) =>
      careFacilitySummary(
        token,
        dateString(getNDateBefore(date, 1)),
        dateString(getNDateAfter(date, 1))
      ).then((r) => r),
    { suspense: true, loadingTimeout: 10000 }
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
  const filteredFacilities = facilities.filter(
    (f) =>
      f.districtId === filterDistrict.id &&
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

  return (
    <>
      <div className="flex flex-row justify-between">
        <SectionTitle>
          <animated.span>
            {count.interpolate((x) => `Facility Count: ${Math.round(x)}`)}
          </animated.span>
        </SectionTitle>
        <SectionTitle>
          <animated.span>
            {oxygen.interpolate((x) => `Oxygen Capacity: ${Math.round(x)}`)}
          </animated.span>
        </SectionTitle>
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
      <Map
        className="mb-8"
        facilities={filteredFacilities.filter(
          (f) => f.date === dateString(date)
        )}
        district={filterDistrict.name}
      ></Map>
    </>
  );
}

export default Capacity;
