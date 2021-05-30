import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { lazy, Suspense, useMemo, useState } from "react";
import useSWR from "swr";

import { careSummary } from "../../utils/api";
import {
  OXYGEN_TYPES,
  OXYGEN_INVENTORY,
  OXYGEN_INVENTORY_NAME,
  OXYGEN_CAPACITY_TRANSLATION,
  OXYGEN_TYPES_KEYS,
} from "../../utils/constants";
import {
  dateString,
  getNDateAfter,
  getNDateBefore,
  processFacilities,
} from "../../utils/utils";
import ThemedSuspense from "../ThemedSuspense";
import GenericTable from "./GenericTable";

dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

const stockSummary = (oxygenFlatData, key) => {
  const entries = oxygenFlatData.filter((f) => f.item_name === key);
  const stock = entries.map((p) => p.stock).reduce((a, b) => a + b, 0);
  const valid_entries = entries.filter(
    (a) => (a?.burn_rate || 0) !== 0 && (a?.burn_rate || null) !== null
  );
  const depleted_entries = valid_entries.filter((a) => a.stock === 0);
  const valid_nonzero_entries = valid_entries.filter((a) => a.stock !== 0);
  const burn_rate = valid_nonzero_entries
    .map((p) => p.burn_rate)
    .reduce((acc, iter) => acc + iter, 0);
  const facilities_with_less_than_5_hrs_of_oxygen = valid_nonzero_entries
    .map((p) => p.stock / p.burn_rate)
    .filter((f) => f < 5.0);

  return (
    <div
      key={key}
      className="md-space-y-0 gap-4 grid-cols-4 my-4 p-4 min-w-0 text-gray-800 dark:text-white dark:bg-gray-800 bg-white rounded-lg shadow-xs overflow-hidden space-y-4 md:grid"
    >
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
          <div className="text-3xl font-bold">
            {stock - Math.floor(stock) !== 0 ? stock.toFixed(2) : stock}
          </div>
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
      <div className="flex items-center">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="exclamation-triangle"
            className="pr-4 w-12 h-12 text-orange-500"
            role="img"
            viewBox="0 0 576 512"
          >
            <path
              fill="currentColor"
              d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"
            />
          </svg>
        </div>
        <div>
          <div>High Alerts</div>
          <div className="text-3xl font-bold">
            {facilities_with_less_than_5_hrs_of_oxygen.length}
          </div>
          <div className="mt-1 text-sm">Facilities</div>
        </div>
      </div>
    </div>
  );
};

const showStockWithBurnRate = (facility, k, inventoryItem) => {
  return inventoryItem ? (
    <div key={k} className={inventoryItem?.is_low ? "text-red-500" : ""}>
      <div className={"text-md font-bold "}>
        {inventoryItem?.stock?.toFixed(2)}
        {" / "}
        {OXYGEN_TYPES_KEYS[k] === "liquid"
          ? (
              facility[OXYGEN_CAPACITY_TRANSLATION[OXYGEN_TYPES_KEYS[k]]] *
              0.8778
            ).toFixed(2)
          : facility[OXYGEN_CAPACITY_TRANSLATION[OXYGEN_TYPES_KEYS[k]]]}

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
          {inventoryItem?.burn_rate?.toFixed(2)}
        </span>
        <span className="pl-1 font-mono text-xs">
          {inventoryItem?.unit} / hr{" "}
        </span>
      </small>

      <div className="flex">
        <span className="relative inline-flex rounded-md shadow-sm">
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
              {(inventoryItem?.stock / inventoryItem?.burn_rate).toFixed(2)}
            </span>
            <span className="pl-1 font-mono text-xs"> hr </span>
          </small>
          {(inventoryItem?.stock / inventoryItem?.burn_rate).toFixed(2) <
            5.0 && (
            <span className="absolute right-0 top-0 flex -mr-5 mt-3 w-4 h-4">
              <span className="absolute inline-flex w-full h-full bg-red-500 rounded-full opacity-75 animate-ping"></span>
              <span className="relative inline-flex w-4 h-4 bg-red-600 rounded-full"></span>
            </span>
          )}
        </span>
      </div>

      <small className="text-xs">
        {dayjs(new Date(inventoryItem?.modified_date)).fromNow()}
      </small>
    </div>
  ) : (
    <div key={k}></div>
  );
};

const oxygenSelector = (selector) => {
  switch (selector.toLowerCase()) {
    case "last updated":
      return "inventoryModifiedDate";
    case "liquid oxygen":
      return "tte_tank";
    case "cylinder b":
      return "tte_b_cylinders";
    case "cylinder c":
      return "tte_c_cylinders";
    case "cylinder d":
      return "tte_d_cylinders";
    default:
      return null;
  }
};

const selectorToText = (selector) => {
  switch (selector) {
    case "inventoryModifiedDate":
      return "last updated date";
    case "tte_tank":
      return "liquid oxygen time to empty";
    case "tte_b_cylinders":
      return "B type cylinder time to empty";
    case "tte_c_cylinders":
      return "C type cylinder time to empty";
    case "tte_d_cylinders":
      return "D type cylinder time to empty";
    default:
      return null;
  }
};

const tableHead = (data) => {
  return data.map((k) => (
    <div>
      <div>{k}</div>
      <div>Stock / Capacity</div>
    </div>
  ));
};
function OxygenMonitor({ filterDistrict, filterFacilityTypes, date }) {
  const [orderBy, setOrderBy] = useState({
    selector: "inventoryModifiedDate",
    order: 1,
  });
  const setOrderByHandler = (selector) => {
    const orderBySelector = oxygenSelector(selector);
    setOrderBy(
      orderBySelector
        ? { selector: orderBySelector, order: -(orderBy?.order || 1) }
        : undefined
    );
  };
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
    const filtered = processFacilities(
      data.results,
      filterFacilityTypes,
      orderBy
    );

    const tableData = filtered.reduce((a, c) => {
      if (c.date === dateString(date)) {
        if (
          c.inventory &&
          Object.keys(c.inventory).length !== 0 &&
          Object.keys(c.inventory).some((e) =>
            Object.values(OXYGEN_INVENTORY).includes(Number(e))
          )
        ) {
          const arr = [
            [
              [c.name, c.facilityType, c.phoneNumber],
              [dayjs(new Date(c.inventoryModifiedDate)).fromNow()],
              ...Object.values(OXYGEN_INVENTORY).map((k) =>
                showStockWithBurnRate(c, k, c.inventory[k])
              ),
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
          Object.keys(c.inventory).some((e) =>
            Object.values(OXYGEN_INVENTORY).includes(Number(e))
          )
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
            Object.keys(c.inventory).some((e) =>
              Object.values(OXYGEN_INVENTORY).includes(Number(e))
            )
          )
        ) {
          return a;
        }

        return [
          ...a,
          {
            "Govt/Pvt": c.facilityType,
            "Hops/CFLTC":
              c.facilityType === "First Line Treatment Centre"
                ? "CFLTC"
                : "Hops",
            "Hospital/CFLTC Address": c.address,
            "Hospital/CFLTC Name": c.name,
            Mobile: c.phoneNumber,
            "Expected Liquid Oxygen": c.expected_oxygen_requirement,
            "Expected Type B Cylinders": c.expected_type_b_cylinders,
            "Expected Type C Cylinders": c.expected_type_c_cylinders,
            "Expected Type D Cylinders": c.expected_type_d_cylinders,
            "Capacity Liquid Oxygen": c.oxygenCapacity,
            "Capacity Type B Cylinders": c.type_b_cylinders,
            "Capacity Type C Cylinders": c.type_c_cylinders,
            "Capacity Type D Cylinders": c.type_d_cylinders,
            ...Object.values(OXYGEN_INVENTORY).reduce((t, x) => {
              const y = { ...t };

              if (c.inventory[x]?.item_name) {
                y[`Opening Stock ${c.inventory[x]?.item_name}`] =
                  c.inventory[x]?.start_stock || 0;
                y[`Stock Added Today ${c.inventory[x]?.item_name}`] =
                  c.inventory[x]?.total_added || 0;
                y[`Closing Stock ${c.inventory[x]?.item_name}`] =
                  c.inventory[x]?.end_stock || 0;
                y[`Total Consumed ${c.inventory[x]?.item_name}`] =
                  c.inventory[x]?.total_consumed || 0;
                y[`Current Stock ${c.inventory[x]?.item_name}`] =
                  c.inventory[x]?.stock || 0;
                y[`Unit ${c.inventory[x]?.item_name}`] =
                  c.inventory[x]?.unit || 0;
                y[`Is Low ${c.inventory[x]?.item_name}`] =
                  c.inventory[x]?.is_low || 0;
                y[`Burn Rate ${c.inventory[x]?.item_name}`] =
                  c.inventory[x]?.burn_rate || 0;
                y[`Updated at ${c.inventory[x]?.item_name}`] =
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
  }, [data, filterFacilityTypes, orderBy]);

  return (
    <>
      <div>
        <h1 className="mt-6 dark:text-white text-3xl font-semibold">
          District Summary
        </h1>
        {Object.values(OXYGEN_INVENTORY_NAME).map((n) =>
          stockSummary(oxygenFlatData, n)
        )}
      </div>
      {orderBy && (
        <div className="flex items-center mt-4 space-x-2">
          <div className="dark:text-white text-xs">
            Showing Results Filtered by: {selectorToText(orderBy.selector)}{" "}
            {orderBy.order === 1 ? "ASC" : "DESC"}
          </div>
          <div
            onClick={(_) => setOrderBy(undefined)}
            className="focus:shadow-outline-green inline-flex items-center justify-center px-2 text-white text-xs leading-5 bg-green-500 active:bg-green-500 hover:bg-green-600 border border-transparent rounded-lg focus:outline-none cursor-pointer transition-colors duration-150"
          >
            X Clear Filter
          </div>
        </div>
      )}

      <Suspense fallback={<ThemedSuspense />}>
        <GenericTable
          className="mb-8"
          columns={["Name", "LAST UPDATED", ...Object.values(OXYGEN_TYPES)]}
          data={tableData}
          exported={exported}
          setOrderBy={setOrderByHandler}
        />
      </Suspense>
    </>
  );
}

export default OxygenMonitor;
