import { Text } from "@vx/text";
import polylabel from "polylabel";
import React, { createRef, useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { Tooltip } from "react-svg-tooltip";
import { feature } from "topojson";
import { Card, CardBody } from "windmill-react-ui";
import { getDistrict, getLSGD } from "../../utils/utils";

function Map({ district, facilities, className }) {
  const [topojson, setTopojson] = useState({});
  const [markers, setMarkers] = useState([]);
  const [projectionConfig, setProjectionConfig] = useState({});

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

  return (
    <Card className={className}>
      <CardBody>
        {topojson.type && (
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 35000,
            }}
            height={400}
          >
            <ZoomableGroup center={projectionConfig[district] || [0, 0]}>
              <Geographies
                className="text-purple-600 fill-current dark:text-gray-400"
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
                    key={e.properties.id}
                    coordinates={polylabel(e.geometry.coordinates)}
                  >
                    <Text fontSize={3} textAnchor="middle">
                      {e.properties.LSGD}
                    </Text>
                  </Marker>
                ))}
              {facilities
                .filter((f) => f.location)
                .map(({ id, name, location }) => {
                  const circleRef = createRef();
                  return (
                    <Marker
                      key={id}
                      coordinates={Object.values(location).reverse()}
                    >
                      <circle
                        ref={circleRef}
                        r={2}
                        fill="#F00"
                        stroke="#fff"
                        strokeWidth={1}
                      />
                      <Tooltip triggerRef={circleRef}>
                        <svg
                          x={5}
                          y={5}
                          width={80}
                          height="20"
                          viewBox="0 0 80 20"
                        >
                          >
                          <rect width="100%" height="100%" fill="black" />
                          <Text
                            verticalAnchor="start"
                            x={2}
                            y={2}
                            fill="white"
                            fontSize="7"
                            scaleToFit={true}
                            width={80}
                          >
                            {`Name: ${name}`}
                          </Text>
                        </svg>
                      </Tooltip>
                    </Marker>
                  );
                })}
            </ZoomableGroup>
          </ComposableMap>
        )}
      </CardBody>
    </Card>
  );
}

export default Map;
