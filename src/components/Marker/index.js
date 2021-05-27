import React, { Component } from "react";
import "./marker.css";
import {
  AVAILABILITY_TYPES,
  AVAILABILITY_TYPES_ORDERED,
} from "../../utils/constants";

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

const colorClasses = (capacity) => {
  if (capacity) {
    let a = (capacity.current_capacity / capacity.total_capacity) * 100;
    if (a < 70.0) {
      return "text-green-500";
    } else if (a === 100.0) {
      return "text-red-700";
    } else {
      return "text-yellow-400";
    }
  } else {
    return "text-blue-500";
  }
};

let canShowBed = (capacity, filter) => {
  if (filter === "All") {
    return true;
  }
  if (capacity && capacity.room_type === filter) {
    return capacity.total_capacity !== 0;
  } else {
    return false;
  }
};

let bedClasses = (zoom) => {
  if (zoom < 11) {
    return " w-6 h-6";
  } else if (zoom < 14) {
    return " w-8 h-8";
  } else {
    return " w-10 h-10";
  }
};

class Marker extends Component {
  state = {
    popup: false,
  };
  render() {
    let data = this.props.data;

    return (
      <div
        className="MarkerWrapper"
        onMouseLeave={(e) => {
          this.setState({ popup: false });
        }}
        onClick={() => {
          let center = { lat: this.props.lat, lng: this.props.lng };
          let zoom = 13;
          this.props.setFocus(center, zoom);
        }}
      >
        <div
          className="MapMarkerIcon"
          onMouseEnter={(e) => {
            this.setState({ popup: true });
          }}
        >
          {canShowBed(
            data.capacity[this.props.selectedBedType],
            this.props.selectedBedType
          ) && (
            <div
              className={
                colorClasses(data.capacity[this.props.selectedBedType]) +
                bedClasses(this.props.zoom)
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="bed"
                role="img"
                viewBox="0 0 640 512"
              >
                <path
                  fill="currentColor"
                  d="M176 256c44.11 0 80-35.89 80-80s-35.89-80-80-80-80 35.89-80 80 35.89 80 80 80zm352-128H304c-8.84 0-16 7.16-16 16v144H64V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v352c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16v-48h512v48c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16V240c0-61.86-50.14-112-112-112z"
                />
              </svg>
            </div>
          )}
        </div>

        {this.state.popup && (
          <div className="MapMarkerOverlay">
            <div className="text-xxs">
              <p className="mb-1 font-black">{data.name}</p>
              <div>
                <div className="grid gap-4 grid-cols-3 mt-4">
                  <div>
                    <p className="font-semibold">Oxygen capacity</p>
                    <p>
                      Current: <strong>{data.oxygenCapacity}</strong>
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Live Patients</p>
                    <p>
                      Current: <strong>{data.actualLivePatients}</strong>
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Discharged Patients</p>
                    <p>
                      Current: <strong>{data.actualDischargedPatients}</strong>
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 grid-cols-3 mt-4">
                  {AVAILABILITY_TYPES_ORDERED.map((a) => {
                    const current = data.capacity[a]?.current_capacity || 1;
                    const total = data.capacity[a]?.total_capacity || 1;
                    const used = ((current / total) * 100).toFixed(2);
                    if (total == 1) {
                      return;
                    }
                    return (
                      <div key={a}>
                        <p className="font-semibold">{AVAILABILITY_TYPES[a]}</p>
                        {data.capacity[a]?.total_capacity ? (
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
          </div>
        )}
      </div>
    );
  }
}

export default Marker;
