"use client";
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";
import PageContainer from "@/components/PageContainer";
import { useToast } from "@/components/toast/ToastContext";
import axiosClient from "@/lib/axiosClient";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FoodFluidIntakeList() {
    const { id } = useParams<{ id: string }>();

    const [records, setRecords] = useState<any[]>([])
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { showToast } = useToast();

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    useEffect(() => {

        const fetchFoodFluidIntakes = async () => {
            try {
                const res = await axiosClient.get("/food-fluid-intakes", {
                    params: {
                        page: currentPage,
                        limit: itemsPerPage,
                        patientId: id,
                    },
                });
                setRecords(res.data.data);
                setTotalPages(res.data.total);
            } catch (err) {
                showToast({
                    message: "Something went wrong!",
                    type: "error",
                });
            }
        };

        fetchFoodFluidIntakes()
    }, [currentPage, itemsPerPage])

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage
                mainPage={true}
                linkCreate={`/food-fluid-intakes/create-patient/${id}`}
                title="Food & Fluid Intake"
                subtitle="Manage and review all food & fluid intake records"

            />

            <PageContainer title="Food & Fluid Intake Records" subtitle="View all patient intake records">
                <div className="bg-card rounded-2xl shadow-lg border p-6 max-w-7xl overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-foreground border-b border-border">
                            <tr>
                                <th className="p-4 text-left font-semibold">Patient</th>
                                <th className="p-4 font-semibold">Input Fluids (ml)</th>
                                <th className="p-4 font-semibold">Food Description</th>
                                <th className="p-4 font-semibold">Total Fluid</th>
                                <th className="p-4 font-semibold">Date</th>
                                <th className="p-4 font-semibold">Actions</th>

                            </tr>
                        </thead>
                        <tbody>
                            {records.map(i => (
                                <tr key={i.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                                    <td className="p-4 font-medium text-foreground">
                                        {i.patientName}
                                    </td>
                                    <td className="p-4 text-center">{i.inputFluidsMl}</td>
                                    <td className="p-4">{i.foodDescription.slice(0, 50)}...</td>
                                    <td className="p-4 text-center">{i.totalFluid}</td>
                                    <td className="p-4 text-center">{new Date(i.timestamp).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <div className="flex gap-3 justify-center">
                                            <Link
                                                href={`/food-fluid-intakes/view/${i.id}`}
                                                className="text-primary hover:text-primary/80 transition-colors p-2 hover:bg-primary/10 rounded-lg"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            {/* <button
                                                onClick={() => handleDelete(note.id)}
                                                className="text-destructive hover:text-destructive/80 transition-colors p-2 hover:bg-destructive/10 rounded-lg"
                                            >
                                                <Trash2 size={18} />
                                            </button> */}
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
