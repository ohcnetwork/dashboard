import React, { useContext, useEffect, useState } from "react";
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow,
} from "windmill-react-ui";
import { AuthContext } from "../../context/AuthContext";
import { careFacilitySummary } from "../../utils/api";
import { InfoCard } from "../Cards/InfoCard";
import RadialCard from "../Chart/RadialCard";
import { SectionTitle } from "../Typography/Title";

function Capacity({ filterDistrict }) {
  const defaultTrivia = { total: 0, used: 0 };
  const resultsPerPage = 10;

  const { auth } = useContext(AuthContext);
  const [facilityData, setFacilityData] = useState([]);
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

export default Capacity;
