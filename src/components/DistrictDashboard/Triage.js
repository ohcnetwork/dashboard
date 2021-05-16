import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { lazy, Suspense, useMemo } from "react";
import useSWR from "swr";

import { careSummary } from "../../utils/api";
import { TRIAGE_TYPES } from "../../utils/constants";
import {
  dateString,
  getNDateAfter,
  getNDateBefore,
  processFacilities,
} from "../../utils/utils";
import { InfoCard } from "../Cards/InfoCard";
import { ValuePill } from "../Pill/ValuePill";
import ThemedSuspense from "../ThemedSuspense";
import GenericTable from "./GenericTable";

dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

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

function Triage({ filterDistrict, filterFacilityTypes, date }) {
  const { data } = useSWR(
    ["Triage", date, filterDistrict.id],
    (url, date, district) =>
      careSummary(
        "triage",
        dateString(getNDateBefore(date, 1)),
        dateString(getNDateAfter(date, 1)),
        district
      )
  );
  const { facilitiesTrivia, exported, tableData } = useMemo(() => {
    const filtered = processFacilities(data.results, filterFacilityTypes);
    const facilitiesTrivia = filtered.reduce(
      (a, c) => {
        const key = c.date === dateString(date) ? "current" : "previous";
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
    const tableData = filtered.reduce((a, c) => {
      if (c.date !== dateString(date)) {
        return a;
      }
      return [
        ...a,
        [
          [c.name, c.facilityType, c.phoneNumber],
          dayjs(c.modifiedDate).fromNow(),
          ...["visited", "referred", "isolation", "home_quarantine"].map(
            (i) =>
              `${c["avg_patients_" + i] || 0}/${c["total_patients_" + i] || 0}`
          ),
        ],
      ];
    }, []);
    const exported = {
      filename: "triage_export.csv",
      data: filtered.reduce((a, c) => {
        if (c.date !== dateString(date)) {
          return a;
        }
        return [
          ...a,
          {
            "Hospital/CFLTC Name": c.name,
            "Hospital/CFLTC Address": c.address,
            "Govt/Pvt": c.facilityType.startsWith("Govt") ? "Govt" : "Pvt",
            "Hops/CFLTC":
              c.facilityType === "First Line Treatment Centre"
                ? "CFLTC"
                : "Hops",
            Mobile: c.phoneNumber,
            ...Object.keys(TRIAGE_TYPES).reduce((t, x) => {
              const y = { ...t };
              y[TRIAGE_TYPES[x]] = c[x] || 0;
              return y;
            }, {}),
          },
        ];
      }, []),
    };
    return { facilitiesTrivia, exported, tableData };
  }, [data, filterFacilityTypes]);

  return (
    <>
      <div className="grid gap-1 grid-rows-none mb-8 sm:grid-flow-col-dense sm:grid-rows-1 sm:place-content-end">
        <ValuePill
          title="Facility Count"
          value={facilitiesTrivia.current.count}
        />
      </div>
      <div className="grid-col-1 grid gap-6 mb-8 md:grid-cols-4">
        {Object.keys(TRIAGE_TYPES).map((k, i) => {
          if (k !== "total_patients") {
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
        <GenericTable
          className="mb-8"
          columns={[
            "Name",
            "Last Updated",
            ...[
              "Patients visited",
              "Patients referred",
              "Patients isolation",
              "Patients home quarantine",
            ],
          ]}
          data={tableData}
          exported={exported}
        />
      </Suspense>
    </>
  );
}

export default Triage;
