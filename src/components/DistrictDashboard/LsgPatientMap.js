import { Card, CardBody, Button } from "@windmill/react-ui";
import download from "downloadjs";
import html2canvas from "html2canvas";
import polylabel from "polylabel";
import React, { useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

import { CARE_LSG_TRANSILATION } from "../../utils/constants";
import { useKeralaMap } from "../../utils/utils";

function Legend({ a, max }) {
  const b = a / 10;
  const text =
    a === 0
      ? 0
      : `${Math.round(max * b)} - ${a > 1 ? Math.round(max * (b - 0.1)) : a}`;
  const color = a === 0 ? "bg-white border" : `bg-red-${a}00`;
  return (
    <span>
      <span className={`${color} px-2 py mr-1`} />
      {text}
    </span>
  );
}

const findLsg = (patients, id) =>
  patients.find((x) => x.code === CARE_LSG_TRANSILATION[id]);
const findColor = (current, max) => {
  switch (true) {
    case current === 0:
      return "#ffffff";
    case current <= max * 0.1:
      return "#ffcdd2";
    case current <= max * 0.2:
      return "#ef9a9a";
    case current <= max * 0.3:
      return "#e57373";
    case current <= max * 0.4:
      return "#ef5350";
    case current <= max * 0.5:
      return "#f44336";
    case current <= max * 0.6:
      return "#e53935";
    case current <= max * 0.7:
      return "#d32f2f";
    case current <= max * 0.8:
      return "#c62828";
    case current <= max * 0.9:
      return "#b71c1c";
    case current <= max:
      return "#b71c1c";
    default:
      return "#000000";
  }
};

function LsgPatientMap({ district, className, patients, dateString }) {
  const {
    topojson,
    position,
    setPosition,
    markers,
    handleZoomIn,
    handleZoomOut,
  } = useKeralaMap(district);

  const max = useMemo(() => Math.max(...patients.map((p) => p.total)), [
    patients,
  ]);

  return (
    <Card
      id="capture"
      className={`${className} overflow-visible relative w-full h-full`}
    >
      <CardBody>
        {topojson.type && (
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 35_000,
            }}
            height={400}
          >
            <ZoomableGroup
              zoom={position.zoom}
              center={position.coordinates}
              onMoveEnd={(pos) => {
                setPosition(pos);
              }}
            >
              <Geographies
                className="dark:text-gray-400 text-green-500 fill-current"
                geography={topojson}
                pointerEvents="none"
              >
                {({ geographies }) =>
                  geographies
                    .filter((d) => d.properties.DISTRICT === district)
                    .map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        style={{
                          default: {
                            fill: findColor(
                              findLsg(patients, geo.id).total || 0,
                              max
                            ),
                            stroke: "gray",
                            strokeOpacity: "0.8",
                            outline: "none",
                          },
                        }}
                      />
                    ))
                }
              </Geographies>
              {markers
                .filter((d) => d.properties.DISTRICT === district)
                .map((e) => {
                  const c = findLsg(patients, e.id);
                  return (
                    c && (
                      <Marker
                        key={e.id}
                        coordinates={polylabel(e.geometry.coordinates)}
                      >
                        <>
                          <text fontSize={3} textAnchor="middle">
                            {`${e.properties.LSGD} - ${c.total}`}
                          </text>
                        </>
                      </Marker>
                    )
                  );
                })}
            </ZoomableGroup>
          </ComposableMap>
        )}

        <div className="py-4 text-right">
          <Button onClick={handleZoomIn}>+</Button>{" "}
          <Button onClick={handleZoomOut}>-</Button>
        </div>

        <div className="flex flex-col dark:text-gray-400 text-gray-600 break-all text-xxxs sm:text-xs">
          <span className="inline-flex my-1 space-x-3">
            {[9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map((a) => (
              <Legend key={a} a={a} max={max} />
            ))}
          </span>
          <div className="text-green-600 text-xl font-bold">{dateString}</div>
          <div className="-mt-2 text-3xl md:font-black">
            {district + " District"}
          </div>
          <div className="-mt-2 text-xl font-semibold">
            LSG WISE DISTRUBUTION
          </div>
          <div className="grid grid-cols-1 md:grid-cols-9">
            {markers
              .filter((d) => d.properties.DISTRICT === district)
              .sort((a, b) => b.properties.LSGD > a.properties.LSGD)
              .map((e) => {
                const c = findLsg(patients, e.id);
                return (
                  <div key={e.id}>
                    <div className="truncate text-xxs">
                      {`${e.properties.LSGD} - ${c.total}`}
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="mt-4 text-green-600">
            Auto Generated from care.coronasafe.network
          </div>
          <button
            aria-label="Download Infographic as Image"
            type="button"
            className="self-start font-bold focus:outline-none"
            onClick={() => {
              html2canvas(document.querySelector("#capture"), {
                scale: 2,
              })
                .then((canvas) =>
                  download(canvas.toDataURL(), "care-lsg-map.png")
                )
                // eslint-disable-next-line no-console
                .catch((error) => console.error(error));
            }}
          >
            Download Image
          </button>
        </div>
      </CardBody>
    </Card>
  );
}

export default LsgPatientMap;
