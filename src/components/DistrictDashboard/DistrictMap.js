import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { lazy, Suspense, useMemo } from "react";
import { animated, useTransition } from "react-spring";
import useSWR from "swr";
import { careSummary } from "../../utils/api";
import {
  dateString,
  getNDateAfter,
  getNDateBefore,
  processFacilities,
} from "../../utils/utils";
import ThemedSuspense from "../ThemedSuspense";
import { SectionTitle } from "../Typography/Title";

const CapacityMap = lazy(() => import("../DistrictDashboard/CapacityMap"));
dayjs.extend(relativeTime);

function DistrictMap({ filterDistrict, filterFacilityTypes, date }) {
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
  const todayFiltered = useMemo(() => {
    return processFacilities(data.results, filterFacilityTypes).filter(
      (f) => f.date === dateString(date)
    );
  }, []);

  const transitions = useTransition(null, {
    enter: { opacity: 1 },
    from: { opacity: 0 },
    leave: { opacity: 0 },
  });

  return transitions.map(({ item, key, props }) => (
    <animated.div key={key} style={props}>
      <div id="capacity-map">
        <SectionTitle>Map</SectionTitle>
      </div>
      <Suspense fallback={<ThemedSuspense />}>
        <CapacityMap
          className="mb-8"
          facilities={todayFiltered}
          district={filterDistrict.name}
        />
      </Suspense>
    </animated.div>
  ));
}

export default DistrictMap;
