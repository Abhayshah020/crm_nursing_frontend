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
            ;

            <div className="bg-card rounded-2xl shadow-lg border p-6 space-y-4 max-w-5xl hover:shadow-xl transition-shadow">

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

                {/* Timestamp */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground border-t pt-4">
                    <Clock size={16} />
                    {new Date(data.timestamp).toLocaleString()}
                </div>
            </div>
        </PageContainer>
    );
}
