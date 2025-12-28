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

    const handleFetch = async () => {
        try {
            const res = await axiosClient.get("/core-vital-signs", {
                params: { page, limit: 10 },
            })
            if (res.status === 200 || res.status === 201) {
                setVitals(res.data)
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

                <div className="overflow-x-auto bg-card rounded-2xl shadow-lg border border-border hover:shadow-xl transition-shadow">
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
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl hover:bg-muted/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        <ChevronLeft size={16} /> Previous
                    </button>
                    <span className="text-sm text-muted-foreground font-medium">Page {page}</span>
                    <button
                        onClick={() => setPage((p) => p + 1)}
                        className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl hover:bg-muted/50 transition-all font-medium"
                    >
                        Next <ChevronRight size={16} />
                    </button>
                </div>

            </PageContainer>
            <Footer />
        </div>
    )
}
