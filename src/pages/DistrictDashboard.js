import React, { useContext, useState } from "react";
import { ChevronDown } from "react-feather";
import { Button, Dropdown, DropdownItem, Transition } from "windmill-react-ui";
import Capacity from "../components/DistrictDashboard/Capacity";
import CapacityTimeseries from "../components/DistrictDashboard/CapacityTimeseries";
import Covid from "../components/DistrictDashboard/Covid";
import Filter from "../components/DistrictDashboard/Filter";
import Patient from "../components/DistrictDashboard/Patient";
import PatientTimeseries from "../components/DistrictDashboard/PatientTimeseries";
import Tests from "../components/DistrictDashboard/Tests";
import TestsTimeseries from "../components/DistrictDashboard/TestsTimeseries";
import { PageTitle } from "../components/Typography/Title";
import { AuthContext } from "../context/AuthContext";
import { districts } from "../utils/constants";
import { getNDateBefore } from "../utils/utils";
import { useInView } from "react-intersection-observer";

const CONTENT = {
  CAPACITY: 1,
  PATIENT: 3,
  TESTS: 4,
  COVID: 2,
};

function DistrictDashboard() {
  const previousDate = getNDateBefore(new Date(), 1);

  const { auth } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [timeseries, setTimeseries] = useState(false);
  const [filterDistrict, setFilterDistrict] = useState(
    auth.userData.district_object
  );
  const [content, setContent] = useState(CONTENT.CAPACITY);
  const [dates, datesOnChange] = useState([
    getNDateBefore(previousDate, 14),
    previousDate,
  ]);
  const [date, dateOnChange] = useState(previousDate);
  const isStateAdmin = ["StateLabAdmin", "StateAdmin"].includes(
    auth.userData.user_type
  );
  const [ref, inView, entry] = useInView({
    threshold: 0,
  });

  const renderContent = () => {
    switch (content) {
      case CONTENT.CAPACITY:
        return !timeseries ? (
          <Capacity filterDistrict={filterDistrict} date={date} />
        ) : (
          <CapacityTimeseries filterDistrict={filterDistrict} dates={dates} />
        );
      case CONTENT.PATIENT:
        return !timeseries ? (
          <Patient filterDistrict={filterDistrict} date={date} />
        ) : (
          <PatientTimeseries filterDistrict={filterDistrict} dates={dates} />
        );
      case CONTENT.TESTS:
        return !timeseries ? (
          <Tests filterDistrict={filterDistrict} date={date} />
        ) : (
          <TestsTimeseries filterDistrict={filterDistrict} dates={dates} />
        );
      case CONTENT.COVID:
        return <Covid filterDistrict={filterDistrict} />;
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
      maxDate={previousDate}
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
                <DropdownItem key={i} onClick={() => setFilterDistrict(d)}>
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
      {renderContent()}
    </div>
  );
}

export default DistrictDashboard;
