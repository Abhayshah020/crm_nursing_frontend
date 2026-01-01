"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    ArrowLeft,
    User,
    Calendar,
    Phone,
    Stethoscope,
    Heart,
    Pill,
    Activity,
    ClipboardList,
    AlertCircle,
    FileText,
    Users,
    CheckCircle2,
    XCircle,
} from "lucide-react"
import AppNavbar from "@/components/AppNavbar"
import Footer from "@/components/Footer"
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage"
import axiosClient from "@/lib/axiosClient"

interface ChronicDisease {
    id: number
    diseaseName: string
    careNeeds: string
    goals: string
    treatmentPlan: string
}

interface PartnershipRole {
    id: number
    name: string
    relationship: string
    details: string
    responsibilities: string
}

interface FormDataType {
    communication?: {
        preferredMethodOfCommunication?: string
        interpreterRequired?: boolean
        vision?: { usesVisionAids?: boolean; eyeCareRequired?: boolean }
        hearing?: { usesHearingAids?: boolean; earCareRequired?: boolean }
    }
    clinicalAssessment?: {
        medicalHistoryAndDiagnoses?: string
        baselineObservations?: {
            bloodPressure?: string
            heartRate?: number
            temperature?: number
            oxygenSaturation?: number
            respiratoryRate?: number
            bloodGlucoseLevel?: number
            painLevel?: number
        }
        allergies?: string
        historyOfCognitiveImpairment?: string
        mentalIllnessOrBehavioursOfConcern?: string
        generalCare?: {
            careNeeds?: string
            goals?: string
            treatmentPlan?: string
        }
        chronicDiseases?: {
            diseaseName?: string
            careNeeds?: string
            goals?: string
            treatmentPlan?: string
        }[]
        otherIdentifiedIssues?: {
            issueDescription?: string
            careNeeds?: string
            goals?: string
            treatmentPlan?: string
        }
    }
    medicationManagement?: {
        currentMedications?: string
        administrationMethod?: {
            requiresFullAssistance?: boolean
            promptingRequired?: boolean
            selfAdministering?: boolean
        }
        completedChecklists?: {
            selfAdministrationAssessmentForm?: boolean
            medicationPlanAndConsentForm?: boolean
            medicationRiskAssessment?: boolean
            medicationRiskIndemnityForm?: boolean
            prnIntakeChecklist?: boolean
        }
    }
    toiletingAndContinence?: {
        careNeeds?: string
        goals?: string
        bowelManagementPlan?: string
        continenceManagementPlan?: string
        potentialBowelCareRisks?: string
        toiletingAids?: string
        toiletingRegime?: string
    }
    woundCare?: {
        woundType?: string
        woundDescription?: string
        completedWoundAssessmentChart?: boolean
        completedWoundAssessmentTreatmentForm?: boolean
        treatmentFormDiscussedWithConsent?: boolean
        treatmentGoals?: string
        treatmentPlan?: string
    }
    nutrition?: {
        completedChecklists?: {
            mealtimeSupportPlan?: boolean
            severeDysphagiaManagementPlan?: boolean
            nutritionAndSwallowingRiskChecklist?: boolean
            pegOrEnteralFeedingCarePlan?: boolean
        }
        swallowingAndFeeding?: {
            difficultySwallowing?: boolean
            riskOfChoking?: boolean
            requiresNutritionalSupport?: boolean
            requiresTexturedFoods?: boolean
        }
        dietitianReview?: { reviewed?: boolean; nextReviewDate?: string }
        speechPathologistReview?: { reviewed?: boolean; nextReviewDate?: string }
        nutritionGoals?: string
        managementPlan?: string
    }
    risksAndEmergencyManagement?: {
        potentialRisksAndIncidentManagement?: {
            options?: string[]
            procedures?: string[]
        }
        emergencyManagement?: { options?: string[]; procedures?: string[] }
        reportableInformationToHealthPractitioner?: string
        specificInstructionsAndConsiderations?: string
    }
    bowelCareChecklistAndPartnership?: {
        doctorsOrdersForBowelCareCompleted?: boolean
        bowelChartInPlace?: boolean
        staffTrainedAndCompetentForClientCare?: boolean
    }
    roleOfOthersInCarePlanAgreedPartnershipActions?: {
        name?: string
        relationship?: string
        details?: string
        responsibilities?: string
    }[]
    finalStep?: {
        carePlanCompletedBy?: string
        carePlanCompletedBySignature?: string
        carePlanCompletedByDate?: string
        clientAcknowledgmentName?: string
        clientAcknowledgmentSignature?: string
        clientAcknowledgmentDate?: string
        clientAdvocateName?: string
        clientAdvocateRelationship?: string
        clientAdvocateSignature?: string
        clientAdvocateDate?: string
        carePlanReview?: {
            reviewed?: boolean
            dateOfReview?: string
            reasonsForReview?: string
            namesOfPersonsInvolved?: string
            changesRequired?: boolean
            outlineChanges?: string
            responsiblePerson?: string
            clientInformed?: boolean
            carePlanUpdated?: boolean
            supervisorName?: string
        }
    }
}

interface CarePlan {
    id: number
    patientName: string
    dateOfBirth: string
    medicalDoctorName: string
    medicalDoctorContactNumber: string
    nextOfKinName: string
    nextOfKinContactNumber: string
    carePlanDevelopedDate: string
    nextCarePlanReviewDate: string
    status: string
    chronicDiseases: ChronicDisease[]
    partnershipRoles: PartnershipRole[]
    formData: FormDataType
    createdAt: string
}

const InfoRow = ({ label, value, icon: Icon }: { label: string; value: string | number | undefined; icon?: any }) => {
    if (!value) return null
    return (
        <div className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
            {Icon && <Icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
                <p className="text-base text-foreground break-words">{value}</p>
            </div>
        </div>
    )
}

const BooleanIndicator = ({
    value,
    trueLabel,
    falseLabel,
}: { value?: boolean; trueLabel?: string; falseLabel?: string }) => {
    if (value === undefined)
        return (
            <Badge variant="outline" className="bg-muted text-muted-foreground">
                Not specified
            </Badge>
        )
    return value ? (
        <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {trueLabel || "Yes"}
        </Badge>
    ) : (
        <Badge variant="outline" className="bg-muted text-muted-foreground">
            <XCircle className="w-3 h-3 mr-1" />
            {falseLabel || "No"}
        </Badge>
    )
}

const SectionCard = ({
    title,
    icon: Icon,
    children,
    className = "",
}: { title: string; icon: any; children: React.ReactNode; className?: string }) => (
    <Card className={`p-6 hover:shadow-lg transition-all duration-300 ${className}`}>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        </div>
        {children}
    </Card>
)

export default function ViewCarePlanPage() {
    const { id } = useParams()
    const router = useRouter()
    const [carePlan, setCarePlan] = useState<CarePlan | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchCarePlan = async () => {
        try {
            const res = await axiosClient.get(`/care-plans/${id}`);
            setCarePlan(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (id) fetchCarePlan()
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-muted-foreground">Loading care plan...</p>
                </div>
            </div>
        )
    }

    if (!carePlan) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
                <Card className="p-8 text-center max-w-md">
                    <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Care Plan Not Found</h2>
                    <p className="text-muted-foreground mb-6">{"The requested care plan could not be loaded."}</p>
                    <Button onClick={() => router.back()} variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Go Back
                    </Button>
                </Card>
            </div>
        )
    }

    const getStatusColor = (status: string) => {
        const statusLower = status?.toLowerCase()
        if (statusLower === "active") return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
        if (statusLower === "pending") return "bg-amber-500/10 text-amber-700 border-amber-500/20"
        if (statusLower === "completed") return "bg-blue-500/10 text-blue-700 border-blue-500/20"
        return "bg-muted text-muted-foreground border-border"
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
            <NavBarOfInternalPage dontShowCreate={true} title="Care Plans" subtitle="Manage and monitor patient care plans" />

            <div className="border-b border-border bg-card/50 backdrop-blur-sm z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                    <Badge className={getStatusColor(carePlan.status)} variant="outline">
                        Status: {carePlan.status}
                    </Badge>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    {/* Client Information */}
                    <SectionCard title="Client Information" icon={User} className="bg-card/80 backdrop-blur-sm">
                        <div className="grid md:grid-cols-2 gap-x-8">
                            <InfoRow label="Client Name" value={carePlan.patientName} icon={User} />
                            <InfoRow label="Date of Birth" value={carePlan.dateOfBirth} icon={Calendar} />
                            <InfoRow label="Medical Doctor" value={carePlan.medicalDoctorName} icon={Stethoscope} />
                            <InfoRow label="Doctor Contact" value={carePlan.medicalDoctorContactNumber} icon={Phone} />
                            <InfoRow label="Next of Kin" value={carePlan.nextOfKinName} icon={Users} />
                            <InfoRow label="Next of Kin Contact" value={carePlan.nextOfKinContactNumber} icon={Phone} />
                            <InfoRow label="Care Plan Developed" value={carePlan.carePlanDevelopedDate} icon={Calendar} />
                            <InfoRow label="Next Review Date" value={carePlan.nextCarePlanReviewDate} icon={Calendar} />
                        </div>
                    </SectionCard>

                    {/* Communication Preferences */}
                    {carePlan.formData?.communication && (
                        <SectionCard title="Communication & Accessibility" icon={FileText}>
                            <div className="space-y-4">
                                {carePlan.formData.communication.preferredMethodOfCommunication && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-2">Preferred Method</p>
                                        <p className="text-base">{carePlan.formData.communication.preferredMethodOfCommunication}</p>
                                    </div>
                                )}
                                <div className="flex flex-wrap gap-3 pt-2">
                                    <BooleanIndicator
                                        value={carePlan.formData.communication.interpreterRequired}
                                        trueLabel="Interpreter Required"
                                        falseLabel="No Interpreter Needed"
                                    />
                                    {carePlan.formData.communication.vision?.usesVisionAids && (
                                        <Badge variant="outline" className="bg-primary/5">
                                            Vision Aids Required
                                        </Badge>
                                    )}
                                    {carePlan.formData.communication.hearing?.usesHearingAids && (
                                        <Badge variant="outline" className="bg-primary/5">
                                            Hearing Aids Required
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </SectionCard>
                    )}

                    {/* Clinical Assessment */}
                    {carePlan.formData?.clinicalAssessment && (
                        <SectionCard title="Clinical Assessment" icon={Activity}>
                            <div className="space-y-6">
                                {carePlan.formData.clinicalAssessment.medicalHistoryAndDiagnoses && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Medical History & Diagnoses</h3>
                                        <p className="text-base leading-relaxed">
                                            {carePlan.formData.clinicalAssessment.medicalHistoryAndDiagnoses}
                                        </p>
                                    </div>
                                )}

                                {carePlan.formData.clinicalAssessment.baselineObservations && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Baseline Observations</h3>
                                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {carePlan.formData.clinicalAssessment.baselineObservations.bloodPressure && (
                                                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                                                    <p className="text-xs text-muted-foreground mb-1">Blood Pressure</p>
                                                    <p className="text-lg font-semibold">
                                                        {carePlan.formData.clinicalAssessment.baselineObservations.bloodPressure}
                                                    </p>
                                                </div>
                                            )}
                                            {carePlan.formData.clinicalAssessment.baselineObservations.heartRate && (
                                                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                                                    <p className="text-xs text-muted-foreground mb-1">Heart Rate</p>
                                                    <p className="text-lg font-semibold">
                                                        {carePlan.formData.clinicalAssessment.baselineObservations.heartRate} bpm
                                                    </p>
                                                </div>
                                            )}
                                            {carePlan.formData.clinicalAssessment.baselineObservations.temperature && (
                                                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                                                    <p className="text-xs text-muted-foreground mb-1">Temperature</p>
                                                    <p className="text-lg font-semibold">
                                                        {carePlan.formData.clinicalAssessment.baselineObservations.temperature}°C
                                                    </p>
                                                </div>
                                            )}
                                            {carePlan.formData.clinicalAssessment.baselineObservations.oxygenSaturation && (
                                                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                                                    <p className="text-xs text-muted-foreground mb-1">Oxygen Saturation</p>
                                                    <p className="text-lg font-semibold">
                                                        {carePlan.formData.clinicalAssessment.baselineObservations.oxygenSaturation}%
                                                    </p>
                                                </div>
                                            )}
                                            {carePlan.formData.clinicalAssessment.baselineObservations.respiratoryRate && (
                                                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                                                    <p className="text-xs text-muted-foreground mb-1">Respiratory Rate</p>
                                                    <p className="text-lg font-semibold">
                                                        {carePlan.formData.clinicalAssessment.baselineObservations.respiratoryRate} /min
                                                    </p>
                                                </div>
                                            )}
                                            {carePlan.formData.clinicalAssessment.baselineObservations.bloodGlucoseLevel && (
                                                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                                                    <p className="text-xs text-muted-foreground mb-1">Blood Glucose</p>
                                                    <p className="text-lg font-semibold">
                                                        {carePlan.formData.clinicalAssessment.baselineObservations.bloodGlucoseLevel} mg/dL
                                                    </p>
                                                </div>
                                            )}
                                            {carePlan.formData.clinicalAssessment.baselineObservations.painLevel !== undefined && (
                                                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                                                    <p className="text-xs text-muted-foreground mb-1">Pain Level</p>
                                                    <p className="text-lg font-semibold">
                                                        {carePlan.formData.clinicalAssessment.baselineObservations.painLevel}/10
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {carePlan.formData.clinicalAssessment.allergies && (
                                    <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                                        <h3 className="text-sm font-semibold text-destructive mb-2 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" />
                                            Allergies
                                        </h3>
                                        <p className="text-base">{carePlan.formData.clinicalAssessment.allergies}</p>
                                    </div>
                                )}

                                {carePlan.formData.clinicalAssessment.historyOfCognitiveImpairment && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Cognitive Impairment History</h3>
                                        <p className="text-base leading-relaxed">
                                            {carePlan.formData.clinicalAssessment.historyOfCognitiveImpairment}
                                        </p>
                                    </div>
                                )}

                                {carePlan.formData.clinicalAssessment.mentalIllnessOrBehavioursOfConcern && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Mental Health & Behaviours</h3>
                                        <p className="text-base leading-relaxed">
                                            {carePlan.formData.clinicalAssessment.mentalIllnessOrBehavioursOfConcern}
                                        </p>
                                    </div>
                                )}

                                {carePlan.formData.clinicalAssessment.generalCare && (
                                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                                        <h3 className="text-sm font-semibold text-primary mb-3">General Care Plan</h3>
                                        <div className="space-y-3">
                                            {carePlan.formData.clinicalAssessment.generalCare.careNeeds && (
                                                <div>
                                                    <p className="text-xs text-muted-foreground mb-1">Care Needs</p>
                                                    <p className="text-sm">{carePlan.formData.clinicalAssessment.generalCare.careNeeds}</p>
                                                </div>
                                            )}
                                            {carePlan.formData.clinicalAssessment.generalCare.goals && (
                                                <div>
                                                    <p className="text-xs text-muted-foreground mb-1">Goals</p>
                                                    <p className="text-sm">{carePlan.formData.clinicalAssessment.generalCare.goals}</p>
                                                </div>
                                            )}
                                            {carePlan.formData.clinicalAssessment.generalCare.treatmentPlan && (
                                                <div>
                                                    <p className="text-xs text-muted-foreground mb-1">Treatment Plan</p>
                                                    <p className="text-sm">{carePlan.formData.clinicalAssessment.generalCare.treatmentPlan}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </SectionCard>
                    )}

                    {/* Chronic Diseases */}
                    {(carePlan.chronicDiseases?.length > 0 ||
                        carePlan.formData?.clinicalAssessment?.chronicDiseases?.length > 0) && (
                            <SectionCard title="Chronic Diseases Management" icon={Heart}>
                                <div className="space-y-4">
                                    {carePlan.chronicDiseases?.map((cd) => (
                                        <div
                                            key={cd.id}
                                            className="p-5 rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 border border-border"
                                        >
                                            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                                <Heart className="w-5 h-5 text-primary" />
                                                {cd.diseaseName}
                                            </h3>
                                            <div className="space-y-3 pl-7">
                                                {cd.careNeeds && (
                                                    <div>
                                                        <p className="text-xs font-medium text-muted-foreground mb-1">Care Needs</p>
                                                        <p className="text-sm leading-relaxed">{cd.careNeeds}</p>
                                                    </div>
                                                )}
                                                {cd.goals && (
                                                    <div>
                                                        <p className="text-xs font-medium text-muted-foreground mb-1">Goals</p>
                                                        <p className="text-sm leading-relaxed">{cd.goals}</p>
                                                    </div>
                                                )}
                                                {cd.treatmentPlan && (
                                                    <div>
                                                        <p className="text-xs font-medium text-muted-foreground mb-1">Treatment Plan</p>
                                                        <p className="text-sm leading-relaxed">{cd.treatmentPlan}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {carePlan.formData?.clinicalAssessment?.chronicDiseases?.map((cd, idx) => (
                                        <div
                                            key={idx}
                                            className="p-5 rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 border border-border"
                                        >
                                            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                                <Heart className="w-5 h-5 text-primary" />
                                                {cd.diseaseName}
                                            </h3>
                                            <div className="space-y-3 pl-7">
                                                {cd.careNeeds && (
                                                    <div>
                                                        <p className="text-xs font-medium text-muted-foreground mb-1">Care Needs</p>
                                                        <p className="text-sm leading-relaxed">{cd.careNeeds}</p>
                                                    </div>
                                                )}
                                                {cd.goals && (
                                                    <div>
                                                        <p className="text-xs font-medium text-muted-foreground mb-1">Goals</p>
                                                        <p className="text-sm leading-relaxed">{cd.goals}</p>
                                                    </div>
                                                )}
                                                {cd.treatmentPlan && (
                                                    <div>
                                                        <p className="text-xs font-medium text-muted-foreground mb-1">Treatment Plan</p>
                                                        <p className="text-sm leading-relaxed">{cd.treatmentPlan}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </SectionCard>
                        )}

                    {/* Medication Management */}
                    {carePlan.formData?.medicationManagement && (
                        <SectionCard title="Medication Management" icon={Pill}>
                            <div className="space-y-5">
                                {carePlan.formData.medicationManagement.currentMedications && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Current Medications</h3>
                                        <p className="text-base leading-relaxed">
                                            {carePlan.formData.medicationManagement.currentMedications}
                                        </p>
                                    </div>
                                )}

                                {carePlan.formData.medicationManagement.administrationMethod && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Administration Method</h3>
                                        <div className="flex flex-wrap gap-2">
                                            <BooleanIndicator
                                                value={carePlan.formData.medicationManagement.administrationMethod.requiresFullAssistance}
                                                trueLabel="Full Assistance Required"
                                            />
                                            <BooleanIndicator
                                                value={carePlan.formData.medicationManagement.administrationMethod.promptingRequired}
                                                trueLabel="Prompting Required"
                                            />
                                            <BooleanIndicator
                                                value={carePlan.formData.medicationManagement.administrationMethod.selfAdministering}
                                                trueLabel="Self-Administering"
                                            />
                                        </div>
                                    </div>
                                )}

                                {carePlan.formData.medicationManagement.completedChecklists && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Completed Checklists</h3>
                                        <div className="grid sm:grid-cols-2 gap-3">
                                            {Object.entries(carePlan.formData.medicationManagement.completedChecklists).map(
                                                ([key, value]) => (
                                                    <div
                                                        key={key}
                                                        className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border"
                                                    >
                                                        {value ? (
                                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                                        ) : (
                                                            <XCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                                        )}
                                                        <span className="text-sm">
                                                            {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                                                        </span>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </SectionCard>
                    )}

                    {/* Nutrition */}
                    {carePlan.formData?.nutrition && (
                        <SectionCard title="Nutrition & Dietary Management" icon={ClipboardList}>
                            <div className="space-y-5">
                                {carePlan.formData.nutrition.swallowingAndFeeding && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                                            Swallowing & Feeding Assessment
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            <BooleanIndicator
                                                value={carePlan.formData.nutrition.swallowingAndFeeding.difficultySwallowing}
                                                trueLabel="Difficulty Swallowing"
                                            />
                                            <BooleanIndicator
                                                value={carePlan.formData.nutrition.swallowingAndFeeding.riskOfChoking}
                                                trueLabel="Risk of Choking"
                                            />
                                            <BooleanIndicator
                                                value={carePlan.formData.nutrition.swallowingAndFeeding.requiresNutritionalSupport}
                                                trueLabel="Nutritional Support Required"
                                            />
                                            <BooleanIndicator
                                                value={carePlan.formData.nutrition.swallowingAndFeeding.requiresTexturedFoods}
                                                trueLabel="Textured Foods Required"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="grid sm:grid-cols-2 gap-4">
                                    {carePlan.formData.nutrition.dietitianReview?.reviewed && (
                                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                                            <p className="text-sm font-medium mb-1">Dietitian Review</p>
                                            <p className="text-xs text-muted-foreground">
                                                Next Review: {carePlan.formData.nutrition.dietitianReview.nextReviewDate || "Not scheduled"}
                                            </p>
                                        </div>
                                    )}
                                    {carePlan.formData.nutrition.speechPathologistReview?.reviewed && (
                                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                                            <p className="text-sm font-medium mb-1">Speech Pathologist Review</p>
                                            <p className="text-xs text-muted-foreground">
                                                Next Review:{" "}
                                                {carePlan.formData.nutrition.speechPathologistReview.nextReviewDate || "Not scheduled"}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {carePlan.formData.nutrition.nutritionGoals && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Nutrition Goals</h3>
                                        <p className="text-base leading-relaxed">{carePlan.formData.nutrition.nutritionGoals}</p>
                                    </div>
                                )}

                                {carePlan.formData.nutrition.managementPlan && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Management Plan</h3>
                                        <p className="text-base leading-relaxed">{carePlan.formData.nutrition.managementPlan}</p>
                                    </div>
                                )}
                            </div>
                        </SectionCard>
                    )}

                    {/* Toileting and Continence */}
                    {carePlan.formData?.toiletingAndContinence &&
                        Object.values(carePlan.formData.toiletingAndContinence).some((v) => v) && (
                            <SectionCard title="Toileting & Continence Care" icon={FileText}>
                                <div className="space-y-4">
                                    <InfoRow label="Care Needs" value={carePlan.formData.toiletingAndContinence.careNeeds} />
                                    <InfoRow label="Goals" value={carePlan.formData.toiletingAndContinence.goals} />
                                    <InfoRow
                                        label="Bowel Management Plan"
                                        value={carePlan.formData.toiletingAndContinence.bowelManagementPlan}
                                    />
                                    <InfoRow
                                        label="Continence Management Plan"
                                        value={carePlan.formData.toiletingAndContinence.continenceManagementPlan}
                                    />
                                    <InfoRow
                                        label="Potential Risks"
                                        value={carePlan.formData.toiletingAndContinence.potentialBowelCareRisks}
                                    />
                                    <InfoRow label="Toileting Aids" value={carePlan.formData.toiletingAndContinence.toiletingAids} />
                                    <InfoRow label="Toileting Regime" value={carePlan.formData.toiletingAndContinence.toiletingRegime} />
                                </div>
                            </SectionCard>
                        )}

                    {/* Wound Care */}
                    {carePlan.formData?.woundCare && Object.values(carePlan.formData.woundCare).some((v) => v) && (
                        <SectionCard title="Wound Care Management" icon={Activity}>
                            <div className="space-y-4">
                                {carePlan.formData.woundCare.woundType && (
                                    <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
                                        <p className="text-sm font-medium text-amber-700 mb-1">Wound Type</p>
                                        <p className="text-base">{carePlan.formData.woundCare.woundType}</p>
                                    </div>
                                )}
                                <InfoRow label="Wound Description" value={carePlan.formData.woundCare.woundDescription} />
                                <InfoRow label="Treatment Goals" value={carePlan.formData.woundCare.treatmentGoals} />
                                <InfoRow label="Treatment Plan" value={carePlan.formData.woundCare.treatmentPlan} />

                                <div className="flex flex-wrap gap-2 pt-2">
                                    <BooleanIndicator
                                        value={carePlan.formData.woundCare.completedWoundAssessmentChart}
                                        trueLabel="Assessment Chart Complete"
                                    />
                                    <BooleanIndicator
                                        value={carePlan.formData.woundCare.completedWoundAssessmentTreatmentForm}
                                        trueLabel="Treatment Form Complete"
                                    />
                                    <BooleanIndicator
                                        value={carePlan.formData.woundCare.treatmentFormDiscussedWithConsent}
                                        trueLabel="Consent Obtained"
                                    />
                                </div>
                            </div>
                        </SectionCard>
                    )}

                    {/* Risk & Emergency Management */}
                    {carePlan.formData?.risksAndEmergencyManagement && (
                        <SectionCard title="Risk & Emergency Management" icon={AlertCircle}>
                            <div className="space-y-5">
                                {carePlan.formData.risksAndEmergencyManagement.potentialRisksAndIncidentManagement?.options && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Potential Risks</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {carePlan.formData.risksAndEmergencyManagement.potentialRisksAndIncidentManagement.options.map(
                                                (opt, idx) => (
                                                    <Badge
                                                        key={idx}
                                                        variant="outline"
                                                        className="bg-amber-500/5 border-amber-500/20 text-amber-700"
                                                    >
                                                        {opt}
                                                    </Badge>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}

                                {carePlan.formData.risksAndEmergencyManagement.potentialRisksAndIncidentManagement?.procedures &&
                                    carePlan.formData.risksAndEmergencyManagement.potentialRisksAndIncidentManagement.procedures.length >
                                    0 && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Risk Management Procedures</h3>
                                            <ul className="space-y-2">
                                                {carePlan.formData.risksAndEmergencyManagement.potentialRisksAndIncidentManagement.procedures.map(
                                                    (proc, idx) => (
                                                        <li key={idx} className="flex items-start gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                                            <span className="text-sm">{proc}</span>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                    )}

                                {carePlan.formData.risksAndEmergencyManagement.emergencyManagement?.options && (
                                    <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                                        <h3 className="text-sm font-semibold text-destructive mb-3 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" />
                                            Emergency Protocols
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {carePlan.formData.risksAndEmergencyManagement.emergencyManagement.options.map((opt, idx) => (
                                                <Badge
                                                    key={idx}
                                                    variant="outline"
                                                    className="bg-destructive/5 border-destructive/20 text-destructive"
                                                >
                                                    {opt}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <InfoRow
                                    label="Reportable Information to Health Practitioner"
                                    value={carePlan.formData.risksAndEmergencyManagement.reportableInformationToHealthPractitioner}
                                />
                                <InfoRow
                                    label="Specific Instructions"
                                    value={carePlan.formData.risksAndEmergencyManagement.specificInstructionsAndConsiderations}
                                />
                            </div>
                        </SectionCard>
                    )}

                    {/* Partnership Roles */}
                    {(carePlan.partnershipRoles?.length > 0 ||
                        carePlan.formData?.roleOfOthersInCarePlanAgreedPartnershipActions?.length > 0) && (
                            <SectionCard title="Care Partnership Team" icon={Users}>
                                <div className="space-y-4">
                                    {carePlan.partnershipRoles?.map((pr) => (
                                        <div
                                            key={pr.id}
                                            className="p-5 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20"
                                        >
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                                    <Users className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-semibold text-foreground">{pr.name}</h3>
                                                    <p className="text-sm text-muted-foreground">{pr.relationship}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-2 pl-13">
                                                {pr.details && (
                                                    <div>
                                                        <p className="text-xs font-medium text-muted-foreground mb-1">Details</p>
                                                        <p className="text-sm">{pr.details}</p>
                                                    </div>
                                                )}
                                                {pr.responsibilities && (
                                                    <div>
                                                        <p className="text-xs font-medium text-muted-foreground mb-1">Responsibilities</p>
                                                        <p className="text-sm">{pr.responsibilities}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {carePlan.formData?.roleOfOthersInCarePlanAgreedPartnershipActions?.map((role, idx) => (
                                        <div
                                            key={idx}
                                            className="p-5 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20"
                                        >
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                                    <Users className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-semibold text-foreground">{role.name}</h3>
                                                    <p className="text-sm text-muted-foreground">{role.relationship}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-2 pl-13">
                                                {role.details && (
                                                    <div>
                                                        <p className="text-xs font-medium text-muted-foreground mb-1">Details</p>
                                                        <p className="text-sm">{role.details}</p>
                                                    </div>
                                                )}
                                                {role.responsibilities && (
                                                    <div>
                                                        <p className="text-xs font-medium text-muted-foreground mb-1">Responsibilities</p>
                                                        <p className="text-sm">{role.responsibilities}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </SectionCard>
                        )}

                    {/* Final Signatures and Review */}
                    {carePlan.formData?.finalStep && (
                        <SectionCard title="Signatures & Review" icon={FileText}>
                            <div className="space-y-6">
                                {(carePlan.formData.finalStep.carePlanCompletedBy ||
                                    carePlan.formData.finalStep.carePlanCompletedByDate) && (
                                        <div className="p-4 rounded-lg bg-muted/30 border border-border">
                                            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Plan Completed By</h3>
                                            <div className="space-y-2">
                                                <InfoRow label="Name" value={carePlan.formData.finalStep.carePlanCompletedBy} />
                                                <InfoRow label="Date" value={carePlan.formData.finalStep.carePlanCompletedByDate} />
                                                {carePlan.formData.finalStep.carePlanCompletedBySignature && (
                                                    <div className="pt-2">
                                                        <p className="text-xs text-muted-foreground mb-2">Signature</p>
                                                        <div className="p-3 bg-background rounded border border-border">
                                                            <p className="font-serif text-lg italic">
                                                                {carePlan.formData.finalStep.carePlanCompletedBySignature}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {(carePlan.formData.finalStep.clientAcknowledgmentName ||
                                    carePlan.formData.finalStep.clientAcknowledgmentDate) && (
                                        <div className="p-4 rounded-lg bg-muted/30 border border-border">
                                            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Client Acknowledgment</h3>
                                            <div className="space-y-2">
                                                <InfoRow label="Name" value={carePlan.formData.finalStep.clientAcknowledgmentName} />
                                                <InfoRow label="Date" value={carePlan.formData.finalStep.clientAcknowledgmentDate} />
                                                {carePlan.formData.finalStep.clientAcknowledgmentSignature && (
                                                    <div className="pt-2">
                                                        <p className="text-xs text-muted-foreground mb-2">Signature</p>
                                                        <div className="p-3 bg-background rounded border border-border">
                                                            <p className="font-serif text-lg italic">
                                                                {carePlan.formData.finalStep.clientAcknowledgmentSignature}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {carePlan.formData.finalStep.carePlanReview && (
                                    <div className="p-5 rounded-lg bg-primary/5 border border-primary/20">
                                        <h3 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Care Plan Review Information
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <BooleanIndicator
                                                    value={carePlan.formData.finalStep.carePlanReview.reviewed}
                                                    trueLabel="Review Completed"
                                                />
                                                {carePlan.formData.finalStep.carePlanReview.dateOfReview && (
                                                    <span className="text-sm text-muted-foreground">
                                                        on {carePlan.formData.finalStep.carePlanReview.dateOfReview}
                                                    </span>
                                                )}
                                            </div>
                                            <InfoRow
                                                label="Review Reasons"
                                                value={carePlan.formData.finalStep.carePlanReview.reasonsForReview}
                                            />
                                            <InfoRow
                                                label="Persons Involved"
                                                value={carePlan.formData.finalStep.carePlanReview.namesOfPersonsInvolved}
                                            />
                                            <InfoRow
                                                label="Outline of Changes"
                                                value={carePlan.formData.finalStep.carePlanReview.outlineChanges}
                                            />
                                            <InfoRow
                                                label="Responsible Person"
                                                value={carePlan.formData.finalStep.carePlanReview.responsiblePerson}
                                            />
                                            <InfoRow label="Supervisor" value={carePlan.formData.finalStep.carePlanReview.supervisorName} />

                                            <div className="flex flex-wrap gap-2 pt-2">
                                                <BooleanIndicator
                                                    value={carePlan.formData.finalStep.carePlanReview.changesRequired}
                                                    trueLabel="Changes Required"
                                                />
                                                <BooleanIndicator
                                                    value={carePlan.formData.finalStep.carePlanReview.clientInformed}
                                                    trueLabel="Client Informed"
                                                />
                                                <BooleanIndicator
                                                    value={carePlan.formData.finalStep.carePlanReview.carePlanUpdated}
                                                    trueLabel="Plan Updated"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </SectionCard>
                    )}
                </div>
            </div>

            
        </div>
    )
}
