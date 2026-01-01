"use client";

import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";
import PageContainer from "@/components/PageContainer";
import { useToast } from "@/components/toast/ToastContext";
import axiosClient from "@/lib/axiosClient";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BowelChartTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const [records, setRecords] = useState<any[]>([]);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [filter, setFilter] = useState("");
    const { showToast } = useToast();

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const res = await axiosClient.get("/bowel-charts");
                setRecords(res.data.data);
            } catch (err) {
                showToast({
                    message: "Error creating bowel chart",
                    type: "error",
                });
            }
        };
        fetchRecords();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <NavBarOfInternalPage
                mainPage={true}
                linkCreate="/bowel-charts/create"
                title="Bowel Charts"
                subtitle="Manage and review all bowel movement records"
            />

            <PageContainer title="Bowel Charts" subtitle="Review all bowel movement records">
                <div className="bg-card rounded-2xl shadow-lg border p-6 max-w-7xl overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-foreground border-b border-border">
                            <tr>
                                <th className="p-3 text-left">Patient</th>
                                <th className="p-3 text-center">Bowel Motion</th>
                                <th className="p-3 text-center">Bristol Type</th>
                                <th className="p-3 text-center">Date</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map(r => (
                                <tr key={r.id} className="border-t hover:bg-muted/30">
                                    <td className="p-3 font-medium text-foreground">
                                        {r.patientName}
                                    </td>
                                    <td className="p-3 text-center">{r.bowelMotion ? "Yes" : "No"}</td>
                                    <td className="p-3 text-center">{r.bristolType}</td>
                                    <td className="p-3 text-center">{new Date(r.timestamp).toLocaleDateString()}</td>
                                    <td className="p-3 text-center">
                                        <div className="flex gap-3 justify-center">
                                            <Link
                                                href={`/bowel-charts/view/${r.id}`}
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
