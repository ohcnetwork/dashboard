import DateRangePicker from "@wojtekmaj/react-daterange-picker/dist/entry.nostyle";
import React from "react";
import DatePicker from "react-date-picker/dist/entry.nostyle";
import { Calendar } from "react-feather";
import { Button } from "windmill-react-ui";

function Filter({
  timeseries,
  setTimeseries,
  date,
  dateOnChange,
  dates,
  datesOnChange,
  maxDate,
  floating,
}) {
  return (
    <div>
      <div
        className={`${
          floating ? "absolute inset-x-0 top-0 mt-10 z-40 flex-shrink-0 " : "mb-8 rounded-lg"
        } flex flex-row items-center justify-between px-4 py-2 bg-white shadow-md dark:bg-gray-800`}
      >
        <p className="dark:text-gray-400">Filters</p>
        <div className="flex space-x-2">
          <div className="bg-white rounded-lg dark:bg-gray-900 dark:text-gray-700">
            <Button
              layout="link"
              onClick={() => setTimeseries(false)}
              className="rounded-r-none shadow-xs"
              disabled={!timeseries}
            >
              <span className="capitalize">Single</span>
            </Button>
            <Button
              layout="link"
              onClick={() => setTimeseries(true)}
              className="rounded-l-none shadow-xs"
              disabled={timeseries}
            >
              <span className="capitalize">Range</span>
            </Button>
          </div>
          {!timeseries ? (
            <DatePicker
              autoFocus={false}
              calendarIcon={<Calendar />}
              clearIcon={null}
              calendarClassName="p-1 font-sans bg-white rounded-lg dark:bg-gray-900 dark:text-gray-400"
              tileClassName="font-sans rounded-lg p-2"
              className="px-1 font-sans bg-white rounded-lg shadow-xs dark:bg-gray-900 dark:text-gray-400"
              value={date}
              onChange={dateOnChange}
              maxDate={maxDate}
            />
          ) : (
            <DateRangePicker
              autoFocus={false}
              calendarIcon={<Calendar />}
              clearIcon={null}
              calendarClassName="p-1 font-sans bg-white rounded-lg dark:bg-gray-900 dark:text-gray-400"
              tileClassName="font-sans rounded-lg p-2"
              className="px-1 font-sans bg-white rounded-lg shadow-xs dark:bg-gray-900 dark:text-gray-400"
              value={dates}
              onChange={datesOnChange}
              maxDate={maxDate}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Filter;
