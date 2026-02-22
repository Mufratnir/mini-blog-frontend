import React from 'react';

type Props = {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ currentPage, lastPage, onPageChange }: Props) => {
  if (lastPage <= 1) return null;

  const getPages = () => {
    const pages: (number | string)[] = [];

    if (lastPage <= 7) {
      // jei shob page choto, shob show korbe
      for (let i = 1; i <= lastPage; i++) pages.push(i);
    } else {
      // First page always
      pages.push(1);

      if (currentPage > 4) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(lastPage - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < lastPage - 3) pages.push('...');

      // Last page always
      pages.push(lastPage);
    }

    return pages;
  };

  const pages = getPages();

  return (
    <div>
      <nav aria-label="Page navigation">
        <ul className="flex space-x-1 text-sm font-medium text-gray-700">
          {/* Previous button */}
          <li>
            <button
              className="flex items-center justify-center w-9 h-9 rounded-l-md bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M13 15l-5-5 5-5v10z" />
              </svg>
            </button>
          </li>

          {/* Page numbers */}
          {pages.map((page, idx) =>
            page === '...' ? (
              <li key={idx}>
                <span className="flex items-center justify-center w-9 h-9">...</span>
              </li>
            ) : (
              <li key={idx}>
                <button
                  onClick={() => onPageChange(Number(page))}
                  className={`flex items-center justify-center w-9 h-9 rounded-md border ${
                    page === currentPage
                      ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              </li>
            ),
          )}

          {/* Next button */}
          <li>
            <button
              className="flex items-center justify-center w-9 h-9 rounded-r-md bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
              onClick={() => onPageChange(Math.min(lastPage, currentPage + 1))}
              disabled={currentPage === lastPage}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M7 5l5 5-5 5V5z" />
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
