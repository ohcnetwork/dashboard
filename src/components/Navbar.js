import React from 'react';

export default function Navbar() {
  return (
    <div className="bg-gray-200 border-b border-gray-300">
      <div className="max-w-screen-sm md:max-w-6xl mx-auto p-3 md:p-4">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end">
          <a className="w-1/2 md:w-1/6 justify-start" href="/#">
            <img className="object-contain" src={require("../assets/img/coronaSafeLogo.svg")} title="CoronaSafe: Corona Literacy Mission" alt="CoronaSafe Logo: Corona Literacy Mission" />
          </a>
          <div className="flex">
            <a href="/#"><div className="px-2 py-1 mr-2" ><div className="text-md font-semibold">Map</div></div></a>
          </div>
        </div>
      </div>
    </div>
  )
}
