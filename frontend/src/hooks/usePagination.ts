// hooks/usePagination.ts
import { useMemo } from 'react';

interface UsePaginationProps {
  totalPages: number;
  siblingCount?: number; // siblingCount dibuat opsional
  currentPage: number;
}

const range = (start: number, end: number): number[] => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

export const usePagination = ({
  totalPages,
  siblingCount = 1,
  currentPage,
}: UsePaginationProps): (string | number)[] | undefined => {
  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount + 5;

    // Kasus 1: Jumlah halaman lebih kecil dari angka yang ingin ditampilkan
    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPages
    );

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // Kasus 2: Tanpa elipsis kiri, tapi ada elipsis kanan
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, '...', totalPages];
    }

    // Kasus 3: Tanpa elipsis kanan, tapi ada elipsis kiri
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [firstPageIndex, '...', ...rightRange];
    }

    // Kasus 4: Dengan elipsis di kedua sisi
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
    }
  }, [totalPages, siblingCount, currentPage]);

  return paginationRange;
};