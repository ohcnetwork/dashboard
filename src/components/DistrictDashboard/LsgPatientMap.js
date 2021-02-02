import { Card, CardBody } from "@windmill/react-ui";
import polylabel from "polylabel";
import React, { useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { feature } from "topojson";
import fetch from "unfetch";

import { CARE_LSG_TRANSILATION } from "../../utils/constants";
import html2canvas from 'html2canvas';
import Download from "downloadjs";

function LsgPatientMap({ district, className, patients, dateString }) {
  const [topojson, setTopojson] = useState({});
  const [zoom, setZoom] = useState(1);
  const [markers, setMarkers] = useState([]);
  const [projectionConfig, setProjectionConfig] = useState({});
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

  const max = Math.max(...patients.map((p) => p.total));

  const color = (current) => {
    switch (true) {
      case (current == 0):
        return "#ffffff";
      case (current <= (max * 0.1)):
        return "#ffcdd2";
      case (current <= (max * 0.2)):
        return "#ef9a9a";
      case (current <= (max * 0.3)):
        return "#e57373";
      case (current <= (max * 0.4)):
        return "#ef5350";
      case (current <= (max * 0.5)):
        return "#f44336";
      case (current <= (max * 0.6)):
        return "#e53935";
      case (current <= (max * 0.7)):
        return "#d32f2f";
      case (current <= (max * 0.8)):
        return "#c62828";
      case (current <= (max * 0.9)):
        return "#b71c1c";
      case (current <= (max)):
        return "#b71c1c";
      default:
        return "#000000";
    }
  }

  const findLsg = (id) => {
    return patients.find((x) => x.code === CARE_LSG_TRANSILATION[id]);
  }

  const findColor = (id) => {
    return color(findLsg(id).total || 0)
  };

  const pill = (color, text) => {
    return <span className="px-2 py-1">
      <span className={`${color} px-2 py mr-1`} ></span>
      {text}
    </span>
  };

  const print = () => {
    html2canvas(document.querySelector("#capture")).then(canvas => {
      var dataUrl = canvas.toDataURL({ pixelRatio: 2 });
      Download(dataUrl, "care-lsg-map");
    });
  };

  return (
    <Card id="capture" className={`${className} overflow-visible relative`}>
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
              onMoveEnd={({ zoom }) => setZoom(zoom / 4)}
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
                      <Geography key={geo.rsmKey} geography={geo} style={{
                        default: {
                          fill: findColor(geo.id),
                          stroke: 'gray',
                          strokeOpacity: "0.8",
                          outline: "none"
                        }
                      }} />
                    ))
                }
              </Geographies>
              {markers
                .filter((d) => d.properties.DISTRICT === district)
                .map((e) => {
                  let c = findLsg(e.id);
                  return <Marker
                    key={e.id}
                    coordinates={polylabel(e.geometry.coordinates)}
                  >
                    <>
                      <text fontSize={3} textAnchor="middle">
                        {/* {e.properties.LSGD} */}
                        {`${e.properties.LSGD} - ${c.total}`}
                      </text>
                    </>
                  </Marker>
                })}

            </ZoomableGroup>
          </ComposableMap>
        )}

        <div className=" flex flex-col text-xxxs dark:text-gray-400 text-gray-600 break-all sm:text-xs">
          <span className="inline-flex">
            {pill("bg-red-900", (`${Math.round(max * 0.9)} - ${Math.round(max * 0.8)}`))}
            {pill("bg-red-800", (`${Math.round(max * 0.8)} - ${Math.round(max * 0.7)}`))}
            {pill("bg-red-700", (`${Math.round(max * 0.7)} - ${Math.round(max * 0.6)}`))}
            {pill("bg-red-600", (`${Math.round(max * 0.6)} - ${Math.round(max * 0.5)}`))}
            {pill("bg-red-500", (`${Math.round(max * 0.5)} - ${Math.round(max * 0.4)}`))}
            {pill("bg-red-400", (`${Math.round(max * 0.4)} - ${Math.round(max * 0.3)}`))}
            {pill("bg-red-300", (`${Math.round(max * 0.3)} - ${Math.round(max * 0.2)}`))}
            {pill("bg-red-200", (`${Math.round(max * 0.2)} - ${Math.round(max * 0.1)}`))}
            {pill("bg-red-100", (`${Math.round(max * 0.1)} - 1`))}
            {pill("bg-white border", Math.round(0))}
          </span>
          <div className="font-bold text-xl text-green-600">
            {dateString}
          </div>
          <div className="text-3xl md:font-black -mt-2">
            {district + ' District'}
          </div>
          <div className="font-semibold text-xl -mt-2">
            LSG WISE DISTRUBUTION
          </div>
          <div className="grid md:grid-cols-9 grid-cols-1">
            {markers
              .filter((d) => d.properties.DISTRICT === district)
              .sort((a, b) => b.properties.LSGD > a.properties.LSGD)
              .map((e) => {
                let c = findLsg(e.id);
                return <div
                  key={e.id}
                >

                  <div className="text-xxs truncate">
                    {/* {e.properties.LSGD} */}
                    {`${e.properties.LSGD} - ${c.total}`}
                  </div>

                </div>
              })}
          </div>
          <div className="mt-4 text-green-600">
            Auto Generated from care.coronasafe.network
          </div>
          <a id="capture-button" className="font-bold " onClick={_ => print()}>
            Download Image
          </a>
        </div>
      </CardBody>
    </Card>
  );
}

export default LsgPatientMap;
