import React from "react";
import useSWR from "swr";
import { covidGetLatest } from "../../utils/api";
import { InfoCard } from "../Cards/InfoCard";
import { SectionTitle } from "../Typography/Title";

function Covid({ filterDistrict }) {
  const { data: covidStats, error } = useSWR(
    ["Covid"],
    (url) => covidGetLatest().then((r) => r),
    { suspense: true, loadingTimeout: 10000 }
  );
  
  return (
    <>
      <SectionTitle>Covid Stats</SectionTitle>
      <div className="grid gap-3 mb-8 md:grid-cols-4 xl:grid-cols-4">
        <InfoCard
          title="Confirmed"
          value={covidStats.summary[filterDistrict.name]?.confirmed || 0}
          delta={covidStats.delta[filterDistrict.name]?.confirmed || 0}
        />
        <InfoCard
          title="Active"
          value={covidStats.summary[filterDistrict.name]?.active || 0}
          delta={covidStats.delta[filterDistrict.name]?.active || 0}
        />
        <InfoCard
          title="Recovered"
          value={covidStats.summary[filterDistrict.name]?.recovered || 0}
          delta={covidStats.delta[filterDistrict.name]?.recovered || 0}
        />
        <InfoCard
          title="Deaths"
          value={covidStats.summary[filterDistrict.name]?.deceased || 0}
          delta={covidStats.delta[filterDistrict.name]?.deceased || 0}
        />
      </div>
      <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-4">
        <InfoCard
          title="Under Observation"
          value={covidStats.summary[filterDistrict.name]?.total_obs || 0}
          delta={covidStats.delta[filterDistrict.name]?.total_obs || 0}
        />
        <InfoCard
          title="Hospital Isolation"
          value={covidStats.summary[filterDistrict.name]?.hospital_obs || 0}
          delta={covidStats.delta[filterDistrict.name]?.hospital_obs || 0}
        />
        <InfoCard
          title="Home Isolation"
          value={covidStats.summary[filterDistrict.name]?.home_obs || 0}
          delta={covidStats.delta[filterDistrict.name]?.home_obs || 0}
        />
        <InfoCard
          title="Hospitalized Today"
          value={covidStats.summary[filterDistrict.name]?.hospital_today || 0}
          delta={covidStats.delta[filterDistrict.name]?.hospital_today || 0}
        />
      </div>
    </>
  );
}

export default Covid;
