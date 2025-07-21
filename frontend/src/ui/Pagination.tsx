// components/ResponsivePagination.tsx
import React from 'react';
import { usePagination } from '../hooks/usePagination'; // Pastikan path hook benar
import clsx from 'clsx';
import {
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/20/solid';

interface PaginationProps {
  onPageChange: (page: number) => void;
  totalPages: number;
  currentPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
  onPageChange,
  totalPages,
  currentPage,
}) => {
  const paginationRange = usePagination({
    currentPage,
    totalPages,
    siblingCount: 1,
  });

  // Jika hanya ada 1 halaman atau kurang, tidak perlu menampilkan paginasi
  if (currentPage === 0 || totalPages <= 1) {
    return null;
  }

  const onNext = () => {
    onPageChange(Math.min(currentPage + 1, totalPages));
  };

  const onPrevious = () => {
    onPageChange(Math.max(currentPage - 1, 1));
  };

  const onFirst = () => {
    onPageChange(1);
  };

  const onLast = () => {
    onPageChange(totalPages);
  };

  const baseButtonClasses =
    'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <nav
      className="flex items-center justify-between"
      aria-label="Pagination"
    >
      {/* ============================================= */}
      {/* Tampilan Mobile (Sederhana)                   */}
      {/* Muncul di layar kecil, hilang di layar besar  */}
      {/* ============================================= */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={onPrevious}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="inline-flex items-center px-4 text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* ============================================= */}
      {/* Tampilan Desktop (Lengkap)                    */}
      {/* Hilang di layar kecil, muncul di layar besar  */}
      {/* ============================================= */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
        <ul className="inline-flex -space-x-px rounded-md shadow-sm">
          {/* Tombol First Page */}
          <li>
            <button onClick={onFirst} disabled={currentPage === 1} className={clsx(baseButtonClasses, 'rounded-l-md')} aria-label="Go to first page">
              <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </li>
          {/* Tombol Previous Page */}
          <li>
            <button onClick={onPrevious} disabled={currentPage === 1} className={baseButtonClasses} aria-label="Go to previous page">
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </li>

          {/* Tombol Angka Halaman */}
          {paginationRange?.map((pageNumber, index) => {
            if (typeof pageNumber === 'string') {
              return (
                <li key={`dots-${index}`}>
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                    ...
                  </span>
                </li>
              );
            }
            return (
              <li key={pageNumber}>
                <button
                  onClick={() => onPageChange(pageNumber)}
                  className={clsx(baseButtonClasses, currentPage === pageNumber && 'z-10 bg-indigo-600 text-white ring-indigo-600 hover:bg-indigo-700')}
                  aria-current={currentPage === pageNumber ? 'page' : undefined}
                >
                  {pageNumber}
                </button>
              </li>
            );
          })}
          
          {/* Tombol Next Page */}
          <li>
            <button onClick={onNext} disabled={currentPage === totalPages} className={baseButtonClasses} aria-label="Go to next page">
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </li>
          {/* Tombol Last Page */}
          <li>
            <button onClick={onLast} disabled={currentPage === totalPages} className={clsx(baseButtonClasses, 'rounded-r-md')} aria-label="Go to last page">
              <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Pagination;