const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center gap-2 mt-4 flex-wrap">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 rounded text-sm transition-all duration-200
          ${
            p === currentPage
              ? 'bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500 text-white'
              : 'bg-black/40 text-gray-400 border border-purple-900/30 hover:text-white'
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
