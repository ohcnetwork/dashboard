import { TimeSeries } from "pondjs";
import React, { useContext, useEffect, useState } from "react";
import { cold } from "react-hot-loader";
import {
  BarChart,
  ChartContainer,
  ChartRow,
  Charts,
  Resizable,
  YAxis,
} from "react-timeseries-charts";
import { Card, CardBody } from "windmill-react-ui";
import { AuthContext } from "../../context/AuthContext";
import { carePatientSummary } from "../../utils/api";
import { patientTypes } from "../../utils/constants";
import { dateString, getNDateAfter, getNDateBefore } from "../../utils/utils";
import { SectionTitle } from "../Typography/Title";

const ColdResizable = cold(Resizable);
const ColdChartContainer = cold(ChartContainer);
const ColdChartRow = cold(ChartRow);
const ColdYAxis = cold(YAxis);
const ColdBarChart = cold(BarChart);
const ColdCharts = cold(Charts);

function PatientTimeseries({ filterDistrict, filterFacilityTypes, dates }) {
  const { auth } = useContext(AuthContext);
  const [facilities, setFacilities] = useState([]);
  const [chartable, setChartable] = useState([]);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    carePatientSummary(
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
        Object.keys(patientTypes).forEach((k) => {
          acc[cur.date][k].today += cur["today_patients_" + patientTypes[k]];
          acc[cur.date][k].total += cur["total_patients_" + patientTypes[k]];
        });
        return acc;
      }
      let _t = {
        ventilator: { total: 0, today: 0 },
        icu: { total: 0, today: 0 },
        isolation: { total: 0, today: 0 },
        home: { total: 0, today: 0 },
      };
      Object.keys(patientTypes).forEach((k) => {
        _t[k].today += cur["today_patients_" + patientTypes[k]];
        _t[k].total += cur["total_patients_" + patientTypes[k]];
      });
      return {
        ...acc,
        [cur.date]: _t,
      };
    }, {});
    let _data = Object.entries(dictionary).reverse();
    let _chartable = Object.keys(patientTypes).map(
      (k) =>
        new TimeSeries({
          name: k[0].toUpperCase() + k.slice(1),
          columns: ["index", "today", "total"],
          points: _data.map(([d, value]) => [
            d,
            value[k].today,
            value[k].total,
          ]),
        })
    );
    setChartable(_chartable);
  }, [facilities, filterDistrict, filterFacilityTypes]);

  const styleBar = {
    today: {
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
                            columns={["today", "total"]}
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
      ) : (
        <div>No Data</div>
      )}
    </div>
  );
}

export default PatientTimeseries;
