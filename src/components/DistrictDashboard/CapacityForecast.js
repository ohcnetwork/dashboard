import { Button, Card, CardBody, WindmillContext } from "@windmill/react-ui";
import React, { useContext, useState } from "react";
import { ArrowLeft } from "react-feather";
import { animated, config, useSpring } from "react-spring";
import { wrap } from "react-suspense-worker";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useSWR from "swr";
import { AuthContext } from "../../context/AuthContext";
import { careSummary } from "../../utils/api";
import { availabilityTypes } from "../../utils/constants";
import { dateString, getNDateAfter, getNDateBefore } from "../../utils/utils";
import NoData from "../NoData";

const arima = wrap(new Worker("../../utils/arima.worker", { type: "module" }));

function CapacityForecast({
  filterDistrict,
  filterFacilityTypes,
  date,
  setForecast,
}) {
  const { auth } = useContext(AuthContext);
  const [timespan, setTimespan] = useState({ past: 14, forecast: 14 });
  const { data, error } = useSWR(
    ["CapacityForecast", date, auth.token, filterDistrict.id, timespan.past],
    (url, date, token, district, days) =>
      careSummary(
        token,
        "facility",
        dateString(getNDateBefore(date, days - 1)),
        dateString(getNDateAfter(date, 1)),
        district
      ).then((r) => r)
  );
  const facilities = data.results.map(
    ({ data: facility, created_date: date }) => ({
      date: dateString(new Date(date)),
      id: facility.id,
      name: facility.name,
      districtId: facility.district,
      facilityType: facility.facility_type || "Unknown",
      oxygenCapacity: facility.oxygen_capacity,
      capacity: facility.availability.reduce((cAcc, cCur) => {
        return {
          ...cAcc,
          [cCur.room_type]: cCur,
        };
      }, {}),
    })
  );
  const filtered = facilities.filter((f) =>
    filterFacilityTypes.includes(f.facilityType)
  );
  const datewise = filtered.reduce((acc, cur) => {
    if (acc[cur.date]) {
      Object.keys(availabilityTypes).forEach((k) => {
        let key = availabilityTypes[k].toLowerCase();
        acc[cur.date][key].used += cur.capacity[k]?.current_capacity || 0;
        acc[cur.date][key].total += cur.capacity[k]?.total_capacity || 0;
      });
      return acc;
    }
    let _t = {
      ventilator: { total: 0, used: 0 },
      icu: { total: 0, used: 0 },
      room: { total: 0, used: 0 },
      bed: { total: 0, used: 0 },
    };
    Object.keys(availabilityTypes).forEach((k) => {
      let key = availabilityTypes[k].toLowerCase();
      _t[key].used += cur.capacity[k]?.current_capacity || 0;
      _t[key].total += cur.capacity[k]?.total_capacity || 0;
    });
    return {
      ...acc,
      [cur.date]: _t,
    };
  }, {});
  const reversed = Object.entries(datewise).reverse();
  let timeseries = {};
  Object.values(availabilityTypes).forEach((k) => {
    timeseries[k] = reversed.map(([d, value]) => ({
      date: d,
      usage:
        (value[k.toLowerCase()].used / value[k.toLowerCase()].total) * 100 || 0,
    }));
  });
  let max = {};
  let min = {};
  let avg = {};
  for (const k of Object.values(availabilityTypes)) {
    max[k] = Math.max(...timeseries[k].map((e) => e.usage));
    min[k] = Math.min(...timeseries[k].map((e) => e.usage));
    avg[k] =
      timeseries[k].reduce((a, p) => a + p.usage, 0) / timeseries[k].length;
  }

  let forecasted = {};
  let forecasted_max = {};
  let forecasted_min = {};
  let forecasted_avg = {};
  if (filtered.length > 0) {
    for (const k of Object.values(availabilityTypes)) {
      // https://github.com/zemlyansky/arima
      forecasted[k] = arima(
        timeseries[k].map((e) => e.usage),
        timespan.forecast,
        {
          method: 0, // ARIMA method (Default: 0)
          optimizer: 0, // Optimization method (Default: 6)
          p: 1, // Number of Autoregressive coefficients
          d: 0, // Number of times the series needs to be differenced
          q: 4, // Number of Moving Average Coefficients
          verbose: false, // Output model analysis to console
        }
      )[0];
      forecasted_max[k] = Math.max(...forecasted[k]);
      forecasted_min[k] = Math.min(...forecasted[k]);
      forecasted_avg[k] =
        forecasted[k].reduce((a, p) => a + p, 0) / timespan.forecast;
    }
  }

  return filtered.length > 0 ? (
    <>
      <div className="flex flex-row justify-end h-6 space-x-2">
        {/* <div className="flex items-center rounded-lg shadow-xs dark:bg-gray-800 dark:text-gray-200">
          <span className="mx-2 text-sm font-medium leading-none">Past</span>
          <div className="flex h-full bg-purple-600 rounded-lg">
            <Button
              size="small"
              onClick={() => setTimespan({ ...timespan, past: 7 })}
              className="rounded-r-none shadow-xs"
              disabled={timespan.past === 7}
            >
              <span className="text-gray-200 capitalize">7 Days</span>
            </Button>
            <Button
              size="small"
              onClick={() => setTimespan({ ...timespan, past: 14 })}
              className="rounded-l-none shadow-xs"
              disabled={timespan.past !== 7}
            >
              <span className="text-gray-200 capitalize">14 Days</span>
            </Button>
          </div>
        </div> */}
        <div className="flex items-center rounded-lg shadow-xs dark:bg-gray-800 dark:text-gray-200">
          <span className="mx-2 text-sm font-medium leading-none">
            Forecast
          </span>
          <div className="flex h-full bg-purple-600 rounded-lg">
            <Button
              size="small"
              onClick={() => setTimespan({ ...timespan, forecast: 7 })}
              className="rounded-r-none shadow-xs"
              disabled={timespan.forecast === 7}
            >
              <span className="text-gray-200 capitalize">7 Days</span>
            </Button>
            <Button
              size="small"
              onClick={() => setTimespan({ ...timespan, forecast: 14 })}
              className="rounded-l-none shadow-xs"
              disabled={timespan.forecast !== 7}
            >
              <span className="text-gray-200 capitalize">14 Days</span>
            </Button>
          </div>
        </div>
        <div className="flex items-center rounded-lg shadow-xs dark:bg-gray-800 dark:text-gray-200">
          <span className="mx-2 text-sm font-medium leading-none">Go back</span>
          <div className="flex h-full bg-purple-600 rounded-lg">
            <Button
              size="small"
              onClick={() => setForecast(false)}
              className="shadow-xs"
            >
              <ArrowLeft className="h-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="my-4 text-xs text-center text-red-600">
        This is a work in progress version for a utilization forecasting system.
        These numbers should not be considered for decision making as it can
        vary as we haven't considered all variables to project it.
      </div>
      <div className="grid gap-6 mb-8 md:grid-cols-1 xl:grid-cols-1">
        {Object.values(availabilityTypes)
          .reverse()
          .map((k, i) => (
            <SingleCapacityForecast
              key={i}
              title={k}
              past={{
                data: timeseries[k],
                avg: avg[k],
                max: max[k],
                min: min[k],
              }}
              forecasted={{
                data: forecasted[k],
                avg: forecasted_avg[k],
                max: forecasted_max[k],
                min: forecasted_min[k],
              }}
            />
          ))}
      </div>
    </>
  ) : (
    <NoData />
  );
}

function SingleCapacityForecast({ title, past, forecasted }) {
  const { mode } = useContext(WindmillContext);
  const { a, mx, mn, fa, fmx, fmn } = useSpring({
    from: { a: 0, mx: 0, mn: 0 },
    to: {
      a: past.avg,
      mx: past.max,
      mn: past.min,
      fa: forecasted.avg,
      fmx: forecasted.max,
      fmn: forecasted.min,
    },
    delay: 0,
    config: config.slow,
  });
  const date = past.data[past.data.length - 1].date;
  const chartData = [
    ...past.data,
    ...forecasted.data.map((d, i) => ({
      date: dateString(getNDateAfter(new Date(date), i + 1)),
      forecasted: d,
    })),
  ];

  return (
    <div className="flex flex-col">
      <p className="mb-2 text-lg font-semibold text-gray-600 dark:text-gray-400">
        {title}
      </p>
      <div className="flex space-x-3">
        <Card className="flex w-1/4">
          <CardBody className="flex flex-col justify-between w-full">
            <p className="mb-2 text-base font-medium text-gray-600 dark:text-gray-400">
              Trends for past {past.data.length} days
            </p>
            <div className="flex justify-between text-lg font-bold">
              <div className="flex flex-col justify-between">
                <p className="text-gray-600 dark:text-gray-400">AVG</p>
                <animated.p className="text-2xl text-gray-700 dark:text-gray-200">
                  {a.interpolate((x) => x.toFixed(2))}
                </animated.p>
              </div>
              <div className="flex flex-col justify-between">
                <p className="text-gray-600 dark:text-gray-400">MIN</p>
                <animated.p className="text-2xl text-gray-700 dark:text-gray-200">
                  {mn.interpolate((x) => x.toFixed(2))}
                </animated.p>
              </div>
              <div className="flex flex-col justify-between">
                <p className="text-gray-600 dark:text-gray-400">MAX</p>
                <animated.p className="text-2xl text-gray-700 dark:text-gray-200">
                  {mx.interpolate((x) => x.toFixed(2))}
                </animated.p>
              </div>
            </div>
            <ResponsiveContainer height={50}>
              <LineChart data={past.data}>
                <Line
                  type="monotone"
                  dataKey="usage"
                  stroke="#955df5"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
        <Card className="flex flex-col w-3/4">
          <CardBody>
            <p className="mb-2 text-base font-medium text-gray-600 dark:text-gray-400 ">
              Forecasts for next {forecasted.data.length} days
            </p>
            <div className="flex space-x-2">
              <div className="flex w-11/12">
                <ResponsiveContainer height={175}>
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 20,
                      left: -20,
                      bottom: 20,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={"date"} />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor:
                          mode === "dark" ? "#1a1c23" : "#f4f5f7",
                        color: mode === "dark" ? "#f4f5f7" : "#1a1c23",
                        borderRadius: "0.5rem",
                        borderStyle: "none",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="usage"
                      stroke="#955df5"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="forecasted"
                      stroke="#955df5"
                      strokeWidth={2}
                      strokeDasharray="3 3"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col self-center w-1/12 text-right">
                <div className="flex flex-col justify-between">
                  <p className="text-base font-semibold text-gray-600 dark:text-gray-400">
                    AVG
                  </p>
                  <animated.p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    {fa.interpolate((x) => x.toFixed(2))}
                  </animated.p>
                </div>
                <div className="flex flex-col justify-between">
                  <p className="text-base font-semibold text-gray-600 dark:text-gray-400">
                    MIN
                  </p>
                  <animated.p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    {fmn.interpolate((x) => x.toFixed(2))}
                  </animated.p>
                </div>
                <div className="flex flex-col justify-between">
                  <p className="text-base font-semibold text-gray-600 dark:text-gray-400">
                    MAX
                  </p>
                  <animated.p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    {fmx.interpolate((x) => x.toFixed(2))}
                  </animated.p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default CapacityForecast;
