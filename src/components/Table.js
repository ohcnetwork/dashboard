import React, { useEffect, useState } from "react";
import {
  Pagination,
  Table as WTable,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow,
} from "windmill-react-ui";

function Table({ columns = [], data = [[]], className }) {
  const resultsPerPage = 25;
  const [page, setPage] = useState(1);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (data.length == 0) {
      return;
    }
    setTableData(
      data.slice((page - 1) * resultsPerPage, page * resultsPerPage)
    );
  }, [data, page]);

  return (
    <TableContainer className={className}>
      <WTable>
        <TableHeader>
          <tr>
            {columns.map((item, i) => (
              <TableCell key={i}>{item}</TableCell>
            ))}
          </tr>
        </TableHeader>
        <TableBody>
          {tableData.map((h, i) => (
            <TableRow key={i}>
              {h.map((r, j) => (
                <TableCell key={j}>
                  <div>{r}</div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </WTable>
      <TableFooter>
        <Pagination
          totalResults={data.length}
          resultsPerPage={resultsPerPage}
          label="Table navigation"
          onChange={setPage}
        />
      </TableFooter>
    </TableContainer>
  );
}

export default Table;
