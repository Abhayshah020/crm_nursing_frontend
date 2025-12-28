"use client";

import { useEffect, useState } from "react";
import PageContainer from "@/components/PageContainer";
import axiosClient from "@/lib/axiosClient";
import Link from "next/link";
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";
import Footer from "@/components/Footer";
import { Eye } from "lucide-react";

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
}

export default function UrineMonitoringTable() {
    const [records, setRecords] = useState<UrineMonitoringType[]>([]);

    const fetchRecords = async () => {
        try {
            const res = await axiosClient.get("/urine-monitoring");
            if (res.status === 200) {
                setRecords(res.data);
            }
        } catch (err) {
            console.error("Error fetching urine monitoring records:", err);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage mainPage={true} linkCreate="/urine-monitoring/create" title="Skin & Circulation" subtitle="Manage all patients" />

            <PageContainer title="Urine Monitoring Records" subtitle="All patients' urine monitoring">
                <div className="bg-card rounded-2xl shadow-lg border p-6 max-w-7xl overflow-x-auto">
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="bg-muted/50 text-left">
                                <th className="px-4 py-2 border-b">Patient</th>
                                <th className="px-4 py-2 border-b">Staff</th>
                                <th className="px-4 py-2 border-b">Timestamp</th>
                                <th className="px-4 py-2 border-b">Reason</th>
                                <th className="px-4 py-2 border-b">Colour</th>
                                <th className="px-4 py-2 border-b">Clarity</th>
                                <th className="px-4 py-2 border-b">Dysuria</th>
                                <th className="px-4 py-2 border-b">Frequency</th>
                                <th className="px-4 py-2 border-b">Fluid Intake (ml)</th>
                                <th className="px-4 py-2 border-b">Urine Output (ml)</th>
                                <th className="px-4 py-2 border-b">Balance</th>
                                <th className="px-4 py-2 border-b">Continence</th>
                                <th className="px-4 py-2 border-b">Catheter</th>
                                <th className="px-4 py-2 border-b">RN/GP Notified</th>
                                <th className="px-4 py-2 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((r) => (
                                <tr key={r.id} className="hover:bg-muted/10">
                                    <td className="px-4 py-2 border-b">{r.patientName}</td>
                                    <td className="px-4 py-2 border-b">{r.staffName}</td>
                                    <td className="px-4 py-2 border-b">{new Date(r.timestamp).toLocaleString()}</td>
                                    <td className="px-4 py-2 border-b">
                                        {Object.entries(r.reasonForCharting)
                                            .filter(([_, v]) => v)
                                            .map(([k]) => k)
                                            .join(", ") || "N/A"}
                                    </td>
                                    <td className="px-4 py-2 border-b">{r.colour || "N/A"}</td>
                                    <td className="px-4 py-2 border-b">{r.clarity || "N/A"}</td>
                                    <td className="px-4 py-2 border-b">{r.dysuria ? "Yes" : "No"}</td>
                                    <td className="px-4 py-2 border-b">{r.frequency || "N/A"}</td>
                                    <td className="px-4 py-2 border-b">{r.totalFluidIntake ?? 0}</td>
                                    <td className="px-4 py-2 border-b">{r.totalUrineOutput ?? 0}</td>
                                    <td className="px-4 py-2 border-b">{r.balance || "N/A"}</td>
                                    <td className="px-4 py-2 border-b">{r.continenceStatus || "N/A"}</td>
                                    <td className="px-4 py-2 border-b">{r.catheterType || "N/A"}</td>
                                    <td className="px-4 py-2 border-b">{r.rnGpManagerNotified ? "Yes" : "No"}</td>
                                    {/* <td className="px-4 py-2 border-b">
                                        <Link href={`/urine-monitoring/view/${r.id}`} className="text-primary hover:underline mr-2">
                                            View

                                        </Link>
                                    </td> */}
                                    <td className="px-4 py-2 border-b">
                                        <div className="flex gap-3 justify-center">
                                            <Link
                                                href={`/urine-monitoring/view/${r.id}`}
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
            </PageContainer>
            <Footer />
        </div>
    );
}
