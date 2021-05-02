import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { lazy, Suspense, useMemo } from "react";
import useSWR from "swr";

import { careSummary } from "../../utils/api";
import { OXYGEN_TYPES } from "../../utils/constants";
import {
  dateString,
  getNDateAfter,
  getNDateBefore,
  processFacilities,
} from "../../utils/utils";
// import { InfoCard } from "../Cards/InfoCard";
// import { ValuePill } from "../Pill/ValuePill";
import ThemedSuspense from "../ThemedSuspense";

const FacilityTable = lazy(() => import("./FacilityTable"));
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

// const initialFacilitiesTrivia = {
//   count: 0,
//   avg_patients_visited: 0,
//   avg_patients_referred: 0,
//   avg_patients_isolation: 0,
//   total_patients_visited: 0,
//   total_patients_referred: 0,
//   total_patients_isolation: 0,
//   avg_patients_home_quarantine: 0,
//   total_patients_home_quarantine: 0,
// };

const showStockWithBurnRate = (inventoryItem) => {
  return inventoryItem ? (
    <div>
      <div className="text-md font-bold">{inventoryItem?.stock}</div>
      <small className="items-center flex text-sm mt-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="fire"
          className="h-5 w-5"
          role="img"
          viewBox="0 0 384 512"
        >
          <path
            fill="currentColor"
            d="M216 23.86c0-23.8-30.65-32.77-44.15-13.04C48 191.85 224 200 224 288c0 35.63-29.11 64.46-64.85 63.99-35.17-.45-63.15-29.77-63.15-64.94v-85.51c0-21.7-26.47-32.23-41.43-16.5C27.8 213.16 0 261.33 0 320c0 105.87 86.13 192 192 192s192-86.13 192-192c0-170.29-168-193-168-296.14z"
          />
        </svg>
        <span className="font-semibold pl-2">
          {inventoryItem?.burn_rate?.toFixed(2)}{" "}
        </span>
        <span className="text-xs pl-1">{inventoryItem?.unit} / hr </span>
      </small>
      <small className="items-center flex mt-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07A7.001 7.001 0 0 0 8 16a7 7 0 0 0 5.29-11.584.531.531 0 0 0 .013-.012l.354-.354.353.354a.5.5 0 1 0 .707-.707l-1.414-1.415a.5.5 0 1 0-.707.707l.354.354-.354.354a.717.717 0 0 0-.012.012A6.973 6.973 0 0 0 9 2.071V1h.5a.5.5 0 0 0 0-1h-3zm2 5.6V9a.5.5 0 0 1-.5.5H4.5a.5.5 0 0 1 0-1h3V5.6a.5.5 0 1 1 1 0z" />
        </svg>
        <span className="text-sm font-semibold pl-2">
          {((inventoryItem?.stock * inventoryItem?.burn_rate) / 60).toFixed(2)}
        </span>
        <span className="text-xs pl-1"> hr </span>
      </small>
    </div>
  ) : (
    "-"
  );
};

function OxygenMonitor({ filterDistrict, filterFacilityTypes, date }) {
  const { data } = useSWR(
    ["OxygenMonitor", date, filterDistrict.id],
    (url, date, district) =>
      careSummary(
        "facility",
        dateString(getNDateBefore(date, 1)),
        dateString(getNDateAfter(date, 1)),
        district
      )
  );
  const { tableData } = useMemo(() => {
    const filtered = processFacilities(data.results, filterFacilityTypes);
    // const facilitiesTrivia = filtered.reduce(
    //   (a, c) => {
    //     const key = c.date === dateString(date) ? "current" : "previous";
    //     a[key].count += 1;
    //     Object.keys(TRIAGE_TYPES).forEach((k) => {
    //       a[key][k] += c[k];
    //       a[key][k] += c[k];
    //     });
    //     return a;
    //   },
    //   {
    //     current: JSON.parse(JSON.stringify(initialFacilitiesTrivia)),
    //     previous: JSON.parse(JSON.stringify(initialFacilitiesTrivia)),
    //   }
    // );

    const tableData = filtered.reduce((a, c) => {
      if (c.date === dateString(date)) {
        if (
          c.inventory &&
          Object.keys(c.inventory).length !== 0 &&
          (c.inventory[2] || c.inventory[4] || c.inventory[5] || c.inventory[6])
        ) {
          const arr = [
            [
              [c.name, c.facilityType, c.phoneNumber],
              [c.oxygenCapacity],
              showStockWithBurnRate(c.inventory[2]),
              showStockWithBurnRate(c.inventory[4]),
              showStockWithBurnRate(c.inventory[6]),
              showStockWithBurnRate(c.inventory[5]),
            ],
          ];

          return [...a, ...arr];
        }
        return a;
      }
      return a;
    }, []);
    /*   const exported = {
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
      }; */
    return { tableData };
  }, [data, filterFacilityTypes]);

  return (
    <>
      {/* <div className="grid gap-1 grid-rows-none mb-8 sm:grid-flow-col-dense sm:grid-rows-1 sm:place-content-end">
        <ValuePill
          title="Facility Count"
          value={facilitiesTrivia.current.count}
        />
      </div> */}
      {/*  <div className="grid-col-1 grid gap-6 mb-8 md:grid-cols-4">
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
      </div> */}

      <Suspense fallback={<ThemedSuspense />}>
        <FacilityTable
          className="mb-8"
          columns={["Name", ...OXYGEN_TYPES]}
          data={tableData}
          // exported={exported}
        />
      </Suspense>
    </>
  );
}

export default OxygenMonitor;
