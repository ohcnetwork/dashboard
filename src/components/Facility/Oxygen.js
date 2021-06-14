import React from "react";
import {
  OXYGEN_TYPES_KEYS,
} from "../../utils/constants";

const Oxygen = ({ oxygenData }) => {
  console.log(oxygenData)
  return (
    <section className="my-8 p-6 dark:bg-gray-700 bg-white">
      <h2 className="text-green-500 text-lg font-bold">Oxygen</h2>
      <div className="mb-4 mt-8">
        <div className="grid-col-1 grid gap-6 mb-8">
          {Object.keys(oxygenData).length ?
            Object.keys(OXYGEN_TYPES_KEYS).map(
              (k) =>
                oxygenData[k] && (
                  <div
                    key={k}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-md"
                  >
                    <div className="justify-butween flex items-center">
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fas"
                          data-icon="weight"
                          className="pr-4 w-12 h-12 text-orange-500"
                          role="img"
                          viewBox="0 0 512 512"
                        >
                          <path
                            fill="currentColor"
                            d="M448 64h-25.98C438.44 92.28 448 125.01 448 160c0 105.87-86.13 192-192 192S64 265.87 64 160c0-34.99 9.56-67.72 25.98-96H64C28.71 64 0 92.71 0 128v320c0 35.29 28.71 64 64 64h384c35.29 0 64-28.71 64-64V128c0-35.29-28.71-64-64-64zM256 320c88.37 0 160-71.63 160-160S344.37 0 256 0 96 71.63 96 160s71.63 160 160 160zm-.3-151.94l33.58-78.36c3.5-8.17 12.94-11.92 21.03-8.41 8.12 3.48 11.88 12.89 8.41 21l-33.67 78.55C291.73 188 296 197.45 296 208c0 22.09-17.91 40-40 40s-40-17.91-40-40c0-21.98 17.76-39.77 39.7-39.94z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="dark:text-gray-400 text-sm font-semibold">
                          {oxygenData[k]?.item_name}
                        </p>
                        <p className="dark:text-white text-2xl font-bold">
                          {oxygenData[k]?.stock -
                            Math.floor(oxygenData[k]?.stock) !==
                            0
                            ? oxygenData[k]?.stock.toFixed(2)
                            : oxygenData[k]?.stock}
                        </p>
                        <p className="dark:text-gray-400 text-sm">
                          {oxygenData[k]?.unit}
                        </p>
                      </div>
                    </div>
                    <div className="justify-butween flex items-center">
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fas"
                          data-icon="fire"
                          className="pr-4 w-12 h-12 text-orange-500"
                          role="img"
                          viewBox="0 0 384 512"
                        >
                          <path
                            fill="currentColor"
                            d="M216 23.86c0-23.8-30.65-32.77-44.15-13.04C48 191.85 224 200 224 288c0 35.63-29.11 64.46-64.85 63.99-35.17-.45-63.15-29.77-63.15-64.94v-85.51c0-21.7-26.47-32.23-41.43-16.5C27.8 213.16 0 261.33 0 320c0 105.87 86.13 192 192 192s192-86.13 192-192c0-170.29-168-193-168-296.14z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="dark:text-gray-400 text-sm font-semibold">
                          Burn Rate
                        </p>
                        <p className="dark:text-white text-2xl font-bold">
                          {oxygenData[k]?.burn_rate?.toFixed(2)}
                        </p>
                        <p className="dark:text-gray-400 text-sm">
                          Cylinders / hour
                        </p>
                      </div>
                    </div>
                    <div className="justify-butween flex items-center">
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="currentColor"
                          className="pr-4 w-12 h-12 text-orange-500"
                          viewBox="0 0 16 16"
                        >
                          <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07A7.001 7.001 0 0 0 8 16a7 7 0 0 0 5.29-11.584.531.531 0 0 0 .013-.012l.354-.354.353.354a.5.5 0 1 0 .707-.707l-1.414-1.415a.5.5 0 1 0-.707.707l.354.354-.354.354a.717.717 0 0 0-.012.012A6.973 6.973 0 0 0 9 2.071V1h.5a.5.5 0 0 0 0-1h-3zm2 5.6V9a.5.5 0 0 1-.5.5H4.5a.5.5 0 0 1 0-1h3V5.6a.5.5 0 1 1 1 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="dark:text-gray-400 text-sm font-semibold">
                          Time to empty
                        </p>
                        <p className="dark:text-white text-2xl font-bold">
                          {(
                            oxygenData[k]?.stock / oxygenData[k]?.burn_rate
                          ).toFixed(2)}
                        </p>
                        <p className="dark:text-gray-400 text-sm">hours</p>
                      </div>
                    </div>
                  </div>
                )
            ) : <div className="word-wrap py-4 text-center my-4 font-bold text-2xl md:text-3xl px-2 break-words bg-gray-50 dark:bg-gray-800 rounded-md text-gray-600"><p>No Data Available</p></div>
          }
        </div>
      </div>
    </section>
  )
}

export default Oxygen;
