import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { lazy, Suspense, useMemo } from "react";
import useSWR from "swr";

import { careSummary } from "../../utils/api";
import { PATIENT_TYPES } from "../../utils/constants";
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
  icu: { total: 0, today: 0 },
  oxygen_bed: { total: 0, today: 0 },
  not_admitted: { total: 0, today: 0 },
  home_isolation: { total: 0, today: 0 },
  isolation_room: { total: 0, today: 0 },
  home_quarantine: { total: 0, today: 0 },
  paediatric_ward: { total: 0, today: 0 },
  gynaecology_ward: { total: 0, today: 0 },
  icu_with_invasive_ventilator: { total: 0, today: 0 },
  icu_with_non_invasive_ventilator: { total: 0, today: 0 },
};

function Patient({ filterDistrict, filterFacilityTypes, date }) {
  const { data } = useSWR(
    ["Patient", date, filterDistrict.id],
    (url, date, district) =>
      careSummary(
        "patient",
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
        Object.keys(PATIENT_TYPES).forEach((k) => {
          a[key][k].today += c[`today_patients_${k}`] || 0;
          a[key][k].total += c[`total_patients_${k}`] || 0;
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
          [c.name, c.facilityType, c.phoneNumber, c.id],
          dayjs(c.modifiedDate, "DD-MM-YYYY HH:mm").fromNow(),
          ...Object.keys(PATIENT_TYPES).map((k) => {
            const delta = c[`today_patients_${k}`] || 0;
            return (
              <div key={k} className="flex">
                <p className="">{c[`total_patients_${k}`] || 0}</p>
                <span className="ml-2 text-sm">
                  {delta === 0 ? "-" : delta > 0 ? `+${delta}` : delta}
                </span>
              </div>
            );
          }),
        ],
      ];
    }, []);
    const exported = {
      filename: "patient_export.csv",
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
            ...Object.keys(PATIENT_TYPES).reduce((t, x) => {
              const y = { ...t };
              y[`Total Patient in ${PATIENT_TYPES[x]}`] =
                c[`total_patients_${x}`];
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
        {Object.keys(PATIENT_TYPES).map((k) => (
          <InfoCard
            key={k}
            title={PATIENT_TYPES[k]}
            value={facilitiesTrivia.current[k].total}
            delta={facilitiesTrivia.current[k].today}
          />
        ))}
      </div>
      <Suspense fallback={<ThemedSuspense />}>
        <GenericTable
          className="mb-8"
          columns={["Name", "Last Updated", ...Object.values(PATIENT_TYPES)]}
          data={tableData}
          exported={exported}
        />
      </Suspense>
    </>
  );
}

export default Patient;
