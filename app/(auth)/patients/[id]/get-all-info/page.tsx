"use client"

import Footer from "@/components/Footer"
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage"
import PageContainer from "@/components/PageContainer"
import { useToast } from "@/components/toast/ToastContext"
import { InfoCard } from "@/components/ViewInfoStatus"
import axiosClient from "@/lib/axiosClient"
import {
    User,
    HeartPulse,
    ClipboardList,
    Activity,
    Droplet,
    Brain,
    Bath,
    FileText,
    Clock
} from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function ViewPatientFullProfilePage() {
    const { id } = useParams()
    const [data, setData] = useState<any>(null)
    const { showToast } = useToast();

    const fetchPatient = async () => {
        try {
            const res = await axiosClient.get(`/patients/${id}/full-profile`)
            if (res.status === 200) {
                setData(res.data.data)
            }
        } catch (error) {
            showToast({
                message: "Something went wrong!",
                type: "error",
            });
        }
    }

    useEffect(() => {
        if (id) fetchPatient()
    }, [id])

    if (!data) return null

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage
                dontShowCreate
                title="Patient Overview"
                subtitle="Complete medical and care records"
            />

            <PageContainer title={data.name} subtitle="Patient Full Profile">
                <div className="bg-card rounded-2xl shadow-lg border p-6 space-y-6">

                    {/* Patient Info */}
                    <InfoCard icon={User} title="Patient Details">
                        <p className="font-semibold">{data.name}</p>
                        <p className="text-sm">Age: {data.age}</p>
                        <p className="text-sm">{data.email}</p>
                        <p className="text-sm">{data.address}</p>
                    </InfoCard>

                    {/* Care Plan */}
                    {data.carePlan && (
                        <InfoCard icon={ClipboardList} title="Care Plan">
                            <p>Status: {data.carePlan.status}</p>
                            <p>Doctor: {data.carePlan.medicalDoctorName}</p>
                        </InfoCard>
                    )}

                    {/* Daily Notes */}
                    {data.dailyNote && (
                        <InfoCard icon={FileText} title="Daily Notes">
                            <p className="whitespace-pre-line">
                                {data.dailyNote.notes}
                            </p>
                        </InfoCard>
                    )}

                    {/* Vital Signs */}
                    {data.coreVitalSigns && (
                        <InfoCard icon={HeartPulse} title="Core Vital Signs">
                            <p>Temperature: {data.coreVitalSigns.temperature} °C</p>
                            <p>Pulse: {data.coreVitalSigns.pulseRate}</p>
                            <p>
                                BP: {data.coreVitalSigns.bloodPressureSystolic}/
                                {data.coreVitalSigns.bloodPressureDiastolic}
                            </p>
                        </InfoCard>
                    )}

                    {/* Pain Assessment */}
                    {data.painComfortAssessment && (
                        <InfoCard icon={Activity} title="Pain Assessment">
                            <p>Pain Score: {data.painComfortAssessment.painScore}/10</p>
                            <p>{data.painComfortAssessment.comments}</p>
                        </InfoCard>
                    )}

                    {/* Food & Fluid */}
                    {data.foodFluidIntake && (
                        <InfoCard icon={Droplet} title="Food & Fluid Intake">
                            <p>Total Fluid: {data.foodFluidIntake.totalFluid} ml</p>
                            <p>{data.foodFluidIntake.foodDescription}</p>
                        </InfoCard>
                    )}

                    {/* Neuro Observation */}
                    {data.neuroGeneralObservation && (
                        <InfoCard icon={Brain} title="Neurological Observation">
                            <p>Consciousness: {data.neuroGeneralObservation.levelOfConsciousness}</p>
                            <p>Speech: {data.neuroGeneralObservation.speech}</p>
                        </InfoCard>
                    )}

                    {/* Hygiene */}
                    {data.generalHygieneCare && (
                        <InfoCard icon={Bath} title="General Hygiene Care">
                            <p>Shower: {data.generalHygieneCare.shower ? "Yes" : "No"}</p>
                            <p>Oral Care: {data.generalHygieneCare.oralCare ? "Yes" : "No"}</p>
                        </InfoCard>
                    )}
                    <div className="flex gap-3">
                        <div className="flex-1 flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                            <Clock className="text-primary mt-1" size={20} />
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground mb-1">Admission Date</p>
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
    )
}
