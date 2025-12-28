"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axiosClient from "@/lib/axiosClient"
import PageContainer from "@/components/PageContainer"
import Footer from "@/components/Footer"
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage"
import { User, MapPin, Activity, Clock } from "lucide-react"

export default function ViewPainComfortAssessmentPage() {
    const { id } = useParams()
    const [data, setData] = useState<any>(null)

    useEffect(() => {
        if (id) fetchData()
    }, [id])

    const fetchData = async () => {

        try {
            const res = await axiosClient.get(`/pain-comfort-assessments/${id}`)

            if (res.status === 200) {
                setData(res.data.data)

            }
        } catch (err) {
            console.error("Error fetching patients:", err);
        }
    }

    if (!data) return null

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage title="Pain & Comfort Assessment" subtitle="View details" dontShowCreate />

            <PageContainer title="Pain & Comfort Assessment" subtitle="Review clinical pain record">
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8 max-w-7xl space-y-6 hover:shadow-xl transition-shadow">

                    {/* Patient Info */}
                    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                        <User className="text-primary mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-1">Patient</p>
                            <p className="font-semibold text-lg text-foreground">{data.patientName}</p>
                        </div>
                    </div>

                    {/* Pain Score & Location */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-muted/30 p-4 rounded-xl">
                            <p className="text-sm text-muted-foreground mb-1">Pain Score</p>
                            <p className="text-lg font-bold text-foreground">{data.painScore}/10</p>
                        </div>
                        <div className="bg-muted/30 p-4 rounded-xl flex items-center gap-2">
                            <MapPin className="text-primary" size={18} />
                            <span className="text-foreground">{data.painLocation}</span>
                        </div>
                    </div>

                    {/* Pain Description */}
                    <div className="bg-muted/30 p-4 rounded-xl flex items-center gap-2">
                        <Activity className="text-primary" size={18} />
                        <span className="text-foreground">{data.painDescription}</span>
                    </div>

                    {/* Pain Management */}
                    <div className="bg-muted/30 p-4 rounded-xl">
                        <p className="text-sm text-muted-foreground mb-1">Pain Management Required</p>
                        <p className="text-foreground font-medium">{data.painManagementRequired ? "Yes" : "No"}</p>
                    </div>

                    {/* Action Taken */}
                    <div className="bg-muted/30 p-4 rounded-xl">
                        <p className="text-sm text-muted-foreground mb-1">Action Taken</p>
                        <p className="text-foreground font-medium">{data.actionTaken}</p>
                    </div>

                    {/* Comments */}
                    <div className="bg-muted/30 p-4 rounded-xl whitespace-pre-line">
                        <p className="text-sm text-muted-foreground mb-1">Comments</p>
                        <p className="text-foreground leading-relaxed">{data.comments}</p>
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground border-t border-border pt-4">
                        <Clock size={16} />
                        <span>Recorded: {new Date(data.timestamp).toLocaleString()}</span>
                    </div>
                </div>
            </PageContainer>

            <Footer />
        </div>
    )
}
