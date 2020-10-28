import { Card } from "@saanuregh/react-ui";
import React from "react";
import { ChevronsDown, ChevronsUp } from "react-feather";
import { animated, config, useSpring } from "react-spring";

function RadialCard({ label, count, current, previous }) {
  const current_used = Math.round((current.used / current.total) * 100);
  const previous_used = Math.round((previous.used / previous.total) * 100);
  const diff = current_used - previous_used;

  const _p = Math.round((current.used / current.total) * 100);

  const { used, total, progress, innerProgress } = useSpring({
    from: { used: 0, total: 0, progress: "0, 100", innerProgress: 0 },
    to: {
      used: current.used,
      total: current.total,
      progress: `${Number.isNaN(_p) ? 0 : _p}, 100`,
      innerProgress: Number.isNaN(_p) ? 0 : _p,
    },
    delay: 0,
    config: config.slow,
  });

  const circlePath = `M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831`;

  return (
    <Card className="items-center flex justify-between">
      <div className="content-center flex justify-center m-2 relative w-4/5">
        <svg viewBox="0 0 36 36" className="w-4/5">
          <path
            className="stroke-current stroke-2 text-gray-100 dark:text-gray-400"
            fill="none"
            d={circlePath}
          />
          <animated.path
            className="stroke-current stroke-2 text-green-500"
            fill="none"
            strokeDasharray={progress}
            d={circlePath}
          />
        </svg>
        <div className="items-center self-center inline-flex flex-col text-sm absolute text-center w-3/5 xl:text-lg">
          <p className="text-xxs font-medium text-center dark:text-gray-400 text-gray-600 xl:text-xs">
            {label}
          </p>
          <div className="space-x-1">
            <animated.span className="font-semibold text-center dark:text-gray-200 text-gray-700">
              {innerProgress.interpolate((x) => `${Math.round(x)}%`)}
            </animated.span>
            {count > 0 &&
              !Number.isNaN(diff) &&
              diff !== 0 &&
              (diff > 0 ? (
                <span className="text-red-400">
                  <ChevronsUp className="inline h-full" />
                  {Math.abs(diff)}%
                </span>
              ) : (
                <span className="text-green-400">
                  <ChevronsDown className="inline h-full" />
                  {Math.abs(diff)}%
                </span>
              ))}
          </div>
        </div>
      </div>
      <div
        style={{ direction: "rtl" }}
        className="grid grid-cols-1 mr-4 space-y-1 text-right w-1/4 xl:space-y-2"
      >
        <div className="flex-col">
          <p className="text-xs font-medium dark:text-gray-400 text-gray-600 xl:text-sm">
            Used
          </p>
          <animated.p className="text-xs font-semibold dark:text-gray-200 text-gray-700 xl:text-lg">
            {used.interpolate((x) => Math.round(x))}
          </animated.p>
        </div>
        <div className="flex-col">
          <p className="text-xs font-medium dark:text-gray-400 text-gray-600 xl:text-sm">
            Total
          </p>
          <animated.p className="text-xs font-semibold dark:text-gray-200 text-gray-700 xl:text-lg">
            {total.interpolate((x) => Math.round(x))}
          </animated.p>
        </div>
      </div>
    </Card>
  );
}

export default RadialCard;
