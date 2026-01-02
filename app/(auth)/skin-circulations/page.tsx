"use client";

import ConfirmModal from "@/components/ConfirmModal";
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";
import PageContainer from "@/components/PageContainer";
import { useToast } from "@/components/toast/ToastContext";
import axiosClient from "@/lib/axiosClient";
import { ChevronLeft, ChevronRight, Eye, Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SkinCirculationList() {
    const [records, setRecords] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [userExist, setUserExist] = useState<any>(null);
    const { showToast } = useToast();

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const fetchRecords = async () => {
        try {
            const res = await axiosClient.get(`/skin-circulations?page=${page}&limit=10`);
            if (res.status === 200) setRecords(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, [page]);

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
            await axiosClient.delete(`/skin-circulations/${deleteId}`);
            showToast({ message: "Deleted record successfully!", type: "success" });
            setDeleteId(null);
            fetchRecords();
        } catch {
            showToast({ message: "Error deleting user!", type: "error" });
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage mainPage={true} linkCreate="/skin-circulations/create" title="Skin & Circulation" subtitle="Manage all patients" />
            <ConfirmModal
                open={deleteId !== null}
                title="Delete Record"
                description="This action cannot be undone. Are you sure you want to delete this record?"
                confirmText="Delete"
                danger
                onCancel={() => setDeleteId(null)}
                onConfirm={handleDeleteConfirm}
            />
            <PageContainer title="Skin & Circulation Records" subtitle="View all patient records">
                <div className="bg-card rounded-2xl shadow-lg border p-6 max-w-7xl overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-foreground border-b border-border">
                            <tr>
                                <th className="p-3 font-semibold text-left">Patient</th>
                                <th className="p-3 font-semibold text-center">Skin Colour</th>
                                <th className="p-3 font-semibold text-center">Temperature</th>
                                <th className="p-3 font-semibold text-center">Capillary Refill</th>
                                <th className="p-3 font-semibold text-center">Date</th>
                                <th className="p-3 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((r) => (
                                <tr key={r.id} className="border-t hover:bg-muted/30 transition-colors">
                                    <td className="p-3">
                                        <Link href={`/skin-circulations/view/${r.id}`} className="text-primary underline">
                                            {r.patientName}
                                        </Link>
                                    </td>
                                    <td className="p-3 text-center">{r.skinColour}</td>
                                    <td className="p-3 text-center">{r.skinTemperature}</td>
                                    <td className="p-3 text-center">{r.capillaryRefill}</td>
                                    <td className="p-3 text-center">{new Date(r.timestamp).toLocaleDateString()}</td>
                                    <td className="p-3 text-center">
                                        <div className="flex gap-3">

                                            <Link href={`/skin-circulations/view/${r.id}`} className="text-primary hover:text-primary/80 p-2 rounded-lg">
                                                <Eye size={18} />
                                            </Link>
                                            {userExist && userExist?.role === 'admin' && (
                                                <button
                                                    onClick={() => setDeleteId(r.id)}
                                                    className="text-primary cursor-pointer hover:text-primary/80 transition-colors p-2 hover:bg-primary/10 rounded-lg"
                                                >
                                                    <Trash size={18} />
                                                </button>
                                            )}
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
    );
}
