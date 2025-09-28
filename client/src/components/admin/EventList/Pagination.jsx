import React from "react";

const Pagination = ({ total, page, limit, onPageChange }) => {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-4 flex gap-2 items-center">
      {page > 1 && (
        <button onClick={() => onPageChange(page - 1)} className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300">Prev</button>
      )}
      {pages.map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 border rounded ${p === page ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
        >
          {p}
        </button>
      ))}
      {page < totalPages && (
        <button onClick={() => onPageChange(page + 1)} className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300">Next</button>
      )}
    </div>
  );
};

export default Pagination;
