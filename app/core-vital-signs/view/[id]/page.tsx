"use client"

import Footer from "@/components/Footer"
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage"
import PageContainer from "@/components/PageContainer"
import axiosClient from "@/lib/axiosClient"
import { Activity, Clock, Droplet, FileText, Heart, Thermometer, User, Wind } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function ViewCoreVitalSignPage() {
    const params = useParams()
    const id = params.id as string

    const [vital, setVital] = useState<any>(null)

    useEffect(() => {
        if (id) fetchVital()
    }, [id])

    const fetchVital = async () => {
        try {
            const res = await axiosClient.get(`/core-vital-signs/${id}`)
            setVital(res.data)
        } catch (error) {
            console.error("Error fetching vital sign:", error)
        }
    }

    if (!vital) return <div>Loading...</div>

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage dontShowCreate={true} title="Core Vital Signs" subtitle="Review patient vital records" />

            <PageContainer title="Core Vital Sign Details" subtitle="View recorded vital measurements">
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8 max-w-7xl space-y-6 hover:shadow-xl transition-shadow">

                    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                        <User className="text-primary mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-1">Patient</p>
                            <p className="font-semibold text-lg text-foreground">{vital.patientName}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                        <Thermometer className="text-primary mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-1">Temperature</p>
                            <p className="text-foreground">{vital.temperature} ({vital.temperatureNote})</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                        <Heart className="text-primary mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-1">Pulse Rate</p>
                            <p className="text-foreground">{vital.pulseRate} ({vital.pulseNote})</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                        <Activity className="text-primary mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-1">Blood Pressure</p>
                            <p className="text-foreground">{vital.bloodPressureSystolic}/{vital.bloodPressureDiastolic} ({vital.bloodPressurePosition})</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                        <Wind className="text-primary mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-1">Respiratory Rate</p>
                            <p className="text-foreground">{vital.respiratoryRate} ({vital.respiratoryNote})</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                        <Droplet className="text-primary mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-1">Oxygen Saturation</p>
                            <p className="text-foreground">{vital.oxygenSaturation} ({vital.oxygenNote})</p>
                        </div>
                    </div>

                    {vital.comments && (
                        <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                            <FileText className="text-primary mt-1" size={20} />
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground mb-1">Comments</p>
                                <p className="whitespace-pre-line text-foreground leading-relaxed">{vital.comments}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t border-border">
                        <Clock size={16} />
                        <span>Recorded By: {vital.staffName} at {new Date(vital.timestamp).toLocaleString()}</span>
                    </div>

                </div>
            </PageContainer>
            <Footer />
        </div>
    )
}
