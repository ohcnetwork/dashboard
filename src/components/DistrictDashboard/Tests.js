import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { lazy, Suspense } from "react";
import useSWR from "swr";

import { careSummary } from "../../utils/api";
import { TESTS_TYPES } from "../../utils/constants";
import {
  dateString,
  getNDateAfter,
  getNDateBefore,
  processFacilities,
} from "../../utils/utils";
import { InfoCard } from "../Cards/InfoCard";
import { ValuePill } from "../Pill/ValuePill";
import ThemedSuspense from "../ThemedSuspense";

const FacilityTable = lazy(() => import("./FacilityTable"));
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

function Tests({ filterDistrict, filterFacilityTypes, date }) {
  const initialFacilitiesTrivia = {
    count: 0,
    result_awaited: 0,
    test_discarded: 0,
    total_patients: 0,
    result_negative: 0,
    result_positive: 0,
  };

  const { data } = useSWR(
    ["Tests", date, filterDistrict.id],
    (url, date, district) =>
      careSummary(
        "tests",
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
      Object.keys(TESTS_TYPES).forEach((k) => {
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

  return (
    <>
      <div className="flex flex-row h-6 justify-end mb-8 space-x-2">
        <ValuePill
          title="Facility Count"
          value={facilitiesTrivia.current.count}
        />
        <ValuePill
          title="Patient Count"
          value={facilitiesTrivia.current.total_patients}
        />
      </div>
      <div className="grid gap-6 grid-cols-4 mb-8">
        {Object.keys(TESTS_TYPES).map((k, i) => {
          if (k !== "total_patients") {
            return (
              <InfoCard
                key={i}
                title={TESTS_TYPES[k]}
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
          columns={["Name", "Last Updated", ...Object.values(TESTS_TYPES)]}
          data={filtered.reduce((a, c) => {
            if (c.date !== dateString(date)) {
              return a;
            }
            return [
              ...a,
              [
                [c.name, c.facilityType, c.phoneNumber],
                dayjs(c.modifiedDate, "DD-MM-YYYY HH:mm").fromNow(),
                ...Object.keys(TESTS_TYPES).map((i) => c[i]),
              ],
            ];
          }, [])}
          exported={{
            filename: "tests_export.csv",
            data: filtered.reduce((a, c) => {
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
                  Mobile: c.phoneNumber,
                  ...Object.keys(TESTS_TYPES).reduce((t, x) => {
                    const y = { ...t };
                    y[x] = c[x];
                    return y;
                  }, {}),
                },
              ];
            }, []),
          }}
        />
      </Suspense>
    </>
  );
}

export default Tests;
