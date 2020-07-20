import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { carePatientSummary } from "../../utils/api";
import { patientLang, patientTypes } from "../../utils/constants";
import { dateString, getNDateAfter, getNDateBefore } from "../../utils/utils";
import { InfoCard } from "../Cards/InfoCard";
import Table from "../Table";
import { SectionTitle } from "../Typography/Title";

function Patient({ filterDistrict, date }) {
  const initialFacilitiesTrivia = {
    count: 0,
    ventilator: { total: 0, today: 0 },
    icu: { total: 0, today: 0 },
    isolation: { total: 0, today: 0 },
    home: { total: 0, today: 0 },
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
          resp.results.map(({ data: facility, created_date }) => ({
            date: dateString(new Date(created_date)),
            ...facility,
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
    let _f = facilities.filter((f) => f.district === filterDistrict.name);
    setFilteredFacilities(_f);
    let _t = _f.reduce(
      (a, c) => {
        let key = c.date === dateString(date) ? "current" : "previous";
        a[key].count += 1;
        Object.keys(patientTypes).forEach((k) => {
          a[key][k].today += c["today_patients_" + patientTypes[k]];
          a[key][k].total += c["total_patients_" + patientTypes[k]];
        });
        return a;
      },
      {
        current: JSON.parse(JSON.stringify(initialFacilitiesTrivia)),
        previous: JSON.parse(JSON.stringify(initialFacilitiesTrivia)),
      }
    );
    setFacilitiesTrivia(_t);
  }, [facilities, filterDistrict]);

  return (
    <>
      <SectionTitle>
        Facility Count: {facilitiesTrivia.current.count}
      </SectionTitle>

      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        {Object.keys(patientLang).map((k, i) => (
          <InfoCard
            key={i}
            title={patientLang[k]}
            value={facilitiesTrivia.current[k].total}
            delta={facilitiesTrivia.current[k].today}
          />
        ))}
      </div>

      <SectionTitle>Facilities</SectionTitle>
      <Table
        className="mb-8"
        columns={["Name", "ICU", "Ventilator", "Home Quarantine", "Isolation"]}
        data={filteredFacilities.reduce((a, c) => {
          if (c.date !== dateString(date)) {
            return a;
          }
          return [
            ...a,
            [
              <p className="font-semibold">{c.facility_name}</p>,
              ...Object.keys(patientTypes).map((i) => {
                let delta = c["today_patients_" + patientTypes[i]];
                return (
                  <div className="flex">
                    <p className="">{c["total_patients_" + patientTypes[i]]}</p>
                    <span className="ml-2 text-sm">
                      {delta == 0 ? "-" : delta > 0 ? `+${delta}` : delta}
                    </span>
                  </div>
                );
              }),
            ],
          ];
        }, [])}
      ></Table>
    </>
  );
}

export default Patient;
