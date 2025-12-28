"use client"

import { useEffect, useState } from "react"
import axiosClient from "@/lib/axiosClient"
import PageContainer from "@/components/PageContainer"
import Footer from "@/components/Footer"
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Eye } from "lucide-react"

export default function PainComfortAssessmentListPage() {
    const [assessments, setAssessments] = useState<any[]>([])
    const [page, setPage] = useState(1)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const res = await axiosClient.get("/pain-comfort-assessments")
        setAssessments(res.data.data)
    }

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage mainPage={true} title="Pain & Comfort Assessment" subtitle="All assessments" linkCreate="/pain-comfort-assessments/create" />

            <PageContainer title="Assessments" subtitle="Pain & comfort records">
                <div className="overflow-x-auto bg-card rounded-2xl shadow-lg border border-border hover:shadow-xl transition-shadow">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-foreground border-b border-border">
                            <tr>
                                <th className="p-4 text-left font-semibold">Patient</th>
                                <th className="p-4 text-center font-semibold">Pain Score</th>
                                <th className="p-4 font-semibold">Location</th>
                                <th className="p-4 text-center font-semibold">Date</th>
                                <th className="p-4 text-center font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assessments.map((a) => (
                                <tr
                                    key={a.id}
                                    className="border-b border-border hover:bg-muted/30 transition-colors"
                                >
                                    <td className="p-4 font-medium text-foreground">
                                        {a.patientName}
                                    </td>

                                    <td className="p-4 text-center text-muted-foreground">
                                        {a.painScore}/10
                                    </td>

                                    <td className="p-4 text-muted-foreground">
                                        {a.painLocation}
                                    </td>

                                    <td className="p-4 text-center text-muted-foreground">
                                        {new Date(a.timestamp).toLocaleDateString()}
                                    </td>

                                    <td className="p-4">
                                        <div className="flex gap-3 justify-center">
                                            <Link
                                                href={`/pain-comfort-assessments/view/${a.id}`}
                                                className="text-primary hover:text-primary/80 transition-colors p-2 hover:bg-primary/10 rounded-lg"
                                            >
                                                <Eye size={18} />
                                            </Link>

                                            {/*
                            <button
                                onClick={() => handleDelete(a.id)}
                                className="text-destructive hover:text-destructive/80 transition-colors p-2 hover:bg-destructive/10 rounded-lg"
                            >
                                <Trash2 size={18} />
                            </button>
                            */}
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
                        <ChevronLeft size={16} />
                        Previous
                    </button>
                    <span className="text-sm text-muted-foreground font-medium">Page {page}</span>
                    <button
                        onClick={() => setPage((p) => p + 1)}
                        className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl hover:bg-muted/50 transition-all font-medium"
                    >
                        Next
                        <ChevronRight size={16} />
                    </button>
                </div>

            </PageContainer>

            <Footer />
        </div>
    )
}
