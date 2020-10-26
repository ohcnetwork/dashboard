/* eslint-disable no-dupe-keys */
import axios from "axios";

import { FACILITY_TYPES } from "./constants";

export const getNDateBefore = (d, n) => {
  const dt = new Date(d);
  return new Date(dt.setDate(dt.getDate() - n));
};

export const getNDateAfter = (d, n) => {
  const dt = new Date(d);
  return new Date(dt.setDate(dt.getDate() + n));
};

export const dateString = (d) => {
  return `${d.getFullYear()}-${`0${d.getMonth() + 1}`.slice(
    -2
  )}-${`0${d.getDate()}`.slice(-2)}`;
};

export const getLSGD = () => {
  return axios.get("/kerala_lsgd.json");
};

export const getDistrict = () => {
  return axios.get("/kerala_district.json");
};

export const processFacilities = (data, filterFacilityTypes) => {
  return data
    .map(({ data, created_date, facility }) => ({
      date: dateString(new Date(created_date)),

      id: facility.id,
      name: facility.name,
      address: facility.address,
      districtId: facility.district,
      facilityType: facility.facility_type || "Unknown",
      location: facility.location,
      phoneNumber: facility.phone_number,

      modifiedDate:
        data.availability && data.availability.length !== 0
          ? Math.max(...data.availability.map((a) => new Date(a.modified_date)))
          : data.modified_date,

      capacity: data.availability
        ? data.availability.reduce((cAcc, cCur) => {
            return {
              ...cAcc,
              [cCur.room_type]: cCur,
            };
          }, {})
        : null,
      oxygenCapacity: data.oxygen_capacity,
      actualDischargedPatients: data.actual_discharged_patients,
      actualLivePatients: data.actual_live_patients,

      today_patients_home_quarantine: data.today_patients_home_quarantine,
      today_patients_icu: data.today_patients_icu,
      today_patients_isolation: data.today_patients_isolation,
      today_patients_ventilator: data.today_patients_ventilator,
      total_patients_home_quarantine: data.total_patients_home_quarantine,
      total_patients_icu: data.total_patients_icu,
      total_patients_isolation: data.total_patients_isolation,
      total_patients_ventilator: data.total_patients_ventilator,

      result_awaited: data.result_awaited,
      result_negative: data.result_negative,
      result_positive: data.result_positive,
      test_discarded: data.test_discarded,
      total_patients: data.total_patients,
      total_tests: data.total_tests,

      avg_patients_confirmed_positive: data.avg_patients_confirmed_positive,
      avg_patients_home_quarantine: data.avg_patients_home_quarantine,
      avg_patients_isolation: data.avg_patients_isolation,
      avg_patients_referred: data.avg_patients_referred,
      avg_patients_visited: data.avg_patients_visited,
      total_patients_confirmed_positive: data.total_patients_confirmed_positive,
      total_patients_home_quarantine: data.total_patients_home_quarantine,
      total_patients_isolation: data.total_patients_isolation,
      total_patients_referred: data.total_patients_referred,
      total_patients_visited: data.total_patients_visited,
    }))
    .filter((f) => filterFacilityTypes.includes(f.facilityType))
    .sort((a, b) => {
      if (
        FACILITY_TYPES.indexOf(a.facilityType) >
        FACILITY_TYPES.indexOf(b.facilityType)
      ) {
        return 1;
      }
      return -1;
    });
};
