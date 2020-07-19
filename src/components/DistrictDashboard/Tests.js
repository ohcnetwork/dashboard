import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { careTestsSummary } from "../../utils/api";
import { testsTypes } from "../../utils/constants";
import { dateString, getNDateAfter, getNDateBefore } from "../../utils/utils";
import { InfoCard } from "../Cards/InfoCard";
import Table from "../Table";
import { SectionTitle } from "../Typography/Title";

function Tests({ filterDistrict, date }) {
  const initialFacilitiesTrivia = {
    count: 0,
    result_awaited: 0,
    test_discarded: 0,
    total_patients: 0,
    result_negative: 0,
    result_positive: 0,
  };

  const { auth } = useContext(AuthContext);
  const [facilities, setFacilities] = useState([]);
  const [filteredFacilities, setFilteredFacilities] = useState([]);
  const [facilitiesTrivia, setFacilitiesTrivia] = useState({
    current: initialFacilitiesTrivia,
    previous: initialFacilitiesTrivia,
  });

  useEffect(() => {
    careTestsSummary(
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
        Object.keys(testsTypes).forEach((k) => {
          a[key][k] += c[k];
          a[key][k] += c[k];
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
      <div className="flex flex-row justify-between">
        <SectionTitle>
          Facility Count: {facilitiesTrivia.current.count}
        </SectionTitle>
        <SectionTitle>
          Patient Count: {facilitiesTrivia.current.total_patients}
        </SectionTitle>
      </div>
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        {Object.keys(testsTypes).map((k, i) => {
          if (k != "total_patients") {
            return (
              <InfoCard
                key={i}
                title={testsTypes[k]}
                value={facilitiesTrivia.current[k]}
                delta={
                  facilitiesTrivia.current[k] - facilitiesTrivia.previous[k]
                }
              />
            );
          }
        })}
      </div>

      <SectionTitle>Facilities</SectionTitle>
      <Table
        className="mb-8"
        columns={[
          "Name",
          "Total Patients",
          "ICU",
          "Ventilator",
          "Home Quarantine",
          "Isolation",
        ]}
        data={filteredFacilities.reduce((a, c) => {
          if (c.date !== dateString(date)) {
            return a;
          }
          return [
            ...a,
            [
              <p className="font-semibold">{c.facility_name}</p>,
              ...Object.keys(testsTypes).map((i) => c[i]),
            ],
          ];
        }, [])}
      ></Table>
    </>
  );
}

export default Tests;
