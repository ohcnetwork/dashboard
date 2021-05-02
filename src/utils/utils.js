import polylabel from "polylabel";
import { useEffect, useState } from "react";
import { feature } from "topojson";
import fetch from "unfetch";

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
      if (new Date(a.modifiedDate) < new Date(b.modifiedDate)) {
        return 1;
      }
      return -1;
    });
};

export const useKeralaMap = () => {
  const [topojson, setTopojson] = useState({});
  const [zoom, setZoom] = useState(1);
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
      })
      .catch((error) => {
        throw error;
      });
  }, []);
  return {
    topojson,
    zoom,
    setZoom,
    markers,
    projectionConfig,
  };
};
