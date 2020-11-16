import { defaultStyles, TooltipWithBounds, useTooltip } from "@vx/tooltip";
import { Card, CardBody, WindmillContext } from "@windmill/react-ui";
import polylabel from "polylabel";
import React, { useContext, useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { feature } from "topojson";
import fetch from "unfetch";

import {
  AVAILABILITY_TYPES,
  AVAILABILITY_TYPES_ORDERED,
} from "../../utils/constants";

function Map({ district, facilities, className }) {
  const [topojson, setTopojson] = useState({});
  const [zoom, setZoom] = useState(1);
  const [markers, setMarkers] = useState([]);
  const [projectionConfig, setProjectionConfig] = useState({});
  const { mode } = useContext(WindmillContext);
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip();

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

  useEffect(() => {
    fetch("/kerala_lsgd.json")
      .then((r) => r.json())
      .then((data) => {
        setTopojson(data);
        setMarkers(feature(data, data.objects.data).features);
      })
      .catch((error) => {
        throw error;
      });
    fetch("/kerala_district.json")
      .then((r) => r.json())
      .then((data) => {
        const { features } = feature(data, data.objects.data);
        const config = features.reduce((a, c) => {
          return {
            ...a,
            [c.properties.DISTRICT]: polylabel(c.geometry.coordinates),
          };
        }, {});
        setProjectionConfig(config);
      })
      .catch((error) => {
        throw error;
      });
  }, []);

  const genToolTip = (f) => (
    <div className="text-xxs">
      <p className="font-black mb-1">{f.name}</p>
      <div>
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
        {AVAILABILITY_TYPES_ORDERED.map((a) => {
          const current = f.capacity[a]?.current_capacity || 1;
          const total = f.capacity[a]?.total_capacity || 1;
          const used = ((current / total) * 100).toFixed(2);
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
  );

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
              center={projectionConfig[district] || [0, 0]}
              onMoveEnd={({ zoom }) => setZoom(zoom / 2)}
            >
              <Geographies
                className="fill-current dark:text-gray-400 text-green-500"
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
                          height: (4 * 1) / zoom,
                          stroke: "black",
                          strokeWidth: (0.1 * 1) / zoom,
                          transform: `translate(${(4 * i * 1) / zoom}, 0)`,
                          width: (4 * 1) / zoom,
                        };
                        return j?.total_capacity ? (
                          <rect
                            key={i}
                            fill={getColor({
                              ratio: j.current_capacity / j.total_capacity,
                            })}
                            {...props}
                          />
                        ) : (
                          <rect key={i} {...props} fill="gray" />
                        );
                      })}
                    </g>
                  </Marker>
                ))}
            </ZoomableGroup>
          </ComposableMap>
        )}
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
            {genToolTip(facilities.find((x) => x.id === tooltipData))}
          </TooltipWithBounds>
        )}
        <div className="items-end flex flex-col text-xxxs dark:text-gray-400 text-gray-600 break-all sm:text-xs">
          <span className="inline-flex space-x-1">
            <span>Legends: </span>
            {[
              { label: "Full", color: "#00FF00" },
              { label: "Empty", color: "#FF0000" },
              { label: "None", color: "gray" },
            ].map((x) => (
              <span key={x.label} style={{ color: x.color }}>
                {x.label}
              </span>
            ))}
          </span>
          <span className="inline-flex">{`In order of: ${AVAILABILITY_TYPES_ORDERED.map(
            (a) => AVAILABILITY_TYPES[a]
          ).join(", ")}`}</span>
        </div>
      </CardBody>
    </Card>
  );
}

export default Map;
