import * as dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { lazy, Suspense, useContext } from "react";
import { animated, config, useSpring } from "react-spring";
import useSWR from "swr";
import { AuthContext } from "../../context/AuthContext";
import { careSummary } from "../../utils/api";
import { TRIAGE_TYPES } from "../../utils/constants";
import { dateString, getNDateAfter, getNDateBefore } from "../../utils/utils";
import { InfoCard } from "../Cards/InfoCard";
import ThemedSuspense from "../ThemedSuspense";
const FacilityTable = lazy(() => import("./FacilityTable"));
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

function Triage({ filterDistrict, filterFacilityTypes, date }) {
  const initialFacilitiesTrivia = {
    count: 0,
    avg_patients_visited: 0,
    avg_patients_referred: 0,
    avg_patients_isolation: 0,
    total_patients_visited: 0,
    total_patients_referred: 0,
    total_patients_isolation: 0,
    avg_patients_home_quarantine: 0,
    total_patients_home_quarantine: 0,
  };

  const { auth } = useContext(AuthContext);
  const { data, error } = useSWR(
    ["Triage", date, auth.token, filterDistrict.id],
    (url, date, token, district) =>
      careSummary(
        token,
        "triage",
        dateString(getNDateBefore(date, 1)),
        dateString(getNDateAfter(date, 1)),
        district
      ).then((r) => r)
  );

  const facilities = data.results.map(({ data, facility, created_date }) => ({
    date: dateString(new Date(created_date)),
    ...data,
    id: facility.id,
    facilityType: facility.facility_type || "Unknown",
    location: facility.location,
    modifiedDate: data.modified_date,
  }));
  const filteredFacilities = facilities.filter((f) =>
    filterFacilityTypes.includes(f.facilityType)
  );
  const facilitiesTrivia = filteredFacilities.reduce(
    (a, c) => {
      let key = c.date === dateString(date) ? "current" : "previous";
      a[key].count += 1;
      Object.keys(TRIAGE_TYPES).forEach((k) => {
        a[key][k] += c[k];
        a[key][k] += c[k];
      });
      return a;
    },
    {
      current: JSON.parse(JSON.stringify(initialFacilitiesTrivia)),
      previous: JSON.parse(JSON.stringify(initialFacilitiesTrivia)),
    }
  );

  const { count } = useSpring({
    from: { count: 0 },
    to: {
      count: facilitiesTrivia.current.count || 0,
    },
    delay: 0,
    config: config.slow,
  });

  return (
    <>
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
      </div>
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        {Object.keys(TRIAGE_TYPES).map((k, i) => {
          if (k != "total_patients") {
            return (
              <InfoCard
                key={i}
                title={TRIAGE_TYPES[k]}
                value={facilitiesTrivia.current[k]}
                delta={
                  facilitiesTrivia.current[k] - facilitiesTrivia.previous[k]
                }
              />
            );
          }
        })}
      </div>

      <Suspense fallback={<ThemedSuspense />}>
        <FacilityTable
          className="mb-8"
          columns={[
            "Name",
            ...[
              "Patients visited",
              "Patients referred",
              "Patients isolation",
              "Patients home quarantine",
            ],
          ]}
          data={filteredFacilities.reduce((a, c) => {
            if (c.date !== dateString(date)) {
              return a;
            }
            return [
              ...a,
              [
                [c.facility_name, c.facilityType],
                ...["visited", "referred", "isolation", "home_quarantine"].map(
                  (i) => `${c["avg_patients_" + i]}/${c["total_patients_" + i]}`
                ),
              ],
            ];
          }, [])}
        ></FacilityTable>
      </Suspense>
    </>
  );
}

export default Triage;
