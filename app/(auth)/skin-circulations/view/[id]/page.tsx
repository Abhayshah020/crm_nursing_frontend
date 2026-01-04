"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageContainer from "@/components/PageContainer";
import { User, Clock, MessageCircle } from "lucide-react";
import axiosClient from "@/lib/axiosClient";

export default function ViewSkinCirculation() {
    const { id } = useParams();
    const [data, setData] = useState<any>(null);

    const fetchRecord = async () => {
        try {
            const res = await axiosClient.get(`/skin-circulations/${id}`);
            if (res.status === 200) setData(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (id) fetchRecord();
    }, [id]);

    if (!data) return <p>Loading...</p>;

    return (
        <PageContainer title="Skin & Circulation Details" subtitle="Patient clinical record">
            <div className="bg-card rounded-2xl shadow-lg border p-6 space-y-4 hover:shadow-xl transition-shadow">

                {/* Patient */}
                <div className="flex gap-3 bg-muted/30 p-4 rounded-xl">
                    <User className="text-primary" />
                    <div>
                        <p className="text-sm text-muted-foreground">Patient</p>
                        <p className="font-semibold">{data.patientName}</p>
                    </div>
                </div>

                {/* Skin colour & temperature */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-muted/30 p-4 rounded-xl text-center">
                        <p className="text-sm text-muted-foreground">Skin Colour</p>
                        <p className="text-lg font-bold">{data.skinColour}</p>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-xl text-center">
                        <p className="text-sm text-muted-foreground">Skin Temperature</p>
                        <p className="text-lg font-bold">{data.skinTemperature}</p>
                    </div>
                </div>

                {/* Integrity & capillary refill */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-muted/30 p-4 rounded-xl text-center">
                        <p className="text-sm text-muted-foreground">Skin Integrity Issues</p>
                        <p className="text-lg font-bold">
                            {data.skinIntegrityIssues || "None"}
                        </p>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-xl text-center">
                        <p className="text-sm text-muted-foreground">Capillary Refill</p>
                        <p className="text-lg font-bold">
                            {data.capillaryRefill || "Not Assessed"}
                        </p>
                    </div>
                </div>

                {/* Comment & staff */}
                <div className="grid sm:grid-cols-2 gap-4">
                    {data.comments && (
                        <div className="flex gap-3 bg-muted/30 p-4 rounded-xl">
                            <MessageCircle className="text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Comment</p>
                                <p className="font-semibold">{data.comments}</p>
                            </div>
                        </div>
                    )}

                    {data.staffName && (
                        <div className="flex gap-3 bg-muted/30 p-4 rounded-xl">
                            <User className="text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Staff Name</p>
                                <p className="font-semibold">{data.staffName}</p>
                            </div>
                        </div>
                    )}
                </div>

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
    );
}
