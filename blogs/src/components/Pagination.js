// Pagination.js

import React from 'react';

import '../Style/Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="pagination">
      {pages.map((page) => (
        <button key={page} onClick={() => onPageChange(page)} disabled={currentPage === page}>
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
