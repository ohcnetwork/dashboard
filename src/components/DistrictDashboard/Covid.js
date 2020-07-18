import React, { useContext, useEffect, useState } from "react";
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow,
} from "windmill-react-ui";
import { getCovidStats } from "../../utils/api";
import { SmallInfoCard } from "../Cards/InfoCard";
import { SectionTitle } from "../Typography/Title";

function Covid({ filterDistrict }) {
  const [covidStats, setCovidStats] = useState({ summary: {}, delta: {} });

  useEffect(() => {
    getCovidStats().then((stats) => setCovidStats(stats));
  }, []);

  return (
    <>
      <SectionTitle>Covid Stats</SectionTitle>
      <div className="grid gap-6 mb-8 md:grid-cols-1 xl:grid-cols-2">
        <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-4">
          <SmallInfoCard
            title="Confirmed"
            value={covidStats.summary[filterDistrict.name]?.confirmed || 0}
            delta={covidStats.delta[filterDistrict.name]?.confirmed || 0}
          />
          <SmallInfoCard
            title="Active"
            value={covidStats.summary[filterDistrict.name]?.active || 0}
            delta={covidStats.delta[filterDistrict.name]?.active || 0}
          />
          <SmallInfoCard
            title="Recovered"
            value={covidStats.summary[filterDistrict.name]?.recovered || 0}
            delta={covidStats.delta[filterDistrict.name]?.recovered || 0}
          />
          <SmallInfoCard
            title="Deaths"
            value={covidStats.summary[filterDistrict.name]?.deceased || 0}
            delta={covidStats.delta[filterDistrict.name]?.deceased || 0}
          />
        </div>
        <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-4">
          <SmallInfoCard
            title="Under Observation"
            value={covidStats.summary[filterDistrict.name]?.total_obs || 0}
            delta={covidStats.delta[filterDistrict.name]?.total_obs || 0}
          />
          <SmallInfoCard
            title="Hospital Isolation"
            value={covidStats.summary[filterDistrict.name]?.hospital_obs || 0}
            delta={covidStats.delta[filterDistrict.name]?.hospital_obs || 0}
          />
          <SmallInfoCard
            title="Home Isolation"
            value={covidStats.summary[filterDistrict.name]?.home_obs || 0}
            delta={covidStats.delta[filterDistrict.name]?.home_obs || 0}
          />
          <SmallInfoCard
            title="Hospitalized Today"
            value={covidStats.summary[filterDistrict.name]?.hospital_today || 0}
            delta={covidStats.delta[filterDistrict.name]?.hospital_today || 0}
          />
        </div>
      </div>
    </>
  );
}

export default Covid;
