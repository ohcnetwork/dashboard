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
    <div className="grid row-span-2 grid-cols-9 mt-2 h-12 bg-gray-200 dark:bg-gray-800 border dark:border border-gray-300 dark:border-gray-900 rounded shadow">
      <div className="col-span-1 pl-3 pt-3 dark:text-gray-200 text-sm font-medium">
        {category}
      </div>
      {bedData.map((bed, idx) => {
        if (!finalTotal[idx].total) return <></>;
        return (
          <div className="grid col-span-2 grid-cols-2 ml-4 mr-4">
            <div className="grid grid-rows-3">
              <div className="row-span-1 text-center text-red-500 text-sm font-semibold">
                Used
              </div>
              <div className="row-span-2 text-center dark:text-gray-200 text-gray-800 text-lg font-semibold">
                {bed.used}/{bed.total}
              </div>
            </div>
            <div className="grid grid-rows-3">
              <div className="row-span-1 text-center text-green-500 text-sm font-semibold">
                Vacant
              </div>
              <div className="row-span-2 text-center dark:text-gray-200 text-gray-800 text-lg font-semibold">
                {bed.vacant}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <Card className="flex flex-col mb-4 mt-4 p-4 rounded-xl">
      <div className="flex flex-col">
        <div>
          <p className="dark:text-gray-200 text-xl font-medium">
            {data.facility_name}
          </p>
        </div>
        <div className="flex flex-row justify-between w-full md:w-3/12">
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

      <div className="h-4/5 flex flex-col mt-1 md:flex-row">
        <div className="flex flex-row mt-1 pb-1 pt-1 border-b border-t md:flex-col md:mt-8 md:pb-0 md:pr-5 md:pt-0 md:border-0">
          <div className="w-1/2 md:w-full">
            <p className="dark:text-gray-400 text-gray-600 font-medium">
              Last Updated
            </p>
            <p className="dark:text-gray-200 text-xl font-medium">
              {data.last_updated}
            </p>
          </div>
          <div className="w-1/2 md:mt-5 md:w-full">
            <p className="text-center dark:text-gray-400 text-gray-600 font-medium md:text-left">
              Patient/Discharged
            </p>
            <p className="text-center dark:text-gray-200 text-xl font-medium md:text-left">
              {data.patient_discharged}
            </p>
          </div>
        </div>

        <div className="grid-rows-7 grid mt-1 w-full overflow-x-scroll overflow-y-hidden md:mt-0 md:pl-5 md:border-l md:overflow-hidden">
          <div className="grid row-span-1 grid-cols-9">
            <div className="col-span-1"></div>
            <div className="col-span-2">
              <p className="text-center dark:text-gray-400 text-gray-600 text-sm font-semibold">
                ORDINARY BEDS
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-center dark:text-gray-400 text-gray-600 text-sm font-semibold font-semibold">
                OXYGEN BEDS
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-center dark:text-gray-400 text-gray-600 text-sm font-semibold font-semibold">
                ICU
              </p>
            </div>
            <div className="col-span-2">
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
