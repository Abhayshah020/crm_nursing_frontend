"use client"

import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage"
import PageContainer from "@/components/PageContainer"
import axiosClient from "@/lib/axiosClient"
import { ChevronLeft, ChevronRight, Eye } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function DailyNotesTablePage() {
    const { id } = useParams<{ id: string }>();

    const [records, setRecords] = useState<any[]>([])
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    useEffect(() => {
        const handleFetch = async () => {
            try {
                const res = await axiosClient.get("/daily-notes", {
                    params: {
                        page: currentPage,
                        limit: itemsPerPage,
                        patientId: id,
                    },
                });
setRecords(res.data.data);
      setTotalPages(res.data.total);

            } catch (error) {
                alert("Error fetching daily notes");
            }
        };

        handleFetch()
    }, [itemsPerPage, currentPage])

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage mainPage={true} linkCreate="/daily-notes/create" title="Daily Notes" subtitle="Manage and review all daily notes" />

            <PageContainer title="Daily Notes" subtitle="Manage and review documentation">

                <div className="bg-card rounded-2xl shadow-lg border p-6 max-w-7xl overflow-x-auto">

                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-foreground border-b border-border">
                            <tr>
                                <th className="p-4 text-left font-semibold">Client</th>
                                <th className="p-4 font-semibold">Date</th>
                                <th className="p-4 font-semibold">Notes</th>
                                <th className="p-4 font-semibold">Created</th>
                                <th className="p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((record) => (
                                <tr key={record.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                                    <td className="p-4 font-medium text-foreground">{record.patientName}</td>
                                    <td className="p-4 text-center text-muted-foreground">{record.timeStamps}</td>
                                    <td className="p-4 text-muted-foreground">{record.notes.slice(0, 40)}...</td>
                                    <td className="p-4 text-center text-muted-foreground">
                                        {new Date(record.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-3 justify-center">
                                            <Link
                                                href={`/daily-notes/view/${record.id}`}
                                                className="text-primary hover:text-primary/80 transition-colors p-2 hover:bg-primary/10 rounded-lg"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {records.length === 0 && (
                                <tr>
                                    <td colSpan={15} className="text-center py-4 text-muted-foreground">
                                        No records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="p-2 border rounded disabled:opacity-50"
                        >
                            <ChevronLeft />
                        </button>
                        <span className="p-2">{currentPage}</span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="p-2 border rounded disabled:opacity-50"
                        >
                            <ChevronRight />
                        </button>
                    </div>
                )}
            </PageContainer>

        </div>
    )
}
