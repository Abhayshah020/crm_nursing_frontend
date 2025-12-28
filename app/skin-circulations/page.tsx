"use client";

import { useState, useEffect } from "react";
import PageContainer from "@/components/PageContainer";
import Link from "next/link";
import { Eye } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import Footer from "@/components/Footer";
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";

export default function SkinCirculationList() {
    const [records, setRecords] = useState<any[]>([]);
    const [page, setPage] = useState(1);

    const fetchRecords = async () => {
        try {
            const res = await axiosClient.get(`/skin-circulations?page=${page}&limit=10`);
            if (res.status === 200) setRecords(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, [page]);

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage mainPage={true} linkCreate="/skin-circulations/create" title="Skin & Circulation" subtitle="Manage all patients" />

            <PageContainer title="Skin & Circulation Records" subtitle="View all patient records">
                <div className="bg-card rounded-2xl shadow border overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-foreground border-b border-border">
                            <tr>
                                <th className="p-3 text-left">Patient</th>
                                <th className="p-3 text-center">Skin Colour</th>
                                <th className="p-3 text-center">Temperature</th>
                                <th className="p-3 text-center">Capillary Refill</th>
                                <th className="p-3 text-center">Date</th>
                                <th className="p-3 text-center">Actions</th>
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
                                    <td className="p-3 text-center">{new Date(r.timestamp).toLocaleDateString()}</td>
                                    <td className="p-3 text-center">
                                        <Link href={`/skin-circulations/view/${r.id}`} className="text-primary hover:text-primary/80 p-2 rounded-lg">
                                            <Eye size={18} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-center items-center gap-4 mt-6">
                    <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-4 py-2 border rounded-xl hover:bg-muted/50 disabled:opacity-50">
                        Previous
                    </button>
                    <span className="text-sm text-muted-foreground font-medium">Page {page}</span>
                    <button onClick={() => setPage(page + 1)} className="px-4 py-2 border rounded-xl hover:bg-muted/50">
                        Next
                    </button>
                </div>
            </PageContainer>
            <Footer />
        </div>
    );
}
