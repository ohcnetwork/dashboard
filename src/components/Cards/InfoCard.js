import React from "react";
import { Card, CardBody } from "windmill-react-ui";

export function InfoCard({ title, value, delta = null }) {
  return (
    <Card>
      <CardBody className="flex flex-col">
        <div>
          <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <div className="flex">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              {value}
            </p>
            {delta != null && (
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {delta == 0 ? "-" : delta > 0 ? `+${delta}` : delta}
              </span>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export function SmallInfoCard({ title, value, delta }) {
  return (
    <Card>
      <CardBody className="flex flex-col">
        <div>
          <p className="mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <div className="flex">
            <p className="text-base font-semibold text-gray-700 dark:text-gray-200">
              {value}
            </p>
            {delta != null && (
              <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                {delta == 0 ? "-" : delta > 0 ? `+${delta}` : delta}
              </span>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
