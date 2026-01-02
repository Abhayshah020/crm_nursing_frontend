"use client";

import Footer from "@/components/Footer";
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";
import PageContainer from "@/components/PageContainer";
import { Info, Status } from "@/components/ViewInfoStatus";
import axiosClient from "@/lib/axiosClient";
import { Clock, MessageCircle, User } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ViewGeneralHygieneCare() {
    const { id } = useParams()

    const [data, setData] = useState<any>(null);

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                const res = await axiosClient.get(`/general-hygiene-care/${id}`);
                if (res.status === 200) setData(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [id]);

    if (!data) return <p>Loading...</p>;

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage dontShowCreate={true} title="Manage and review all daily notes" subtitle="" />

            <PageContainer title="General Hygiene Care Details" subtitle="Review hygiene care documentation">
                <div className="bg-card rounded-3xl border border-border shadow-lg hover:shadow-xl
                transition-all p-6 sm:p-8 mx-auto space-y-8">

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
                                Date & Time
                            </p>
                            <p className="text-sm font-medium">
                                {new Date(data.timestamp).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* ================= Hygiene Activities ================= */}
                    <section className="section-card">
                        <h3 className="section-title">General Hygiene Care</h3>

                        <div className="grid sm:grid-cols-3 gap-4">
                            {[
                                { key: "sponge", label: "Sponge Bath" },
                                { key: "shower", label: "Shower" },
                                { key: "hairWash", label: "Hair Wash" },
                                { key: "oralCare", label: "Oral Care" },
                                { key: "teethCleaned", label: "Teeth Cleaned" },
                                { key: "denturesCleaned", label: "Dentures Cleaned" },
                                { key: "bedBath", label: "Bed Bath" },
                            ].map((item) => (
                                <Status
                                    key={item.key}
                                    label={item.label}
                                    value={Boolean(data[item.key as keyof typeof data])}
                                />
                            ))}
                        </div>
                    </section>

                    {/* ================= Staff & Comments ================= */}
                    {(data.comments || data.staffName) && (
                        <section className="section-card">
                            <h3 className="section-title">Additional Information</h3>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {data.staffName && (
                                    <Info label="Staff Name" value={data.staffName} />
                                )}

                                {data.comments && (
                                    <div className="space-y-1">
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                            Comments
                                        </p>
                                        <p className="text-sm whitespace-pre-line">
                                            {data.comments}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* ================= Footer ================= */}
                    <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground pt-4 border-t">
                        <div className="flex gap-1 items-center">
                            <Clock size={16} />
                            <span>
                                Time Stamp: {new Date(data.timestamp).toLocaleString()}
                            </span>
                        </div>

                        <div className="flex gap-1 items-center">
                            <User size={16} />
                            <span>
                                Created: {data.createdBy}
                            </span>
                        </div>

                    </div>
                </div>

            </PageContainer>

            
        </div>
    );
}
