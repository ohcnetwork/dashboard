import React, { useContext } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardBody, WindmillContext } from "@windmill/react-ui";
import { SectionTitle } from "../Typography/Title";

function TimeseriesLineChart({ name, data, dataKeys, colors }) {
  const { mode } = useContext(WindmillContext);

  return (
    <div>
      <SectionTitle>{name}</SectionTitle>
      <Card className="mb-8">
        <CardBody>
          <ResponsiveContainer height={400}>
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={"date"} />
              <YAxis />
              <Tooltip
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
                <Line
                  type="monotone"
                  key={k}
                  dataKey={k}
                  stroke={colors[i]}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    </div>
  );
}

export default TimeseriesLineChart;
