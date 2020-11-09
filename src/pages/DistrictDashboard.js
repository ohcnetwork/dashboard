import { Button, Dropdown, DropdownItem } from "@windmill/react-ui";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { ChevronDown } from "react-feather";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router-dom";
import { animated, useTransition } from "react-spring";
import { SWRConfig } from "swr";

import ThemedSuspense from "../components/ThemedSuspense";
import { PageTitle } from "../components/Typography/Title";
import { CONTENT, DISTRICTS, FACILITY_TYPES } from "../utils/constants";
import { getNDateBefore } from "../utils/utils";

const Capacity = lazy(() => import("../components/DistrictDashboard/Capacity"));
const CapacityTimeseries = lazy(() =>
  import("../components/DistrictDashboard/CapacityTimeseries")
);
const Covid = lazy(() => import("../components/DistrictDashboard/Covid"));
const CovidTimeseries = lazy(() =>
  import("../components/DistrictDashboard/CovidTimeseries")
);
const Filter = lazy(() => import("../components/DistrictDashboard/Filter"));
const Patient = lazy(() => import("../components/DistrictDashboard/Patient"));
const PatientTimeseries = lazy(() =>
  import("../components/DistrictDashboard/PatientTimeseries")
);
const Tests = lazy(() => import("../components/DistrictDashboard/Tests"));
const TestsTimeseries = lazy(() =>
  import("../components/DistrictDashboard/TestsTimeseries")
);
const Triage = lazy(() => import("../components/DistrictDashboard/Triage"));
const TriageTimeseries = lazy(() =>
  import("../components/DistrictDashboard/TriageTimeseries")
);

function DistrictDashboard() {
  const todayDate = new Date();
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [timeseries, setTimeseries] = useState(false);
  const [filterDistrict, setFilterDistrict] = useState({
    id: 7,
    name: "Ernakulam",
  });
  const [filterFacilityTypes, setFilterFacilityTypes] = useState(
    FACILITY_TYPES
  );
  const [content, setContent] = useState(
    CONTENT[params.content?.toUpperCase()] || CONTENT.CAPACITY
  );
  const [dates, datesOnChange] = useState([
    getNDateBefore(todayDate, 14),
    todayDate,
  ]);
  const [date, dateOnChange] = useState(todayDate);
  const [ref, inView] = useInView({
    threshold: 0,
  });

  useEffect(() => {
    setContent(CONTENT[params.content?.toUpperCase()] || CONTENT.CAPACITY);
  }, [params.content]);

  useEffect(() => {
    window.history.replaceState(
      null,
      "Care Dashboard",
      `/district/${Object.entries(CONTENT)
        .find((a) => a[1] === content)[0]
        .toLowerCase()}`
    );
  }, [content]);

  const renderContent = () => {
    switch (content) {
      case CONTENT.CAPACITY:
        return !timeseries ? (
          <Capacity
            filterDistrict={filterDistrict}
            filterFacilityTypes={filterFacilityTypes}
            date={date}
          />
        ) : (
          <CapacityTimeseries
            filterDistrict={filterDistrict}
            filterFacilityTypes={filterFacilityTypes}
            dates={dates}
          />
        );
      case CONTENT.PATIENT:
        return !timeseries ? (
          <Patient
            filterDistrict={filterDistrict}
            filterFacilityTypes={filterFacilityTypes}
            date={date}
          />
        ) : (
          <PatientTimeseries
            filterDistrict={filterDistrict}
            filterFacilityTypes={filterFacilityTypes}
            dates={dates}
          />
        );
      case CONTENT.TESTS:
        return !timeseries ? (
          <Tests
            filterDistrict={filterDistrict}
            filterFacilityTypes={filterFacilityTypes}
            date={date}
          />
        ) : (
          <TestsTimeseries
            filterDistrict={filterDistrict}
            filterFacilityTypes={filterFacilityTypes}
            dates={dates}
          />
        );
      case CONTENT.TRIAGE:
        return !timeseries ? (
          <Triage
            filterDistrict={filterDistrict}
            filterFacilityTypes={filterFacilityTypes}
            date={date}
          />
        ) : (
          <TriageTimeseries
            filterDistrict={filterDistrict}
            filterFacilityTypes={filterFacilityTypes}
            dates={dates}
          />
        );
      case CONTENT.COVID:
        return !timeseries ? (
          <Covid filterDistrict={filterDistrict} date={date} />
        ) : (
          <CovidTimeseries filterDistrict={filterDistrict} dates={dates} />
        );
      default:
        return <div />;
    }
  };

  function ConditionalFilter({ floating }) {
    return (
      <Filter
        floating={floating}
        timeseries={timeseries}
        setTimeseries={setTimeseries}
        date={date}
        dateOnChange={dateOnChange}
        dates={dates}
        datesOnChange={datesOnChange}
        maxDate={todayDate}
        filterFacilityTypes={filterFacilityTypes}
        setFilterFacilityTypes={setFilterFacilityTypes}
        content={content}
      />
    );
  }
  const transitions = useTransition(content, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 1 },
  });
  return (
    <div className="overflow-auto">
      <PageTitle>District Dashboard</PageTitle>
      <div className="items-center bg-green-500 rounded-lg shadow-md flex flex-col justify-between mb-2 px-4 py-2 md:flex-row">
        <p className="font-semibold text-white">{filterDistrict.name}</p>
        <div className="md:flex md:space-x-2">
          <div className="dark:bg-gray-900 bg-white rounded-lg flex flex-wrap justify-center space-x-1 space-y-1 dark:text-gray-700 md:space-x-0 md:space-y-0">
            {Object.keys(CONTENT).map((k, i) => {
              let t = "shadow-xs ";
              if (i === 0) {
                t += "md:rounded-r-none";
              } else if (i === Object.keys(CONTENT).length - 1) {
                t += "md:rounded-l-none";
              } else {
                t += "md:rounded-l-none md:rounded-r-none";
              }
              return (
                <Button
                  layout="link"
                  onClick={() => setContent(CONTENT[k])}
                  className={t}
                  disabled={content === CONTENT[k]}
                  key={i}
                >
                  <span className="capitalize">{k.toLowerCase()}</span>
                </Button>
              );
            })}
          </div>
          <div className="dark:bg-gray-900 bg-white rounded-lg hidden mt-2 relative md:mt-0">
            <Button
              layout="link"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Select district"
              aria-haspopup="true"
              disabled
              iconRight={ChevronDown}
              className="shadow-xs"
            >
              Select District
            </Button>
            <Dropdown
              isOpen={isOpen}
              align="right"
              onClose={() => setIsOpen(false)}
              className="z-40"
            >
              {DISTRICTS.map((d, i) => (
                <DropdownItem
                  key={i}
                  onClick={() => {
                    setFilterDistrict(d);
                    setIsOpen(false);
                  }}
                >
                  <span>{d.name}</span>
                </DropdownItem>
              ))}
            </Dropdown>
          </div>
        </div>
      </div>
      <div ref={ref}>
        <ConditionalFilter floating={false} />
      </div>
      {!inView && <ConditionalFilter floating />}
      <Suspense fallback={<ThemedSuspense />}>
        <SWRConfig
          value={{
            suspense: true,
            loadingTimeout: 10_000,
            refreshInterval: 300_000,
            onError: (error, key) => {
              // eslint-disable-next-line no-console
              console.error(error, key);
            },
          }}
        >
          {transitions.map(({ key, props }) => (
            <animated.div key={key} style={props}>
              {renderContent()}
            </animated.div>
          ))}
        </SWRConfig>
      </Suspense>
    </div>
  );
}

export default DistrictDashboard;
