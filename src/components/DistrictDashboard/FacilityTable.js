import {
  Button,
  Input,
  Pagination,
  Table as WTable,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow,
} from "@saanuregh/react-ui";
import fuzzysort from "fuzzysort";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";

function FacilityTable({ columns = [], data, className, exported = null }) {
  const resultsPerPage = 25;
  const [filteredData, setFilteredData] = useState(data);
  const [page, setPage] = useState(1);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    setTableData(
      filteredData.slice((page - 1) * resultsPerPage, page * resultsPerPage)
    );
  }, [filteredData, page]);

  return (
    <div className={className}>
      <div className="items-center flex justify-between pb-2">
        <h2 className="text-lg font-semibold dark:text-gray-300 text-gray-600">
          Facilities
        </h2>
        <div className="items-center flex space-x-2">
          {exported && (
            <CSVLink data={exported.data} filename={exported.filename}>
              <Button>Export</Button>
            </CSVLink>
          )}
          <Input
            className="self-center flex w-64"
            placeholder="Search Facilities"
            onChange={(e) => {
              setFilteredData(
                e.target.value
                  ? data.filter((v) =>
                      fuzzysort
                        .go(
                          e.target.value,
                          data.map((d) => ({ ...d, 0: d[0][0] })),
                          { key: "0" }
                        )
                        .map((v) => v.target)
                        .includes(v[0][0])
                    )
                  : data
              );
            }}
          />
        </div>
      </div>

      <TableContainer className="text-xs xl:text-base">
        <WTable>
          <TableHeader>
            <tr className="whitespace-pre">
              {columns.map((item, i) => (
                <TableCell key={i}>{item}</TableCell>
              ))}
            </tr>
          </TableHeader>
          <TableBody>
            {tableData.length > 0 &&
              tableData.map((h, i) => (
                <TableRow key={i}>
                  {h.map((r, j) => (
                    <TableCell key={j}>
                      {j === 0 ? (
                        <div className="flex flex-col whitespace-pre-wrap w-32">
                          <p className="text-xs font-semibold xl:text-sm">
                            {r[0]}
                          </p>
                          <p className="text-xxs dark:text-gray-400 text-gray-600 xl:text-xs">
                            {r[1]}
                          </p>
                          <p className="text-xxs dark:text-gray-400 text-gray-600 xl:text-xs">
                            {r[2]}
                          </p>
                        </div>
                      ) : (
                        r
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </WTable>
        <TableFooter>
          <Pagination
            totalResults={filteredData.length}
            resultsPerPage={resultsPerPage}
            label="Table navigation"
            onChange={setPage}
          />
        </TableFooter>
      </TableContainer>
    </div>
  );
}

export default FacilityTable;
