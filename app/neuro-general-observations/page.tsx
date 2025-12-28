"use client";

import { useState, useEffect } from "react";
import PageContainer from "@/components/PageContainer";
import axiosClient from "@/lib/axiosClient";
import Link from "next/link";
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";
import Footer from "@/components/Footer";
import { Eye } from "lucide-react";

export default function NeuroObservationsTable() {
    const [observations, setObservations] = useState<any[]>([]);

    useEffect(() => {
        fetchObservations();
    }, []);

    const fetchObservations = async () => {
        try {
            const res = await axiosClient.get("/neuro-general-observations");
            if (res.status === 200) setObservations(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage mainPage={true} linkCreate="/neuro-general-observations/create" title="Neurological Observations" subtitle="Manage and review all neurological observations" />

            <PageContainer title="Neurological Observations" subtitle="List of all observations">
                <div className="bg-card rounded-2xl shadow border overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 border-b border-border">
                            <tr>
                                <th className="p-3 text-left">Patient</th>
                                <th className="p-3">Level of Consciousness</th>
                                <th className="p-3">Orientation</th>
                                <th className="p-3">Speech</th>
                                <th className="p-3">Pupils</th>
                                <th className="p-3">Date</th>
                                <th className="p-4 font-semibold">Actions</th>

                            </tr>
                        </thead>
                        <tbody>
                            {observations.map(obs => (
                                <tr key={obs.id} className="border-t hover:bg-muted/30">
                                    <td className="p-3">
                                        {obs.patientName}
                                    </td>
                                    <td className="p-3 text-center">{obs.levelOfConsciousness}</td>
                                    <td className="p-3 text-center">{obs.orientation}</td>
                                    <td className="p-3 text-center">{obs.speech}</td>
                                    <td className="p-3 text-center">{obs.pupils}</td>
                                    <td className="p-3 text-center">{new Date(obs.timestamp).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <div className="flex gap-3 justify-center">
                                            <Link
                                                href={`/neuro-general-observations/view/${obs.id}`}
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
