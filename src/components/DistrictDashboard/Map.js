import { Card, CardBody, WindmillContext } from "@saanuregh/react-ui";
import { defaultStyles, TooltipWithBounds, useTooltip } from "@vx/tooltip";
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
import {
  AVAILABILITY_TYPES,
  AVAILABILITY_TYPES_ORDERED,
} from "../../utils/constants";
import { getDistrict, getLSGD } from "../../utils/utils";

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
      parseInt(color2.substring(0, 2), 16) * ratio +
        parseInt(color1.substring(0, 2), 16) * (1 - ratio)
    );
    const g = Math.ceil(
      parseInt(color2.substring(2, 4), 16) * ratio +
        parseInt(color1.substring(2, 4), 16) * (1 - ratio)
    );
    const b = Math.ceil(
      parseInt(color2.substring(4, 6), 16) * ratio +
        parseInt(color1.substring(4, 6), 16) * (1 - ratio)
    );
    return "#" + hex(r) + hex(g) + hex(b);
  };

  useEffect(() => {
    getLSGD().then(({ data }) => {
      setTopojson(data);
      setMarkers(feature(data, data.objects.data).features);
    });
    getDistrict().then(({ data }) => {
      let features = feature(data, data.objects.data).features;
      let config = features.reduce((a, c) => {
        return {
          ...a,
          [c.properties.DISTRICT]: polylabel(c.geometry.coordinates),
        };
      }, {});
      setProjectionConfig(config);
    });
  }, []);

  const genToolTip = (f) => (
    <div className="flex flex-col">
      <p className="mb-2 text-base font-semibold">{f.name}</p>
      <div className="mb-1">
        <p className="font-semibold">Oxygen capacity</p>
        <p>
          Current: <strong>{f.oxygenCapacity}</strong>
        </p>
      </div>
      <div className="mb-1">
        <p className="font-semibold">Live Patients</p>
        <p>
          Current: <strong>{f.actualLivePatients}</strong>
        </p>
      </div>
      <div className="mb-1">
        <p className="font-semibold">Discharged Patients</p>
        <p>
          Current: <strong>{f.actualDischargedPatients}</strong>
        </p>
      </div>
      {AVAILABILITY_TYPES_ORDERED.map((a) => {
        let current = f.capacity[a]?.current_capacity || 1;
        let total = f.capacity[a]?.total_capacity || 1;
        let used = ((current / total) * 100).toFixed(2);
        return (
          <div className="mb-1" key={a}>
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
  );

  return (
    <Card className={className}>
      <CardBody className="relative">
        <div className="absolute bottom-0 right-0 flex flex-col items-end p-5 space-y-1 text-xs pointer-events-none">
          <div
            style={{ backgroundColor: "#00FF00" }}
            className="w-12 h-6 p-1 leading-none text-center border border-black"
          >
            Full
          </div>
          <div
            style={{ backgroundColor: "#FF0000" }}
            className="w-12 h-6 p-1 leading-none text-center border border-black"
          >
            Empty
          </div>
          <div
            style={{ backgroundColor: "gray" }}
            className="w-12 h-6 p-1 leading-none text-center border border-black"
          >
            None
          </div>
          <div className="grid w-2/3 grid-cols-8 gap-0">
            {AVAILABILITY_TYPES_ORDERED.map((a) => (
              <div
                key={a}
                className="p-1 leading-none text-center bg-white border border-black"
              >
                {AVAILABILITY_TYPES[a]}
              </div>
            ))}
          </div>
        </div>
        {topojson.type && (
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 35000,
            }}
            height={400}
          >
            <ZoomableGroup
              center={projectionConfig[district] || [0, 0]}
              onMoveEnd={({ zoom }) => setZoom(zoom / 2)}
            >
              <Geographies
                className="text-green-500 fill-current dark:text-gray-400"
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
                        tooltipLeft: event.pageX,
                        tooltipTop: event.pageY,
                        tooltipData: event.currentTarget.firstChild.id,
                      });
                    }}
                    onMouseOut={hideTooltip}
                  >
                    <g alignmentBaseline="middle" id={f.id}>
                      {AVAILABILITY_TYPES_ORDERED.map((a, i) => {
                        let j = f.capacity[a];
                        const props = {
                          transform: `translate(${(4 * i * 1) / zoom}, 0)`,
                          height: (4 * 1) / zoom,
                          width: (4 * 1) / zoom,
                          stroke: "black",
                          strokeWidth: (0.1 * 1) / zoom,
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
            top={tooltipTop - 125}
            left={tooltipLeft - 175}
            style={{
              ...defaultStyles,
              minWidth: 60,
              backgroundColor:
                mode === "dark"
                  ? "var(--color-green-500)"
                  : "var(--color-white)",
              color: mode === "dark" ? "white" : "var(--color-gray-600)",
            }}
          >
            {genToolTip(facilities.find((x) => x.id == tooltipData))}
          </TooltipWithBounds>
        )}
      </CardBody>
    </Card>
  );
}

export default Map;
