import { TimeSeries } from "pondjs";
import React, { useContext, useEffect, useState } from "react";
import { cold } from "react-hot-loader";
import {
  BarChart,
  ChartContainer,
  ChartRow,
  Charts,
  LineChart,
  Resizable,
  YAxis,
} from "react-timeseries-charts";
import { Card, CardBody } from "windmill-react-ui";
import { AuthContext } from "../../context/AuthContext";
import { careFacilitySummary } from "../../utils/api";
import { availabilityTypes } from "../../utils/constants";
import { dateString, getNDateAfter, getNDateBefore } from "../../utils/utils";
import { SectionTitle } from "../Typography/Title";

const ColdResizable = cold(Resizable);
const ColdChartContainer = cold(ChartContainer);
const ColdChartRow = cold(ChartRow);
const ColdYAxis = cold(YAxis);
const ColdBarChart = cold(BarChart);
const ColdCharts = cold(Charts);
const ColdLineChart = cold(LineChart);

function CapacityTimeseries({ filterDistrict, dates }) {
  const { auth } = useContext(AuthContext);
  const [facilities, setFacilities] = useState([]);
  const [chartable, setChartable] = useState([]);

  useEffect(() => {
    careFacilitySummary(
      auth.token,
      dateString(getNDateBefore(dates[0], 1)),
      dateString(getNDateAfter(dates[1], 1))
    )
      .then((resp) => {
        setFacilities(
          resp.results.map(({ data: facility, created_date: date }) => ({
            date: dateString(new Date(date)),
            id: facility.id,
            name: facility.name,
            districtId: facility.district,
            facilityType: facility.facility_type || "Unknown",
            oxygenCapacity: facility.oxygen_capacity,
            capacity: facility.availability.reduce((cAcc, cCur) => {
              return {
                ...cAcc,
                [cCur.room_type]: cCur,
              };
            }, {}),
          }))
        );
      })
      .catch((ex) => {
        console.error("Data Unavailable", ex);
      });
  }, [dates]);

  useEffect(() => {
    if (facilities.length == 0) {
      return;
    }
    let _f = facilities.filter((f) => f.districtId === filterDistrict.id);
    const dictionary = _f.reduce((acc, cur) => {
      if (acc[cur.date]) {
        acc[cur.date].oxygen.total += cur.oxygenCapacity || 0;
        Object.keys(availabilityTypes).forEach((k) => {
          acc[cur.date][availabilityTypes[k]].used +=
            cur.capacity[k]?.current_capacity || 0;
          acc[cur.date][availabilityTypes[k]].total +=
            cur.capacity[k]?.total_capacity || 0;
        });
        return acc;
      }
      let _t = {
        oxygen: { total: cur.oxygenCapacity, used: 0 },
        ventilator: { total: 0, used: 0 },
        icu: { total: 0, used: 0 },
        room: { total: 0, used: 0 },
        bed: { total: 0, used: 0 },
      };
      Object.keys(availabilityTypes).forEach((k) => {
        _t[availabilityTypes[k]].used += cur.capacity[k]?.current_capacity || 0;
        _t[availabilityTypes[k]].total += cur.capacity[k]?.total_capacity || 0;
      });
      return {
        ...acc,
        [cur.date]: _t,
      };
    }, {});
    let _data = Object.entries(dictionary).reverse();
    let _chartable = ["ventilator", "icu", "room", "bed"].map(
      (k) =>
        new TimeSeries({
          name: k[0].toUpperCase() + k.slice(1),
          columns: ["index", "used", "total", "avail"],
          points: _data.map(([d, value]) => [
            d,
            value[k].used,
            value[k].total,
            100 - (value[k].used / value[k].total) * 100,
          ]),
        })
    );
    setChartable(_chartable);
  }, [facilities, filterDistrict]);

  const styleBar = {
    used: {
      normal: {
        fill: "#7e3af2",
        opacity: 0.8,
      },
      highlighted: {
        fill: "#a7c4dd",
        opacity: 1.0,
      },
      selected: {
        fill: "orange",
        opacity: 1.0,
      },
      muted: {
        fill: "grey",
        opacity: 0.5,
      },
    },
    total: {
      normal: {
        fill: "#955df5",
        opacity: 0.8,
      },
      highlighted: {
        fill: "#a7c4dd",
        opacity: 1.0,
      },
      selected: {
        fill: "orange",
        opacity: 1.0,
      },
      muted: {
        fill: "grey",
        opacity: 0.5,
      },
    },
  };

  const styleLine = {
    avail: {
      normal: {
        fill: "green",
        opacity: 1,
        strokeWidth: 2,
      },
      highlighted: {
        fill: "#a7c4dd",
        opacity: 1.0,
      },
      selected: {
        fill: "orange",
        opacity: 1.0,
      },
      muted: {
        fill: "grey",
        opacity: 0.5,
      },
    },
  };

  const styleAxis = {
    label: {
      stroke: "none",
      fill: "#AAA", // Default label color
      fontWeight: 200,
      fontSize: 14,
      font: '"Inter", sans-serif"',
    },
    values: {
      stroke: "none",
      fill: "#888",
      fontWeight: 100,
      fontSize: 11,
      font: '"Inter", sans-serif"',
    },
    ticks: {
      fill: "none",
      stroke: "#AAA",
      opacity: 0.2,
    },
    axis: {
      fill: "none",
      stroke: "#AAA",
      opacity: 1,
    },
  };

  return (
    <div className="min-w-full min-h-full">
      {chartable.map((s, i) => (
        <div key={i}>
          <SectionTitle>{s.name() + "s"}</SectionTitle>
          <Card className="mb-8 bg-pur">
            <CardBody>
              <ColdResizable>
                <ColdChartContainer
                  timeRange={s.timerange()}
                  timeAxisStyle={styleAxis}
                >
                  <ColdChartRow height="150">
                    <ColdYAxis
                      id="line"
                      label="% Available"
                      transition={300}
                      min={0}
                      max={100}
                      width="70"
                      type="linear"
                      style={styleAxis}
                      showGrid={true}
                    />
                    <ColdYAxis
                      id="bar"
                      label={s.name() + "s"}
                      transition={300}
                      min={0}
                      max={s.max("total") + (s.max("total") * 30) / 100}
                      width="70"
                      type="linear"
                      style={styleAxis}
                    />
                    <ColdCharts>
                      <ColdBarChart
                        axis="bar"
                        style={styleBar}
                        columns={["used", "total"]}
                        series={s}
                      />
                      <ColdLineChart
                        axis="line"
                        style={styleLine}
                        columns={["avail"]}
                        series={s}
                      />
                    </ColdCharts>
                  </ColdChartRow>
                </ColdChartContainer>
              </ColdResizable>
            </CardBody>
          </Card>
        </div>
      ))}
    </div>
  );
}

export default CapacityTimeseries;
