"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageContainer from "@/components/PageContainer";
import axiosClient from "@/lib/axiosClient";
import { User, Clock } from "lucide-react";
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";
import Footer from "@/components/Footer";
import { Info } from "@/components/ViewInfoStatus";

export default function ViewNeuroObservation() {
    const { id } = useParams();
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchObservation = async () => {
            try {
                const res = await axiosClient.get(`/neuro-general-observations/${id}`);
                if (res.status === 200) setData(res.data.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchObservation();
    }, [id]);

    if (!data) return <p>Loading...</p>;

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage dontShowCreate={true} title="Daily Notes" subtitle="Manage and review all daily notes" />

            <PageContainer title="Observation Details" subtitle="Neurological & General Observations">
                <div className="bg-card rounded-3xl border border-border shadow-lg hover:shadow-xl
                transition-all p-6 sm:p-8 max-w-5xl mx-auto space-y-8">

                    {/* ================= Header ================= */}
                    <div className="flex flex-wrap items-center justify-between gap-4
                    bg-muted/30 rounded-2xl p-5">
                        <div className="flex items-center gap-3">
                            <User className="text-primary" />
                            <div className="space-y-1">
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                    Patient
                                </p>
                                <p className="text-lg font-semibold text-foreground">
                                    {data.patientName}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-1 text-right">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                Recorded At
                            </p>
                            <p className="text-sm font-medium">
                                {new Date(data.timestamp).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* ================= Neurological Findings ================= */}
                    <section className="section-card">
                        <h3 className="section-title">Neurological Assessment</h3>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <Info
                                label="Level of Consciousness"
                                value={data.levelOfConsciousness}
                            />
                            <Info
                                label="Orientation"
                                value={data.orientation}
                            />
                            <Info
                                label="Speech"
                                value={data.speech}
                            />
                            <Info
                                label="Pupils"
                                value={data.pupils}
                            />
                        </div>
                    </section>

                    {/* ================= Notes ================= */}
                    {data.comments && (
                        <section className="section-card">
                            <h3 className="section-title">Clinical Notes</h3>
                            <p className="text-sm whitespace-pre-line">
                                {data.comments}
                            </p>
                        </section>
                    )}

                    {/* ================= Staff ================= */}
                    <section className="section-card">
                        <h3 className="section-title">Recorded By</h3>
                        <Info label="Staff Name" value={data.staffName} />
                    </section>

                    {/* ================= Footer ================= */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground
                    border-t border-border pt-4">
                        <Clock size={14} />
                        <span>
                            Observation recorded on {new Date(data.timestamp).toLocaleString()}
                        </span>
                    </div>
                </div>

            </PageContainer>
            
        </div>
    );
}
