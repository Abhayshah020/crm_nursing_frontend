"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import PageContainer from "@/components/PageContainer";
import axiosClient from "@/lib/axiosClient";
import Footer from "@/components/Footer";
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";
import { ChevronLeft, ChevronRight, Eye, Trash } from "lucide-react";
import { useToast } from "@/components/toast/ToastContext";
import ConfirmModal from "@/components/ConfirmModal";
import { Pagination } from "@/components/Pagination";

export default function FoodFluidIntakeList() {
    const [intakes, setIntakes] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const { showToast } = useToast();
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [userExist, setUserExist] = useState<any>(null);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const fetchRecords = async () => {
        try {
            const res = await axiosClient.get("/food-fluid-intakes", {
                params: {
                    page: currentPage,
                    limit: itemsPerPage,
                },
            });
            if (res.status === 200) {
                setTotalPages(res.data.page);
                setIntakes(res.data.data); // adjust if your API returns differently
            }
        } catch (err) {
            showToast({
                message: "Something went wrong!",
                type: "error",
            });
        }
    };


    useEffect(() => {
        fetchRecords()
    }, [currentPage, itemsPerPage]);

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
            await axiosClient.delete(`/food-fluid-intakes/${deleteId}`);
            showToast({ message: "Deleted record successfully!", type: "success" });
            setDeleteId(null);
            fetchRecords();
        } catch {
            showToast({ message: "Error deleting user!", type: "error" });
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage mainPage={true} linkCreate="/food-fluid-intakes/create" title="Food & Fluid Intake" subtitle="Manage and review all food & fluid intake records" />
            <ConfirmModal
                open={deleteId !== null}
                title="Delete Record"
                description="This action cannot be undone. Are you sure you want to delete this record?"
                confirmText="Delete"
                danger
                onCancel={() => setDeleteId(null)}
                onConfirm={handleDeleteConfirm}
            />
            <PageContainer title="Food & Fluid Intake Records" subtitle="View all patient intake records">
                <div className="bg-card rounded-2xl shadow-lg border p-6 max-w-7xl overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-foreground border-b border-border">
                            <tr>
                                <th className="p-4 text-left font-semibold">Patient</th>
                                <th className="p-4 text-left font-semibold">Input Fluids (ml)</th>
                                <th className="p-4 text-left font-semibold">Food Description</th>
                                <th className="p-4 text-left font-semibold">Total Fluid</th>
                                <th className="p-4 text-left font-semibold">Date</th>
                                <th className="p-4 font-semibold">Actions</th>

                            </tr>
                        </thead>
                        <tbody>
                            {intakes.map(i => (
                                <tr key={i.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                                    <td className="p-4 font-medium text-foreground text-left">
                                        {i.patientName}
                                    </td>
                                    <td className="p-4 text-left">{i.inputFluidsMl}</td>
                                    <td className="p-4 text-left">{i.foodDescription.slice(0, 50)}...</td>
                                    <td className="p-4 text-left">{i.totalFluid}</td>
                                    <td className="p-4 text-left">{i.date}</td>
                                    <td className="p-4">
                                        <div className="flex gap-3 justify-center">
                                            <Link
                                                href={`/food-fluid-intakes/view/${i.id}`}
                                                className="text-primary hover:text-primary/80 transition-colors p-2 hover:bg-primary/10 rounded-lg"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            {userExist && userExist?.role === 'admin' && (
                                                <button
                                                    onClick={() => setDeleteId(i.id)}
                                                    className="text-primary cursor-pointer hover:text-primary/80 transition-colors p-2 hover:bg-primary/10 rounded-lg"
                                                >
                                                    <Trash size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {intakes.length === 0 && (
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
    );
}
