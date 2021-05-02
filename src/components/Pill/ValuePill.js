import React from "react";
import { animated, config, useSpring } from "react-spring";

export function ValuePill({ title, value = 0 }) {
  const { v } = useSpring({
    from: {
      v: 0,
    },
    to: {
      v: value,
    },
    delay: 0,
    config: config.slow,
  });

  return (
    <div className="flex items-center justify-between h-6 dark:text-gray-200 dark:bg-gray-800 rounded-lg shadow-xs">
      <span className="mx-2 text-xxs font-medium leading-none xl:text-sm">
        {title}
      </span>
      <div className="flex items-center h-full text-xs font-medium bg-green-500 rounded-lg xl:text-base">
        <animated.span className="inline-flex items-center justify-center align-bottom px-3 py-1 text-white leading-5 rounded-md shadow-xs">
          {v.interpolate((x) => Math.round(x))}
        </animated.span>
      </div>
    </div>
  );
}
