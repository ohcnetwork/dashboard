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
} from "@windmill/react-ui";
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
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
          Facilities
        </h2>
        <div className="flex items-center space-x-2">
          {exported && (
            <CSVLink data={exported.data} filename={exported.filename}>
              <Button>Export</Button>
            </CSVLink>
          )}
          <Input
            className="flex self-center w-64"
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

      <TableContainer>
        <WTable>
          <TableHeader>
            <tr>
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
                      <div>
                        {j == 0 ? (
                          <div className="flex flex-col w-64">
                            <p className="font-semibold truncate">{r[0]}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {r[1]}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {r[2]}
                            </p>
                          </div>
                        ) : (
                          r
                        )}
                      </div>
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
