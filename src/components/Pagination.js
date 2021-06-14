import React from "react";
import ReactPaginate from "react-paginate";

const Pagination = ({
  resultsPerPage,
  totalResults,
  currentPage,
  currentResults,
  handlePageClick,
}) => {
  const pageCount = Math.ceil(totalResults / resultsPerPage);
  const currentPageFirstResult = currentPage * resultsPerPage + 1;
  const currentPageLastResult = currentPage * resultsPerPage + currentResults;
  return (
    <div className="grid grid-rows-2 md:grid-cols-2">
      <div className="mt-1 dark:text-gray-400 text-gray-600 text-xs">
        {`SHOWING ${currentPageFirstResult}-${currentPageLastResult} OF ${totalResults}`}
      </div>
      <div>
        <ReactPaginate
          pageCount={pageCount}
          marginPagesDisplayed={1}
          pageRangeDisplayed={4}
          previousLabel={"<"}
          nextLabel={">"}
          initialPage={0}
          onPageChange={(e) => handlePageClick(e.selected)}
          forcePage={currentPage}
          breakLabel={"..."}
          breakClassName={
            "text-gray-600 dark:text-gray-400 inline-flex items-center"
          }
          previousLinkClassName={
            "px-3 py-1 text-xs font-semibold hover:bg-gray-100 rounded dark:text-gray-600 dark:hover:bg-gray-500 dark:hover:text-gray-300 dark:hover:bg-opacity-10"
          }
          nextLinkClassName={
            "px-3 py-1 text-xs font-semibold hover:bg-gray-100 rounded dark:text-gray-600 dark:hover:bg-gray-500 dark:hover:text-gray-300 dark:hover:bg-opacity-10"
          }
          containerClassName={"flex mt-2 sm:mt-auto sm:justify-end"}
          pageClassName={"mx-1 inline-flex items-center text-gray-600"}
          pageLinkClassName={
            "px-3 py-1 text-xs font-semibold hover:bg-gray-100 rounded dark:hover:bg-gray-500 dark:hover:bg-opacity-10"
          }
          activeLinkClassName={
            "px-3 py-1 text-xs text-gray-200 font-semibold bg-green-500 hover:bg-green-600"
          }
        />
      </div>
    </div>
  );
};

export default Pagination;
