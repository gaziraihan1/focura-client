import { useState, useMemo } from "react";

interface UsePaginationProps<T> {
  items: T[];
  itemsPerPage?: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  paginatedItems: T[];
  startIndex: number;
  endIndex: number;
  setCurrentPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  resetPage: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export function usePagination<T>({
  items,
  itemsPerPage = 15,
}: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const resetPage = () => {
    setCurrentPage(1);
  };

  const canGoNext = currentPage < totalPages;
  const canGoPrevious = currentPage > 1;

  return {
    currentPage,
    totalPages,
    totalItems,
    paginatedItems,
    startIndex,
    endIndex,
    setCurrentPage,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,
    resetPage,
    canGoNext,
    canGoPrevious,
  };
}