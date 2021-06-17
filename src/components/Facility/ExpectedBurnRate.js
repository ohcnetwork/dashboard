import React from "react";

const ExpectedBurnRate = ({ patientData }) => {
  console.log(patientData);

  return patientData &&
    patientData.results &&
    patientData.results?.length >= 1 ? (
    <section className="my-8 px-6 py-4 dark:bg-gray-700 bg-white">
      <h2 className="text-green-500 text-lg font-bold">Expected Burn Rate</h2>
      {patientData.results[0]?.data?.total_patients_bed_with_oxygen_support ||
      patientData.results[0].data?.total_patients_icu_with_oxygen_support ||
      patientData.results[0].data?.total_patients_icu_with_invasive_ventilator +
        patientData.results[0].data
          ?.total_patients_icu_with_non_invasive_ventilator ? (
        <div className="grid-col-1 grid gap-6 mb-4 mt-8 md:grid-cols-3">
          {patientData.results[0].data
            .total_patients_bed_with_oxygen_support ? (
            <div
              key={"OXYGEN_BED"}
              className="word-wrap flex flex-col pb-3 pl-3 pr-4 pt-6 break-words bg-gray-50 dark:bg-gray-800 rounded-md space-x-3"
            >
              <div>
                <p className="ml-4 dark:text-gray-300 text-gray-500 text-lg font-semibold capitalize">
                  {"Oxygen Bed"}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="fire"
                  className="w-10 h-10 text-orange-500"
                  role="img"
                  viewBox="0 0 384 512"
                >
                  <path
                    fill="currentColor"
                    d="M216 23.86c0-23.8-30.65-32.77-44.15-13.04C48 191.85 224 200 224 288c0 35.63-29.11 64.46-64.85 63.99-35.17-.45-63.15-29.77-63.15-64.94v-85.51c0-21.7-26.47-32.23-41.43-16.5C27.8 213.16 0 261.33 0 320c0 105.87 86.13 192 192 192s192-86.13 192-192c0-170.29-168-193-168-296.14z"
                  />
                </svg>
                <h1 className="mb-2 mt-3 text-gray-800 dark:text-white text-3xl font-bold">
                  {patientData.results[0].data
                    .total_patients_bed_with_oxygen_support *
                    7.4 *
                    8.778}
                  <span className="ml-1 text-lg font-bold">
                    m<sup>3</sup>/hr
                  </span>
                  {
                    <sup className="ml-1 dark:text-gray-500 text-gray-600 text-lg">
                      {`${patientData.results[0].data.total_patients_bed_with_oxygen_support}`}
                    </sup>
                  }
                </h1>
              </div>
            </div>
          ) : null}
          {patientData.results[0].data
            .total_patients_icu_with_oxygen_support ? (
            <div
              key={"ICU"}
              className="word-wrap flex flex-col pb-3 pl-3 pr-4 pt-6 break-words bg-gray-50 dark:bg-gray-800 rounded-md space-x-3"
            >
              <div>
                <p className="ml-4 dark:text-gray-300 text-gray-500 text-lg font-semibold capitalize">
                  {"ICU"}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="fire"
                  className="w-10 h-10 text-orange-500"
                  role="img"
                  viewBox="0 0 384 512"
                >
                  <path
                    fill="currentColor"
                    d="M216 23.86c0-23.8-30.65-32.77-44.15-13.04C48 191.85 224 200 224 288c0 35.63-29.11 64.46-64.85 63.99-35.17-.45-63.15-29.77-63.15-64.94v-85.51c0-21.7-26.47-32.23-41.43-16.5C27.8 213.16 0 261.33 0 320c0 105.87 86.13 192 192 192s192-86.13 192-192c0-170.29-168-193-168-296.14z"
                  />
                </svg>
                <h1 className="mb-2 mt-3 text-gray-800 dark:text-white text-3xl font-bold">
                  {patientData.results[0].data
                    .total_patients_icu_with_oxygen_support *
                    10 *
                    8.778}
                  <span className="ml-1 text-lg font-bold">
                    m<sup>3</sup>/hr
                  </span>
                  {
                    <sup className="ml-1 dark:text-gray-500 text-gray-600 text-lg">
                      {`${patientData.results[0].data.total_patients_icu_with_oxygen_support}`}
                    </sup>
                  }
                </h1>
              </div>
            </div>
          ) : null}
          {patientData.results[0].data
            .total_patients_icu_with_invasive_ventilator +
          patientData.results[0].data
            .total_patients_icu_with_non_invasive_ventilator ? (
            <div
              key={"Ventilator"}
              className="word-wrap flex flex-col pb-3 pl-3 pr-4 pt-6 break-words bg-gray-50 dark:bg-gray-800 rounded-md space-x-3"
            >
              <div>
                <p className="ml-4 dark:text-gray-300 text-gray-500 text-lg font-semibold capitalize">
                  {"Ventilator"}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="fire"
                  className="w-10 h-10 text-orange-500"
                  role="img"
                  viewBox="0 0 384 512"
                >
                  <path
                    fill="currentColor"
                    d="M216 23.86c0-23.8-30.65-32.77-44.15-13.04C48 191.85 224 200 224 288c0 35.63-29.11 64.46-64.85 63.99-35.17-.45-63.15-29.77-63.15-64.94v-85.51c0-21.7-26.47-32.23-41.43-16.5C27.8 213.16 0 261.33 0 320c0 105.87 86.13 192 192 192s192-86.13 192-192c0-170.29-168-193-168-296.14z"
                  />
                </svg>
                <h1 className="mb-2 mt-3 text-gray-800 dark:text-white text-3xl font-bold">
                  {(patientData.results[0].data
                    .total_patients_icu_with_invasive_ventilator +
                    patientData.results[0].data
                      .total_patients_icu_with_non_invasive_ventilator) *
                    10 *
                    8.778}
                  <span className="ml-1 text-lg font-bold">
                    m<sup>3</sup>/hr
                  </span>
                  {
                    <sup className="ml-1 dark:text-gray-500 text-gray-600 text-lg">
                      {patientData.results[0].data
                        .total_patients_icu_with_invasive_ventilator +
                        patientData.results[0].data
                          .total_patients_icu_with_non_invasive_ventilator}
                    </sup>
                  }
                </h1>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="word-wrap my-4 px-2 py-4 text-center text-gray-600 break-words text-2xl font-bold bg-gray-50 dark:bg-gray-800 rounded-md md:text-3xl">
          <p>No Data Available</p>
        </div>
      )}
    </section>
  ) : (
    <div className="word-wrap my-4 px-2 py-4 text-center text-gray-600 break-words text-2xl font-bold bg-gray-50 dark:bg-gray-800 rounded-md md:text-3xl">
      <p>No Data Available</p>
    </div>
  );
};

export default ExpectedBurnRate;
