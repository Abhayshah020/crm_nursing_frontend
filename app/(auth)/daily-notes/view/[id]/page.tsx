"use client"

import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage"
import PageContainer from "@/components/PageContainer"
import { useToast } from "@/components/toast/ToastContext"
import axiosClient from "@/lib/axiosClient"
import { Clock, FileText, User } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function ViewDailyNotePage() {
    const { id } = useParams()
    const [data, setData] = useState<any>(null)
    const { showToast } = useToast();

    const handleFetch = async () => {
        try {
            const res = await axiosClient.get(`/daily-notes/${id}`);
            if (res.status === 200 || res.status === 201) {
                setData(res.data);
            } else {
                showToast({
                    message: "Something went wrong!",
                    type: "error",
                });
            }
        } catch (error) {
            showToast({
                message: "Something went wrong!",
                type: "error",
            });
        }
    };


    useEffect(() => {
        handleFetch()
    }, [id])

    if (!data) return null

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage dontShowCreate={true} title="Daily Notes" subtitle="Manage and review all daily notes" />

            <PageContainer title="Daily Note Details" subtitle="Review care documentation">
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8 max-w-7xl space-y-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                        <User className="text-primary mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-1">Client</p>
                            <p className="font-semibold text-lg text-foreground">{data.patientName}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                        <FileText className="text-primary mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-1">Notes</p>
                            <p className="whitespace-pre-line text-foreground leading-relaxed">{data.notes}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                        <Clock className="text-primary mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-1">Date</p>
                            <p className="font-medium text-foreground">{data.date}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                        <Clock className="text-primary mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-1">Time</p>
                            <p className="font-medium text-foreground">{data.time}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                        <Clock className="text-primary mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-1">Created By</p>
                            <p className="font-medium text-foreground">{data.createdBy}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t border-border">
                        <Clock size={16} />
                        <span>Created: {new Date(data.createdAt).toLocaleString()}</span>
                    </div>
                </div>
            </PageContainer>


        </div>
    )
}
