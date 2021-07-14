import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useState, useEffect, useMemo } from "react";
import useSWR from "swr";

import { careSummary } from "../../utils/api";
import { PATIENT_TYPES } from "../../utils/constants";
import {
  dateString,
  getNDateAfter,
  getNDateBefore,
  processFacilities,
} from "../../utils/utils";
import { InfoCard } from "../Cards/InfoCard";
import { ValuePill } from "../Pill/ValuePill";
import { PatientCard } from "../Cards/PatientCard";
import { SectionTitle } from "../Typography/Title";
import { CSVLink } from "react-csv";
import Pagination from "../Pagination";
import { Button, Input } from "@windmill/react-ui";
import fuzzysort from "fuzzysort";
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

const initialFacilitiesTrivia = {
  count: 0,
  icu: { total: 0, today: 0 },
  oxygen_bed: { total: 0, today: 0 },
  bed_with_oxygen_support: { total: 0, today: 0 },
  icu_with_oxygen_support: { total: 0, today: 0 },
  not_admitted: { total: 0, today: 0 },
  home_isolation: { total: 0, today: 0 },
  isolation_room: { total: 0, today: 0 },
  home_quarantine: { total: 0, today: 0 },
  paediatric_ward: { total: 0, today: 0 },
  gynaecology_ward: { total: 0, today: 0 },
  icu_with_invasive_ventilator: { total: 0, today: 0 },
  icu_with_non_invasive_ventilator: { total: 0, today: 0 },
};

function Patient({ filterDistrict, filterFacilityTypes, date }) {
  const { data } = useSWR(
    ["Patient", date, filterDistrict.id],
    (url, date, district) =>
      careSummary(
        "patient",
        dateString(getNDateBefore(date, 1)),
        dateString(getNDateAfter(date, 1)),
        district
      )
  );

  const { facilitiesTrivia, exported, patientCardData } = useMemo(() => {
    const filtered = processFacilities(data.results, filterFacilityTypes);
    const facilitiesTrivia = filtered.reduce(
      (a, c) => {
        const key = c.date === dateString(date) ? "current" : "previous";
        a[key].count += 1;
        Object.keys(PATIENT_TYPES).forEach((k) => {
          a[key][k].today += c[`today_patients_${k}`] || 0;
          a[key][k].total += c[`total_patients_${k}`] || 0;
        });
        return a;
      },
      {
        current: JSON.parse(JSON.stringify(initialFacilitiesTrivia)),
        previous: JSON.parse(JSON.stringify(initialFacilitiesTrivia)),
      }
    );

    const patientCardData = filtered.reduce((acc, facility) => {
      if (facility.date !== dateString(date)) return acc;
      const details = [
        ...acc,
        {
          id: facility.id,
          facility_name: facility.name,
          facility_type: facility.facilityType,
          phone_number: facility.phoneNumber,
          last_updated: dayjs(
            facility.modifiedDate,
            "DD-MM-YYYY HH:mm"
          ).fromNow(),
        },
      ];
      Object.keys(PATIENT_TYPES).forEach((type) => {
        details[details.length - 1][type] = {
          total: facility[`total_patients_${type}`] || 0,
          today: facility[`today_patients_${type}`] || 0,
        };
      });
      return details;
    }, []);

    const exported = {
      filename: "patient_export.csv",
      data: filtered.reduce((a, c) => {
        if (c.date !== dateString(date)) {
          return a;
        }
        return [
          ...a,
          {
            "Hospital/CFLTC Name": c.name,
            "Hospital/CFLTC Address": c.address,
            "Govt/Pvt": c.facilityType.startsWith("Govt") ? "Govt" : "Pvt",
            "Hops/CFLTC":
              c.facilityType === "First Line Treatment Centre"
                ? "CFLTC"
                : "Hops",
            Mobile: c.phoneNumber,
            ...Object.keys(PATIENT_TYPES).reduce((t, x) => {
              const y = { ...t };
              y[`Total Patient in ${PATIENT_TYPES[x]}`] =
                c[`total_patients_${x}`];
              return y;
            }, {}),
          },
        ];
      }, []),
    };
    return { facilitiesTrivia, exported, patientCardData };
  }, [data, filterFacilityTypes]);

  const [filteredData, setFilteredData] = useState(patientCardData);
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const resultsPerPage = 10;

  useEffect(() => {
    const debounce_timer = setTimeout(() => {
      setFilteredData(
        searchTerm
          ? patientCardData.filter((v) =>
              fuzzysort
                .go(
                  searchTerm,
                  patientCardData.map((d) => ({ ...d, 0: d.facility_name })),
                  { key: "0" }
                )
                .map((v) => v.target)
                .includes(v.facility_name)
            )
          : patientCardData
      );
      setPage(0);
    }, 1000);
    return () => clearTimeout(debounce_timer);
  }, [searchTerm, patientCardData]);

  useEffect(() => {
    setTableData(
      filteredData.slice(page * resultsPerPage, (page + 1) * resultsPerPage)
    );
  }, [filteredData, page]);

  return (
    <>
      <div className="grid gap-1 grid-rows-none mb-8 sm:grid-flow-col-dense sm:grid-rows-1 sm:place-content-end">
        <ValuePill
          title="Facility Count"
          value={facilitiesTrivia.current.count}
        />
      </div>

      <div className="grid-col-1 grid gap-6 mb-8 md:grid-cols-4">
        {Object.keys(PATIENT_TYPES).map((k) => (
          <InfoCard
            key={k}
            title={PATIENT_TYPES[k]}
            value={facilitiesTrivia.current[k].total}
            delta={facilitiesTrivia.current[k].today}
          />
        ))}
      </div>

      <div id="facility-patient-cards" className="mb-16 mt-16">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <SectionTitle>Facilities</SectionTitle>
          <div className="flex max-w-full space-x-4">
            {exported && (
              <CSVLink data={exported.data} filename={exported.filename}>
                <Button block>Export</Button>
              </CSVLink>
            )}
            <Input
              className="sw-40 rounded-lg sm:w-auto"
              placeholder="Search Facility"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>

        {tableData.map((data) => (
          <PatientCard data={data} key={data.id} />
        ))}

        <Pagination
          resultsPerPage={resultsPerPage}
          totalResults={filteredData.length}
          currentPage={page}
          currentResults={tableData.length}
          handlePageClick={setPage}
        />
      </div>
    </>
  );
}

export default Patient;
