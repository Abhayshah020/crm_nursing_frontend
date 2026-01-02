"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Trash2, ChevronLeft, ChevronRight, Plus, Trash } from "lucide-react";
import PageContainer from "@/components/PageContainer";
import Footer from "@/components/Footer";
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";
import Link from "next/link";
import axiosClient from "@/lib/axiosClient";
import { useToast } from "@/components/toast/ToastContext";
import ConfirmModal from "@/components/ConfirmModal";

export default function CarePlansTablePage() {
    const [carePlans, setCarePlans] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [filter, setFilter] = useState("");
    const { showToast } = useToast();
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [userExist, setUserExist] = useState<any>(null);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const fetchRecords = async () => {
        try {
            const res = await axiosClient.get("/care-plans");
            let data = res.data;

            setCarePlans(data.data);
        } catch (err) {
            console.error(err);
            showToast({
                message: "Error fetching care plans",
                type: "error",
            });
        }
    };


    useEffect(() => {
        fetchRecords();
    }, [currentPage]);

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
            await axiosClient.delete(`/care-plans/${deleteId}`);
            showToast({ message: "Deleted record successfully!", type: "success" });
            setDeleteId(null);
            fetchRecords();
        } catch {
            showToast({ message: "Error deleting user!", type: "error" });
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <NavBarOfInternalPage
                mainPage={true}
                linkCreate="/care-plans/create"
                title="Care Plans"
                subtitle="Manage and monitor patient care plans"
            />
            <ConfirmModal
                open={deleteId !== null}
                title="Delete Record"
                description="This action cannot be undone. Are you sure you want to delete this record?"
                confirmText="Delete"
                danger
                onCancel={() => setDeleteId(null)}
                onConfirm={handleDeleteConfirm}
            />
            <PageContainer title="Care Plans" subtitle="List of all care plans">
                <div className="bg-card rounded-2xl shadow-lg border p-6 max-w-7xl overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-foreground border-b border-border">
                            <tr>
                                <th className="p-4 text-left font-semibold">Patient</th>
                                <th className="p-4 font-semibold">DOB</th>
                                <th className="p-4 font-semibold">Medical Doctor</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carePlans.map((cp) => (
                                <tr key={cp.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                                    <td className="p-4 font-medium text-foreground">{cp.patientName}</td>
                                    <td className="p-4 text-center text-muted-foreground">{new Date(cp.dateOfBirth).toLocaleDateString()}</td>
                                    <td className="p-4 text-muted-foreground">{cp.medicalDoctorName}</td>
                                    <td className="p-4 text-center text-muted-foreground">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${cp.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {cp.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-3 justify-center">
                                            <Link
                                                href={`/care-plans/view-care-plan/${cp.id}`}
                                                className="text-primary hover:text-primary/80 transition-colors p-2 hover:bg-primary/10 rounded-lg"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            {userExist && userExist?.role === 'admin' && (
                                                <button
                                                    onClick={() => setDeleteId(cp.id)}
                                                    className="text-primary cursor-pointer hover:text-primary/80 transition-colors p-2 hover:bg-primary/10 rounded-lg"
                                                >
                                                    <Trash size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {carePlans.length === 0 && (
                                <tr>
                                    <td colSpan={15} className="text-center py-4 text-muted-foreground">
                                        No records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>


                {/* Pagination */}
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
