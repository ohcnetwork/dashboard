import { Button, Dropdown, DropdownItem } from "@windmill/react-ui";
import React, { lazy, Suspense, useContext, useEffect, useState } from "react";
import { ChevronDown } from "react-feather";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router-dom";
import ThemedSuspense from "../components/ThemedSuspense";
import { PageTitle } from "../components/Typography/Title";
import { AuthContext } from "../context/AuthContext";
import { districts, facilityTypes } from "../utils/constants";
import { getNDateBefore } from "../utils/utils";
import { SWRConfig } from "swr";
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

const CONTENT = {
  CAPACITY: 1,
  PATIENT: 3,
  TESTS: 4,
  COVID: 2,
};

function DistrictDashboard() {
  const todayDate = new Date();
  const params = useParams();
  const { auth } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [timeseries, setTimeseries] = useState(false);
  const [filterDistrict, setFilterDistrict] = useState(
    auth.userData.district_object
  );
  const [filterFacilityTypes, setFilterFacilityTypes] = useState(facilityTypes);
  const [content, setContent] = useState(
    CONTENT[params.content?.toUpperCase()] || CONTENT.CAPACITY
  );
  const [dates, datesOnChange] = useState([
    getNDateBefore(todayDate, 14),
    todayDate,
  ]);
  const [date, dateOnChange] = useState(todayDate);
  const isStateAdmin = ["StateLabAdmin", "StateAdmin"].includes(
    auth.userData.user_type
  );
  const [ref, inView, entry] = useInView({
    threshold: 0,
  });

  useEffect(() => {
    setContent(CONTENT[params.content?.toUpperCase()] || CONTENT.CAPACITY);
  }, [params.content]);

  useEffect(() => {
    window.history.replaceState(
      null,
      "Care Dashboard",
      "/app/district/" +
        Object.entries(CONTENT)
          .find((a) => a[1] === content)[0]
          .toLowerCase()
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

  const ConditionalFilter = ({ floating }) => (
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
    />
  );

  return (
    <div>
      <PageTitle>District Dashboard</PageTitle>
      <div className="flex flex-row items-center justify-between px-4 py-2 mb-2 bg-purple-600 rounded-lg shadow-md">
        <p className="font-semibold text-white">{filterDistrict.name}</p>
        <div className="flex space-x-2">
          <div className="bg-white rounded-lg dark:bg-gray-900 dark:text-gray-700">
            {Object.keys(CONTENT).map((k, i) => {
              let t = "shadow-xs ";
              if (i == 0) {
                t += "rounded-r-none";
              } else if (i == Object.keys(CONTENT).length - 1) {
                t += "rounded-l-none";
              } else {
                t += "rounded-l-none rounded-r-none";
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
          <div className="relative bg-white rounded-lg dark:bg-gray-900">
            <Button
              layout="link"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={
                !isStateAdmin ? "Need statelevel access" : "Select district"
              }
              aria-haspopup="true"
              disabled={!isStateAdmin}
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
              {districts.map((d, i) => (
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
      {!inView && <ConditionalFilter floating={true} />}
      <Suspense fallback={<ThemedSuspense />}>
        <SWRConfig
          value={{
            suspense: true,
            loadingTimeout: 10000,
            refreshInterval: 300000,
          }}
        >
          {renderContent()}
        </SWRConfig>
      </Suspense>
    </div>
  );
}

export default DistrictDashboard;
