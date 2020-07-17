import React, { useContext } from "react";
import Chart from "react-apexcharts";
import { Card, WindmillContext } from "windmill-react-ui";

function RadialCard({ label, used, total, width = 200 }) {
  const fontFamily = "Inter";
  const { mode } = useContext(WindmillContext);

  return (
    <Card className="flex justify-between">
      <Chart
        options={{
          theme: {
            monochrome: {
              enabled: true,
              color: "#7e3af2",
              shadeTo: "light",
              shadeIntensity: 0.65,
            },
          },
          labels: [label],
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
        series={[Math.round((used / total) * 100) || 0]}
        type="radialBar"
        width={width}
        height={width}
      />
      <div className="grid self-center grid-cols-1 py-4 pr-4 space-y-2 text-right">
        <div className="flex-col">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Used
          </p>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {used}
          </p>
        </div>
        <div className="flex-col">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Total
          </p>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {total}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default RadialCard;
