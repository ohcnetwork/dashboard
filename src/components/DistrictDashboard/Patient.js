import * as dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { lazy, Suspense, useContext } from "react";
import useSWR from "swr";
import { AuthContext } from "../../context/AuthContext";
import { careSummary } from "../../utils/api";
import { PATIENT_TYPES } from "../../utils/constants";
import { dateString, getNDateAfter, getNDateBefore } from "../../utils/utils";
import { InfoCard } from "../Cards/InfoCard";
import { ValuePill } from "../Pill/ValuePill";
import ThemedSuspense from "../ThemedSuspense";
const FacilityTable = lazy(() => import("./FacilityTable"));
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

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
    phone_number: facility.phone_number,
    location: facility.location,
    address: facility.address,
    modifiedDate: data.modified_date,
  }));
  const filteredFacilities = facilities.filter((f) =>
    filterFacilityTypes.includes(f.facilityType)
  );
  const facilitiesTrivia = filteredFacilities.reduce(
    (a, c) => {
      let key = c.date === dateString(date) ? "current" : "previous";
      a[key].count += 1;
      Object.keys(PATIENT_TYPES).forEach((k) => {
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

  return (
    <>
      <div className="flex flex-row justify-end h-6 mb-8 space-x-2">
        <ValuePill
          title={"Facility Count"}
          value={facilitiesTrivia.current.count}
        />
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        {Object.keys(PATIENT_TYPES).map((k, i) => (
          <InfoCard
            key={i}
            title={PATIENT_TYPES[k]}
            value={facilitiesTrivia.current[k].total}
            delta={facilitiesTrivia.current[k].today}
          />
        ))}
      </div>
      <Suspense fallback={<ThemedSuspense />}>
        <FacilityTable
          className="mb-8"
          columns={["Name", "Last Updated", ...Object.values(PATIENT_TYPES)]}
          data={filteredFacilities.reduce((a, c) => {
            if (c.date !== dateString(date)) {
              return a;
            }
            return [
              ...a,
              [
                [c.facility_name, c.facilityType, c.phone_number],
                dayjs(c.modifiedDate, "DD-MM-YYYY HH:mm").fromNow(),
                ...Object.keys(PATIENT_TYPES).map((k) => {
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
          exported={{
            filename: "patient_export.csv",
            data: filteredFacilities.reduce((a, c) => {
              if (c.date !== dateString(date)) {
                return a;
              }
              return [
                ...a,
                {
                  "Hospital/CFLTC Name": c.facility_name,
                  "Hospital/CFLTC Address": c.address,
                  "Govt/Pvt": c.facilityType.startsWith("Govt")
                    ? "Govt"
                    : "Pvt",
                  "Hops/CFLTC":
                    c.facilityType === "First Line Treatment Centre"
                      ? "CFLTC"
                      : "Hops",
                  Mobile: c.phone_number,
                  ...Object.keys(PATIENT_TYPES).reduce((t, x) => {
                    let y = { ...t };
                    y[`Total Patient in ${PATIENT_TYPES[x]}`] =
                      c["total_patients_" + x];
                    return y;
                  }, {}),
                },
              ];
            }, []),
          }}
        ></FacilityTable>
      </Suspense>
    </>
  );
}

export default Patient;
