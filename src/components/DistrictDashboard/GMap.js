import { Card, CardBody, WindmillContext } from "@windmill/react-ui";
import React, { useContext, useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import Geosuggest from "react-geosuggest";
import Marker from "../Marker/index";

import {
  AVAILABILITY_TYPES,
  AVAILABILITY_TYPES_ORDERED,
  GMAP_KEY,
} from "../../utils/constants";

const selectedButtonClasses = (bool) => {
  const d = " px-4 py-2 font-bold rounded-lg shadow ";
  return (
    d +
    (bool
      ? "bg-green-500 text-white"
      : "dark:hover:bg-green-500 hover:text-white hover:bg-green-500 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white")
  );
};

function GMap({ district, facilities, className }) {
  const [selectedBedType, setSelectedBedType] = useState("All");
  const { mode } = useContext(WindmillContext);

  let [state, setState] = useState({
    assets: [],
    showAddressSuggestion: false,
    center: {
      lat: district.lat,
      lng: district.lng,
    },
    zoom: district.zoom,
  });

  useEffect(() => {
    setState({
      ...state,
      center: {
        lat: district.lat,
        lng: district.lng,
      },
      zoom: district.zoom,
    });
  }, [district]);

  return (
    <Card className={`${className} overflow-visible relative`}>
      <CardBody>
        <div className="main-content-container pb-4 px-4">
          <div>
            <div>
              {/* <Geosuggest
                // ref={el => (this._geoSuggest = el)}
                placeholder="Search by address"
                highlightMatch={true}
                country="in"
                style={{
                  input: {
                    border: "none",
                    padding: "0px 10px",
                    color: "#454545",
                    backgroundColor: "#fff",
                    boxSizing: "border-box",
                    margin: "5px 0px",
                    height: "48px",
                    width: "300px",
                    borderRadius: "5px",
                  },
                  suggests: {
                    color: "#fff",
                    display: state.showAddressSuggestion ? "block" : "none",
                    marginTop: "0px",
                    marginBottom: "0px",
                    position: "absolute",
                    zIndex: 1,
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    boxShadow: "rgb(238, 238, 238) 0px 0px 8px 8px",
                  },
                  suggestItem: {
                    backgroundColor: "#fff",
                    padding: "10px 10px",
                    cursor: "pointer",
                    color: "#454545",
                  },
                }}
                onBlur={() => {
                  setState({ ...state, showAddressSuggestion: false });
                }}
                onFocus={() => {
                  setState({ ...state, showAddressSuggestion: true });
                }}
                onChange={(text) => {
                  if (text == null || text === "") {
                    // this.getAssets();
                  }
                  setState({ ...state, showAddressSuggestion: true });
                }}
                onSuggestSelect={(suggest) => {
                  if (suggest && suggest.location) {
                    setState({
                      ...state,
                      showAddressSuggestion: false,
                      center: {
                        lat: suggest.location.lat,
                        lng: suggest.location.lng,
                      },
                      zoom: 12,
                    });
                  }
                }}
              /> */}
            </div>
          </div>
          <div>
            <div>
              <div>
                <div style={{ height: "75vh", width: "100%" }}>
                  <GoogleMapReact
                    bootstrapURLKeys={{
                      key: GMAP_KEY,
                    }}
                    defaultCenter={{
                      lat: 10.1485476,
                      lng: 76.5007524,
                    }}
                    defaultZoom={8}
                    center={state.center}
                    zoom={state.zoom}
                    options={{
                      styles:
                        mode === "dark"
                          ? [
                              {
                                elementType: "geometry",
                                stylers: [{ color: "#242f3e" }],
                              },
                              {
                                elementType: "labels.icon",
                                stylers: [
                                  {
                                    visibility: "off",
                                  },
                                ],
                              },
                              {
                                elementType: "labels.text.stroke",
                                stylers: [{ color: "#242f3e" }],
                              },
                              {
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#746855" }],
                              },
                              {
                                featureType: "administrative.locality",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#d59563" }],
                              },
                              {
                                featureType: "poi",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#d59563" }],
                              },
                              {
                                featureType: "poi.park",
                                elementType: "geometry",
                                stylers: [{ color: "#263c3f" }],
                              },
                              {
                                featureType: "poi.park",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#6b9a76" }],
                              },
                              {
                                featureType: "road",
                                elementType: "geometry",
                                stylers: [{ color: "#38414e" }],
                              },
                              {
                                featureType: "road",
                                elementType: "geometry.stroke",
                                stylers: [{ color: "#212a37" }],
                              },
                              {
                                featureType: "road",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#9ca5b3" }],
                              },
                              {
                                featureType: "road.highway",
                                elementType: "geometry",
                                stylers: [{ color: "#746855" }],
                              },
                              {
                                featureType: "road.highway",
                                elementType: "geometry.stroke",
                                stylers: [{ color: "#1f2835" }],
                              },
                              {
                                featureType: "road.highway",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#f3d19c" }],
                              },
                              {
                                featureType: "transit",
                                elementType: "geometry",
                                stylers: [{ color: "#2f3948" }],
                              },
                              {
                                featureType: "transit.station",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#d59563" }],
                              },
                              {
                                featureType: "water",
                                elementType: "geometry",
                                stylers: [{ color: "#17263c" }],
                              },
                              {
                                featureType: "water",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#515c6d" }],
                              },
                              {
                                featureType: "water",
                                elementType: "labels.text.stroke",
                                stylers: [{ color: "#17263c" }],
                              },
                            ]
                          : [
                              {
                                elementType: "geometry",
                                stylers: [
                                  {
                                    color: "#f5f5f5",
                                  },
                                ],
                              },
                              {
                                elementType: "labels.icon",
                                stylers: [
                                  {
                                    visibility: "off",
                                  },
                                ],
                              },
                              {
                                elementType: "labels.text.fill",
                                stylers: [
                                  {
                                    color: "#616161",
                                  },
                                ],
                              },
                              {
                                elementType: "labels.text.stroke",
                                stylers: [
                                  {
                                    color: "#f5f5f5",
                                  },
                                ],
                              },
                              {
                                featureType: "administrative.land_parcel",
                                elementType: "labels.text.fill",
                                stylers: [
                                  {
                                    color: "#bdbdbd",
                                  },
                                ],
                              },
                              {
                                featureType: "poi",
                                elementType: "geometry",
                                stylers: [
                                  {
                                    color: "#eeeeee",
                                  },
                                ],
                              },
                              {
                                featureType: "poi",
                                elementType: "labels.text.fill",
                                stylers: [
                                  {
                                    color: "#757575",
                                  },
                                ],
                              },
                              {
                                featureType: "poi.government",
                                elementType: "geometry.stroke",
                                stylers: [
                                  {
                                    color: "#ffc54a",
                                  },
                                ],
                              },
                              {
                                featureType: "poi.medical",
                                elementType: "geometry.stroke",
                                stylers: [
                                  {
                                    color: "#40ff8b",
                                  },
                                ],
                              },
                              {
                                featureType: "poi.park",
                                elementType: "geometry",
                                stylers: [
                                  {
                                    color: "#e5e5e5",
                                  },
                                ],
                              },
                              {
                                featureType: "poi.park",
                                elementType: "labels.text.fill",
                                stylers: [
                                  {
                                    color: "#9e9e9e",
                                  },
                                ],
                              },
                              {
                                featureType: "road",
                                elementType: "geometry",
                                stylers: [
                                  {
                                    color: "#ffffff",
                                  },
                                ],
                              },
                              {
                                featureType: "road",
                                elementType: "geometry.stroke",
                                stylers: [
                                  {
                                    color: "#000000",
                                  },
                                ],
                              },
                              {
                                featureType: "road.arterial",
                                elementType: "labels.text.fill",
                                stylers: [
                                  {
                                    color: "#757575",
                                  },
                                ],
                              },
                              {
                                featureType: "road.highway",
                                elementType: "geometry",
                                stylers: [
                                  {
                                    color: "#dadada",
                                  },
                                ],
                              },
                              {
                                featureType: "road.highway",
                                elementType: "labels.text.fill",
                                stylers: [
                                  {
                                    color: "#616161",
                                  },
                                ],
                              },
                              {
                                featureType: "road.local",
                                elementType: "labels.text.fill",
                                stylers: [
                                  {
                                    color: "#9e9e9e",
                                  },
                                ],
                              },
                              {
                                featureType: "transit.line",
                                elementType: "geometry",
                                stylers: [
                                  {
                                    color: "#e5e5e5",
                                  },
                                ],
                              },
                              {
                                featureType: "transit.station",
                                elementType: "geometry",
                                stylers: [
                                  {
                                    color: "#eeeeee",
                                  },
                                ],
                              },
                              {
                                featureType: "water",
                                elementType: "geometry",
                                stylers: [
                                  {
                                    color: "#c9c9c9",
                                  },
                                ],
                              },
                              {
                                featureType: "water",
                                elementType: "labels.text.fill",
                                stylers: [
                                  {
                                    color: "#9e9e9e",
                                  },
                                ],
                              },
                            ],
                    }}
                  >
                    {facilities
                      .filter((f) => f.location)
                      .map((f) => (
                        <Marker
                          key={f.id}
                          data={f}
                          lat={f.location["latitude"]}
                          lng={f.location["longitude"]}
                          coordinates={Object.values(f.location).reverse()}
                          group={0}
                          zoom={state.zoom}
                          selectedBedType={selectedBedType}
                          setFocus={(center, zoom) => {
                            setState({ ...state, center, zoom: zoom });
                          }}
                        />
                      ))}
                  </GoogleMapReact>
                </div>
              </div>
            </div>
          </div>
        </div>

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

export default GMap;
