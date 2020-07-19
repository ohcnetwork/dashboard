import React, { useContext } from "react";
import Chart from "react-apexcharts";
import { Card, WindmillContext } from "windmill-react-ui";

function RadialCard({ label, data, dataKey }) {
  const fontFamily = "Inter";
  const { mode } = useContext(WindmillContext);

  const current_used = Math.round(
    (data.current[dataKey].used / data.current[dataKey].total) * 100
  );
  const previous_used = Math.round(
    (data.previous[dataKey].used / data.previous[dataKey].total) * 100
  );
  const diff = current_used - previous_used;
  let _label = label;
  if (data.current.count > 0) {
    _label += diff > 0 ? ` ⬆ ${diff}` : diff != 0 ? ` ⬇ ${diff}` : "";
  }

  return (
    <Card className="flex items-center justify-between">
      <Chart
        className="flex self-center"
        options={{
          theme: {
            monochrome: {
              enabled: true,
              color: "#7e3af2",
              shadeTo: "light",
              shadeIntensity: 0.65,
            },
          },
          labels: [_label],
          plotOptions: {
            radialBar: {
              hollow: {
                size: "70%",
              },
              dataLabels: {
                show: true,
                name: {
                  show: true,
                  fontSize: "12px",
                  fontFamily,
                  fontWeight: 600,
                  color: undefined,
                  offsetY: -2,
                },
                value: {
                  show: true,
                  fontSize: "18px",
                  fontFamily,
                  fontWeight: 600,
                  color: mode === "dark" ? "white" : "black",
                  offsetY: 2,
                },
              },
            },
          },
        }}
        series={[current_used || 0]}
        type="radialBar"
      />
      <div className="grid self-center grid-cols-1 py-4 pr-4 space-y-2 text-right">
        <div className="flex-col">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Used
          </p>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {data.current[dataKey].used}
          </p>
        </div>
        <div className="flex-col">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Total
          </p>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {data.current[dataKey].total}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default RadialCard;
