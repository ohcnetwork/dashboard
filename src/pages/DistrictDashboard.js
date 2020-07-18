import React, { useContext, useEffect, useState } from "react";
import { ChevronDown } from "react-feather";
import { Button, Dropdown, DropdownItem } from "windmill-react-ui";
import Capacity from "../components/DistrictDashboard/Capacity";
import Covid from "../components/DistrictDashboard/Covid";
import { PageTitle } from "../components/Typography/Title";
import { AuthContext } from "../context/AuthContext";
import { districts } from "../utils/constants";

const CONTENT = {
  CAPACITY: 1,
  COVID: 2,
  PATIENT: 3,
  TEST: 4,
};

function DistrictDashboard() {
  const { auth } = useContext(AuthContext);
  const [isStateAdmin, setIsStateAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [filterDistrict, setFilterDistrict] = useState(
    auth.userData.district_object
  );
  const [content, setContent] = useState(CONTENT.CAPACITY);

  useEffect(() => {
    setIsStateAdmin(
      ["StateLabAdmin", "StateAdmin"].includes(auth.userData.user_type)
    );
  }, []);

  const renderContent = () => {
    switch (content) {
      case CONTENT.CAPACITY:
        return <Capacity filterDistrict={filterDistrict} />;
      case CONTENT.COVID:
        return <Covid filterDistrict={filterDistrict} />;
      default:
        return <div />;
    }
  };

  return (
    <>
      <PageTitle>District Dashboard</PageTitle>

      <div className="flex items-center justify-between px-4 py-2 mb-8 bg-purple-600 rounded-lg shadow-md">
        <p className="font-semibold text-white">{filterDistrict.name}</p>
        <div className="flex">
          <div className="mr-2 bg-white rounded-lg dark:bg-gray-900 dark:text-gray-700">
            {Object.keys(CONTENT).map((k, i) => {
              let t = "shadow-md ";
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
                >
                  <span className="capitalize">{k}</span>
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
                <DropdownItem onClick={() => setFilterDistrict(d)}>
                  <span>{d.name}</span>
                </DropdownItem>
              ))}
            </Dropdown>
          </div>
        </div>
      </div>
      {renderContent()}
    </>
  );
}

export default DistrictDashboard;
