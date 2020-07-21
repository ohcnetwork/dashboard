import * as dayjs from "dayjs";
import "dayjs/locale/en-in";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { carePatientSummary } from "../../utils/api";
import { patientTypes } from "../../utils/constants";
import { dateString, getNDateAfter, getNDateBefore } from "../../utils/utils";
import { InfoCard } from "../Cards/InfoCard";
import FacilityTable from "./FacilityTable";
import { SectionTitle } from "../Typography/Title";

function Patient({ filterDistrict, filterFacilityTypes, date }) {
  const initialFacilitiesTrivia = {
    count: 0,
    ventilator: { total: 0, today: 0 },
    icu: { total: 0, today: 0 },
    isolation: { total: 0, today: 0 },
    home_quarantine: { total: 0, today: 0 },
  };

  const { auth } = useContext(AuthContext);
  const [facilities, setFacilities] = useState([]);
  const [filteredFacilities, setFilteredFacilities] = useState([]);
  const [facilitiesTrivia, setFacilitiesTrivia] = useState({
    current: initialFacilitiesTrivia,
    previous: initialFacilitiesTrivia,
  });

  useEffect(() => {
    carePatientSummary(
      auth.token,
      dateString(getNDateBefore(date, 1)),
      dateString(getNDateAfter(date, 1))
    )
      .then((resp) => {
        setFacilities(
          resp.results.map(({ data, facility, created_date }) => ({
            date: dateString(new Date(created_date)),
            ...data,
            id: facility.id,
            facilityType: facility.facility_type || "Unknown",
            location: facility.location,
            modifiedDate: data.modified_date,
          }))
        );
      })
      .catch((ex) => {
        console.error("Data Unavailable", ex);
      });
  }, [date]);

  useEffect(() => {
    if (facilities.length == 0) {
      return;
    }
    let _f = facilities.filter(
      (f) =>
        f.district === filterDistrict.name &&
        filterFacilityTypes.includes(f.facilityType)
    );
    setFilteredFacilities(_f);
    let _t = _f.reduce(
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
    setFacilitiesTrivia(_t);
  }, [facilities, filterDistrict, filterFacilityTypes]);

  return (
    <>
      <SectionTitle>
        Facility Count: {facilitiesTrivia.current.count}
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
              dayjs(c.modifiedDate)
                .locale("en-in")
                .format("h:mm:ssA DD/MM/YYYY"),
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
