"use client";

import Footer from "@/components/Footer";
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";
import PageContainer from "@/components/PageContainer";
import { Info, Status } from "@/components/ViewInfoStatus";
import axiosClient from "@/lib/axiosClient";
import { User, Clock } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BowelChartView() {
    const { id } = useParams<{ id: string }>();

    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosClient.get(`/bowel-charts/${id}`);
                setData(res.data);
            } catch (err) {
                console.error(err);
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
                                Date & Time
                            </p>
                            <p className="text-sm font-medium">
                                {new Date(data.timestamp).toLocaleString()}
                            </p>
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

                    {/* ================= Footer ================= */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground
                    border-t border-border pt-4">
                        <Clock size={14} />
                        <span>
                            Recorded on {new Date(data.timestamp).toLocaleString()}
                        </span>
                    </div>
                </div>

            </PageContainer>
            <Footer />
        </div>
    );
}
