import { useEffect, useState } from "react";

function usePagination<T>(items: T[], itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState(1);

  // Math.max(1, ...) so an empty list still means "1 page", never 0
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  // Bug fix: if items shrink (delete/search) and we are past the last page,
  // move back to the last valid page instead of showing an empty table.
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    currentItems,
    currentPage: safePage,
    totalPages,
    goToPage,
    startIndex,
    totalItems: items.length,
  };
}

export default usePagination;
