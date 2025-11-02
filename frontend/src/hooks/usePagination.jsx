import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";

const getBreakpoint = () => {
  if (window.innerWidth < 768) return "sm";
  if (window.innerWidth < 1024) return "md";
  return "lg";
};

const range = (start, end) => {
  let length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

const usePaginationRange = (totalPages, currentPage, siblingCount = 1) => {
  const paginationRange = useMemo(() => {
    const DOTS = "...";

    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);
      return [...leftRange, DOTS, totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }

    return range(1, totalPages);
  }, [totalPages, currentPage, siblingCount]);

  return paginationRange;
};

export const usePagination = (data, config) => {
  const [breakpoint, setBreakpoint] = useState(getBreakpoint());
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getBreakpoint());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const itemsPerPage = useMemo(() => {
    return config[breakpoint] || 3;
  }, [breakpoint, config]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, data.length]); 

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const paginationRange = usePaginationRange(totalPages, currentPage);

  const PaginationComponent = () =>
    totalPages > 1 ? (
      <div className="join">
        <button
          className="join-item btn"
          onClick={goToPrev}
          disabled={currentPage === 1}
        >
          «
        </button>
        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === "...") {
            return (
              <button key={index} className="join-item btn btn-disabled">
                ...
              </button>
            );
          }
          return (
            <button
              key={index}
              className={`join-item btn ${
                currentPage === pageNumber ? "btn-primary" : ""
              }`}
              onClick={() => paginate(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}
        <button
          className="join-item btn"
          onClick={goToNext}
          disabled={currentPage === totalPages}
        >
          »
        </button>
      </div>
    ) : null;

  return { currentItems, PaginationComponent };
};
