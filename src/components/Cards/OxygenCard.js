import { Card } from "@windmill/react-ui";
import React from "react";
import { OXYGEN_TYPES } from "../../utils/constants";

export function OxygenCard({ data }) {
  const getSVG = (parameter) => {
    if (parameter === "Quantity") {
      return (
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="weight"
            className="pr-4 w-10 h-10 text-orange-500"
            role="img"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M448 64h-25.98C438.44 92.28 448 125.01 448 160c0 105.87-86.13 192-192 192S64 265.87 64 160c0-34.99 9.56-67.72 25.98-96H64C28.71 64 0 92.71 0 128v320c0 35.29 28.71 64 64 64h384c35.29 0 64-28.71 64-64V128c0-35.29-28.71-64-64-64zM256 320c88.37 0 160-71.63 160-160S344.37 0 256 0 96 71.63 96 160s71.63 160 160 160zm-.3-151.94l33.58-78.36c3.5-8.17 12.94-11.92 21.03-8.41 8.12 3.48 11.88 12.89 8.41 21l-33.67 78.55C291.73 188 296 197.45 296 208c0 22.09-17.91 40-40 40s-40-17.91-40-40c0-21.98 17.76-39.77 39.7-39.94z"
            />
          </svg>
        </div>
      );
    } else if (parameter === "Burn Rate") {
      return (
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="fire"
            className="pr-4 w-10 h-10 text-orange-500"
            role="img"
            viewBox="0 0 384 512"
          >
            <path
              fill="currentColor"
              d="M216 23.86c0-23.8-30.65-32.77-44.15-13.04C48 191.85 224 200 224 288c0 35.63-29.11 64.46-64.85 63.99-35.17-.45-63.15-29.77-63.15-64.94v-85.51c0-21.7-26.47-32.23-41.43-16.5C27.8 213.16 0 261.33 0 320c0 105.87 86.13 192 192 192s192-86.13 192-192c0-170.29-168-193-168-296.14z"
            />
          </svg>
        </div>
      );
    } else {
      return (
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="currentColor"
            className="pr-4 w-10 h-10 text-orange-500"
            viewBox="0 0 16 16"
          >
            <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07A7.001 7.001 0 0 0 8 16a7 7 0 0 0 5.29-11.584.531.531 0 0 0 .013-.012l.354-.354.353.354a.5.5 0 1 0 .707-.707l-1.414-1.415a.5.5 0 1 0-.707.707l.354.354-.354.354a.717.717 0 0 0-.012.012A6.973 6.973 0 0 0 9 2.071V1h.5a.5.5 0 0 0 0-1h-3zm2 5.6V9a.5.5 0 0 1-.5.5H4.5a.5.5 0 0 1 0-1h3V5.6a.5.5 0 1 1 1 0z" />
          </svg>
        </div>
      );
    }
  };

  const getUnit = (parameter, id) => {
    if (parameter === "Quantity") {
      return <div className="font-mono text-xs">{data.quantity_unit[id]}</div>;
    } else if (parameter === "Burn Rate") {
      return (
        <div className="font-mono text-xs">{data.quantity_unit[id]}/hr</div>
      );
    } else {
      return <div className="font-mono text-xs">hr</div>;
    }
  };

  const showOxygenInfo = (oxygenData, parameter) => (
    <div className="grid row-span-2 grid-cols-9 items-center mt-4">
      <div className="flex flex-row col-span-1 items-center">
        {getSVG(parameter)}
        <div className="dark:text-gray-200 text-sm font-medium">
          {parameter}
        </div>
      </div>
      {oxygenData.map((val, idx) =>
        !val ? (
          <div
            key={idx}
            className="col-span-2 text-center dark:text-gray-400 text-gray-600 text-lg font-semibold"
          ></div>
        ) : (
          <div
            key={idx}
            className="col-span-2 text-center dark:text-gray-400 text-gray-600 text-lg font-semibold"
          >
            <div className="flex flex-row justify-center">
              <div
                className={`text-gray-800 dark:text-gray-200 text-lg font-semibold ${
                  data.is_low[idx] ? "text-red-500 dark:text-red-500" : ""
                }`}
              >
                {val}
              </div>
              {parameter === "Time to Empty" && val < 5.0 && (
                <span className="relative inline-flex rounded-md shadow-sm">
                  <span className="absolute flex w-4 h-4">
                    <span className="absolute inline-flex w-full h-full bg-red-500 rounded-full opacity-75 animate-ping"></span>
                    <span className="relative inline-flex w-4 h-4 bg-red-600 rounded-full"></span>
                  </span>
                </span>
              )}
            </div>
            {getUnit(parameter, idx)}
          </div>
        )
      )}
    </div>
  );

  return (
    <Card className="flex flex-col mb-4 mt-4 p-4 rounded-xl">
      <div className="flex flex-col justify-between md:flex-row">
        <div className="flex flex-col">
          <div>
            <a href={`/facility/${data.facility_id}`}>
              <p className="dark:text-gray-200 text-xl font-medium">
                {data.facility_name}
              </p>
            </a>
          </div>
          <div className="flex flex-row justify-between w-full">
            <div className="mr-5">
              <p className="dark:text-gray-400 text-gray-600 text-sm font-semibold">
                {data.facility_type}
              </p>
            </div>
            <div>
              <p className="dark:text-gray-400 text-gray-600 text-sm font-semibold">
                {data.phone_number}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-1 pt-2 border-t md:mt-0 md:pt-0 md:border-0">
          <p className="dark:text-gray-400 text-gray-600 text-sm font-medium">
            Last Updated
          </p>
          <p className="dark:text-gray-200 text-xl font-medium">
            {data.facility_last_updated}
          </p>
        </div>
      </div>

      <div className="grid-rows-7 grid mt-2 pt-2 w-full border-t overflow-x-scroll overflow-y-hidden md:mt-4 md:pt-0 md:border-0 md:overflow-hidden">
        <div className="grid row-span-1 grid-cols-9 w-800 md:w-full">
          <div className="col-span-1" />
          {Object.values(OXYGEN_TYPES).map((val) => (
            <div className="col-span-2 text-center dark:text-gray-400 text-gray-600 text-sm font-semibold">
              {val.toUpperCase()}
            </div>
          ))}
        </div>

        <div className="md:w-ful grid row-span-1 grid-cols-9 md:mt-1 md:pb-1 md:pt-1 md:border-b md:border-t">
          <div className="col-span-1 dark:text-gray-400 text-gray-600 text-xs font-semibold">
            LAST UPDATED
          </div>
          {data.last_updated.map((val, idx) => (
            <div
              key={idx}
              className="col-span-2 text-center dark:text-gray-400 text-gray-600 text-xs font-semibold"
            >
              {val}
            </div>
          ))}
        </div>

        {showOxygenInfo(data.quantity, "Quantity")}
        {showOxygenInfo(data.burn_rate, "Burn Rate")}
        {showOxygenInfo(data.time_to_empty, "Time to Empty")}
      </div>
    </Card>
  );
}
