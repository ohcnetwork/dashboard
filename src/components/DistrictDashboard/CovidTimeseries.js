import React, { useMemo } from "react";
import useSWR from "swr";

import { covidGetHistories, covidGetHotspotHistories } from "../../utils/api";
import { dateString } from "../../utils/utils";
import TimeseriesBarChart from "../Chart/TimeseriesBarChart";
import NoData from "../NoData";

function CovidTimeseries({ filterDistrict, dates }) {
  const { data: dataHistories } = useSWR(["CovidHistories"], () =>
    covidGetHistories()
  );
  const { data: dataHotspots } = useSWR(["CovidHotspotHistories"], () =>
    covidGetHotspotHistories()
  );
  const { _dataHistories, _dataHotspots, chartable } = useMemo(() => {
    const reversedDateString1 = dateString(dates[0])
      .split("-")
      .reverse()
      .join("-");
    const reversedDateString2 = dateString(dates[1])
      .split("-")
      .reverse()
      .join("-");

    let dataHistoriesIdx1 = 0;
    let dataHistoriesIdx2 = dataHistories.histories.length - 1;
    dataHistories.histories.forEach((h, i) => {
      if (h.date === reversedDateString1 && i > dataHistoriesIdx1) {
        dataHistoriesIdx1 = i;
      }
      if (h.date === reversedDateString2 && i < dataHistoriesIdx2) {
        dataHistoriesIdx2 = i;
      }
    });
    const initialData = {
      hospital_obs: 0,
      home_obs: 0,
      total_obs: 0,
      hospital_today: 0,
      confirmed: 0,
      recovered: 0,
      deceased: 0,
      active: 0,
    };
    const lang = {
      confirmed: "Confirmed",
      active: "Active",
      recovered: "Recovered",
      deceased: "Deaths",
      total_obs: "Under Observation",
      home_obs: "Home Isolation",
      hospital_obs: "Hospital Isolation",
      hospital_today: "Hospitalized Today",
    };
    const _dataHistories = dataHistories.histories
      .slice(dataHistoriesIdx1, dataHistoriesIdx2 + 1)
      .map((h) => {
        const summary = {
          summary: JSON.parse(JSON.stringify(initialData)),
          delta: JSON.parse(JSON.stringify(initialData)),
        };
        Object.keys(initialData).forEach((k) => {
          summary.summary[k] += h.summary[filterDistrict.name][k];
          summary.delta[k] += h.delta[filterDistrict.name][k];
        });
        return {
          date: h.date,
          ...summary,
        };
      });
    const chartable = Object.keys(lang).map((k) => ({
      name: lang[k],
      data: _dataHistories.map((d) => ({
        date: d.date,
        total: d.summary[k],
        delta: d.delta[k],
      })),
    }));

    let dataHotspotsIdx1 = 0;
    let dataHotspotsIdx2 = dataHotspots.histories.length - 1;

    dataHotspots.histories.forEach((h, i) => {
      if (h.date === reversedDateString1 && i > dataHotspotsIdx1) {
        dataHotspotsIdx1 = i;
      }
      if (h.date === reversedDateString2 && i < dataHotspotsIdx2) {
        dataHotspotsIdx2 = i;
      }
    });
    const _dataHotspots = dataHotspots.histories
      .slice(dataHotspotsIdx1, dataHotspotsIdx2 + 1)
      .map((h) => ({
        date: h.date,
        count: h.hotspots.filter((x) => x.district === filterDistrict.name)
          .length,
      }));
    return {
      _dataHistories,
      _dataHotspots,
      chartable,
    };
  }, [dataHistories, dataHotspots]);

  return (
    <div className="min-w-full min-h-full">
      {_dataHistories.length > 0 && _dataHotspots.length > 0 ? (
        <div>
          {chartable.map((k, i) => (
            <TimeseriesBarChart
              key={i}
              name={k.name}
              data={k.data}
              dataKeys={["delta", "total"]}
              colors={["var(--color-green-400)", "var(--color-green-500)"]}
            />
          ))}
          <TimeseriesBarChart
            name="Hotspots"
            data={_dataHotspots}
            dataKeys={["count"]}
            colors={["var(--color-green-400)"]}
          />
        </div>
      ) : (
        <NoData />
      )}
    </div>
  );
}

export default CovidTimeseries;
