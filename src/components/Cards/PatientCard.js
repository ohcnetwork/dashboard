import React from "react";
import { Card } from "@windmill/react-ui";
import { ChevronsDown, ChevronsUp } from "react-feather";

export function PatientCard({ data }) {
  const getSubscriptData = (val) => {
    if (val == 0) return;
    else if (val > 0) {
      return (
        <div className="flex flex-row text-green-500 text-sm">
          <ChevronsUp className="h-5" />
          {val}
        </div>
      );
    } else {
      return (
        <div className="flex flex-row text-red-500 text-sm">
          <ChevronsDown className="h-5" />
          {val}
        </div>
      );
    }
  };

  return (
    <Card className="flex flex-col mb-4 mt-4 p-4 rounded-xl">
      <div className="flex flex-col justify-between md:flex-row">
        <div className="flex flex-col">
          <div>
            <a href={`/facility/${data.id}`}>
              <p className="dark:text-gray-200 text-xl font-medium">
                {data.facility_name}
              </p>
            </a>
          </div>
          <div className="flex flex-row justify-between w-full">
            <div className="mr-5">
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
        <div className="flex flex-col mt-1 pt-2 border-t md:mt-0 md:pt-0 md:border-0">
          <p className="dark:text-gray-400 text-gray-600 text-sm font-medium">
            Last Updated
          </p>
          <p className="dark:text-gray-200 text-xl font-medium">
            {data.last_updated}
          </p>
        </div>
      </div>

      <div className="grid grid-rows-5 mt-2 pt-2 w-full border-t overflow-x-scroll overflow-y-hidden md:mt-4 md:pt-0 md:border-0 md:overflow-hidden">
        <div className="grid row-span-1 grid-cols-5 mb-2 pt-3 w-800 md:w-full">
          <div className="col-span-1 text-center dark:text-gray-200 text-gray-600 text-sm font-semibold">
            ISOLATION
          </div>
          <div className="col-span-1 text-center dark:text-gray-200 text-gray-600 text-sm font-semibold">
            OXYGEN BEDS
          </div>
          <div className="col-span-2 text-center dark:text-gray-200 text-gray-600 text-sm font-semibold">
            ICU
          </div>
          <div className="col-span-1 text-center dark:text-gray-200 text-gray-600 text-sm font-semibold">
            WARDS
          </div>
        </div>

        <div className="grid row-span-2 grid-cols-5 mb-4">
          <div className="col-span-1">
            <div className="m-auto p-2 w-3/5 text-center dark:bg-gray-900 rounded-lg">
              <div className="dark:text-gray-200 text-xs font-semibold">
                Home Isolation
              </div>
              <div className="flex flex-row justify-center mt-1 dark:text-gray-200 text-2xl font-semibold">
                <div>{data.home_isolation.total}</div>
                {getSubscriptData(data.home_isolation.today)}
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <div className="m-auto p-2 w-3/5 h-full text-center dark:bg-gray-900 rounded-lg">
              <div className="flex flex-row justify-center mt-3 dark:text-gray-200 text-2xl font-semibold">
                <div>{data.bed_with_oxygen_support.total}</div>
                {getSubscriptData(data.bed_with_oxygen_support.today)}
              </div>
            </div>
          </div>
          <div className="grid col-span-2 grid-cols-2">
            <div className="col-span-1">
              <div className="float-right mr-2 p-2 w-3/5 h-full text-center dark:bg-gray-900 rounded-lg">
                <div className="dark:text-gray-200 text-xs font-semibold">
                  ICU
                </div>
                <div className="flex flex-row justify-center mt-1 dark:text-gray-200 text-2xl font-semibold">
                  <div>{data.icu.total}</div>
                  {getSubscriptData(data.icu.today)}
                </div>
              </div>
            </div>
            <div className="col-span-1">
              <div className="ml-2 p-2 w-3/5 text-center dark:bg-gray-900 rounded-lg">
                <div className="dark:text-gray-200 text-xs font-semibold">
                  Oxygen Support
                </div>
                <div className="flex flex-row justify-center mt-1 dark:text-gray-200 text-2xl font-semibold">
                  <div>{data.icu_with_oxygen_support.total}</div>
                  {getSubscriptData(data.icu_with_oxygen_support.today)}
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <div className="m-auto p-2 w-3/5 text-center dark:bg-gray-900 rounded-lg">
              <div className="dark:text-gray-200 text-xs font-semibold">
                Gynaecology Ward
              </div>
              <div className="flex flex-row justify-center mt-1 dark:text-gray-200 text-2xl font-semibold">
                <div>{data.gynaecology_ward.total}</div>
                {getSubscriptData(data.gynaecology_ward.today)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid row-span-2 grid-cols-5">
          <div className="col-span-1">
            <div className="m-auto p-2 w-3/5 text-center dark:bg-gray-900 rounded-lg">
              <div className="dark:text-gray-200 text-xs font-semibold">
                Isolation Room
              </div>
              <div className="flex flex-row justify-center mt-1 dark:text-gray-200 text-2xl font-semibold">
                <div>{data.isolation_room.total}</div>
                {getSubscriptData(data.isolation_room.today)}
              </div>
            </div>
          </div>
          <div className="col-span-1"></div>
          <div className="grid col-span-2 grid-cols-2">
            <div className="col-span-1">
              <div className="float-right mr-2 px-1 py-2 w-3/5 text-center dark:bg-gray-900 rounded-lg">
                <div className="dark:text-gray-200 text-xs font-semibold">
                  Non Invasive Ventilator
                </div>
                <div className="flex flex-row justify-center mt-1 dark:text-gray-200 text-2xl font-semibold">
                  <div>{data.icu_with_non_invasive_ventilator.total}</div>
                  {getSubscriptData(
                    data.icu_with_non_invasive_ventilator.today
                  )}
                </div>
              </div>
            </div>
            <div className="col-span-1">
              <div className="ml-2 p-2 w-3/5 text-center dark:bg-gray-900 rounded-lg">
                <div className="dark:text-gray-200 text-xs font-semibold">
                  Invasive Ventilator
                </div>
                <div className="flex flex-row justify-center mt-1 dark:text-gray-200 text-2xl font-semibold">
                  <div>{data.icu_with_invasive_ventilator.total}</div>
                  {getSubscriptData(data.icu_with_invasive_ventilator.today)}
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <div className="m-auto p-2 w-3/5 text-center dark:bg-gray-900 rounded-lg">
              <div className="dark:text-gray-200 text-xs font-semibold">
                Paediatric Ward
              </div>
              <div className="flex flex-row justify-center mt-1 dark:text-gray-200 text-2xl font-semibold">
                <div>{data.paediatric_ward.total}</div>
                {getSubscriptData(data.paediatric_ward.today)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
