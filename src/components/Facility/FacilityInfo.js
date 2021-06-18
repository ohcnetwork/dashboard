import React from "react";

const FacilityInfo = ({ facilityData }) => {
  return facilityData &&
    facilityData.results &&
    facilityData.results?.length >= 1 ? (
    <div className="flex flex-col items-start justify-center mt-4">
      <h1 className="mb-3 mt-6 text-3xl font-bold">
        {facilityData?.results[0]?.facility.name}
      </h1>

      <div className="w -full flex flex-wrap items-center justify-start">
        {facilityData?.results[0]?.facility?.phone_number && (
          <div style={{ width: "50%" }} className="my-2 text-sm">
            <span className="font-semibold">Phone: </span>
            {facilityData?.results[0]?.facility?.phone_number}
          </div>
        )}
        {facilityData?.results[0]?.facility?.facility_type && (
          <div style={{ width: "50%" }} className="my-2 text-sm">
            <span className="font-semibold">Facility Type: </span>
            {facilityData?.results[0]?.facility?.facility_type}
          </div>
        )}
        {facilityData?.results[0]?.facility?.address && (
          <div style={{ width: "50%" }} className="my-2 text-sm">
            <span className="font-semibold">Address: </span>
            {facilityData?.results[0]?.facility?.address}
          </div>
        )}
        {facilityData?.results[0]?.facility?.local_body_object?.name && (
          <div style={{ width: "50%" }} className="my-2 text-sm">
            <span className="font-semibold">Local Body: </span>
            {facilityData?.results[0]?.facility?.local_body_object?.name}
          </div>
        )}
        {facilityData?.results[0]?.facility?.ward_object && (
          <div style={{ width: "50%" }} className="my-2 text-sm">
            <span className="font-semibold">Ward: </span>
            {`${
              facilityData?.results[0]?.facility?.ward_object?.number || ""
            }, ${facilityData?.results[0]?.facility?.ward_object?.name || ""}`}
          </div>
        )}
        {facilityData?.results[0]?.district_object && (
          <div style={{ width: "50%" }} className="my-2 text-sm">
            <span className="font-semibold">District: </span>
            {facilityData?.results[0]?.district_object?.name}
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="word-wrap my-4 px-2 py-4 text-center text-gray-600 break-words text-2xl font-bold bg-gray-50 dark:bg-gray-800 rounded-md md:text-3xl">
      <p>No Data Available</p>
    </div>
  );
};

export default FacilityInfo;
