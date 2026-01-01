"use client"

import Footer from "@/components/Footer"
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage"
import PageContainer from "@/components/PageContainer"
import axiosClient from "@/lib/axiosClient"
import { ChevronLeft, ChevronRight, Eye } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function CoreVitalSignsTablePage() {
    const [vitals, setVitals] = useState<any[]>([])
    const [page, setPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filter, setFilter] = useState("");   
 const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    
    const handleFetch = async () => {
        try {
            const res = await axiosClient.get("/core-vital-signs", {
                params: { page, limit: 10 },
            })
            if (res.status === 200 || res.status === 201) {
                setVitals(res.data.data)
            } else {
                alert("Error fetching core vital signs")
            }
        } catch (error) {
            alert("Error fetching core vital signs")
        }
    }

    useEffect(() => {
        handleFetch()
    }, [page])

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage
                linkCreate="/core-vital-signs/create"
                title="Core Vital Signs"
                subtitle="Manage and review all core vital records"
            />

            <PageContainer title="Core Vital Signs" subtitle="View all vital measurements">

                <div className="bg-card rounded-2xl shadow-lg border p-6 max-w-7xl overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-foreground border-b border-border">
                            <tr>
                                <th className="p-4 text-left font-semibold">Patient</th>
                                <th className="p-4 font-semibold">Temp</th>
                                <th className="p-4 font-semibold">Pulse</th>
                                <th className="p-4 font-semibold">BP</th>
                                <th className="p-4 font-semibold">Resp</th>
                                <th className="p-4 font-semibold">O₂ Sat</th>
                                <th className="p-4 font-semibold">Timestamp</th>
                                <th className="p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vitals.map((v) => (
                                <tr key={v.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                                    <td className="p-4 font-medium text-foreground">{v.patientName}</td>
                                    <td className="p-4 text-muted-foreground">{v.temperature} ({v.temperatureNote})</td>
                                    <td className="p-4 text-muted-foreground">{v.pulseRate} ({v.pulseNote})</td>
                                    <td className="p-4 text-muted-foreground">{v.bloodPressureSystolic}/{v.bloodPressureDiastolic} ({v.bloodPressurePosition})</td>
                                    <td className="p-4 text-muted-foreground">{v.respiratoryRate} ({v.respiratoryNote})</td>
                                    <td className="p-4 text-muted-foreground">{v.oxygenSaturation} ({v.oxygenNote})</td>
                                    <td className="p-4 text-center text-muted-foreground">{new Date(v.timestamp).toLocaleString()}</td>
                                    <td className="p-4">
                                        <div className="flex gap-3 justify-center">
                                            <Link
                                                href={`/core-vital-signs/view/${v.id}`}
                                                className="text-primary hover:text-primary/80 transition-colors p-2 hover:bg-primary/10 rounded-lg"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {vitals.length === 0 && (
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
    )
}
