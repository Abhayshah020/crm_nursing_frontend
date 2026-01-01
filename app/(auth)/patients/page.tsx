"use client";

import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";
import PageContainer from "@/components/PageContainer";
import { useToast } from "@/components/toast/ToastContext";
import axiosClient from "@/lib/axiosClient";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PatientsTablePage() {
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
        const handleFetch = async () => {
            try {
                const res = await axiosClient.get("/patients", {
                    params: {
                        page: currentPage,
                        limit: itemsPerPage,
                    },
                });
                setRecords(res.data.data);
                setTotalPages(res.data.total);
            } catch (error) {
                showToast({
                    message: "Something went wrong!",
                    type: "error",
                });
            }
        };
        handleFetch();
    }, [currentPage, itemsPerPage])

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage mainPage={true} linkCreate="/patients/create" title="Patients" subtitle="Manage all patients" />

            <PageContainer title="Patients" subtitle="List of all patients in the system">
                <div className="bg-card rounded-2xl shadow-lg border p-6 max-w-7xl overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-foreground border-b border-border">
                            <tr>
                                <th className="p-4 text-left font-semibold">Name</th>
                                <th className="p-4 text-left font-semibold">Contact</th>
                                <th className="p-4 text-left font-semibold">Email</th>
                                <th className="p-4 text-left font-semibold">Age</th>
                                <th className="p-4 text-left font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((patient) => (
                                <tr key={patient.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            {patient.image && (<div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
                                                <img
                                                    src={`${process.env.NEXT_PUBLIC_API_URL}${patient.image}`}
                                                    alt={patient.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>)}
                                            <span className="font-medium">{patient.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-left text-muted-foreground">{patient.contact || "-"}</td>
                                    <td className="p-4 text-left text-muted-foreground">{patient.email || "-"}</td>
                                    <td className="p-4 text-left text-muted-foreground">{patient.age || "-"}</td>
                                    <td className="p-4 text-left">
                                        <div className="flex gap-3">
                                            <Link
                                                href={`/patients/view/${patient.id}`}
                                                className="text-primary hover:text-primary/80 transition-colors p-2 hover:bg-primary/10 rounded-lg"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            {/* <button
                                                onClick={() => handleDelete(patient.id)}
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
