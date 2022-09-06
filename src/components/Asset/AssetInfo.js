import React from "react";
import QRCode from "qrcode.react";

const status = (asset_status) => {
  if (asset_status === "ACTIVE") {
    return (
      <span className="px-2 py-1 text-white text-sm bg-green-700 rounded-full uppercase">
        ACTIVE
      </span>
    );
  }
  return (
    <span className="px-2 py-1 text-white text-sm bg-yellow-700 rounded-full uppercase">
      TRANSFER IN PROGRESS
    </span>
  );
};

const working_status = (is_working) => {
  const bgColorClass = is_working ? "bg-green-700" : "bg-red-700";
  return (
    <span
      className={`${bgColorClass} text-white text-sm px-2 py-1 uppercase rounded-full`}
    >
      {!is_working && "Not "} Working
    </span>
  );
};

const AssetInfo = ({ assetData }) => {
  return assetData ? (
    <div>
      <h1 className="mb-3 mt-6 text-3xl font-bold">Asset Details</h1>
      <div className="mt-2 p-3 border-4 border-gray-600 rounded-lg shadow md:p-6">
        <div className="mb-4 break-words text-2xl font-semibold">
          {assetData?.name}
        </div>
        <div className="justify-between md:flex">
          <div className="mb-2">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col">
                <span className="font-bold">Location</span>
                <span>{assetData?.location_object.name || "--"}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold">Facility</span>
                <span>{assetData?.location_object.facility.name || "--"}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold">Serial Number</span>
                <span>{assetData?.serial_number || "--"}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold">Warranty Details</span>
                <span>{assetData?.warranty_details || "--"}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold">Type</span>
                <span>{assetData?.asset_type || "--"}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold">Vendor Name</span>
                <span>{assetData?.vendor_name || "--"}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold">Customer Support Name</span>
                <span>{assetData?.support_name || "--"}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold">Contact Phone Number</span>
                <span>{assetData?.support_phone || "--"}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold">Contact Email</span>
                <span>{assetData?.support_email || "--"}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold">Status</span>
                <span>{status(assetData?.status)}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold">Working status</span>
                <span>{working_status(assetData?.is_working)}</span>
              </div>
              {!assetData?.is_working && (
                <div className="flex flex-col">
                  <span className="font-bold">Not working reason</span>
                  <span>{assetData?.not_working_reason || "--"}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-2 mx-2">
            <div className="flex justify-center mb-3 p-2 bg-white rounded-md">
              <QRCode
                bgColor="#FFFFFF"
                fgColor="#000000"
                level="Q"
                size={128}
                value={document.location.href}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="word-wrap bg-gray-50 my-4 px-2 py-4 text-center text-gray-600 break-words text-2xl font-bold dark:bg-gray-800 rounded-md md:text-3xl">
      <p>No Data Available</p>
    </div>
  );
};

export default AssetInfo;
