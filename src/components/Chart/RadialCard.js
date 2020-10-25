import { Card } from "@saanuregh/react-ui";
import React from "react";
import { ChevronsDown, ChevronsUp } from "react-feather";
import { animated, config, useSpring } from "react-spring";

function RadialCard({ label, count, current, previous }) {
  const current_used = Math.round((current.used / current.total) * 100);
  const previous_used = Math.round((previous.used / previous.total) * 100);
  const diff = current_used - previous_used;

  let _p = Math.round((current.used / current.total) * 100);

  const { used, total, progress, innerProgress } = useSpring({
    from: { used: 0, total: 0, progress: "0, 100", innerProgress: 0 },
    to: {
      used: current.used,
      total: current.total,
      progress: `${isNaN(_p) ? 0 : _p}, 100`,
      innerProgress: isNaN(_p) ? 0 : _p,
    },
    delay: 0,
    config: config.slow,
  });

  const circlePath = `M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831`;

  return (
    <Card className="flex items-center justify-between">
      <div className="relative flex content-center justify-center w-4/5 m-2">
        <svg viewBox="0 0 36 36" className="w-4/5">
          <path
            className="text-gray-100 stroke-current stroke-2 dark:text-gray-400"
            fill="none"
            d={circlePath}
          />
          <animated.path
            className="text-green-500 stroke-current stroke-2"
            fill="none"
            strokeDasharray={progress}
            d={circlePath}
          />
        </svg>
        <div className="absolute inline-flex flex-col items-center self-center w-3/5 text-sm text-center xl:text-lg">
          <p className="font-medium text-center text-gray-600 text-xxs xl:text-xs dark:text-gray-400">
            {label}
          </p>
          <div className="space-x-1">
            <animated.span className="font-semibold text-center text-gray-700 dark:text-gray-200">
              {innerProgress.interpolate((x) => `${Math.round(x)}%`)}
            </animated.span>
            {count > 0 &&
              !isNaN(diff) &&
              diff != 0 &&
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
        className="grid w-1/4 grid-cols-1 mr-4 space-y-1 text-right xl:space-y-2"
      >
        <div className="flex-col">
          <p className="text-xs font-medium text-gray-600 xl:text-sm dark:text-gray-400">
            Used
          </p>
          <animated.p className="text-xs font-semibold text-gray-700 xl:text-lg dark:text-gray-200">
            {used.interpolate((x) => Math.round(x))}
          </animated.p>
        </div>
        <div className="flex-col">
          <p className="text-xs font-medium text-gray-600 xl:text-sm dark:text-gray-400">
            Total
          </p>
          <animated.p className="text-xs font-semibold text-gray-700 xl:text-lg dark:text-gray-200">
            {total.interpolate((x) => Math.round(x))}
          </animated.p>
        </div>
      </div>
    </Card>
  );
}

export default RadialCard;
