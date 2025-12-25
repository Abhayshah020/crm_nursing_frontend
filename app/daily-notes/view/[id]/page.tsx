"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "next/navigation"
import AppNavbar from "@/components/AppNavbar"
import PageContainer from "@/components/PageContainer"
import Footer from "@/components/Footer"
import { Calendar, User, FileText, Clock } from "lucide-react"
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage"
import axiosClient from "@/lib/axiosClient"

export default function ViewDailyNotePage() {
    const { id } = useParams()
    const [note, setNote] = useState<any>(null)

    const handleFetch = async () => {
        try {
            const res = await axiosClient.get(`/daily-notes/${id}`);
            if (res.status === 200 || res.status === 201) {
                setNote(res.data);
            } else {
                alert("Error fetching daily note");
            }
        } catch (error) {
            alert("Error fetching daily note");
        }
    };


    useEffect(() => {
        handleFetch()
    }, [id])

    if (!note) return null

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage dontShowCreate={true} title="Daily Notes" subtitle="Manage and review all daily notes" />

            <PageContainer title="Daily Note Details" subtitle="Review care documentation">
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8 max-w-7xl space-y-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                        <User className="text-primary mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-1">Client</p>
                            <p className="font-semibold text-lg text-foreground">{note.clientName}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                        <Calendar className="text-primary mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-1">Date</p>
                            <p className="font-medium text-foreground">{note.timeStamps}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                        <FileText className="text-primary mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-1">Notes</p>
                            <p className="whitespace-pre-line text-foreground leading-relaxed">{note.notes}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t border-border">
                        <Clock size={16} />
                        <span>Created: {new Date(note.createdAt).toLocaleString()}</span>
                    </div>
                </div>
            </PageContainer>
            <Footer />
        </div>
    )
}
