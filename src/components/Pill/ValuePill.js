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
    <div className="items-center dark:bg-gray-800 rounded-lg shadow-xs flex h-6 justify-between dark:text-gray-200">
      <span className="text-xxs font-medium leading-none mx-2 xl:text-sm">
        {title}
      </span>
      <div className="items-center bg-green-500 rounded-lg flex text-xs font-medium h-full xl:text-base">
        <animated.span className="items-center rounded-md shadow-xs inline-flex justify-center leading-5 px-3 py-1 text-white align-bottom">
          {v.interpolate((x) => Math.round(x))}
        </animated.span>
      </div>
    </div>
  );
}
