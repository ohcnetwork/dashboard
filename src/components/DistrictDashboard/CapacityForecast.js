import { Button, Card, CardBody, WindmillContext } from "@windmill/react-ui";
import React, { useContext, useState, useMemo } from "react";
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

import { careSummary } from "../../utils/api";
import {
  AVAILABILITY_TYPES,
  AVAILABILITY_TYPES_ORDERED,
} from "../../utils/constants";
import {
  dateString,
  getNDateAfter,
  getNDateBefore,
  processFacilities,
} from "../../utils/utils";
import NoData from "../NoData";
import { Pill } from "../Pill/Pill";

const arima = wrap(new Worker("../../utils/arima.worker", { type: "module" }));

function CapacityForecast({
  filterDistrict,
  filterFacilityTypes,
  date,
  setForecast,
}) {
  const [timespan, setTimespan] = useState({ past: 14, forecast: 14 });
  const { data } = useSWR(
    ["CapacityForecast", date, filterDistrict.id, timespan.past],
    (url, date, district, days) =>
      careSummary(
        "facility",
        dateString(getNDateBefore(date, days - 1)),
        dateString(getNDateAfter(date, 1)),
        district
      )
  );
  const {
    filtered,
    timeseries,
    max,
    min,
    avg,
    forecasted,
    forecasted_max,
    forecasted_min,
    forecasted_avg,
  } = useMemo(() => {
    const filtered = processFacilities(data.results, filterFacilityTypes);
    const datewise = filtered.reduce((acc, cur) => {
      if (acc[cur.date]) {
        Object.keys(AVAILABILITY_TYPES).forEach((k) => {
          acc[cur.date][k].used += cur.capacity[k]?.current_capacity || 0;
          acc[cur.date][k].total += cur.capacity[k]?.total_capacity || 0;
        });
        return acc;
      }
      const _t = {
        20: { total: 0, used: 0 },
        10: { total: 0, used: 0 },
        150: { total: 0, used: 0 },
        1: { total: 0, used: 0 },
        70: { total: 0, used: 0 },
        50: { total: 0, used: 0 },
        60: { total: 0, used: 0 },
        40: { total: 0, used: 0 },
        100: { total: 0, used: 0 },
        110: { total: 0, used: 0 },
        120: { total: 0, used: 0 },
        30: { total: 0, used: 0 },
      };
      Object.keys(AVAILABILITY_TYPES).forEach((k) => {
        _t[k].used += cur.capacity[k]?.current_capacity || 0;
        _t[k].total += cur.capacity[k]?.total_capacity || 0;
      });
      return {
        ...acc,
        [cur.date]: _t,
      };
    }, {});
    const timeseries = {};
    Object.keys(AVAILABILITY_TYPES).forEach((k) => {
      timeseries[k] = Object.entries(datewise)
        .reverse()
        .map(([d, value]) => ({
          date: d,
          usage: (value[k].used / value[k].total) * 100 || 0,
        }));
    });
    const max = {};
    const min = {};
    const avg = {};
    for (const k of Object.keys(AVAILABILITY_TYPES)) {
      max[k] = Math.max(...timeseries[k].map((e) => e.usage));
      min[k] = Math.min(...timeseries[k].map((e) => e.usage));
      avg[k] =
        timeseries[k].reduce((a, p) => a + p.usage, 0) / timeseries[k].length;
    }
    const forecasted = {};
    const forecasted_max = {};
    const forecasted_min = {};
    const forecasted_avg = {};
    if (filtered.length > 0) {
      for (const k of Object.keys(AVAILABILITY_TYPES)) {
        // https://github.com/zemlyansky/arima
        // eslint-disable-next-line prefer-destructuring
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
    return {
      filtered,
      timeseries,
      max,
      min,
      avg,
      forecasted,
      forecasted_max,
      forecasted_min,
      forecasted_avg,
    };
  }, [data, filterFacilityTypes, timespan]);

  return filtered.length > 0 ? (
    <>
      <div className="grid gap-1 grid-rows-none mb-8 sm:grid-flow-col-dense sm:grid-rows-1 sm:place-content-end">
        <Pill title="Forecast">
          <>
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
          </>
        </Pill>
        <Pill title="Go back">
          <Button
            size="small"
            onClick={() => setForecast(false)}
            className="shadow-xs"
          >
            <ArrowLeft className="h-4" />
          </Button>
        </Pill>
      </div>
      <div className="my-4 text-center text-red-600 text-xs">
        This is a work in progress version for a utilization forecasting system.
        These numbers should not be considered for decision making as it can
        vary as we haven't considered all variables to project it.
      </div>
      <div className="grid gap-6 mb-8 md:grid-cols-1 xl:grid-cols-1">
        {AVAILABILITY_TYPES_ORDERED.map((k) => (
          <SingleCapacityForecast
            key={k}
            title={AVAILABILITY_TYPES[k]}
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
  const { date } = past.data[past.data.length - 1];
  const chartData = [
    ...past.data,
    ...forecasted.data.map((d, i) => ({
      date: dateString(getNDateAfter(new Date(date), i + 1)),
      forecasted: d,
    })),
  ];

  return (
    <div className="flex flex-col">
      <p className="mb-2 dark:text-gray-400 text-gray-600 text-lg font-semibold">
        {title}
      </p>
      <div className="flex space-x-3">
        <Card className="flex w-1/4">
          <CardBody className="flex flex-col justify-between w-full">
            <p className="mb-2 dark:text-gray-400 text-gray-600 text-base font-medium">
              Trends for past {past.data.length} days
            </p>
            <div className="flex justify-between text-lg font-bold">
              <div className="flex flex-col justify-between">
                <p className="dark:text-gray-400 text-gray-600">AVG</p>
                <animated.p className="dark:text-gray-200 text-gray-700 text-2xl">
                  {a.interpolate((x) => x.toFixed(2))}
                </animated.p>
              </div>
              <div className="flex flex-col justify-between">
                <p className="dark:text-gray-400 text-gray-600">MIN</p>
                <animated.p className="dark:text-gray-200 text-gray-700 text-2xl">
                  {mn.interpolate((x) => x.toFixed(2))}
                </animated.p>
              </div>
              <div className="flex flex-col justify-between">
                <p className="dark:text-gray-400 text-gray-600">MAX</p>
                <animated.p className="dark:text-gray-200 text-gray-700 text-2xl">
                  {mx.interpolate((x) => x.toFixed(2))}
                </animated.p>
              </div>
            </div>
            <ResponsiveContainer height={50}>
              <LineChart data={past.data}>
                <Line
                  type="monotone"
                  dataKey="usage"
                  stroke="var(--color-green-400)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
        <Card className="flex flex-col w-3/4">
          <CardBody>
            <p className="mb-2 dark:text-gray-400 text-gray-600 text-base font-medium">
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
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor:
                          mode === "dark"
                            ? "var(--color-gray-800)"
                            : "var(--color-gray-100)",
                        color:
                          mode === "dark"
                            ? "var(--color-gray-100)"
                            : "var(--color-gray-800)",
                        borderRadius: "0.5rem",
                        borderStyle: "none",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="usage"
                      stroke="var(--color-green-400)"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="forecasted"
                      stroke="var(--color-green-400)"
                      strokeWidth={2}
                      strokeDasharray="3 3"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col self-center w-1/12 text-right">
                <div className="flex flex-col justify-between">
                  <p className="dark:text-gray-400 text-gray-600 text-base font-semibold">
                    AVG
                  </p>
                  <animated.p className="dark:text-gray-200 text-gray-700 text-lg font-semibold">
                    {fa.interpolate((x) => x.toFixed(2))}
                  </animated.p>
                </div>
                <div className="flex flex-col justify-between">
                  <p className="dark:text-gray-400 text-gray-600 text-base font-semibold">
                    MIN
                  </p>
                  <animated.p className="dark:text-gray-200 text-gray-700 text-lg font-semibold">
                    {fmn.interpolate((x) => x.toFixed(2))}
                  </animated.p>
                </div>
                <div className="flex flex-col justify-between">
                  <p className="dark:text-gray-400 text-gray-600 text-base font-semibold">
                    MAX
                  </p>
                  <animated.p className="dark:text-gray-200 text-gray-700 text-lg font-semibold">
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
