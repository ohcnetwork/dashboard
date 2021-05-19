import polylabel from "polylabel";
import { useEffect, useState } from "react";
import { feature } from "topojson";
import fetch from "unfetch";

import { OXYGEN_INVENTORY } from "./constants";

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

const timeToEmpty = (inventoryItem) =>
  inventoryItem &&
  inventoryItem.stock &&
  inventoryItem.burn_rate &&
  inventoryItem.burn_rate !== undefined &&
  Math.round(inventoryItem.burn_rate ?? 0) !== 0
    ? (inventoryItem?.stock / inventoryItem?.burn_rate).toFixed(2)
    : -1;

export const processFacilities = (data, filterFacilityTypes, orderBy) => {
  return data
    .filter((d) => d.facility)
    .map(({ data, created_date, facility, modified_date }) => ({
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
          ? Math.max(...data.availability.map((a) => new Date(a.modified_date)))
          : data.modified_date || modified_date,
      inventoryModifiedDate:
        data.inventory && Object.keys(data.inventory).length !== 0
          ? Math.max(
              ...Object.values(data.inventory).map(
                (a) => new Date(a.modified_date)
              )
            )
          : data.modified_date || modified_date,

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
    .reduce(
      (acc, f, i, arr) => {
        const { zero, nonZero } = acc;
        let returnable;
        if (
          filterFacilityTypes.includes(f.facilityType) &&
          (orderBy
            ? Math.round(f[orderBy.selector]) >= 0 &&
              Number(f[orderBy.selector]) < Infinity
            : true)
        ) {
          returnable = { zero, nonZero: [...nonZero, f] };
        } else {
          returnable = { nonZero, zero: [...zero, f] };
        }
        if (arr.length - 1 === i) {
          return [
            ...nonZero.sort((a, b) => {
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
      },
      { zero: [], nonZero: [] }
    );
  // .filter(
  //   (f) =>
  //     filterFacilityTypes.includes(f.facilityType) &&
  //     (orderBy
  //       ? Math.round(f[orderBy.selector]) >= 0 &&
  //         Number(f[orderBy.selector]) < Infinity
  //       : true)
  // )
  // .sort((a, b) => {
  //   return orderBy && a[orderBy.selector] !== undefined
  //     ? a[orderBy.selector] < b[orderBy.selector]
  //       ? 1 * Number(orderBy.order)
  //       : -1 * Number(orderBy.order)
  //     : new Date(a.modifiedDate) < new Date(b.modifiedDate)
  //     ? 1
  //     : -1;
  // });
};

export const useKeralaMap = (district) => {
  const [topojson, setTopojson] = useState({});
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const [markers, setMarkers] = useState([]);
  const [projectionConfig, setProjectionConfig] = useState({});
  useEffect(() => {
    fetch("/kerala_lsgd.json")
      .then((r) => r.json())
      .then((data) => {
        setTopojson(data);
        setMarkers(feature(data, data.objects.data).features);
      })
      .catch((error) => {
        throw error;
      });
    fetch("/kerala_district.json")
      .then((r) => r.json())
      .then((data) => {
        const { features } = feature(data, data.objects.data);
        const config = features.reduce((a, c) => {
          return {
            ...a,
            [c.properties.DISTRICT]: polylabel(c.geometry.coordinates),
          };
        }, {});
        setProjectionConfig(config);
        setPosition({ ...position, coordinates: config[district] || [0, 0] });
      })
      .catch((error) => {
        throw error;
      });
  }, []);

  const handleZoomIn = () => {
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 2 }));
  };

  const handleZoomOut = () => {
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 2 }));
  };

  return {
    topojson,
    position,
    setPosition,
    markers,
    projectionConfig,
    handleZoomIn,
    handleZoomOut,
  };
};
