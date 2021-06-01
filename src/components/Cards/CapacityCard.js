import React from "react";
import { Card } from "@windmill/react-ui";

export function CapacityCard({ data }) {
  const finalTotal = data.covid.map((val, idx) => {
    const used = val.used + data.non_covid[idx].used;
    const total = val.total + data.non_covid[idx].total;
    const vacant = val.vacant + data.non_covid[idx].vacant;
    return { used: used, total: total, vacant: vacant };
  });

  const showBedInfo = (bedData, category) => (
    <div className="grid grid-cols-5 bg-gray-200 dark:bg-gray-900 rounded-lg">
      <div className="pl-3 pt-2 dark:text-gray-200 text-sm font-medium">
        {category}
      </div>
      {bedData.map((bed) => (
        <div className="grid grid-cols-2 ml-5 mr-5">
          <div className="grid grid-rows-2">
            <div className="text-center text-red-500 text-sm font-semibold">
              Used
            </div>
            <div className="text-center dark:text-gray-200 text-gray-800 text-lg font-semibold">
              {bed.used}/{bed.total}
            </div>
          </div>
          <div className="grid grid-rows-2">
            <div className="text-center text-green-500 text-sm font-semibold">
              Vacant
            </div>
            <div className="text-center dark:text-gray-200 text-gray-800 text-lg font-semibold">
              {bed.vacant}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="flex flex-col mb-4 mt-4 pb-6 pl-4 pr-4 pt-2 rounded-xl">
      <div className="flex flex-col">
        <div>
          <p className="dark:text-gray-200 text-xl font-medium">
            {data.facility_name}
          </p>
        </div>
        <div className="flex flex-row justify-between w-3/12">
          <div>
            <p className="dark:text-gray-400 text-gray-600 text-sm font-semibold">
              {data.facility_type}
            </p>
          </div>
          <div>
            <p className="dark:text-gray-400 text-gray-600 text-sm font-semibold">
              {data.phone_number}
            </p>
          </div>
        </div>
      </div>

      <div className="h-4/5 mt-7 flex flex-row">
        <div className="flex flex-col mt-4 pr-3">
          <div>
            <p className="dark:text-gray-400 text-gray-600 font-medium">
              Last Updated
            </p>
            <p className="dark:text-gray-200 text-2xl font-medium">
              {data.last_updated}
            </p>
          </div>
          <div className="mt-5">
            <p className="dark:text-gray-400 text-gray-600 font-medium">
              Patient/Discharged
            </p>
            <p className="dark:text-gray-200 text-2xl font-medium">
              {data.patient_discharged}
            </p>
          </div>
        </div>

        <div className="grid grid-rows-4 pl-5 w-full border-l">
          <div className="grid grid-cols-5 h-6">
            <div></div>
            <div>
              <p className="text-center dark:text-gray-400 text-gray-600 text-sm font-semibold">
                ORDINARY BEDS
              </p>
            </div>
            <div>
              <p className="text-center dark:text-gray-400 text-gray-600 text-sm font-semibold font-semibold">
                OXYGEN BEDS
              </p>
            </div>
            <div>
              <p className="text-center dark:text-gray-400 text-gray-600 text-sm font-semibold font-semibold">
                ICU
              </p>
            </div>
            <div>
              <p className="text-center dark:text-gray-400 text-gray-600 text-sm font-semibold font-semibold">
                VENTILATORS
              </p>
            </div>
          </div>

          {showBedInfo(data.covid, "Covid")}
          {showBedInfo(data.non_covid, "Non-Covid")}
          {showBedInfo(finalTotal, "Total")}
        </div>
      </div>
    </Card>
  );
}
