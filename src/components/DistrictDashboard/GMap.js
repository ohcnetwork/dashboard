import { Card, CardBody, WindmillContext } from "@windmill/react-ui";
import React, { useContext, useState } from "react";
import GoogleMapReact from "google-map-react";
import Geosuggest from "react-geosuggest";
import Marker from "../Marker/index";

import {
  AVAILABILITY_TYPES,
  AVAILABILITY_TYPES_ORDERED,
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
      lat: 10.1485476,
      lng: 76.5007524,
    },
    zoom: 10,
  });

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
                      key: "AIzaSyDsBAc3y7deI5ZO3NtK5GuzKwtUzQNJNUk",
                    }}
                    defaultCenter={{
                      lat: 10.1485476,
                      lng: 76.5007524,
                    }}
                    defaultZoom={8}
                    center={state.center}
                    zoom={state.zoom}
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
