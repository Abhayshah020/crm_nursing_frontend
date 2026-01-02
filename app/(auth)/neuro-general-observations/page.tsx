"use client";

import { useState, useEffect } from "react";
import PageContainer from "@/components/PageContainer";
import axiosClient from "@/lib/axiosClient";
import Link from "next/link";
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";
import Footer from "@/components/Footer";
import { ChevronLeft, ChevronRight, Eye, Trash } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
import { useToast } from "@/components/toast/ToastContext";

export default function NeuroObservationsTable() {
    const [observations, setObservations] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
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
            const res = await axiosClient.get("/neuro-general-observations");
            if (res.status === 200) setObservations(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);


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
            await axiosClient.delete(`/neuro-general-observations/${deleteId}`);
            showToast({ message: "Deleted record successfully!", type: "success" });
            setDeleteId(null);
            fetchRecords();
        } catch {
            showToast({ message: "Error deleting user!", type: "error" });
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage mainPage={true} linkCreate="/neuro-general-observations/create" title="Neurological Observations" subtitle="Manage and review all neurological observations" />
            <ConfirmModal
                open={deleteId !== null}
                title="Delete Record"
                description="This action cannot be undone. Are you sure you want to delete this record?"
                confirmText="Delete"
                danger
                onCancel={() => setDeleteId(null)}
                onConfirm={handleDeleteConfirm}
            />
            <PageContainer title="Neurological Observations" subtitle="List of all observations">
                <div className="bg-card rounded-2xl shadow-lg border p-6 max-w-7xl overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 border-b border-border">
                            <tr>
                                <th className="p-3 font-semibold text-left">Patient</th>
                                <th className="p-3 font-semibold">Level of Consciousness</th>
                                <th className="p-3 font-semibold">Orientation</th>
                                <th className="p-3 font-semibold">Speech</th>
                                <th className="p-3 font-semibold">Pupils</th>
                                <th className="p-3 font-semibold">Date</th>
                                <th className="p-4 font-semibold">Actions</th>

                            </tr>
                        </thead>
                        <tbody>
                            {observations.map(obs => (
                                <tr key={obs.id} className="border-t hover:bg-muted/30">
                                    <td className="p-3">
                                        {obs.patientName}
                                    </td>
                                    <td className="p-3 text-center">{obs.levelOfConsciousness}</td>
                                    <td className="p-3 text-center">{obs.orientation}</td>
                                    <td className="p-3 text-center">{obs.speech}</td>
                                    <td className="p-3 text-center">{obs.pupils}</td>
                                    <td className="p-3 text-center">{new Date(obs.timestamp).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <div className="flex gap-3 justify-center">
                                            <Link
                                                href={`/neuro-general-observations/view/${obs.id}`}
                                                className="text-primary hover:text-primary/80 transition-colors p-2 hover:bg-primary/10 rounded-lg"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            {userExist && userExist?.role === 'admin' && (
                                                <button
                                                    onClick={() => setDeleteId(obs.id)}
                                                    className="text-primary cursor-pointer hover:text-primary/80 transition-colors p-2 hover:bg-primary/10 rounded-lg"
                                                >
                                                    <Trash size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {observations.length === 0 && (
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
