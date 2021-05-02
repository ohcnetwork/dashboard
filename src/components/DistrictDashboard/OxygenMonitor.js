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
  console.log(entries);
  const stock = entries.map((p) => p.stock).reduce((a, b) => a + b, 0);
  const burn_rate =
    entries.map((p) => p.burn_rate).reduce((a, b) => a + b, 0) / entries.length;

  return (
    <div className="grid gap-4 grid-cols-3 my-4 p-4 min-w-0 text-gray-800 dark:text-white dark:bg-gray-800 bg-white rounded-lg shadow-xs overflow-hidden">
      <div className="flex items-center">
        <div className="pl-4">
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
  const { tableData, oxygenFlatData } = useMemo(() => {
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

    return { tableData, oxygenFlatData };
  }, [data, filterFacilityTypes]);

  console.log(oxygenFlatData);
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
          // exported={exported}
        />
      </Suspense>
    </>
  );
}

export default OxygenMonitor;
