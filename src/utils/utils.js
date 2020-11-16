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

      ...("availability" in data
        ? {
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
          }
        : {
            ...data,
          }),
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
