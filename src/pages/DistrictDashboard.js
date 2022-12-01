import { Button, Dropdown, DropdownItem } from "@windmill/react-ui";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { ChevronDown } from "react-feather";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router-dom";
import { animated, useTransition } from "react-spring";
import { SWRConfig } from "swr";

import ThemedSuspense from "../components/ThemedSuspense";
import { PageTitle } from "../components/Typography/Title";
import {
  CONTENT,
  FACILITY_TYPES,
  ACTIVATED_DISTRICTS,
} from "../utils/constants";
import { getNDateBefore } from "../utils/utils";

const Capacity = lazy(() => import("../components/DistrictDashboard/Capacity"));
const DistrictMap = lazy(() =>
  import("../components/DistrictDashboard/DistrictMap")
);
const CapacityTimeseries = lazy(() =>
  import("../components/DistrictDashboard/CapacityTimeseries")
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
const Lsg = lazy(() => import("../components/DistrictDashboard/Lsg"));
const OxygenMonitor = lazy(() =>
  import("../components/DistrictDashboard/OxygenMonitor")
);

function DistrictDashboard() {
  const todayDate = new Date();
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [timeseries, setTimeseries] = useState(false);
  const [filterDistrict, setFilterDistrict] = useState(ACTIVATED_DISTRICTS[1]);
  const [filterFacilityTypes, setFilterFacilityTypes] =
    useState(FACILITY_TYPES);
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

  const getDistrict = (name) => {
    const district = ACTIVATED_DISTRICTS.find(
      (district) => district.name.toLowerCase() === name?.toLowerCase()
    );

    return district === undefined ? ACTIVATED_DISTRICTS[1] : district;
  };

  useEffect(() => {
    setFilterDistrict(getDistrict(params.district));
  }, [params.district]);

  useEffect(() => {
    setContent(CONTENT[params.content?.toUpperCase()] || CONTENT.CAPACITY);
  }, [params.content]);

  useEffect(() => {
    window.history.replaceState(
      null,
      "Care Dashboard",
      `/district/${filterDistrict.name.toLowerCase()}/${Object.entries(CONTENT)
        .find((a) => a[1] === content)[0]
        .toLowerCase()}`
    );
  }, [content, filterDistrict]);

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
      case CONTENT.LSG:
        return !timeseries ? (
          <Lsg filterDistrict={filterDistrict} date={date} />
        ) : (
          <div>Work in Progress</div>
        );
      case CONTENT.OXYGEN:
        return !timeseries ? (
          <OxygenMonitor
            filterDistrict={filterDistrict}
            filterFacilityTypes={filterFacilityTypes}
            date={date}
          />
        ) : (
          <div>Work in Progress</div>
        );
      case CONTENT.MAP:
        return !timeseries ? (
          <DistrictMap
            filterDistrict={filterDistrict}
            filterFacilityTypes={filterFacilityTypes}
            date={date}
          />
        ) : (
          <div>Work in Progress</div>
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
    <div className="overflow-hidden md:overflow-auto">
      <PageTitle>State Dashboard</PageTitle>
      <div className="flex flex-col items-center justify-between mb-2 px-4 py-2 bg-primary-500 rounded-lg shadow-md md:flex-row">
        <p className="text-white font-semibold">{filterDistrict.name}</p>
        <div className="md:flex md:space-x-2">
          <div className="flex flex-wrap justify-center dark:text-gray-700 dark:bg-gray-900 bg-white rounded-lg space-x-1 space-y-1 md:space-x-0 md:space-y-0">
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
          <div className="relative mt-2 dark:bg-gray-900 bg-white rounded-lg md:mt-0">
            <Button
              layout="link"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Select district"
              aria-haspopup="true"
              disabled={false}
              iconRight={ChevronDown}
              className="w-full shadow-xs"
            >
              {filterDistrict.name}
            </Button>
            <Dropdown
              isOpen={isOpen}
              align="right"
              onClose={() => setIsOpen(false)}
              className="z-40"
            >
              {ACTIVATED_DISTRICTS.map((d, i) => (
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
