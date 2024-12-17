import { Card, CardBody, WindmillContext } from "@windmill/react-ui";
import React, { useContext } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { SectionTitle } from "../Typography/Title";

function TimeseriesBarChart({ name, data, dataKeys = [], colors = [] }) {
  const { mode } = useContext(WindmillContext);

  // Ensure dataKeys and colors are matched
  if (dataKeys.length !== colors.length) {
    console.error("The number of dataKeys must match the number of colors.");
    return null;
  }

  return (
    <div>
      <SectionTitle>{name}</SectionTitle>
      <Card className="mb-8">
        <CardBody>
          <ResponsiveContainer height={400}>
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 10,
                left: -10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                cursor={{ fill: mode === "dark" ? "#333" : "#f5f5f5" }}
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
                formatter={(value, name) => [value, name.toUpperCase()]} // Tooltip formatter
              />
              <Legend
                wrapperStyle={{
                  color:
                    mode === "dark"
                      ? "var(--color-gray-100)"
                      : "var(--color-gray-800)",
                }}
              />
              {dataKeys.map((k, i) => (
                <Bar key={k} dataKey={k} stackId="a" fill={colors[i]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    </div>
  );
}

export default TimeseriesBarChart;
