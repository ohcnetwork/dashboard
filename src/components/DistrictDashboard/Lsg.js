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
} from "../../utils/utils";
import { InfoCard } from "../Cards/InfoCard";
import { ValuePill } from "../Pill/ValuePill";
import ThemedSuspense from "../ThemedSuspense";

const FacilityTable = lazy(() => import("./FacilityTable"));
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

const initiallsgTrivia = {
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

function Lsg({ filterDistrict, filterFacilityTypes, date }) {
  const { data } = useSWR(
    ["Patient", date, filterDistrict.id],
    (url, date, district) =>
      careSummary(
        "district/patient",
        dateString(getNDateBefore(date, 1)),
        dateString(getNDateAfter(date, 1)),
        district
      )
  );

  const { lsgTrivia, exported, tableData } = useMemo(() => {

    const filtered =
      data.results
        .map(({ data, created_date }) => (
          Object.keys(data).map((key, _index) => {
            return {
              created_date: dateString(new Date(created_date)),
              total: Object.keys(PATIENT_TYPES).map((k) => data[key][`total_patients_${k}`] || 0).reduce((a, b) => a + b, 0),
              total_today: Object.keys(PATIENT_TYPES).map((k) => data[key][`today_patients_${k}`] || 0).reduce((a, b) => a + b, 0),
              ...data[key]
            };
          })
        )).flat().sort((a, b) => b.total - a.total)

    const lsgTrivia = filtered.reduce(
      (a, c) => {
        const key = c.created_date === dateString(date) ? "current" : "previous";
        a[key].count += 1;
        Object.keys(PATIENT_TYPES).forEach((k) => {
          a[key][k].today += c[`today_patients_${k}`] || 0;
          a[key][k].total += c[`total_patients_${k}`] || 0;
        });
        return a;
      },
      {
        current: JSON.parse(JSON.stringify(initiallsgTrivia)),
        previous: JSON.parse(JSON.stringify(initiallsgTrivia)),
      }
    );
    const tableData = filtered.reduce((a, c) => {
      if (c.created_date !== dateString(date)) {
        return a;
      }
      return [
        ...a,
        [
          [c.name],
          <div className="flex">
            <p className="font-semibold">{c.total || 0}</p>
            <span className="text-sm ml-2">
              {c.total_today === 0 ? "" : c.total_today > 0 ? `+${c.total_today}` : `-${c.total_today}`}
            </span>
          </div>,
          c.total_inactive,
          ...Object.keys(PATIENT_TYPES).map((k) => {
            const delta = c[`today_patients_${k}`] || 0;
            return (
              <div key={k} className="flex">
                <p className="">{c[`total_patients_${k}`] || 0}</p>
                <span className="text-sm ml-2">
                  {delta === 0 ? "" : delta > 0 ? `+${delta}` : `-${delta}`}
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
        if (c.created_date !== dateString(date)) {
          return a;
        }
        return [
          ...a,
          {
            "Name": c.name,
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
    return { lsgTrivia, exported, tableData };
  }, [data, filterFacilityTypes]);

  return (
    <>
      <div className="grid gap-1 grid-rows-none mb-8 sm:grid-flow-col-dense sm:grid-rows-1 sm:place-content-end">
        <ValuePill
          title="Lsg Count"
          value={lsgTrivia.current.count}
        />
      </div>

      <div className="grid-col-1 grid gap-6 mb-8 md:grid-cols-4">
        {Object.keys(PATIENT_TYPES).map((k) => (
          <InfoCard
            key={k}
            title={PATIENT_TYPES[k]}
            value={lsgTrivia.current[k].total}
            delta={lsgTrivia.current[k].today}
          />
        ))}
      </div>
      <Suspense fallback={<ThemedSuspense />}>
        <FacilityTable
          title="Lsg"
          className="mb-8"
          columns={["Name of LSG", <div>Live</div>, "Discharged", ...Object.values(PATIENT_TYPES)]}
          data={tableData}
          exported={exported}
        />
      </Suspense>
    </>
  );
}

export default Lsg;
