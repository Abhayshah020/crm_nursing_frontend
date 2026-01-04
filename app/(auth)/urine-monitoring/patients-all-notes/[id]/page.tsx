"use client";

import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";
import PageContainer from "@/components/PageContainer";
import { Pagination } from "@/components/Pagination";
import axiosClient from "@/lib/axiosClient";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface UrineMonitoringType {
    id: number;
    patientName: string;
    staffName: string;
    timestamp: string;
    reasonForCharting: Record<string, boolean>;
    colour: string;
    clarity: string;
    odour: string;
    dysuria: boolean;
    frequency: string;
    urgency: boolean;
    totalFluidIntake: number;
    totalUrineOutput: number;
    balance: string;
    continenceStatus: string;
    catheterType: string;
    rnGpManagerNotified: boolean;
    date: string
}

export default function UrineMonitoringTable() {
    const { id } = useParams<{ id: string }>();

    const [records, setRecords] = useState<any[]>([])
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };


    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const res = await axiosClient.get("/urine-monitoring", {
                    params: {
                        page: currentPage,
                        limit: itemsPerPage,
                        patientId: id,
                    },
                });
                setRecords(res.data.data);
                setTotalPages(res.data.page);
            } catch (err) {
                console.error("Error fetching urine monitoring records:", err);
            }
        };

        fetchRecords();
    }, [currentPage, itemsPerPage])

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage
                mainPage={true}
                linkCreate={`/urine-monitoring/create-patient/${id}`}
                title="Urine Monitoring Records"
                subtitle="Manage all patients"
            />

            <PageContainer title="Urine Monitoring Records" subtitle="All patients' urine monitoring">
                <div className="bg-card rounded-2xl shadow-lg border p-6 max-w-7xl overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-foreground border-b border-border">
                            <tr className="bg-muted/50 text-left">
                                <th className="px-4 font-semibold py-2 border-b">Patient</th>
                                <th className="px-4 font-semibold py-2 border-b">Staff</th>
                                <th className="px-4 font-semibold py-2 border-b">Colour</th>
                                <th className="px-4 font-semibold py-2 border-b">Frequency</th>
                                <th className="px-4 font-semibold py-2 border-b">Fluid Intake (ml)</th>
                                <th className="px-4 font-semibold py-2 border-b">Urine Output (ml)</th>
                                <th className="px-4 font-semibold py-2 border-b">Date</th>
                                <th className="px-4 font-semibold py-2 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((r) => (
                                <tr key={r.id} className="hover:bg-muted/10">
                                    <td className="px-4 py-2 border-b">{r.patientName}</td>
                                    <td className="px-4 py-2 border-b">{r.staffName}</td>
                                    <td className="px-4 py-2 border-b">{r.colour || "N/A"}</td>
                                    <td className="px-4 py-2 border-b">{r.frequency || "N/A"}</td>
                                    <td className="px-4 py-2 border-b">{r.totalFluidIntake ?? 0}</td>
                                    <td className="px-4 py-2 border-b">{r.totalUrineOutput ?? 0}</td>
                                    <td className="px-4 py-2 border-b">{r.date}</td>
                                    <td className="px-4 py-2 border-b">
                                        <div className="flex gap-3 justify-center">
                                            <Link
                                                href={`/urine-monitoring/view/${r.id}`}
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
                <Pagination totalPages={totalPages} handlePrevPage={handlePrevPage} handleNextPage={handleNextPage} currentPage={currentPage} itemsPerPage={itemsPerPage} onItemsPerPageChange={(size) => { setItemsPerPage(size); setCurrentPage(1) }} />

            </PageContainer>

        </div>
    );
}
