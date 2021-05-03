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
import ThemedSuspense from "../ThemedSuspense";

const FacilityTable = lazy(() => import("./FacilityTable"));
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

const stockSummary = (oxygenFlatData, key) => {
  const entries = oxygenFlatData.filter((f) => f.item_name === key);
  const stock = entries.map((p) => p.stock).reduce((a, b) => a + b, 0);
  const burn_rate =
    entries.map((p) => p.burn_rate).reduce((a, b) => a + b, 0) / entries.length;

  return (
    <div className="md-space-y-0 gap-4 grid-cols-3 my-4 p-4 min-w-0 text-gray-800 dark:text-white dark:bg-gray-800 bg-white rounded-lg shadow-xs overflow-hidden space-y-4 md:grid">
      <div className="flex items-center">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="weight"
            className="pr-4 w-12 h-12 text-orange-500"
            role="img"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M448 64h-25.98C438.44 92.28 448 125.01 448 160c0 105.87-86.13 192-192 192S64 265.87 64 160c0-34.99 9.56-67.72 25.98-96H64C28.71 64 0 92.71 0 128v320c0 35.29 28.71 64 64 64h384c35.29 0 64-28.71 64-64V128c0-35.29-28.71-64-64-64zM256 320c88.37 0 160-71.63 160-160S344.37 0 256 0 96 71.63 96 160s71.63 160 160 160zm-.3-151.94l33.58-78.36c3.5-8.17 12.94-11.92 21.03-8.41 8.12 3.48 11.88 12.89 8.41 21l-33.67 78.55C291.73 188 296 197.45 296 208c0 22.09-17.91 40-40 40s-40-17.91-40-40c0-21.98 17.76-39.77 39.7-39.94z"
            />
          </svg>
        </div>
        <div className="">
          <div>{key}</div>
          <div className="text-3xl font-bold">{stock}</div>
          <div className="mt-1 text-sm">{entries[0]?.unit}</div>
        </div>
      </div>

      <div className="flex items-center">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="fire"
            className="pr-4 w-12 h-12 text-orange-500"
            role="img"
            viewBox="0 0 384 512"
          >
            <path
              fill="currentColor"
              d="M216 23.86c0-23.8-30.65-32.77-44.15-13.04C48 191.85 224 200 224 288c0 35.63-29.11 64.46-64.85 63.99-35.17-.45-63.15-29.77-63.15-64.94v-85.51c0-21.7-26.47-32.23-41.43-16.5C27.8 213.16 0 261.33 0 320c0 105.87 86.13 192 192 192s192-86.13 192-192c0-170.29-168-193-168-296.14z"
            />
          </svg>
        </div>
        <div>
          <div>Burn Rate</div>
          <div className="text-3xl font-bold">{burn_rate?.toFixed(2)}</div>
          <div className="mt-1 text-sm">{entries[0]?.unit} / hour </div>
        </div>
      </div>
      <div className="flex items-center">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="currentColor"
            className="pr-4 w-12 h-12 text-orange-500"
            viewBox="0 0 16 16"
          >
            <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07A7.001 7.001 0 0 0 8 16a7 7 0 0 0 5.29-11.584.531.531 0 0 0 .013-.012l.354-.354.353.354a.5.5 0 1 0 .707-.707l-1.414-1.415a.5.5 0 1 0-.707.707l.354.354-.354.354a.717.717 0 0 0-.012.012A6.973 6.973 0 0 0 9 2.071V1h.5a.5.5 0 0 0 0-1h-3zm2 5.6V9a.5.5 0 0 1-.5.5H4.5a.5.5 0 0 1 0-1h3V5.6a.5.5 0 1 1 1 0z" />
          </svg>
        </div>
        <div>
          <div>Time to Empty</div>
          <div className="text-3xl font-bold">
            {(stock / burn_rate).toFixed(2)}
          </div>
          <div className="mt-1 text-sm">hours</div>
        </div>
      </div>
    </div>
  );
};

const showStockWithBurnRate = (inventoryItem) => {
  return inventoryItem ? (
    <div className={inventoryItem?.is_low ? "text-red-500" : ""}>
      <div className={"text-md font-bold "}>
        {inventoryItem?.stock}{" "}
        <span className="pl-1 font-mono text-xs">{inventoryItem?.unit} </span>
      </div>
      <small className="flex items-center mt-2 text-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="fire"
          className="w-4 h-4"
          role="img"
          viewBox="0 0 384 512"
        >
          <path
            fill="currentColor"
            d="M216 23.86c0-23.8-30.65-32.77-44.15-13.04C48 191.85 224 200 224 288c0 35.63-29.11 64.46-64.85 63.99-35.17-.45-63.15-29.77-63.15-64.94v-85.51c0-21.7-26.47-32.23-41.43-16.5C27.8 213.16 0 261.33 0 320c0 105.87 86.13 192 192 192s192-86.13 192-192c0-170.29-168-193-168-296.14z"
          />
        </svg>
        <span className="pl-2 font-semibold">
          {inventoryItem?.stock > 0
            ? inventoryItem?.burn_rate?.toFixed(2)
            : "_"}{" "}
        </span>
        <span className="pl-1 font-mono text-xs">
          {inventoryItem?.unit} / hr{" "}
        </span>
      </small>
      <small className="flex items-center mt-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07A7.001 7.001 0 0 0 8 16a7 7 0 0 0 5.29-11.584.531.531 0 0 0 .013-.012l.354-.354.353.354a.5.5 0 1 0 .707-.707l-1.414-1.415a.5.5 0 1 0-.707.707l.354.354-.354.354a.717.717 0 0 0-.012.012A6.973 6.973 0 0 0 9 2.071V1h.5a.5.5 0 0 0 0-1h-3zm2 5.6V9a.5.5 0 0 1-.5.5H4.5a.5.5 0 0 1 0-1h3V5.6a.5.5 0 1 1 1 0z" />
        </svg>
        <span className="pl-2 text-sm font-semibold">
          {inventoryItem?.stock > 0
            ? (inventoryItem?.stock / inventoryItem?.burn_rate).toFixed(2)
            : "_"}
        </span>
        <span className="pl-1 font-mono text-xs"> hr </span>
      </small>
      <small className="text-xs">
        {new Date(inventoryItem?.modified_date).toLocaleString()}
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
  const { tableData, oxygenFlatData, exported } = useMemo(() => {
    const filtered = processFacilities(data.results, filterFacilityTypes);

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

    const oxygenFlatData = filtered
      .map((c) => {
        if (
          c.date === dateString(date) &&
          c.inventory &&
          Object.keys(c.inventory).length !== 0 &&
          (c.inventory[2] || c.inventory[4] || c.inventory[5] || c.inventory[6])
        ) {
          return Object.values(c.inventory);
        }
      })
      .filter(function (element) {
        return element !== undefined;
      })
      .flat();

    const exported = {
      data: filtered.reduce((a, c) => {
        if (c.date !== dateString(date)) {
          return a;
        }

        if (
          !(
            c.inventory &&
            Object.keys(c.inventory).length !== 0 &&
            (c.inventory[2] ||
              c.inventory[4] ||
              c.inventory[5] ||
              c.inventory[6])
          )
        ) {
          return a;
        }

        return [
          ...a,
          {
            "Govt/Pvt": c.facilityType.startsWith("Govt") ? "Govt" : "Pvt",
            "Hops/CFLTC":
              c.facilityType === "First Line Treatment Centre"
                ? "CFLTC"
                : "Hops",
            "Hospital/CFLTC Address": c.address,
            "Hospital/CFLTC Name": c.name,
            Mobile: c.phoneNumber,
            ...[2, 4, 5, 6].reduce((t, x) => {
              const y = { ...t };

              if (c.inventory[x]?.item_name) {
                y[`Current Stock ${c.inventory[x]?.item_name}`] =
                  c.inventory[x]?.stock || 0;
                y[`Total Added ${c.inventory[x]?.item_name}`] =
                  c.inventory[x]?.total_added || 0;
                y[`Total Consumed ${c.inventory[x]?.item_name}`] =
                  c.inventory[x]?.total_consumed || 0;
                y[`Start Stock ${c.inventory[x]?.item_name}`] =
                  c.inventory[x]?.start_stock || 0;
                y[`End Stock ${c.inventory[x]?.item_name}`] =
                  c.inventory[x]?.end_stock || 0;
                y[`${c.inventory[x]?.item_name} Unit`] =
                  c.inventory[x]?.unit || 0;
                y[`Is Low ${c.inventory[x]?.item_name}`] =
                  c.inventory[x]?.is_low || 0;
                y[`${c.inventory[x]?.item_name} Updated at`] =
                  c.inventory[x]?.modified_date || 0;
              }
              return y;
            }, {}),
          },
        ];
      }, []),
      filename: "oxygen_export.csv",
    };

    return { tableData, oxygenFlatData, exported };
  }, [data, filterFacilityTypes]);

  return (
    <>
      <div>
        <h1 className="mt-6 dark:text-white text-3xl font-semibold">
          District Summary
        </h1>
        {stockSummary(oxygenFlatData, "Liquid Oxygen")}
        {stockSummary(oxygenFlatData, "Jumbo D Type Oxygen Cylinder")}
        {stockSummary(oxygenFlatData, "C Type Oxygen Cylinder")}
        {stockSummary(oxygenFlatData, "B Type Oxygen Cylinder")}
      </div>

      <Suspense fallback={<ThemedSuspense />}>
        <FacilityTable
          className="mb-8"
          columns={["Name", ...OXYGEN_TYPES]}
          data={tableData}
          exported={exported}
        />
      </Suspense>
    </>
  );
}

export default OxygenMonitor;
