"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageContainer from "@/components/PageContainer";
import axiosClient from "@/lib/axiosClient";
import { Info, Status } from "@/components/ViewInfoStatus";
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";
import Footer from "@/components/Footer";

interface UrineMonitoringType {
    id: number;
    patientName: string;
    staffName: string;
    timestamp: string;
    reasonForCharting: Record<string, boolean>;
    colour: string;
    clarity: string;
    odour: string;
    otherObservations: Record<string, boolean>;
    dysuria: boolean;
    frequency: string;
    urgency: boolean;
    nocturia: boolean;
    lowerAbdominalPain: boolean;
    painNotes: string;
    continenceStatus: string;
    aidsUsed: Record<string, boolean>;
    catheterType: string;
    siteCleanAndIntact: boolean;
    bagBelowBladder: boolean;
    totalFluidIntake: number;
    totalUrineOutput: number;
    balance: string;
    redFlags: Record<string, boolean>;
    rnGpManagerNotified: boolean;
    comments: string;
}

export default function UrineMonitoringView() {
    const params = useParams();
    const { id } = params;
    const [record, setRecord] = useState<UrineMonitoringType | null>(null);

    const fetchRecord = async () => {
        try {
            const res = await axiosClient.get(`/urine-monitoring/${id}`);
            if (res.status === 200) {
                setRecord(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching record:", err);
        }
    };

    useEffect(() => {
        fetchRecord();
    }, [id]);

    if (!record) return <div>Loading...</div>;
    return (
        <div className="flex flex-col min-h-screen">

            <NavBarOfInternalPage dontShowCreate={true} title="New Neurological Observation" subtitle="Manage and review" />

            <PageContainer title="Urine Monitoring Details" subtitle={`Patient: ${record.patientName}`}>
                <div className="bg-card rounded-3xl border border-border shadow-lg hover:shadow-xl transition-all
                p-6 sm:p-8 max-w-5xl mx-auto space-y-8">

                    {/* ================= Header ================= */}
                    <div className="flex flex-wrap items-center justify-between gap-4
                    bg-muted/30 rounded-2xl p-5">
                        <div className="space-y-1">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                Patient
                            </p>
                            <p className="text-lg font-semibold text-foreground">
                                {record.patientName}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                Recorded By
                            </p>
                            <p className="text-lg font-semibold">
                                {record.staffName}
                            </p>
                        </div>

                        <div className="space-y-1 text-right">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                Date & Time
                            </p>
                            <p className="text-sm font-medium">
                                {new Date(record.timestamp).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* ================= Reason for Charting ================= */}
                    <section className="space-y-3">
                        <h3 className="section-title">Reason for Charting</h3>

                        <div className="flex flex-wrap gap-2">
                            {Object.entries(record.reasonForCharting)
                                .filter(([_, value]) => value)
                                .map(([key]) => (
                                    <span key={key} className="badge">
                                        {key.replace(/([A-Z])/g, " $1")}
                                    </span>
                                ))}

                            {!Object.values(record.reasonForCharting).some(Boolean) && (
                                <span className="text-muted-foreground text-sm">N/A</span>
                            )}
                        </div>
                    </section>

                    {/* ================= Urine Characteristics ================= */}
                    <section className="section-card">
                        <h3 className="section-title">Urine Characteristics</h3>

                        <div className="grid sm:grid-cols-3 gap-4">
                            <Info label="Colour" value={record.colour} />
                            <Info label="Clarity" value={record.clarity} />
                            <Info label="Odour" value={record.odour} />
                        </div>

                        <Info
                            label="Other Observations"
                            value={
                                Object.entries(record.otherObservations)
                                    .filter(([_, v]) => v)
                                    .map(([k]) => k)
                                    .join(", ") || "N/A"
                            }
                        />
                    </section>

                    {/* ================= Pain & Symptoms ================= */}
                    <section className="section-card">
                        <h3 className="section-title">Pain & Symptoms</h3>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <Status label="Dysuria" value={record.dysuria} />
                            <Info label="Frequency" value={record.frequency} />
                            <Status label="Urgency" value={record.urgency} />
                            <Status label="Nocturia" value={record.nocturia} />
                            <Status label="Lower Abdominal Pain" value={record.lowerAbdominalPain} />
                        </div>

                        <Info label="Pain Notes" value={record.painNotes} multiline />
                    </section>

                    {/* ================= Continence & Devices ================= */}
                    <section className="section-card">
                        <h3 className="section-title">Continence & Devices</h3>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <Info label="Continence Status" value={record.continenceStatus} />
                            <Info label="Catheter Type" value={record.catheterType} />
                            <Status label="Site Clean & Intact" value={record.siteCleanAndIntact} />
                            <Status label="Bag Below Bladder" value={record.bagBelowBladder} />
                        </div>

                        <Info
                            label="Aids Used"
                            value={
                                Object.entries(record.aidsUsed)
                                    .filter(([_, v]) => v)
                                    .map(([k]) => k)
                                    .join(", ") || "N/A"
                            }
                        />
                    </section>

                    {/* ================= Intake-Output ================= */}
                    <section className="section-card">
                        <h3 className="section-title">Intake & Output Summary</h3>

                        <div className="grid sm:grid-cols-3 gap-4">
                            <Info label="Fluid Intake" value={`${record.totalFluidIntake || 0} ml`} />
                            <Info label="Urine Output" value={`${record.totalUrineOutput || 0} ml`} />
                            <Info label="Balance" value={record.balance} />
                        </div>
                    </section>

                    {/* ================= Escalation ================= */}
                    <section className="section-card">
                        <h3 className="section-title">Escalation & Clinical Review</h3>

                        <Info
                            label="Red Flags"
                            value={
                                Object.entries(record.redFlags)
                                    .filter(([_, v]) => v)
                                    .map(([k]) => k.replace(/([A-Z])/g, " $1"))
                                    .join(", ") || "None"
                            }
                        />

                        <Status
                            label="RN / GP / Manager Notified"
                            value={record.rnGpManagerNotified}
                        />
                    </section>

                    {/* ================= Comments ================= */}
                    <section className="section-card">
                        <h3 className="section-title">Additional Comments</h3>
                        <p className="text-sm whitespace-pre-line text-foreground">
                            {record.comments || "N/A"}
                        </p>
                    </section>
                </div>

            </PageContainer>
            
        </div>
    );
}
