import { Card } from "@windmill/react-ui";
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
    <Card className="flex items-center justify-between">
      <div className="relative flex content-center justify-center m-2 w-4/5">
        <svg viewBox="0 0 36 36" className="w-4/5">
          <path
            className="text-gray-100 dark:text-gray-400 stroke-current stroke-2"
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
        <div className="absolute inline-flex flex-col items-center self-center w-3/5 text-center text-sm xl:text-lg">
          <p className="text-center dark:text-gray-400 text-gray-600 text-xxs font-medium xl:text-xs">
            {label}
          </p>
          <div className="space-x-1">
            <animated.span className="text-center dark:text-gray-200 text-gray-700 font-semibold">
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
        className="grid grid-cols-1 mr-4 w-1/4 text-right space-y-1 xl:space-y-2"
      >
        <div className="flex-col">
          <p className="dark:text-gray-400 text-gray-600 text-xs font-medium xl:text-sm">
            Used
          </p>
          <animated.p className="dark:text-gray-200 text-gray-700 text-xs font-semibold xl:text-lg">
            {used.interpolate((x) => Math.round(x))}
          </animated.p>
        </div>
        <div className="flex-col">
          <p className="dark:text-gray-400 text-gray-600 text-xs font-medium xl:text-sm">
            Total
          </p>
          <animated.p className="dark:text-gray-200 text-gray-700 text-xs font-semibold xl:text-lg">
            {total.interpolate((x) => Math.round(x))}
          </animated.p>
        </div>
      </div>
    </Card>
  );
}

export default RadialCard;
