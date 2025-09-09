import React from "react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null; // Don't show pagination if only one page

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      {/* First Page */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md border border-[var(--border)] text-[var(--text)] bg-[var(--card)] hover:bg-[var(--primary)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        « First
      </button>

      {/* Prev Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md border border-[var(--border)] text-[var(--text)] bg-[var(--card)] hover:bg-[var(--primary)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ‹ Prev
      </button>

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-md border border-[var(--border)] ${
            currentPage === page
              ? "bg-[var(--primary)] text-white"
              : "bg-[var(--card)] text-[var(--text)] hover:bg-[var(--primary)] hover:text-white"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md border border-[var(--border)] text-[var(--text)] bg-[var(--card)] hover:bg-[var(--primary)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next ›
      </button>

      {/* Last Page */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md border border-[var(--border)] text-[var(--text)] bg-[var(--card)] hover:bg-[var(--primary)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Last »
      </button>
    </div>
  );
}
