import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const range = (from, to) => {
    return Array.from({ length: to - from + 1 }, (_, i) => from + i);
  };

  const renderPaginationItems = () => {
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    const pages = range(1, totalPages);

    return (
      <>
        {prevPage && (
          <button
            className="px-4 py-2 rounded-md font-normal text-base leading-6 font-inter  bg-customWhite text-lightBlack hover:bg-customWhite"
            onClick={() => onPageChange(prevPage)}
          >
            Previous
          </button>
        )}

        {pages.map(page => (
          <button
            key={page}
            className={`px-4 py-2 rounded-md font-normal text-base leading-6 font-inter  ${
              currentPage === page
                ? "bg-secondary-content text-white dark:bg-black"
                : "border border-gray-300  bg-white text-lightBlack hover:bg-customWhite"
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        {nextPage && (
          <button
            className="px-4 py-2 rounded-md font-normal text-base leading-6 font-inter border border-gray-300  bg-white text-lightBlack hover:bg-customWhite"
            onClick={() => onPageChange(nextPage)}
          >
            Next
          </button>
        )}
      </>
    );
  };

  return <div className="flex space-x-2  py-16 px-4 justify-end">{renderPaginationItems()}</div>;
};

export default Pagination;
