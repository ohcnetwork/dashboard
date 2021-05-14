import { defaultStyles, TooltipWithBounds, useTooltip } from "@vx/tooltip";
import { Card, CardBody, WindmillContext, Button } from "@windmill/react-ui";
import polylabel from "polylabel";
import React, { useContext, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

import {
  AVAILABILITY_TYPES,
  AVAILABILITY_TYPES_ORDERED,
} from "../../utils/constants";
import { useKeralaMap } from "../../utils/utils";

const getColor = ({ color1 = "00FF00", color2 = "FF0000", ratio }) => {
  const hex = (color) => {
    const colorString = color.toString(16);
    return colorString.length === 1 ? `0${colorString}` : colorString;
  };
  const r = Math.ceil(
    Number.parseInt(color2.slice(0, 2), 16) * ratio +
    Number.parseInt(color1.slice(0, 2), 16) * (1 - ratio)
  );
  const g = Math.ceil(
    Number.parseInt(color2.slice(2, 4), 16) * ratio +
    Number.parseInt(color1.slice(2, 4), 16) * (1 - ratio)
  );
  const b = Math.ceil(
    Number.parseInt(color2.slice(4, 6), 16) * ratio +
    Number.parseInt(color1.slice(4, 6), 16) * (1 - ratio)
  );
  return `#${hex(r)}${hex(g)}${hex(b)}`;
};

function Tooltip({ facility: f }) {
  return (
    <div className="text-xxs">
      <p className="mb-1 font-black">{f.name}</p>
      <div>
        <div className="grid gap-4 grid-cols-3 mt-2">
          <div>
            <p className="font-semibold">Oxygen capacity</p>
            <p>
              Current: <strong>{f.oxygenCapacity}</strong>
            </p>
          </div>
          <div>
            <p className="font-semibold">Live Patients</p>
            <p>
              Current: <strong>{f.actualLivePatients}</strong>
            </p>
          </div>
          <div>
            <p className="font-semibold">Discharged Patients</p>
            <p>
              Current: <strong>{f.actualDischargedPatients}</strong>
            </p>
          </div>
        </div>
        <div className="grid gap-4 grid-cols-3 mt-2">
          {AVAILABILITY_TYPES_ORDERED.map((a) => {
            const current = f.capacity[a]?.current_capacity || 1;
            const total = f.capacity[a]?.total_capacity || 1;
            const used = ((current / total) * 100).toFixed(2);
            if (total == 1) {
              return;
            }
            return (
              <div key={a}>
                <p className="font-semibold">{AVAILABILITY_TYPES[a]}</p>
                {f.capacity[a]?.total_capacity ? (
                  <>
                    <p>
                      Current: <strong>{current}</strong>
                    </p>
                    <p>
                      Total: <strong>{total}</strong>
                    </p>
                    <p>
                      Used:{" "}
                      <strong
                        style={{
                          color: getColor({
                            ratio: current / total,
                          }),
                        }}
                      >
                        {used}%
                      </strong>
                    </p>
                  </>
                ) : (
                  <p key={a}>Not available</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const selectedButtonClasses = (bool) => {
  const d = " px-4 py-2 font-bold rounded-lg shadow ";
  return (
    d +
    (bool
      ? "bg-green-500 text-white"
      : "dark:hover:bg-green-500 hover:text-white hover:bg-green-500 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white")
  );
};

function CapacityMap({ district, facilities, className }) {
  const { topojson, markers, position, setPosition, handleZoomIn, handleZoomOut } = useKeralaMap(district);
  const [selectedBedType, setSelectedBedType] = useState("All");
  const { mode } = useContext(WindmillContext);
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip();

  return (
    <Card className={`${className} overflow-visible relative`}>
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
              onMoveEnd={(pos) => { setPosition(pos) }}
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
                      <Geography key={geo.rsmKey} geography={geo} />
                    ))
                }
              </Geographies>
              {markers
                .filter((d) => d.properties.DISTRICT === district)
                .map((e) => (
                  <Marker
                    key={e.id}
                    coordinates={polylabel(e.geometry.coordinates)}
                  >
                    <text fontSize={3} textAnchor="middle">
                      {e.properties.LSGD}
                    </text>
                  </Marker>
                ))}
              {facilities
                .filter((f) => f.location)
                .map((f) => (
                  <Marker
                    key={f.id}
                    coordinates={Object.values(f.location).reverse()}
                    alignmentBaseline="middle"
                    onMouseOver={(event) => {
                      showTooltip({
                        tooltipData: event.currentTarget.firstChild.id,
                        tooltipLeft: event.pageX,
                        tooltipTop: event.pageY,
                      });
                    }}
                    onMouseOut={hideTooltip}
                  >
                    <g alignmentBaseline="middle" id={f.id}>
                      {AVAILABILITY_TYPES_ORDERED.map((a, i) => {
                        const j = f.capacity[a];
                        const props = {
                          height: (4 * 1) / position.zoom,
                          stroke: "black",
                          strokeWidth: (0.1 * 1) / position.zoom,
                          transform: `translate(${(4 * i * 1) / position.zoom}, 0)`,
                          width: (4 * 1) / position.zoom,
                        };

                        if (selectedBedType !== "All" && selectedBedType != a) {
                          return;
                        }
                        return j?.total_capacity ? (
                          <rect
                            key={i}
                            fill={getColor({
                              ratio: j.current_capacity / j.total_capacity,
                            })}
                            {...props}
                          />
                        ) : (
                          <></>
                        );
                      })}
                    </g>
                  </Marker>
                ))}
            </ZoomableGroup>
          </ComposableMap>
        )}
        <div className="text-right py-4">
          <Button onClick={handleZoomIn} >+</Button>
          {' '}
          <Button onClick={handleZoomOut} >-</Button>
        </div>
        {tooltipOpen && (
          <TooltipWithBounds
            key={Math.random()}
            top={tooltipTop - 200}
            left={tooltipLeft - 165}
            style={{
              ...defaultStyles,
              backgroundColor:
                mode === "dark"
                  ? "var(--color-green-500)"
                  : "var(--color-white)",
              color: mode === "dark" ? "white" : "var(--color-gray-600)",
              minWidth: 120,
            }}
          >
            <Tooltip facility={facilities.find((x) => x.id === tooltipData)} />
          </TooltipWithBounds>
        )}
        <div className="flex flex-col items-end dark:text-gray-400 text-gray-600 break-all text-xxxs sm:text-xs">
          <span className="inline-flex space-x-1">
            <span>Legends: </span>
            {[
              { label: "Available", color: "#00FF00" },
              { label: "Full", color: "#FF0000" },
            ].map((x) => (
              <span key={x.label} style={{ color: x.color }}>
                {x.label}
              </span>
            ))}
          </span>
          <div className="grid gap-2 grid-cols-2 md:grid-cols-6">
            <button
              onClick={(_) => setSelectedBedType("All")}
              className={selectedButtonClasses(selectedBedType === "All")}
            >
              Show All
            </button>
            {AVAILABILITY_TYPES_ORDERED.filter(
              (n) => ![40, 50, 60, 70].includes(n)
            ).map((a) => (
              <button
                key={a}
                onClick={(_) => setSelectedBedType(a)}
                className={selectedButtonClasses(a === selectedBedType)}
              >
                {AVAILABILITY_TYPES[a]}
              </button>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default CapacityMap;
