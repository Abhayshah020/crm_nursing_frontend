"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PageContainer from "@/components/PageContainer";
import axiosClient from "@/lib/axiosClient";
import Footer from "@/components/Footer";
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";
import { Eye } from "lucide-react";

export default function BowelChartTable() {
    const [records, setRecords] = useState<any[]>([]);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const res = await axiosClient.get("/bowel-charts");
                setRecords(res.data);
            } catch (err) {
                console.error("Error fetching bowel charts:", err);
            }
        };
        fetchRecords();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <NavBarOfInternalPage
                mainPage={true}
                linkCreate="/bowel-charts/create"
                title="Care Plans"
                subtitle="Manage and monitor patient care plans"
            />

            <PageContainer title="Bowel Charts" subtitle="Review all bowel movement records">
                <div className="bg-card rounded-2xl shadow border overflow-x-auto">
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
                                        {/* <Link href={`/bowel-charts/view/${r.id}`} className="text-primary hover:text-primary/80">View</Link> */}
                                        <div className="flex gap-3 justify-center">
                                            <Link
                                                href={`/bowel-charts/view/${r.id}`}
                                                className="text-primary hover:text-primary/80 transition-colors p-2 hover:bg-primary/10 rounded-lg"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            {/* <button
                                                onClick={() => handleDelete(cp.id)}
                                                className="text-destructive hover:text-destructive/80 transition-colors p-2 hover:bg-destructive/10 rounded-lg"
                                            >
                                                <Trash2 size={18} />
                                            </button> */}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </PageContainer>
            <Footer />
        </div>
    );
}
