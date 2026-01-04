import { ChevronLeft, ChevronRight } from "lucide-react"

export const Pagination = ({
    totalPages,
    currentPage,
    itemsPerPage,
    handlePrevPage,
    handleNextPage,
    onItemsPerPageChange,
}) => {

    const itemsPerPageOptions = [5, 10, 20, 50, 100]
    return (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Items per page */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Rows per page</span>
                <select
                    value={itemsPerPage}
                    onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                    className="rounded-md border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    {itemsPerPageOptions.map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">
                        Page <span className="font-medium">{currentPage}</span> of{" "}
                        <span className="font-medium">{totalPages}</span>
                    </span>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => handlePrevPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="flex h-9 w-9 items-center justify-center rounded-md border bg-white text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <button
                            onClick={() => handleNextPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="flex h-9 w-9 items-center justify-center rounded-md border bg-white text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
