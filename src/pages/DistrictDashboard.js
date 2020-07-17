import React, { useContext, useEffect, useState } from "react";
import { ChevronDown } from "react-feather";
import {
  Button,
  Dropdown,
  DropdownItem,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow,
} from "windmill-react-ui";
import { InfoCard, SmallInfoCard } from "../components/Cards/InfoCard";
import RadialCard from "../components/Chart/RadialCard";
import { PageTitle, SectionTitle } from "../components/Typography/Title";
import { AuthContext } from "../context/AuthContext";
import { careFacilitySummary, getCovidStats } from "../utils/api";
import { districts } from "../utils/constants";

function DistrictDashboard() {
  const defaultTrivia = { total: 0, used: 0 };
  const resultsPerPage = 10;

  const [isStateAdmin, setIsStateAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { auth } = useContext(AuthContext);
  const [facilityData, setFacilityData] = useState([]);
  const [covidStats, setCovidStats] = useState({ summary: {}, delta: {} });
  const [filterDistrict, setFilterDistrict] = useState(
    auth.userData.district_object
  );
  const [filteredFacilities, setFilteredFacilities] = useState([]);
  const [facilitiesTrivia, setFacilitiesTrivia] = useState({
    oxygen: defaultTrivia,
    ventilator: defaultTrivia,
    icu: defaultTrivia,
    room: defaultTrivia,
    bed: defaultTrivia,
  });
  const [page, setPage] = useState(1);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setIsStateAdmin(
      ["StateLabAdmin", "StateAdmin"].includes(auth.userData.user_type)
    );
    getCovidStats().then((stats) => setCovidStats(stats));
    careFacilitySummary(auth.token)
      .then((summary) => {
        const dictionary = summary.results.reduce((acc, { data: facility }) => {
          if (acc[facility.id]) {
            return acc;
          }
          return {
            ...acc,
            [facility.id]: {
              name: facility.name,
              districtId: facility.district,
              district: facility.district_object?.name || "Unknown",
              location: facility.location || "Unknown",
              facility_type: facility.facility_type || "Unknown",
              oxygenCapacity: facility.oxygen_capacity,
              localbody: facility.local_body_object?.name || "Unknown",
              modified: facility.modified_date,
              capacity: facility.availability.reduce((cAcc, cCur) => {
                return {
                  ...cAcc,
                  [cCur.room_type]: cCur,
                };
              }, {}),
              roomModified: facility.availability.reduce((cAcc, cCur) => {
                return {
                  ...cAcc,
                  [cCur.room_type]: cCur,
                };
              }, {}),
            },
          };
        }, {});
        setFacilityData(Object.values(dictionary));
      })
      .catch((ex) => {
        console.error("Data Unavailable", ex);
      });
  }, []);

  useEffect(() => {
    setTableData(
      filteredFacilities.slice(
        (page - 1) * resultsPerPage,
        page * resultsPerPage
      )
    );
  }, [page]);

  useEffect(() => {
    let _f = facilityData.filter((f) => f.districtId === filterDistrict.id);
    setFilteredFacilities(_f);
    setTableData(_f.slice((page - 1) * resultsPerPage, page * resultsPerPage));
    setFacilitiesTrivia({
      oxygen: {
        used: _f
          .map((f) => f.capacity[20]?.current_capacity || 0)
          .reduce((a, b) => a + b, 0),
        total: _f.map((f) => f.oxygenCapacity || 0).reduce((a, b) => a + b, 0),
      },
      ventilator: {
        used: _f
          .map((f) => f.capacity[20]?.current_capacity || 0)
          .reduce((a, b) => a + b, 0),
        total: _f
          .map((f) => f.capacity[20]?.total_capacity || 0)
          .reduce((a, b) => a + b, 0),
      },
      icu: {
        used: _f
          .map((f) => f.capacity[10]?.current_capacity || 0)
          .reduce((a, b) => a + b, 0),
        total: _f
          .map((f) => f.capacity[10]?.total_capacity || 0)
          .reduce((a, b) => a + b, 0),
      },
      room: {
        used: _f
          .map((f) => f.capacity[3]?.current_capacity || 0)
          .reduce((a, b) => a + b, 0),
        total: _f
          .map((f) => f.capacity[3]?.total_capacity || 0)
          .reduce((a, b) => a + b, 0),
      },
      bed: {
        used: _f
          .map((f) => f.capacity[1]?.current_capacity || 0)
          .reduce((a, b) => a + b, 0),
        total: _f
          .map((f) => f.capacity[1]?.total_capacity || 0)
          .reduce((a, b) => a + b, 0),
      },
    });
  }, [facilityData, filterDistrict]);

  return (
    <>
      <PageTitle>District Dashboard</PageTitle>

      <div className="flex items-center justify-between px-4 py-2 mb-8 bg-purple-600 rounded-lg shadow-md">
        <p className="font-semibold text-white">{filterDistrict.name}</p>
        <div className="relative">
          <Button
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

      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <RadialCard
          label="Ventilators Used"
          used={facilitiesTrivia.ventilator.used}
          total={facilitiesTrivia.ventilator.total}
        />
        <RadialCard
          label="ICUs Used"
          used={facilitiesTrivia.icu.used}
          total={facilitiesTrivia.icu.total}
        />
        <RadialCard
          label="Beds Used"
          used={facilitiesTrivia.bed.used}
          total={facilitiesTrivia.bed.total}
        />
        <RadialCard
          label="Rooms Used"
          used={facilitiesTrivia.room.used}
          total={facilitiesTrivia.room.total}
        />
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-6">
        <InfoCard title="Total Hospitals" value={filteredFacilities.length} />
        <InfoCard
          title="Total Oxygen Capacity"
          value={facilitiesTrivia.oxygen.total}
        />
        <InfoCard
          title="Ventilators Available"
          value={
            facilitiesTrivia.ventilator.total - facilitiesTrivia.ventilator.used
          }
        />
        <InfoCard
          title="ICUs Available"
          value={facilitiesTrivia.icu.total - facilitiesTrivia.icu.used}
        />
        <InfoCard
          title="Rooms Available"
          value={facilitiesTrivia.room.total - facilitiesTrivia.room.used}
        />
        <InfoCard
          title="Beds Available"
          value={facilitiesTrivia.bed.total - facilitiesTrivia.bed.used}
        />
      </div>

      <SectionTitle>Covid Stats</SectionTitle>
      <div className="grid gap-6 mb-8 md:grid-cols-1 xl:grid-cols-2">
        <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-4">
          <SmallInfoCard
            title="Confirmed"
            value={covidStats.summary[filterDistrict.name]?.confirmed || 0}
            delta={covidStats.delta[filterDistrict.name]?.confirmed || 0}
          />
          <SmallInfoCard
            title="Active"
            value={covidStats.summary[filterDistrict.name]?.active || 0}
            delta={covidStats.delta[filterDistrict.name]?.active || 0}
          />
          <SmallInfoCard
            title="Recovered"
            value={covidStats.summary[filterDistrict.name]?.recovered || 0}
            delta={covidStats.delta[filterDistrict.name]?.recovered || 0}
          />
          <SmallInfoCard
            title="Deaths"
            value={covidStats.summary[filterDistrict.name]?.deceased || 0}
            delta={covidStats.delta[filterDistrict.name]?.deceased || 0}
          />
        </div>
        <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-4">
          <SmallInfoCard
            title="Under Observation"
            value={covidStats.summary[filterDistrict.name]?.total_obs || 0}
            delta={covidStats.delta[filterDistrict.name]?.total_obs || 0}
          />
          <SmallInfoCard
            title="Hospital Isolation"
            value={covidStats.summary[filterDistrict.name]?.hospital_obs || 0}
            delta={covidStats.delta[filterDistrict.name]?.hospital_obs || 0}
          />
          <SmallInfoCard
            title="Home Isolation"
            value={covidStats.summary[filterDistrict.name]?.home_obs || 0}
            delta={covidStats.delta[filterDistrict.name]?.home_obs || 0}
          />
          <SmallInfoCard
            title="Hospitalized Today"
            value={covidStats.summary[filterDistrict.name]?.hospital_today || 0}
            delta={covidStats.delta[filterDistrict.name]?.hospital_today || 0}
          />
        </div>
      </div>

      <SectionTitle>Facilities</SectionTitle>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Name</TableCell>
              <TableCell>Ventilator</TableCell>
              <TableCell>ICU</TableCell>
              <TableCell>Bed</TableCell>
              <TableCell>Room</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {tableData.map((h, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex flex-col">
                    <p className="font-semibold">{h.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {h.facility_type}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {h.capacity[20]?.current_capacity || 0}/
                    {h.capacity[20]?.total_capacity || 0}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {h.capacity[10]?.current_capacity || 0}/
                    {h.capacity[10]?.total_capacity || 0}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {h.capacity[1]?.current_capacity || 0}/
                    {h.capacity[1]?.total_capacity || 0}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {h.capacity[3]?.current_capacity || 0}/
                    {h.capacity[3]?.total_capacity || 0}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={filteredFacilities.length}
            resultsPerPage={resultsPerPage}
            label="Table navigation"
            onChange={setPage}
          />
        </TableFooter>
      </TableContainer>

      <SectionTitle>Charts</SectionTitle>
    </>
  );
}

export default DistrictDashboard;
