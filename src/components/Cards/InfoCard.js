import React from "react";
import { Card, CardBody } from "@saanuregh/react-ui";
import { animated, config, useSpring } from "react-spring";

export function InfoCard({ title, value, delta = null, small = false }) {
  const { _value, _delta } = useSpring({
    from: { _value: 0, _delta: 0 },
    to: {
      _value: value,
      _delta: delta || 0,
    },
    delay: 0,
    config: config.slow,
  });
  return (
    <Card>
      <CardBody className="flex flex-col">
        <div>
          <p
            className={`${
              small ? "mb-1 text-xs" : "mb-2 text-sm"
            } font-medium text-gray-600 dark:text-gray-400`}
          >
            {title}
          </p>
          <div className="flex">
            <animated.p
              className={`${
                small ? "text-base" : "text-lg"
              } font-semibold text-gray-700 dark:text-gray-200`}
            >
              {_value.interpolate((x) => Math.round(x))}
            </animated.p>
            {delta != null && (
              <animated.span
                className={`ml-2 ${
                  small ? "text-xs" : "text-sm"
                } text-gray-600 dark:text-gray-400`}
              >
                {_delta.interpolate((y) => {
                  let x = Math.round(y);
                  return x == 0 ? "-" : x > 0 ? `+${x}` : x;
                })}
              </animated.span>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
