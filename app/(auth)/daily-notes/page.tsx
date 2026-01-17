"use client"

import ConfirmModal from "@/components/ConfirmModal"
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage"
import PageContainer from "@/components/PageContainer"
import { Pagination } from "@/components/Pagination"
import { useToast } from "@/components/toast/ToastContext"
import axiosClient from "@/lib/axiosClient"
import { generateDailyNotesPdf } from "@/utils/generateDailyNotesPdf"
import { ChevronLeft, ChevronRight, Eye, Trash } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function DailyNotesTablePage() {
    const [notes, setNotes] = useState<any[]>([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [userExist, setUserExist] = useState<any>(null);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };
    const { showToast } = useToast();

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const fetchRecords = async () => {
        try {
            const res = await axiosClient.get("/daily-notes", {
                params: {
                    page: currentPage,
                    limit: itemsPerPage,
                },
            });
            if (res.status === 200 || res.status === 201) {
                setTotalPages(res.data.page);
                setNotes(res.data.data);
            } else {
                showToast({
                    message: "Something went wrong!",
                    type: "error",
                });
            }
        } catch (error) {
            showToast({
                message: "Something went wrong!",
                type: "error",
            });
        }
    };

    useEffect(() => {
        fetchRecords()
    }, [currentPage, itemsPerPage])

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
            await axiosClient.delete(`/daily-notes/${deleteId}`);
            showToast({ message: "Deleted record successfully!", type: "success" });
            setDeleteId(null);
            fetchRecords();
        } catch {
            showToast({ message: "Error deleting user!", type: "error" });
        }
    };

    const handleDownload = () => {
        if (notes.length == 0) return;
        generateDailyNotesPdf(notes);
    };


    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage mainPage={true} linkCreate="/daily-notes/create" title="Daily Notes" subtitle="Manage and review all daily notes" />
            <ConfirmModal
                open={deleteId !== null}
                title="Delete Record"
                description="This action cannot be undone. Are you sure you want to delete this record?"
                confirmText="Delete"
                danger
                onCancel={() => setDeleteId(null)}
                onConfirm={handleDeleteConfirm}
            />
            <PageContainer title="Daily Notes" subtitle="Manage and review documentation">

                <div className="bg-card rounded-2xl shadow-lg border p-6 max-w-7xl overflow-x-auto">
                    <div className="w-full flex justify-end">
                        <button
                            onClick={handleDownload}
                            className="px-4 py-2 cursor-pointer bg-blue-600 mb-2 text-white rounded"
                        >
                            Download Report
                        </button>
                    </div>
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-foreground border-b border-border">
                            <tr>
                                <th className="p-4 text-left font-semibold">Patient</th>
                                <th className="p-4 font-semibold">Date</th>
                                <th className="p-4 font-semibold">Notes</th>
                                <th className="p-4 font-semibold">Created</th>
                                <th className="p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notes.map((note) => (
                                <tr key={note.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                                    <td className="p-4 font-medium text-foreground">{note.patientName}</td>
                                    <td className="p-4 text-center text-muted-foreground">{note.date}</td>
                                    <td className="p-4 text-muted-foreground">{note.notes.slice(0, 40)}...</td>
                                    <td className="p-4 text-center text-muted-foreground">
                                        {new Date(note.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-3 justify-center">
                                            <Link
                                                href={`/daily-notes/view/${note.id}`}
                                                className="text-primary hover:text-primary/80 transition-colors p-2 hover:bg-primary/10 rounded-lg"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            {userExist && userExist?.role === 'admin' && (
                                                <button
                                                    onClick={() => setDeleteId(note.id)}
                                                    className="text-primary cursor-pointer hover:text-primary/80 transition-colors p-2 hover:bg-primary/10 rounded-lg"
                                                >
                                                    <Trash size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {notes.length === 0 && (
                                <tr>
                                    <td colSpan={15} className="text-center py-4 text-muted-foreground">
                                        No records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination totalPages={totalPages} handlePrevPage={handlePrevPage} handleNextPage={handleNextPage} currentPage={currentPage} itemsPerPage={itemsPerPage} onItemsPerPageChange={(size) => { setItemsPerPage(size); setCurrentPage(1) }} />

            </PageContainer>

        </div>
    )
}
