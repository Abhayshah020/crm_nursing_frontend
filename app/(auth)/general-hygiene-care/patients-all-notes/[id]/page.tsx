"use client";

import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";
import PageContainer from "@/components/PageContainer";
import axiosClient from "@/lib/axiosClient";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function GeneralHygieneCareList() {
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
                const res = await axiosClient.get("/general-hygiene-care", {
                    params: {
                        page: currentPage,
                        limit: itemsPerPage,
                        patientId: id,
                    },
                });
                setRecords(res.data.data);
                setTotalPages(res.data.total);
            } catch (err) {
                console.error(err);
            }
        };
        fetchRecords();
    }, [currentPage])

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage
                mainPage={true}
                linkCreate={`/general-hygiene-care/create-patient/${id}`}
                title="General Hygiene Care Records"
                subtitle="Manage and review"
            />

            <PageContainer title="General Hygiene Care Records" subtitle="Review hygiene documentation">
                <div className="bg-card rounded-2xl shadow-lg border p-6 max-w-7xl overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-foreground border-b border-border">
                            <tr>
                                <th className="p-3 text-left">Patient</th>
                                <th className="p-3 text-center">Sponge</th>
                                <th className="p-3 text-center">Shower</th>
                                <th className="p-3 text-center">Hair Wash</th>
                                <th className="p-3 text-center">Oral Care</th>
                                <th className="p-3 text-center">Date</th>
                                <th className="p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((r) => (
                                <tr key={r.id} className="border-t hover:bg-muted/30">
                                    <td className="p-3">
                                        {r.patientName}
                                    </td>
                                    <td className="p-3 text-center">{r.sponge ? "Sponged" : "-"}</td>
                                    <td className="p-3 text-center">{r.shower ? "Showered" : "-"}</td>
                                    <td className="p-3 text-center">{r.hairWash ? "Hair Washed" : "-"}</td>
                                    <td className="p-3 text-center">{r.oralCare ? "Oral Cared" : "-"}</td>
                                    <td className="p-3 text-center">{r.date}</td>
                                    <td className="p-4">
                                        <div className="flex gap-3 justify-center">
                                            <Link
                                                href={`/general-hygiene-care/view/${r.id}`}
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
