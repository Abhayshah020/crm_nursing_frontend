"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageContainer from "@/components/PageContainer";
import axiosClient from "@/lib/axiosClient";
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";
import Footer from "@/components/Footer";
import { Eye } from "lucide-react";

export default function GeneralHygieneCareList() {
    const [records, setRecords] = useState<any[]>([]);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const res = await axiosClient.get("/general-hygiene-care");
                if (res.status === 200) setRecords(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchRecords();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage mainPage={true} linkCreate="/general-hygiene-care/create" title="Manage and review all daily notes" subtitle="Manage and review" />

            <PageContainer title="General Hygiene Care Records" subtitle="Review hygiene documentation">
                <div className="bg-card rounded-2xl shadow border overflow-x-auto">
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
                                    <td className="p-3 text-center">{r.sponge ? "✔" : ""}</td>
                                    <td className="p-3 text-center">{r.shower ? "✔" : ""}</td>
                                    <td className="p-3 text-center">{r.hairWash ? "✔" : ""}</td>
                                    <td className="p-3 text-center">{r.oralCare ? "✔" : ""}</td>
                                    <td className="p-3 text-center">{new Date(r.timestamp).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <div className="flex gap-3 justify-center">
                                            <Link
                                                href={`/general-hygiene-care/view/${r.id}`}
                                                className="text-primary hover:text-primary/80 transition-colors p-2 hover:bg-primary/10 rounded-lg"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            {/* <button
                                                onClick={() => handleDelete(note.id)}
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
