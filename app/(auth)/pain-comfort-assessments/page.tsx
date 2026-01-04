"use client"

import ConfirmModal from "@/components/ConfirmModal"
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage"
import PageContainer from "@/components/PageContainer"
import { useToast } from "@/components/toast/ToastContext"
import axiosClient from "@/lib/axiosClient"
import { ChevronLeft, ChevronRight, Eye, Trash } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function PainComfortAssessmentListPage() {
    const [assessments, setAssessments] = useState<any[]>([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [userExist, setUserExist] = useState<any>(null);
    const { showToast } = useToast();
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const fetchRecords = async () => {
        try {
            const res = await axiosClient.get("/pain-comfort-assessments", {
                params: {
                    page: currentPage,
                    limit: itemsPerPage,
                },
            });
            setAssessments(res.data.data)
            setTotalPages(res.data.page);

        } catch (error) {
            showToast({
                message: "Something went wrong!",
                type: "error",
            });
        }
    }

    useEffect(() => {
        fetchRecords()
    }, [])

    useEffect(() => {
        if (typeof window === "undefined") return;

        const user = sessionStorage.getItem("user");
        if (user) {
            try {
                setUserExist(JSON.parse(user));
            } catch {
                setUserExist(null);
            }
        }
    }, []);

    const handleDeleteConfirm = async () => {
        if (!deleteId) return;
        if (!userExist) return;
        if (userExist && userExist.role !== "admin") return;
        try {
            await axiosClient.delete(`/pain-comfort-assessments/${deleteId}`);
            showToast({ message: "Deleted record successfully!", type: "success" });
            setDeleteId(null);
            fetchRecords();
        } catch {
            showToast({ message: "Error deleting user!", type: "error" });
        }
    };


    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage mainPage={true} title="Pain & Comfort Assessment" subtitle="All assessments" linkCreate="/pain-comfort-assessments/create" />
            <ConfirmModal
                open={deleteId !== null}
                title="Delete Record"
                description="This action cannot be undone. Are you sure you want to delete this record?"
                confirmText="Delete"
                danger
                onCancel={() => setDeleteId(null)}
                onConfirm={handleDeleteConfirm}
            />
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
                                        {a.date}
                                    </td>

                                    <td className="p-4">
                                        <div className="flex gap-3 justify-center">
                                            <Link
                                                href={`/pain-comfort-assessments/view/${a.id}`}
                                                className="text-primary hover:text-primary/80 transition-colors p-2 hover:bg-primary/10 rounded-lg"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            {userExist && userExist?.role === 'admin' && (
                                                <button
                                                    onClick={() => setDeleteId(a.id)}
                                                    className="text-primary cursor-pointer hover:text-primary/80 transition-colors p-2 hover:bg-primary/10 rounded-lg"
                                                >
                                                    <Trash size={18} />
                                                </button>
                                            )}
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
