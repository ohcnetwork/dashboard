import { TimeSeries } from "pondjs";
import React, { useContext, useEffect, useState } from "react";
import { cold } from "react-hot-loader";
import {
  ChartContainer,
  ChartRow,
  Charts,
  LineChart,
  Resizable,
  YAxis,
} from "react-timeseries-charts";
import { Card, CardBody } from "windmill-react-ui";
import { AuthContext } from "../../context/AuthContext";
import { careTestsSummary } from "../../utils/api";
import { testsTypes } from "../../utils/constants";
import { dateString, getNDateAfter, getNDateBefore } from "../../utils/utils";
import { SectionTitle } from "../Typography/Title";

const ColdResizable = cold(Resizable);
const ColdChartContainer = cold(ChartContainer);
const ColdChartRow = cold(ChartRow);
const ColdYAxis = cold(YAxis);
const ColdLineChart = cold(LineChart);
const ColdCharts = cold(Charts);

function TestsTimeseries({ filterDistrict, filterFacilityTypes, dates }) {
  const { auth } = useContext(AuthContext);
  const [facilities, setFacilities] = useState([]);
  const [chartable, setChartable] = useState(null);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    careTestsSummary(
      auth.token,
      dateString(getNDateBefore(dates[0], 1)),
      dateString(getNDateAfter(dates[1], 1))
    )
      .then((resp) => {
        setFacilities(
          resp.results.map(({ data, facility, created_date }) => ({
            date: dateString(new Date(created_date)),
            ...data,
            id: facility.id,
            facilityType: facility.facility_type || "Unknown",
            location: facility.location,
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
    let _f = facilities.filter(
      (f) =>
        f.district === filterDistrict.name &&
        filterFacilityTypes.includes(f.facilityType)
    );
    if (_f.length == 0) {
      setEmpty(true);
      return;
    }
    setEmpty(false);
    const dictionary = _f.reduce((acc, cur) => {
      if (acc[cur.date]) {
        Object.keys(testsTypes).forEach((k) => {
          acc[cur.date][k] += cur[k];
          acc[cur.date][k] += cur[k];
        });
        return acc;
      }
      let _t = {
        result_awaited: 0,
        test_discarded: 0,
        total_patients: 0,
        result_negative: 0,
        result_positive: 0,
      };
      Object.keys(testsTypes).forEach((k) => {
        _t[k] += cur[k];
        _t[k] += cur[k];
      });
      return {
        ...acc,
        [cur.date]: _t,
      };
    }, {});
    let _data = Object.entries(dictionary).reverse();
    let _chartable = new TimeSeries({
      name: "tests",
      columns: ["index", ...Object.keys(testsTypes)],
      points: _data.map(([d, value]) => [d, ...Object.values(value)]),
    });
    setChartable(_chartable);
  }, [facilities, filterDistrict, filterFacilityTypes]);

  const styleLine = {
    result_awaited: {
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
    test_discarded: {
      normal: {
        fill: "red",
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
    total_patients: {
      normal: {
        fill: "yellow",
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
    result_negative: {
      normal: {
        fill: "orange",
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
    result_positive: {
      normal: {
        fill: "blue",
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
    <div>
      {!empty ? (
        <div className="min-w-full min-h-full">
          {chartable && (
            <div>
              <SectionTitle>Tests</SectionTitle>
              <Card className="mb-8 bg-pur">
                <CardBody>
                  <ColdResizable>
                    <ColdChartContainer
                      timeRange={chartable.timerange()}
                      timeAxisStyle={styleAxis}
                    >
                      <ColdChartRow height="150">
                        <ColdYAxis
                          id="line"
                          label="Count"
                          transition={300}
                          min={0}
                          max={Math.max(
                            ...Object.keys(testsTypes).map((a) =>
                              chartable.max(a)
                            )
                          )}
                          width="70"
                          type="linear"
                          style={styleAxis}
                        />
                        <ColdCharts>
                          <ColdLineChart
                            axis="line"
                            style={styleLine}
                            columns={[...Object.keys(testsTypes)]}
                            series={chartable}
                          />
                        </ColdCharts>
                      </ColdChartRow>
                    </ColdChartContainer>
                  </ColdResizable>
                </CardBody>
              </Card>
            </div>
          )}
        </div>
      ) : (
        <div>No Data</div>
      )}
    </div>
  );
}

export default TestsTimeseries;
