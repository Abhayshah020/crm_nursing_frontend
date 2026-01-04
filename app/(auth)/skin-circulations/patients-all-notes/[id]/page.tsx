"use client";

import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";
import PageContainer from "@/components/PageContainer";
import { Pagination } from "@/components/Pagination";
import axiosClient from "@/lib/axiosClient";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SkinCirculationList() {
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
                const res = await axiosClient.get(`/skin-circulations`, {
                    params: {
                        page: currentPage,
                        limit: itemsPerPage,
                        patientId: id,
                    },
                });
                setRecords(res.data.data);
                setTotalPages(res.data.page);
            } catch (err) {
                console.error(err);
            }
        };
        fetchRecords();
    }, [currentPage, itemsPerPage])


    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage
                mainPage={true}
                linkCreate={`/skin-circulations/create-patient/${id}`}
                title="Skin & Circulation"
                subtitle="Manage all patients"
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
                                    <td className="p-3 text-center">{r.date}</td>
                                    <td className="p-3 text-center">
                                        <Link href={`/skin-circulations/view/${r.id}`} className="text-primary hover:text-primary/80 p-2 rounded-lg">
                                            <Eye size={18} />
                                        </Link>
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
