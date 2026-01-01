"use client"

import { useEffect, useState } from "react"
import axiosClient from "@/lib/axiosClient"
import PageContainer from "@/components/PageContainer"
import Footer from "@/components/Footer"
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Eye } from "lucide-react"
import { useToast } from "@/components/toast/ToastContext"

export default function PainComfortAssessmentListPage() {
    const [assessments, setAssessments] = useState<any[]>([])
    const [page, setPage] = useState(1)
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const { showToast } = useToast();

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await axiosClient.get("/pain-comfort-assessments")
            setAssessments(res.data.data)

        } catch (error) {
            showToast({
                message: "Something went wrong!",
                type: "error",
            });
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage mainPage={true} title="Pain & Comfort Assessment" subtitle="All assessments" linkCreate="/pain-comfort-assessments/create" />

            <PageContainer title="Pain & Comfort Assessment" subtitle="Pain & comfort records">
                <div className="bg-card rounded-2xl shadow-lg border p-6 max-w-7xl overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-foreground border-b border-border">
                            <tr>
                                <th className="p-4 text-left font-semibold">Patient</th>
                                <th className="p-4 text-center font-semibold">Pain Score</th>
                                <th className="p-4 font-semibold">Location</th>
                                <th className="p-4 text-center font-semibold">Date</th>
                                <th className="p-4 text-center font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assessments.map((a) => (
                                <tr
                                    key={a.id}
                                    className="border-b border-border hover:bg-muted/30 transition-colors"
                                >
                                    <td className="p-4 font-medium text-foreground">
                                        {a.patientName}
                                    </td>

                                    <td className="p-4 text-center text-muted-foreground">
                                        {a.painScore}/10
                                    </td>

                                    <td className="p-4 text-muted-foreground">
                                        {a.painLocation}
                                    </td>

                                    <td className="p-4 text-center text-muted-foreground">
                                        {new Date(a.timestamp).toLocaleDateString()}
                                    </td>

                                    <td className="p-4">
                                        <div className="flex gap-3 justify-center">
                                            <Link
                                                href={`/pain-comfort-assessments/view/${a.id}`}
                                                className="text-primary hover:text-primary/80 transition-colors p-2 hover:bg-primary/10 rounded-lg"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {assessments.length === 0 && (
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
