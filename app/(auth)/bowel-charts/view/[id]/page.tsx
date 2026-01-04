"use client";

import Footer from "@/components/Footer";
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";
import PageContainer from "@/components/PageContainer";
import { useToast } from "@/components/toast/ToastContext";
import { Info, Status } from "@/components/ViewInfoStatus";
import axiosClient from "@/lib/axiosClient";
import { User, Clock } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BowelChartView() {
    const { id } = useParams<{ id: string }>();
    const { showToast } = useToast();

    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosClient.get(`/bowel-charts/${id}`);
                setData(res.data);
            } catch (err) {
                showToast({
                    message: "Error creating bowel chart",
                    type: "error",
                });
            }
        };
        fetchData();
    }, [id]);

    if (!data) return <div>Loading...</div>;

    return (
        <div className="flex flex-col min-h-screen">

            <NavBarOfInternalPage dontShowCreate={true} title="New Neurological Observation" subtitle="Manage and review" />

            <PageContainer title="Bowel Chart Details" subtitle="Review bowel movement record">
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
                    </div>

                    {/* ================= Bowel Motion Summary ================= */}
                    <section className="section-card">
                        <h3 className="section-title">Bowel Motion Summary</h3>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <Status label="Bowel Motion Passed" value={data.bowelMotion} />
                            <Info label="Bristol Stool Type" value={data.bristolType} />
                        </div>
                    </section>

                    {/* ================= Symptoms & Observations ================= */}
                    <section className="section-card">
                        <h3 className="section-title">Symptoms & Observations</h3>

                        <div className="grid sm:grid-cols-3 gap-4">
                            <Status label="Straining" value={data.straining} />
                            <Status label="Pain / Discomfort" value={data.painDiscomfort} />
                            <Status label="Blood / Mucus Present" value={data.bloodMucusPresent} />
                            <Status label="Incomplete Emptying" value={data.incompleteEmptying} />
                            <Status label="Unusual Odour" value={data.unusualOdour} />
                        </div>
                    </section>

                    {/* ================= Comments ================= */}
                    <section className="section-card">
                        <h3 className="section-title">Additional Comments</h3>
                        <p className="text-sm whitespace-pre-line text-foreground">
                            {data.comments || "N/A"}
                        </p>
                    </section>

                    <div className="flex gap-3">
                        <div className="flex-1 flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                            <Clock className="text-primary mt-1" size={20} />
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground mb-1">Date</p>
                                <p className="font-medium text-foreground">{data.date}</p>
                            </div>
                        </div>
                        <div className="flex-1 flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                            <Clock className="text-primary mt-1" size={20} />
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground mb-1">Time</p>
                                <p className="font-medium text-foreground">{data.time}</p>
                            </div>
                        </div>
                    </div>

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
