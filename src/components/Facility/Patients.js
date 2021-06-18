import React from "react";
import { PATIENT_TYPES } from "../../utils/constants";
import { dateString } from "../../utils/utils";

const initialPatientFacilitiesTrivia = {
  count: 0,
  icu: { total: 0, today: 0 },
  oxygen_bed: { total: 0, today: 0 },
  not_admitted: { total: 0, today: 0 },
  home_isolation: { total: 0, today: 0 },
  isolation_room: { total: 0, today: 0 },
  home_quarantine: { total: 0, today: 0 },
  paediatric_ward: { total: 0, today: 0 },
  gynaecology_ward: { total: 0, today: 0 },
  icu_with_invasive_ventilator: { total: 0, today: 0 },
  icu_with_non_invasive_ventilator: { total: 0, today: 0 },
};

const Patients = ({ patientsFiltered, date }) => {
  const patientFacilitiesTrivia =
    patientsFiltered &&
    patientsFiltered.reduce(
      (a, c) => {
        const key = c.date === dateString(date) ? "current" : "previous";
        a[key].count += 1;
        Object.keys(PATIENT_TYPES).forEach((k) => {
          if (a[key][k]) {
            a[key][k].today += c[`today_patients_${k}`] || 0;
            a[key][k].total += c[`total_patients_${k}`] || 0;
          }
        });
        return a;
      },
      {
        current: JSON.parse(JSON.stringify(initialPatientFacilitiesTrivia)),
        previous: JSON.parse(JSON.stringify(initialPatientFacilitiesTrivia)),
      }
    );

  const renderPatientCards = () => {
    let dataExists = false;
    let elems = (
      <div className="grid-col-1 grid gap-6 mb-8 md:grid-cols-4">
        {Object.keys(PATIENT_TYPES).map((k) => {
          if (patientFacilitiesTrivia?.current[`${k}`]?.total) {
            dataExists = true;
          }
          return patientFacilitiesTrivia?.current[`${k}`]?.total ? (
            <div
              key={k}
              className="word-wrap pl-3 pr-2 py-2 break-words bg-gray-50 dark:bg-gray-800 rounded-md"
            >
              <p className="dark:text-gray-300 text-gray-500 text-lg font-semibold capitalize">
                {k.split("_").join(" ")}
              </p>
              <h1 className="mb-2 mt-3 text-gray-800 dark:text-white text-3xl font-bold">
                {patientFacilitiesTrivia?.current[`${k}`]?.total}
                {
                  <sup className="ml-1 dark:text-gray-500 text-gray-600 text-lg font-thin">
                    {patientFacilitiesTrivia?.current[`${k}`]?.total -
                      patientFacilitiesTrivia?.previous[`${k}`]?.total &&
                      `${
                        patientFacilitiesTrivia?.current[`${k}`]?.total -
                          patientFacilitiesTrivia?.previous[`${k}`]?.total >
                        0
                          ? "+"
                          : "-"
                      } ${patientFacilitiesTrivia?.current[`${k}`]?.total}`}
                  </sup>
                }
              </h1>
            </div>
          ) : null;
        })}
      </div>
    );

    if (dataExists) {
      return elems;
    } else {
      return (
        <div className="word-wrap my-4 px-2 py-4 text-center text-gray-600 break-words text-2xl font-bold bg-gray-50 dark:bg-gray-800 rounded-md md:text-3xl">
          <p>No Data Available</p>
        </div>
      );
    }
  };

  return (
    <section className="my-8 px-6 py-4 dark:bg-gray-700 bg-white">
      <h2 className="text-green-500 text-lg font-bold">Patients</h2>
      <div className="mb-4 mt-8">{renderPatientCards()}</div>
    </section>
  );
};

export default Patients;
