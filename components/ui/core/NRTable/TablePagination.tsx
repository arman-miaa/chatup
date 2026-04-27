import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../../button";

interface TablePaginationProps {
  totalPage?: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const TablePagination = ({
  totalPage = 10,
  currentPage,
  onPageChange,
}: TablePaginationProps) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPage;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPage <= maxVisible) {
      return Array.from({ length: totalPage }, (_, i) => i + 1);
    }

    pages.push(1);

    if (currentPage > 3) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPage - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPage - 2) pages.push("...");
    pages.push(totalPage);

    return pages;
  };

  return (
    <div className="flex items-center justify-end gap-3 p-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirstPage}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          isFirstPage
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <ArrowLeft className="w-4 h-4" />
        Previous
      </button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="min-w-10 h-10 px-3 flex items-center justify-center text-gray-500"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`min-w-10 h-10 px-3 rounded-lg text-sm font-medium transition-all ${
                currentPage === page
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {String(page).padStart(2, "0")}
            </button>
          )
        )}
      </div>

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLastPage}
        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
          isLastPage
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "text-white font-semibold rounded-full shadow-md hover:opacity-90"
        }`}
      >
        Next
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default TablePagination;
