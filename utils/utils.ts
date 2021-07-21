import { OXYGEN_INVENTORY } from "./constants";

export const getNDateBefore = (d: Date, n: number) => {
  const dt = new Date(d);
  return new Date(dt.setDate(dt.getDate() - n));
};

export const getNDateAfter = (d: Date, n: number) => {
  const dt = new Date(d);
  return new Date(dt.setDate(dt.getDate() + n));
};

export const dateString = (d: Date) => {
  return `${d.getFullYear()}-${`0${d.getMonth() + 1}`.slice(
    -2
  )}-${`0${d.getDate()}`.slice(-2)}`;
};

// TODO: Write types
const timeToEmpty = (inventoryItem: any) => {
  return inventoryItem &&
    inventoryItem.stock &&
    inventoryItem.burn_rate &&
    inventoryItem.burn_rate !== undefined &&
    Math.round(inventoryItem.burn_rate ?? 0) !== 0
    ? (inventoryItem?.stock / inventoryItem?.burn_rate).toFixed(2)
    : -1;
};

// TODO: Write types
export const processFacilities = (
  data: any,
  filterFacilityTypes: any,
  orderBy: any
) => {
  return (
    data
      // TODO: Write types
      .filter((d: any) => d.facility)
      // TODO: Write types
      .map(({ data, created_date, facility, modified_date }: any) => ({
        date: dateString(new Date(created_date)),

        id: facility.id,
        name: facility.name,
        address: facility.address,
        districtId: facility.district,
        facilityType: facility.facility_type || "Unknown",
        location: facility.location,
        phoneNumber: facility.phone_number,
        inventory: data.inventory,

        modifiedDate:
          data.availability && data.availability.length !== 0
            ? Math.max(
                // TODO: Write types
                ...data.availability.map((a: any) => new Date(a.modified_date))
              )
            : data.modified_date || modified_date,
        inventoryModifiedDate:
          data.inventory && Object.keys(data.inventory).length !== 0
            ? Math.max(
                // @ts-ignore FIX THIS
                ...Object.values(data.inventory).map(
                  // TODO: Write types
                  (a: any) => new Date(a.modified_date)
                )
              )
            : data.modified_date || modified_date,

        ...("availability" in data
          ? {
              capacity: data.availability
                ? // TODO: Write types
                  data.availability.reduce((cAcc: any, cCur: any) => {
                    return {
                      ...cAcc,
                      [cCur.room_type]: cCur,
                    };
                  }, {})
                : null,
              oxygenCapacity: data.oxygen_capacity,
              type_b_cylinders: data.type_b_cylinders,
              type_c_cylinders: data.type_c_cylinders,
              type_d_cylinders: data.type_d_cylinders,
              expected_oxygen_requirement: data.expected_oxygen_requirement,
              expected_type_b_cylinders: data.expected_type_b_cylinders,
              expected_type_c_cylinders: data.expected_type_c_cylinders,
              expected_type_d_cylinders: data.expected_type_d_cylinders,
              actualDischargedPatients: data.actual_discharged_patients,
              actualLivePatients: data.actual_live_patients,
              tte_tank: Number(
                timeToEmpty(
                  data.inventory && data.inventory[OXYGEN_INVENTORY.liquid]
                ) || -1
              ),
              tte_d_cylinders: Number(
                timeToEmpty(
                  data.inventory && data.inventory[OXYGEN_INVENTORY.type_d]
                ) || -1
              ),
              tte_c_cylinders: Number(
                timeToEmpty(
                  data.inventory && data.inventory[OXYGEN_INVENTORY.type_c]
                ) || -1
              ),
              tte_b_cylinders: Number(
                timeToEmpty(
                  data.inventory && data.inventory[OXYGEN_INVENTORY.type_b]
                ) || -1
              ),
            }
          : {
              ...data,
            }),
      }))
      .filter((f: any) => filterFacilityTypes.includes(f.facilityType))
      // TODO: Write types and make variable names clear
      .reduce((acc: any, f: any, i: any, arr: any) => {
        const zero = acc?.zero || acc;
        const nonZero = acc?.nonZero || acc;
        let returnable;
        if (arr.length === 1) {
          return arr;
        }
        if (
          orderBy
            ? Math.round(f[orderBy.selector]) >= 0 &&
              Number(f[orderBy.selector]) < Infinity
            : true
        ) {
          returnable = { zero, nonZero: [...nonZero, f] };
        } else {
          returnable = { nonZero, zero: [...zero, f] };
        }
        if (arr.length - 1 === i) {
          return [
            // TODO: Write types
            ...nonZero.sort((a: any, b: any) => {
              return orderBy && a[orderBy.selector] !== undefined
                ? a[orderBy.selector] < b[orderBy.selector]
                  ? 1 * Number(orderBy.order)
                  : -1 * Number(orderBy.order)
                : new Date(a.modifiedDate) < new Date(b.modifiedDate)
                ? 1
                : -1;
            }),
            ...zero,
          ];
        }
        return returnable;
      }, [])
  );
};
