import React from "react";
import useSWR from "swr";
import { covidGetHistories, covidGetHotspotHistories } from "../../utils/api";
import { dateString } from "../../utils/utils";
import { InfoCard } from "../Cards/InfoCard";
import { SectionTitle } from "../Typography/Title";

function Covid({ filterDistrict, date }) {
  const { data: dataHistories, error: errorHistories } = useSWR(
    ["CovidHistories"],
    (url) => covidGetHistories().then((r) => r)
  );
  const { data: dataHotspots, error: errorHotspots } = useSWR(
    ["CovidHotspotHistories"],
    (url) => covidGetHotspotHistories().then((r) => r)
  );
  const reversedDateString = dateString(date)
    .split("-")
    .reverse()
    .join("-");
  const latest =
    dataHistories.histories.find((h) => h.date === reversedDateString) ||
    dataHistories.histories[dataHistories.histories.length - 1];
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
  let latestSummary = {
    summary: JSON.parse(JSON.stringify(initialData)),
    delta: JSON.parse(JSON.stringify(initialData)),
  };
  Object.keys(latest.summary).forEach((d) => {
    Object.keys(initialData).forEach((k) => {
      latestSummary.summary[k] += latest.summary[d][k];
      latestSummary.delta[k] += latest.delta[d][k];
    });
  });
  let hotspotsLatestIdx = dataHotspots.histories.findIndex(
    (h) => h.date === reversedDateString
  );
  if (hotspotsLatestIdx == -1) {
    hotspotsLatestIdx = dataHotspots.histories.length - 1;
  }
  const hotspotsLatest = dataHotspots.histories[hotspotsLatestIdx].hotspots;
  const hotspotsPreLatest =
    dataHotspots.histories[hotspotsLatestIdx - 1].hotspots;

  return (
    <>
      <div className="flex flex-row justify-between">
        <SectionTitle>District Covid Stats</SectionTitle>
        <SectionTitle>
          Could't fetch data for{" "}
          {dateString(date)
            .split("-")
            .reverse()
            .join("/")}
          , showing data of previous date
        </SectionTitle>
      </div>
      <div className="grid gap-3 mb-4 md:grid-cols-5 xl:grid-cols-5">
        {Object.keys(lang)
          .slice(0, 4)
          .map((k) => (
            <InfoCard
              k={k}
              small={true}
              title={lang[k]}
              value={latest.summary[filterDistrict.name][k] || 0}
              delta={latest.delta[filterDistrict.name][k] || 0}
            />
          ))}
        <InfoCard
          small={true}
          title="Hotspots"
          value={
            hotspotsLatest.filter((h) => h.district === filterDistrict.name)
              .length
          }
          delta={
            hotspotsLatest.filter((h) => h.district === filterDistrict.name)
              .length -
            hotspotsPreLatest.filter((h) => h.district === filterDistrict.name)
              .length
          }
        />
      </div>
      <div className="grid gap-3 mb-8 md:grid-cols-4 xl:grid-cols-4">
        {Object.keys(lang)
          .slice(4)
          .map((k) => (
            <InfoCard
              k={k}
              small={true}
              title={lang[k]}
              value={latest.summary[filterDistrict.name][k] || 0}
              delta={latest.delta[filterDistrict.name][k] || 0}
            />
          ))}
      </div>
      <SectionTitle>Kerala Covid Stats</SectionTitle>
      <div className="grid gap-3 mb-4 md:grid-cols-5 xl:grid-cols-5">
        {Object.keys(lang)
          .slice(0, 4)
          .map((k) => (
            <InfoCard
              k={k}
              small={true}
              title={lang[k]}
              value={latestSummary.summary[k]}
              delta={latestSummary.delta[k]}
            />
          ))}
        <InfoCard
          small={true}
          title="Hotspots"
          value={hotspotsLatest.length}
          delta={hotspotsLatest.length - hotspotsPreLatest.length}
        />
      </div>
      <div className="grid gap-3 mb-8 md:grid-cols-4 xl:grid-cols-4">
        {Object.keys(lang)
          .slice(4)
          .map((k) => (
            <InfoCard
              k={k}
              small={true}
              title={lang[k]}
              value={latestSummary.summary[k]}
              delta={latestSummary.delta[k]}
            />
          ))}
      </div>
    </>
  );
}

export default Covid;
