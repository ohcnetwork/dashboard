import React, { useContext } from "react";
import { animated, config, useSpring } from "react-spring";
import useSWR from "swr";
import { AuthContext } from "../../context/AuthContext";
import { careSummary } from "../../utils/api";
import { patientTypes } from "../../utils/constants";
import { dateString, getNDateAfter, getNDateBefore } from "../../utils/utils";
import { InfoCard } from "../Cards/InfoCard";
import { SectionTitle } from "../Typography/Title";
import FacilityTable from "./FacilityTable";

function Patient({ filterDistrict, filterFacilityTypes, date }) {
  const initialFacilitiesTrivia = {
    count: 0,
    ventilator: { total: 0, today: 0 },
    icu: { total: 0, today: 0 },
    isolation: { total: 0, today: 0 },
    home_quarantine: { total: 0, today: 0 },
  };

  const { auth } = useContext(AuthContext);
  const { data, error } = useSWR(
    ["Patient", date, auth.token, filterDistrict.id],
    (url, date, token, district) =>
      careSummary(
        token,
        "patient",
        dateString(getNDateBefore(date, 1)),
        dateString(getNDateAfter(date, 1)),
        district
      ).then((r) => r)
  );

  const facilities = data.results.map(({ data, facility, created_date }) => ({
    date: dateString(new Date(created_date)),
    ...data,
    id: facility.id,
    facilityType: facility.facility_type || "Unknown",
    location: facility.location,
    modifiedDate: data.modified_date,
  }));
  const filteredFacilities = facilities.filter((f) =>
    filterFacilityTypes.includes(f.facilityType)
  );
  const facilitiesTrivia = filteredFacilities.reduce(
    (a, c) => {
      let key = c.date === dateString(date) ? "current" : "previous";
      a[key].count += 1;
      Object.keys(patientTypes).forEach((k) => {
        a[key][k].today += c["today_patients_" + k];
        a[key][k].total += c["total_patients_" + k];
      });
      return a;
    },
    {
      current: JSON.parse(JSON.stringify(initialFacilitiesTrivia)),
      previous: JSON.parse(JSON.stringify(initialFacilitiesTrivia)),
    }
  );

  const { count } = useSpring({
    from: { count: 0 },
    to: {
      count: facilitiesTrivia.current.count || 0,
    },
    delay: 0,
    config: config.slow,
  });

  return (
    <>
      <SectionTitle>
        <animated.span>
          {count.interpolate((x) => `Facility Count: ${Math.round(x)}`)}
        </animated.span>
      </SectionTitle>

      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        {Object.keys(patientTypes).map((k, i) => (
          <InfoCard
            key={i}
            title={patientTypes[k]}
            value={facilitiesTrivia.current[k].total}
            delta={facilitiesTrivia.current[k].today}
          />
        ))}
      </div>

      <FacilityTable
        className="mb-8"
        columns={["Name", "Last Updated", ...Object.values(patientTypes)]}
        data={filteredFacilities.reduce((a, c) => {
          if (c.date !== dateString(date)) {
            return a;
          }
          return [
            ...a,
            [
              [c.facility_name, c.facilityType],
              c.modifiedDate,
              ...Object.keys(patientTypes).map((k) => {
                let delta = c["today_patients_" + k];
                return (
                  <div className="flex">
                    <p className="">{c["total_patients_" + k]}</p>
                    <span className="ml-2 text-sm">
                      {delta == 0 ? "-" : delta > 0 ? `+${delta}` : delta}
                    </span>
                  </div>
                );
              }),
            ],
          ];
        }, [])}
      ></FacilityTable>
    </>
  );
}

export default Patient;
