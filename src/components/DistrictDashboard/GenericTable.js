import {
  Button,
  Input,
  Table as WTable,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow,
} from "@windmill/react-ui";
import Pagination from "../Pagination";
import fuzzysort from "fuzzysort";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";

function GenericTable({
  columns = [],
  setOrderBy,
  data,
  className,
  exported = null,
  title = "Facilities",
}) {
  const resultsPerPage = 25;
  const [filteredData, setFilteredData] = useState(data);
  const [page, setPage] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setFilteredData(
      searchTerm
        ? data.filter((v) =>
            fuzzysort
              .go(
                searchTerm,
                data.map((d) => ({ ...d, 0: d[0][0] })),
                { key: "0" }
              )
              .map((v) => v.target)
              .includes(v[0][0])
          )
        : data
    );
    setPage(0);
  }, [searchTerm]);

  useEffect(() => {
    setTableData(
      filteredData.slice(page * resultsPerPage, (page + 1) * resultsPerPage)
    );
  }, [filteredData, page]);

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center justify-between pb-2 sm:flex-no-wrap">
        <h2 className="dark:text-gray-300 text-gray-600 text-lg font-semibold">
          {title}
        </h2>
        <div className="flex max-w-full space-x-1">
          {exported && (
            <CSVLink data={exported.data} filename={exported.filename}>
              <Button block>Export</Button>
            </CSVLink>
          )}
          <Input
            className="w-40 rounded-lg sm:w-auto"
            placeholder={"Search " + title}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>

      <TableContainer className="text-xs shadow-md overflow-hidden xl:text-base">
        <div className="h-screen overflow-auto overscroll-auto">
          <table className="w-full">
            <TableHeader>
              <tr className="top-0 text-center whitespace-pre bg-gray-100 dark:bg-gray-700">
                {columns.map((item, i) => (
                  <th
                    className="sticky top-0 p-2 bg-gray-100 dark:bg-gray-700"
                    key={i}
                    onClick={(_) => setOrderBy && setOrderBy(item)}
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </TableHeader>
            <TableBody className="flex-1 overflow-scroll">
              {tableData.length > 0 &&
                tableData.map((row, i) => (
                  <TableRow key={i}>
                    {row.map((col, j) => (
                      <TableCell key={j}>
                        {j === 0 ? (
                          <div className="flex flex-col w-32 whitespace-pre-wrap">
                            <p className="text-xs font-semibold xl:text-sm">
                              {col[0]}
                            </p>
                            <p className="dark:text-gray-400 text-gray-600 text-xxs xl:text-xs">
                              {col[1]}
                            </p>
                            <p className="dark:text-gray-400 text-gray-600 text-xxs xl:text-xs">
                              {col[2]}
                            </p>
                          </div>
                        ) : (
                          col
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </table>
        </div>
        <TableFooter>
          <Pagination
            resultsPerPage={resultsPerPage}
            totalResults={filteredData.length}
            currentPage={page}
            currentResults={tableData.length}
            handlePageClick={setPage}
          />
        </TableFooter>
      </TableContainer>
    </div>
  );
}

export default GenericTable;
