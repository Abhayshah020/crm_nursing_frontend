"use client"

import { useToast } from "@/components/toast/ToastContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axiosClient from "@/lib/axiosClient"
import {
    AlertTriangle,
    ArrowLeft,
    Badge as Bandage,
    Calendar,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Droplet,
    Ear,
    Eye,
    FileCheck,
    FileText,
    HeartPulse,
    MessageSquare,
    Phone,
    Pill,
    Save,
    Shield,
    Stethoscope,
    User,
    Users,
    Utensils,
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type FormDataType = {
    patientId: string
    patientName: string
    dateOfBirth: string
    medicalDoctorName: string
    medicalDoctorContactNumber: string
    nextOfKinName: string
    nextOfKinContactNumber: string
    carePlanDevelopedDate: string
    nextCarePlanReviewDate: string
    communication: {
        preferredMethodOfCommunication: string
        interpreterRequired: boolean
    }
    sensory: {
        vision: { usesVisionAids: boolean; eyeCareRequired: boolean }
        hearing: { usesHearingAids: boolean; earCareRequired: boolean }
    }
    clinicalAssessment: {
        medicalHistoryAndDiagnoses: string
        baselineObservations: {
            bloodPressure: string
            heartRate: number
            temperature: number
            oxygenSaturation: number
            respiratoryRate: number
            bloodGlucoseLevel: number
            painLevel: number
        }
        allergies: string
        historyOfCognitiveImpairment: string
        mentalIllnessOrBehavioursOfConcern: string
    }
    generalCare: { careNeeds: string; goals: string; treatmentPlan: string }
    chronicDiseases: Array<{ diseaseName: string; careNeeds: string; goals: string; treatmentPlan: string }>
    otherIdentifiedIssues: { issueDescription: string; careNeeds: string; goals: string; treatmentPlan: string }
    medicationManagement: {
        currentMedications: string
        administrationMethod: { requiresFullAssistance: boolean; promptingRequired: boolean; selfAdministering: boolean }
        completedChecklists: {
            selfAdministrationAssessmentForm: boolean
            medicationPlanAndConsentForm: boolean
            medicationRiskAssessment: boolean
            medicationRiskIndemnityForm: boolean
            prnIntakeChecklist: boolean
        }
    }
    toiletingAndContinence: {
        careNeeds: string
        goals: string
        bowelManagementPlan: string
        continenceManagementPlan: string
        potentialBowelCareRisks: string
        toiletingAids: string
        toiletingRegime: string
    }
    woundCare: {
        woundType: string
        woundDescription: string
        completedWoundAssessmentChart: boolean
        completedWoundAssessmentTreatmentForm: boolean
        treatmentFormDiscussedWithConsent: boolean
        treatmentGoals: string
        treatmentPlan: string
    }
    nutrition: {
        completedChecklists: {
            mealtimeSupportPlan: boolean
            severeDysphagiaManagementPlan: boolean
            nutritionAndSwallowingRiskChecklist: boolean
            pegOrEnteralFeedingCarePlan: boolean
        }
        swallowingAndFeeding: {
            difficultySwallowing: boolean
            riskOfChoking: boolean
            requiresNutritionalSupport: boolean
            requiresTexturedFoods: boolean
        }
        dietitianReview: { reviewed: boolean; nextReviewDate: string }
        speechPathologistReview: { reviewed: boolean; nextReviewDate: string }
        nutritionGoals: string
        managementPlan: string
    }
    risksAndEmergencyManagement: {
        potentialRisksAndIncidentManagement: { options: string[]; procedures: string[] }
        emergencyManagement: { options: string[]; procedures: string[] }
        reportableInformationToHealthPractitioner: string
        specificInstructionsAndConsiderations: string
    }
    bowelCareChecklistAndPartnership: {
        doctorsOrdersForBowelCareCompleted: boolean
        bowelChartInPlace: boolean
        staffTrainedAndCompetentForClientCare: boolean
    }
    roleOfOthersInCarePlanAgreedPartnershipActions: Array<{
        name: string
        relationship: string
        details: string
        responsibilities: string
    }>

    completionAndReview: {
        carePlanCompletedBy: { printedName: string; signature: string; date: string }
        clientAcknowledgment: { printedName: string; signature: string; date: string }
        clientAdvocateAcknowledgment: { printedName: string; relationship: string; signature: string; date: string }
        carePlanReviewed: boolean
        dateOfReview: string
        reasonsForReview: string
        namesOfPersonsInvolved: string
        changesToCarePlanRequired: boolean
        outlineChangesRequired: string
        personResponsibleToImplement: string
        clientOrAdvocateInformed: boolean
        carePlanUpdated: boolean
        supervisorName: string
    }
}

export default function CarePlanForm() {
    const { id } = useParams<{ id: string }>();
    const [step, setStep] = useState(1)
    const [status, setStatus] = useState<"draft" | "completed">("draft")
    const router = useRouter();
    const { showToast } = useToast();

    const [formData, setFormData] = useState<FormDataType>({
        patientId: "",
        patientName: "",
        dateOfBirth: null,
        medicalDoctorName: null,
        medicalDoctorContactNumber: null,
        nextOfKinName: null,
        nextOfKinContactNumber: null,
        carePlanDevelopedDate: null,
        nextCarePlanReviewDate: null,
        communication: { preferredMethodOfCommunication: "", interpreterRequired: false },
        sensory: {
            vision: { usesVisionAids: false, eyeCareRequired: false },
            hearing: { usesHearingAids: false, earCareRequired: false },
        },
        clinicalAssessment: {
            medicalHistoryAndDiagnoses: "",
            baselineObservations: {
                bloodPressure: "",
                heartRate: 0,
                temperature: 0,
                oxygenSaturation: 0,
                respiratoryRate: 0,
                bloodGlucoseLevel: 0,
                painLevel: 0,
            },
            allergies: "",
            historyOfCognitiveImpairment: "",
            mentalIllnessOrBehavioursOfConcern: "",
        },
        generalCare: { careNeeds: "", goals: "", treatmentPlan: "" },
        chronicDiseases: [],
        otherIdentifiedIssues: { issueDescription: "", careNeeds: "", goals: "", treatmentPlan: "" },
        medicationManagement: {
            currentMedications: "",
            administrationMethod: { requiresFullAssistance: false, promptingRequired: false, selfAdministering: false },
            completedChecklists: {
                selfAdministrationAssessmentForm: false,
                medicationPlanAndConsentForm: false,
                medicationRiskAssessment: false,
                medicationRiskIndemnityForm: false,
                prnIntakeChecklist: false,
            },
        },
        toiletingAndContinence: {
            careNeeds: "",
            goals: "",
            bowelManagementPlan: "",
            continenceManagementPlan: "",
            potentialBowelCareRisks: "",
            toiletingAids: "",
            toiletingRegime: "",
        },
        woundCare: {
            woundType: "",
            woundDescription: "",
            completedWoundAssessmentChart: false,
            completedWoundAssessmentTreatmentForm: false,
            treatmentFormDiscussedWithConsent: false,
            treatmentGoals: "",
            treatmentPlan: "",
        },
        nutrition: {
            completedChecklists: {
                mealtimeSupportPlan: false,
                severeDysphagiaManagementPlan: false,
                nutritionAndSwallowingRiskChecklist: false,
                pegOrEnteralFeedingCarePlan: false,
            },
            swallowingAndFeeding: {
                difficultySwallowing: false,
                riskOfChoking: false,
                requiresNutritionalSupport: false,
                requiresTexturedFoods: false,
            },
            dietitianReview: { reviewed: false, nextReviewDate: "" },
            speechPathologistReview: { reviewed: false, nextReviewDate: "" },
            nutritionGoals: "",
            managementPlan: "",
        },
        risksAndEmergencyManagement: {
            potentialRisksAndIncidentManagement: { options: [], procedures: [] },
            emergencyManagement: { options: [], procedures: [] },
            reportableInformationToHealthPractitioner: "",
            specificInstructionsAndConsiderations: "",
        },
        bowelCareChecklistAndPartnership: {
            doctorsOrdersForBowelCareCompleted: false,
            bowelChartInPlace: false,
            staffTrainedAndCompetentForClientCare: false,
        },
        roleOfOthersInCarePlanAgreedPartnershipActions: [],
        completionAndReview: {
            carePlanCompletedBy: { printedName: "", signature: "", date: "" },
            clientAcknowledgment: { printedName: "", signature: "", date: "" },
            clientAdvocateAcknowledgment: { printedName: "", relationship: "", signature: "", date: "" },
            carePlanReviewed: false,
            dateOfReview: "",
            reasonsForReview: "",
            namesOfPersonsInvolved: "",
            changesToCarePlanRequired: false,
            outlineChangesRequired: "",
            personResponsibleToImplement: "",
            clientOrAdvocateInformed: false,
            carePlanUpdated: false,
            supervisorName: "",
        },
    })

    const fetchPatients = async () => {
        try {
            const res = await axiosClient.get("/patients", {
                params: { id: id }
            });
            if (res.status === 200) {
                setFormData((prev) => ({
                    ...prev,
                    patientId: res.data.data.id,
                    patientName: res.data.data.name,
                }))
            };
        } catch (err) {
            showToast({
                message: "Please select a client before saving the Care Plan.",
                type: "error",
            });
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleNext = () => setStep(step + 1)
    const handlePrev = () => setStep(step - 1)

    const handleSubmit = async () => {
        try {
            const {
                patientId,
                patientName,
                dateOfBirth,
                medicalDoctorName,
                medicalDoctorContactNumber,
                chronicDiseases,
                roleOfOthersInCarePlanAgreedPartnershipActions,
                ...others
            } = formData;

            const createdBy = JSON.parse(sessionStorage.getItem("user") || "{}").id || 0;

            if (patientId === "" || patientName === "" || createdBy === 0) {
                showToast({
                    message: "Please select a client before saving the Care Plan.",
                    type: "error",
                });
                return;
            }
            const res = await axiosClient.post("/care-plans", {
                patientId,
                patientName,
                dateOfBirth,
                medicalDoctorName,
                medicalDoctorContactNumber,
                createdBy,
                chronicDiseases,
                partnershipRoles: roleOfOthersInCarePlanAgreedPartnershipActions,
                formData: others,
                status
            });
            if (res.status === 201 || res.status === 200) {
                showToast({
                    message: "Care Plan saved successfully",
                    type: "success",
                });
                router.push("/care-plans");
            } else {
                showToast({
                    message: "Error saving Care Plan",
                    type: "error",
                });
            }
        } catch (err) {
            showToast({
                message: "Error saving Care Plan",
                type: "error",
            });
        }
    };

    const steps = [
        { number: 1, title: "Client Information", icon: User },
        { number: 2, title: "Communication & Sensory", icon: MessageSquare },
        { number: 3, title: "Clinical Assessment", icon: HeartPulse },
        { number: 4, title: "General Care", icon: Stethoscope },
        { number: 5, title: "Chronic Diseases", icon: FileText },
        { number: 6, title: "Medication", icon: Pill },
        { number: 7, title: "Toileting & Continence", icon: Droplet },
        { number: 8, title: "Wound Care", icon: Bandage },
        { number: 9, title: "Checklist & Role", icon: Utensils },
        { number: 10, title: "Completion", icon: AlertTriangle },
        { number: 11, title: "Review", icon: CheckCircle2 },
    ]

    const totalSteps = steps.length
    const progress = (step / totalSteps) * 100

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50">

            <main className="flex-1">

                <div className="bg-white/80 backdrop-blur-md border-b border-blue-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <Button onClick={() => router.back()} variant="ghost" size="icon" className="hover:bg-primary/10">
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Create Care Plan
                                </h1>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Step {step} of {totalSteps}: {steps[step - 1].title}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => handleSubmit()}>
                                    <Save className="w-4 h-4" />
                                    Save Draft
                                </Button>
                            </div>
                        </div>

                        <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                        {step === 1 && (
                            <Card className="border-blue-100 shadow-lg">
                                <CardHeader className="border-b">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <User className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <CardTitle>Client Information</CardTitle>
                                            <CardDescription>Basic information about the client</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="clientName" className="text-sm font-medium flex items-center gap-2">
                                                <User className="w-4 h-4 text-blue-600" />
                                                Client Name
                                            </Label>
                                            <input
                                                id="clientName"
                                                value={formData.patientName}
                                                // onChange={(e) => {
                                                //     const selectedPatient = patients.find((patient) => patient.name === e.target.value);
                                                //     setFormData((prev) => ({
                                                //         ...prev,
                                                //         patientName: e.target.value,
                                                //         patientId: selectedPatient ? selectedPatient.id : "",
                                                //     }));
                                                // }}
                                                readOnly
                                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="dateOfBirth" className="text-sm font-medium flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-blue-600" />
                                                Date of Birth
                                            </Label>
                                            <Input
                                                id="dateOfBirth"
                                                type="date"
                                                value={formData.dateOfBirth || ""}
                                                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                                className="transition-all focus:scale-[1.01]"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="medicalDoctorName" className="text-sm font-medium flex items-center gap-2">
                                                <Stethoscope className="w-4 h-4 text-blue-600" />
                                                Medical Doctor Name
                                            </Label>
                                            <Input
                                                id="medicalDoctorName"
                                                placeholder="Enter doctor name"
                                                value={formData.medicalDoctorName || ""}
                                                onChange={(e) => setFormData({ ...formData, medicalDoctorName: e.target.value })}
                                                className="transition-all focus:scale-[1.01]"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="medicalDoctorContact" className="text-sm font-medium flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-blue-600" />
                                                Doctor Contact Number
                                            </Label>
                                            <Input
                                                id="medicalDoctorContact"
                                                placeholder="Enter contact number"
                                                value={formData.medicalDoctorContactNumber || ""}
                                                onChange={(e) => setFormData({ ...formData, medicalDoctorContactNumber: e.target.value })}
                                                className="transition-all focus:scale-[1.01]"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="nextOfKinName" className="text-sm font-medium flex items-center gap-2">
                                                <User className="w-4 h-4 text-blue-600" />
                                                Next of Kin Name
                                            </Label>
                                            <Input
                                                id="nextOfKinName"
                                                placeholder="Enter next of kin name"
                                                value={formData.nextOfKinName || ""}
                                                onChange={(e) => setFormData({ ...formData, nextOfKinName: e.target.value })}
                                                className="transition-all focus:scale-[1.01]"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="nextOfKinContact" className="text-sm font-medium flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-blue-600" />
                                                Next of Kin Contact
                                            </Label>
                                            <Input
                                                id="nextOfKinContact"
                                                placeholder="Enter contact number"
                                                value={formData.nextOfKinContactNumber || ""}
                                                onChange={(e) => setFormData({ ...formData, nextOfKinContactNumber: e.target.value })}
                                                className="transition-all focus:scale-[1.01]"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="carePlanDate" className="text-sm font-medium flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-blue-600" />
                                                Care Plan Developed Date
                                            </Label>
                                            <Input
                                                id="carePlanDate"
                                                type="date"
                                                value={formData.carePlanDevelopedDate || ""}
                                                onChange={(e) => setFormData({ ...formData, carePlanDevelopedDate: e.target.value })}
                                                className="transition-all focus:scale-[1.01]"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="reviewDate" className="text-sm font-medium flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-blue-600" />
                                                Next Review Date
                                            </Label>
                                            <Input
                                                id="reviewDate"
                                                type="date"
                                                value={formData.nextCarePlanReviewDate || ""}
                                                onChange={(e) => setFormData({ ...formData, nextCarePlanReviewDate: e.target.value })}
                                                className="transition-all focus:scale-[1.01]"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {step === 2 && (
                            <Card className="border-blue-100 shadow-lg">
                                <CardHeader className="border-b">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <MessageSquare className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <CardTitle>Communication & Sensory</CardTitle>
                                            <CardDescription>Communication preferences and sensory needs</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-8">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg flex items-center gap-2">
                                            <MessageSquare className="w-5 h-5 text-blue-600" />
                                            Communication
                                        </h3>
                                        <div className="space-y-4 pl-7">
                                            <div className="space-y-2">
                                                <Label htmlFor="commMethod">Preferred Method of Communication</Label>
                                                <Input
                                                    id="commMethod"
                                                    placeholder="e.g., Verbal, Sign Language, Written"
                                                    value={formData.communication.preferredMethodOfCommunication}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            communication: {
                                                                ...formData.communication,
                                                                preferredMethodOfCommunication: e.target.value,
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>

                                            <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
                                                <Checkbox
                                                    id="interpreter"
                                                    checked={formData.communication.interpreterRequired}
                                                    onCheckedChange={(checked) =>
                                                        setFormData({
                                                            ...formData,
                                                            communication: {
                                                                ...formData.communication,
                                                                interpreterRequired: checked as boolean,
                                                            },
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="interpreter" className="cursor-pointer">
                                                    Interpreter Required
                                                </Label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg flex items-center gap-2">
                                            <Eye className="w-5 h-5 text-blue-600" />
                                            Vision
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                                            <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
                                                <Checkbox
                                                    id="visionAids"
                                                    checked={formData.sensory.vision.usesVisionAids}
                                                    onCheckedChange={(checked) =>
                                                        setFormData({
                                                            ...formData,
                                                            sensory: {
                                                                ...formData.sensory,
                                                                vision: {
                                                                    ...formData.sensory.vision,
                                                                    usesVisionAids: checked as boolean,
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="visionAids" className="cursor-pointer">
                                                    Uses Vision Aids
                                                </Label>
                                            </div>

                                            <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
                                                <Checkbox
                                                    id="eyeCare"
                                                    checked={formData.sensory.vision.eyeCareRequired}
                                                    onCheckedChange={(checked) =>
                                                        setFormData({
                                                            ...formData,
                                                            sensory: {
                                                                ...formData.sensory,
                                                                vision: {
                                                                    ...formData.sensory.vision,
                                                                    eyeCareRequired: checked as boolean,
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="eyeCare" className="cursor-pointer">
                                                    Eye Care Required
                                                </Label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg flex items-center gap-2">
                                            <Ear className="w-5 h-5 text-blue-600" />
                                            Hearing
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                                            <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
                                                <Checkbox
                                                    id="hearingAids"
                                                    checked={formData.sensory.hearing.usesHearingAids}
                                                    onCheckedChange={(checked) =>
                                                        setFormData({
                                                            ...formData,
                                                            sensory: {
                                                                ...formData.sensory,
                                                                hearing: {
                                                                    ...formData.sensory.hearing,
                                                                    usesHearingAids: checked as boolean,
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="hearingAids" className="cursor-pointer">
                                                    Uses Hearing Aids
                                                </Label>
                                            </div>

                                            <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
                                                <Checkbox
                                                    id="earCare"
                                                    checked={formData.sensory.hearing.earCareRequired}
                                                    onCheckedChange={(checked) =>
                                                        setFormData({
                                                            ...formData,
                                                            sensory: {
                                                                ...formData.sensory,
                                                                hearing: {
                                                                    ...formData.sensory.hearing,
                                                                    earCareRequired: checked as boolean,
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="earCare" className="cursor-pointer">
                                                    Ear Care Required
                                                </Label>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {step === 3 && (
                            <Card className="border-blue-100 shadow-lg">
                                <CardHeader className="border-b">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <HeartPulse className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <CardTitle>Clinical Assessment & Diagnoses</CardTitle>
                                            <CardDescription>Medical history, baseline observations, and allergies</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-8">
                                    <div className="space-y-4">
                                        <Label htmlFor="medicalHistory" className="text-sm font-medium">
                                            Medical History / Diagnoses
                                        </Label>
                                        <textarea
                                            id="medicalHistory"
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter medical history and diagnoses..."
                                            value={formData.clinicalAssessment.medicalHistoryAndDiagnoses}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    clinicalAssessment: {
                                                        ...formData.clinicalAssessment,
                                                        medicalHistoryAndDiagnoses: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg flex items-center gap-2">
                                            <HeartPulse className="w-5 h-5 text-blue-600" />
                                            Baseline Observations
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                                            <div className="space-y-2">
                                                <Label htmlFor="bloodPressure">Blood Pressure</Label>
                                                <Input
                                                    id="bloodPressure"
                                                    placeholder="e.g., 120/80"
                                                    value={formData.clinicalAssessment.baselineObservations.bloodPressure}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            clinicalAssessment: {
                                                                ...formData.clinicalAssessment,
                                                                baselineObservations: {
                                                                    ...formData.clinicalAssessment.baselineObservations,
                                                                    bloodPressure: e.target.value,
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                                                <Input
                                                    id="heartRate"
                                                    type="number"
                                                    placeholder="e.g., 72"
                                                    value={formData.clinicalAssessment.baselineObservations.heartRate || ""}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            clinicalAssessment: {
                                                                ...formData.clinicalAssessment,
                                                                baselineObservations: {
                                                                    ...formData.clinicalAssessment.baselineObservations,
                                                                    heartRate: Number(e.target.value),
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="temperature">Temperature (°C)</Label>
                                                <Input
                                                    id="temperature"
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="e.g., 37.0"
                                                    value={formData.clinicalAssessment.baselineObservations.temperature || ""}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            clinicalAssessment: {
                                                                ...formData.clinicalAssessment,
                                                                baselineObservations: {
                                                                    ...formData.clinicalAssessment.baselineObservations,
                                                                    temperature: Number(e.target.value),
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="oxygenSaturation">Oxygen Saturation (%)</Label>
                                                <Input
                                                    id="oxygenSaturation"
                                                    type="number"
                                                    placeholder="e.g., 98"
                                                    value={formData.clinicalAssessment.baselineObservations.oxygenSaturation || ""}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            clinicalAssessment: {
                                                                ...formData.clinicalAssessment,
                                                                baselineObservations: {
                                                                    ...formData.clinicalAssessment.baselineObservations,
                                                                    oxygenSaturation: Number(e.target.value),
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="respiratoryRate">Respiratory Rate (breaths/min)</Label>
                                                <Input
                                                    id="respiratoryRate"
                                                    type="number"
                                                    placeholder="e.g., 16"
                                                    value={formData.clinicalAssessment.baselineObservations.respiratoryRate || ""}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            clinicalAssessment: {
                                                                ...formData.clinicalAssessment,
                                                                baselineObservations: {
                                                                    ...formData.clinicalAssessment.baselineObservations,
                                                                    respiratoryRate: Number(e.target.value),
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="bloodGlucose">Blood Glucose Level (mg/dL)</Label>
                                                <Input
                                                    id="bloodGlucose"
                                                    type="number"
                                                    placeholder="e.g., 100"
                                                    value={formData.clinicalAssessment.baselineObservations.bloodGlucoseLevel || ""}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            clinicalAssessment: {
                                                                ...formData.clinicalAssessment,
                                                                baselineObservations: {
                                                                    ...formData.clinicalAssessment.baselineObservations,
                                                                    bloodGlucoseLevel: Number(e.target.value),
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="painLevel">Pain Level (0-10 scale)</Label>
                                                <Input
                                                    id="painLevel"
                                                    type="number"
                                                    min="0"
                                                    max="10"
                                                    placeholder="0 = No pain, 10 = Worst pain"
                                                    value={formData.clinicalAssessment.baselineObservations.painLevel || ""}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            clinicalAssessment: {
                                                                ...formData.clinicalAssessment,
                                                                baselineObservations: {
                                                                    ...formData.clinicalAssessment.baselineObservations,
                                                                    painLevel: Number(e.target.value),
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label htmlFor="allergies" className="text-sm font-medium">
                                            Allergies
                                        </Label>
                                        <textarea
                                            id="allergies"
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter any known allergies..."
                                            value={formData.clinicalAssessment.allergies}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    clinicalAssessment: {
                                                        ...formData.clinicalAssessment,
                                                        allergies: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <Label htmlFor="cognitiveImpairment" className="text-sm font-medium">
                                            History of Cognitive Impairment
                                        </Label>
                                        <textarea
                                            id="cognitiveImpairment"
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter cognitive impairment history..."
                                            value={formData.clinicalAssessment.historyOfCognitiveImpairment}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    clinicalAssessment: {
                                                        ...formData.clinicalAssessment,
                                                        historyOfCognitiveImpairment: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <Label htmlFor="mentalIllness" className="text-sm font-medium">
                                            Mental Illness / Behaviours of Concern
                                        </Label>
                                        <textarea
                                            id="mentalIllness"
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter mental health concerns..."
                                            value={formData.clinicalAssessment.mentalIllnessOrBehavioursOfConcern}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    clinicalAssessment: {
                                                        ...formData.clinicalAssessment,
                                                        mentalIllnessOrBehavioursOfConcern: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <Label htmlFor="careNeeds" className="text-sm font-medium">
                                            Care Needs
                                        </Label>
                                        <textarea
                                            id="careNeeds"
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter care needs..."
                                            value={formData.generalCare.careNeeds}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    generalCare: {
                                                        ...formData.generalCare,
                                                        careNeeds: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <Label htmlFor="goals" className="text-sm font-medium">
                                            Goals
                                        </Label>
                                        <textarea
                                            id="goals"
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter care goals..."
                                            value={formData.generalCare.goals}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    generalCare: {
                                                        ...formData.generalCare,
                                                        goals: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <Label htmlFor="treatmentPlan" className="text-sm font-medium">
                                            Treatment Plan
                                        </Label>
                                        <textarea
                                            id="treatmentPlan"
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter treatment plan..."
                                            value={formData.generalCare.treatmentPlan}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    generalCare: {
                                                        ...formData.generalCare,
                                                        treatmentPlan: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-blue-600" />
                                            Chronic Diseases
                                        </h3>
                                        {formData.chronicDiseases.map((disease, index) => (
                                            <Card key={index} className="bg-blue-50/50 border-blue-200">
                                                <CardContent className="pt-6 space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="font-medium text-blue-900">Disease {index + 1}</h4>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                const newDiseases = formData.chronicDiseases.filter((_, i) => i !== index)
                                                                setFormData({ ...formData, chronicDiseases: newDiseases })
                                                            }}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Disease Name</Label>
                                                        <Input
                                                            placeholder="Enter disease name"
                                                            value={disease.diseaseName}
                                                            onChange={(e) => {
                                                                const newDiseases = [...formData.chronicDiseases]
                                                                newDiseases[index].diseaseName = e.target.value
                                                                setFormData({ ...formData, chronicDiseases: newDiseases })
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Care Needs</Label>
                                                        <textarea
                                                            rows={2}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                            placeholder="Enter care needs for this disease..."
                                                            value={disease.careNeeds}
                                                            onChange={(e) => {
                                                                const newDiseases = [...formData.chronicDiseases]
                                                                newDiseases[index].careNeeds = e.target.value
                                                                setFormData({ ...formData, chronicDiseases: newDiseases })
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Goals</Label>
                                                        <textarea
                                                            rows={2}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                            placeholder="Enter goals for this disease..."
                                                            value={disease.goals}
                                                            onChange={(e) => {
                                                                const newDiseases = [...formData.chronicDiseases]
                                                                newDiseases[index].goals = e.target.value
                                                                setFormData({ ...formData, chronicDiseases: newDiseases })
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Treatment Plan</Label>
                                                        <textarea
                                                            rows={2}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                            placeholder="Enter treatment plan for this disease..."
                                                            value={disease.treatmentPlan}
                                                            onChange={(e) => {
                                                                const newDiseases = [...formData.chronicDiseases]
                                                                newDiseases[index].treatmentPlan = e.target.value
                                                                setFormData({ ...formData, chronicDiseases: newDiseases })
                                                            }}
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full border-dashed border-2 hover:bg-blue-50 bg-transparent"
                                            onClick={() =>
                                                setFormData({
                                                    ...formData,
                                                    chronicDiseases: [
                                                        ...formData.chronicDiseases,
                                                        { diseaseName: "", careNeeds: "", goals: "", treatmentPlan: "" },
                                                    ],
                                                })
                                            }
                                        >
                                            Add Chronic Disease
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg flex items-center gap-2">
                                            <AlertTriangle className="w-5 h-5 text-blue-600" />
                                            Other Identified Issues
                                        </h3>
                                        <div className="space-y-4 pl-7">
                                            <div className="space-y-2">
                                                <Label>Issue Description</Label>
                                                <textarea
                                                    rows={2}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Describe other identified issues..."
                                                    value={formData.otherIdentifiedIssues.issueDescription}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            otherIdentifiedIssues: {
                                                                ...formData.otherIdentifiedIssues,
                                                                issueDescription: e.target.value,
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Care Needs</Label>
                                                <textarea
                                                    rows={2}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Enter care needs..."
                                                    value={formData.otherIdentifiedIssues.careNeeds}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            otherIdentifiedIssues: {
                                                                ...formData.otherIdentifiedIssues,
                                                                careNeeds: e.target.value,
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Goals</Label>
                                                <textarea
                                                    rows={2}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Enter goals..."
                                                    value={formData.otherIdentifiedIssues.goals}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            otherIdentifiedIssues: {
                                                                ...formData.otherIdentifiedIssues,
                                                                goals: e.target.value,
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Treatment Plan</Label>
                                                <textarea
                                                    rows={2}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Enter treatment plan..."
                                                    value={formData.otherIdentifiedIssues.treatmentPlan}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            otherIdentifiedIssues: {
                                                                ...formData.otherIdentifiedIssues,
                                                                treatmentPlan: e.target.value,
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {step === 4 && (
                            <Card className="border-blue-100 shadow-lg">
                                <CardHeader className="border-b">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Pill className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <CardTitle>Medication Management</CardTitle>
                                            <CardDescription>Current medications and administration details</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-8">
                                    <div className="space-y-4">
                                        <Label htmlFor="currentMedications" className="text-sm font-medium">
                                            Current Medications
                                        </Label>
                                        <textarea
                                            id="currentMedications"
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="List all current medications..."
                                            value={formData.medicationManagement.currentMedications}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    medicationManagement: {
                                                        ...formData.medicationManagement,
                                                        currentMedications: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg flex items-center gap-2">
                                            <Pill className="w-5 h-5 text-blue-600" />
                                            Administration Method
                                        </h3>
                                        <div className="space-y-3 pl-7">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="requiresFullAssistance"
                                                    checked={formData.medicationManagement.administrationMethod.requiresFullAssistance}
                                                    onCheckedChange={(checked) =>
                                                        setFormData({
                                                            ...formData,
                                                            medicationManagement: {
                                                                ...formData.medicationManagement,
                                                                administrationMethod: {
                                                                    ...formData.medicationManagement.administrationMethod,
                                                                    requiresFullAssistance: checked as boolean,
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="requiresFullAssistance" className="cursor-pointer">
                                                    Requires Full Assistance
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="promptingRequired"
                                                    checked={formData.medicationManagement.administrationMethod.promptingRequired}
                                                    onCheckedChange={(checked) =>
                                                        setFormData({
                                                            ...formData,
                                                            medicationManagement: {
                                                                ...formData.medicationManagement,
                                                                administrationMethod: {
                                                                    ...formData.medicationManagement.administrationMethod,
                                                                    promptingRequired: checked as boolean,
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="promptingRequired" className="cursor-pointer">
                                                    Prompting Required
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="selfAdministering"
                                                    checked={formData.medicationManagement.administrationMethod.selfAdministering}
                                                    onCheckedChange={(checked) =>
                                                        setFormData({
                                                            ...formData,
                                                            medicationManagement: {
                                                                ...formData.medicationManagement,
                                                                administrationMethod: {
                                                                    ...formData.medicationManagement.administrationMethod,
                                                                    selfAdministering: checked as boolean,
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="selfAdministering" className="cursor-pointer">
                                                    Self-administering
                                                </Label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                            Completed Checklists
                                        </h3>
                                        <div className="space-y-3 pl-7">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="selfAdminAssessment"
                                                    checked={formData.medicationManagement.completedChecklists.selfAdministrationAssessmentForm}
                                                    onCheckedChange={(checked) =>
                                                        setFormData({
                                                            ...formData,
                                                            medicationManagement: {
                                                                ...formData.medicationManagement,
                                                                completedChecklists: {
                                                                    ...formData.medicationManagement.completedChecklists,
                                                                    selfAdministrationAssessmentForm: checked as boolean,
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="selfAdminAssessment" className="cursor-pointer">
                                                    Self-Administration of Medication Assessment Form
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="medPlanConsent"
                                                    checked={formData.medicationManagement.completedChecklists.medicationPlanAndConsentForm}
                                                    onCheckedChange={(checked) =>
                                                        setFormData({
                                                            ...formData,
                                                            medicationManagement: {
                                                                ...formData.medicationManagement,
                                                                completedChecklists: {
                                                                    ...formData.medicationManagement.completedChecklists,
                                                                    medicationPlanAndConsentForm: checked as boolean,
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="medPlanConsent" className="cursor-pointer">
                                                    Medication Plan and Consent Form
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="medRiskAssessment"
                                                    checked={formData.medicationManagement.completedChecklists.medicationRiskAssessment}
                                                    onCheckedChange={(checked) =>
                                                        setFormData({
                                                            ...formData,
                                                            medicationManagement: {
                                                                ...formData.medicationManagement,
                                                                completedChecklists: {
                                                                    ...formData.medicationManagement.completedChecklists,
                                                                    medicationRiskAssessment: checked as boolean,
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="medRiskAssessment" className="cursor-pointer">
                                                    Medication Risk Assessment
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="medRiskIndemnity"
                                                    checked={formData.medicationManagement.completedChecklists.medicationRiskIndemnityForm}
                                                    onCheckedChange={(checked) =>
                                                        setFormData({
                                                            ...formData,
                                                            medicationManagement: {
                                                                ...formData.medicationManagement,
                                                                completedChecklists: {
                                                                    ...formData.medicationManagement.completedChecklists,
                                                                    medicationRiskIndemnityForm: checked as boolean,
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="medRiskIndemnity" className="cursor-pointer">
                                                    Medication Risk Indemnity Form (if applicable)
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="prnChecklist"
                                                    checked={formData.medicationManagement.completedChecklists.prnIntakeChecklist}
                                                    onCheckedChange={(checked) =>
                                                        setFormData({
                                                            ...formData,
                                                            medicationManagement: {
                                                                ...formData.medicationManagement,
                                                                completedChecklists: {
                                                                    ...formData.medicationManagement.completedChecklists,
                                                                    prnIntakeChecklist: checked as boolean,
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="prnChecklist" className="cursor-pointer">
                                                    PRN Intake Checklist (if applicable)
                                                </Label>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {step === 5 && (
                            <Card className="border-blue-100 shadow-lg">
                                <CardHeader className="border-b">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Droplet className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <CardTitle>Toileting and Continence</CardTitle>
                                            <CardDescription>Continence management and toileting needs</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-6">
                                    <div className="space-y-4">
                                        <Label htmlFor="toiletingCareNeeds" className="text-sm font-medium">
                                            Care Needs
                                        </Label>
                                        <textarea
                                            id="toiletingCareNeeds"
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter care needs..."
                                            value={formData.toiletingAndContinence.careNeeds}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    toiletingAndContinence: {
                                                        ...formData.toiletingAndContinence,
                                                        careNeeds: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <Label htmlFor="toiletingGoals" className="text-sm font-medium">
                                            Goals
                                        </Label>
                                        <textarea
                                            id="toiletingGoals"
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter goals..."
                                            value={formData.toiletingAndContinence.goals}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    toiletingAndContinence: {
                                                        ...formData.toiletingAndContinence,
                                                        goals: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <Label htmlFor="bowelPlan" className="text-sm font-medium">
                                            Bowel Management Plan
                                        </Label>
                                        <textarea
                                            id="bowelPlan"
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter bowel management plan..."
                                            value={formData.toiletingAndContinence.bowelManagementPlan}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    toiletingAndContinence: {
                                                        ...formData.toiletingAndContinence,
                                                        bowelManagementPlan: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <Label htmlFor="continencePlan" className="text-sm font-medium">
                                            Continence Management Plan
                                        </Label>
                                        <textarea
                                            id="continencePlan"
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter continence management plan..."
                                            value={formData.toiletingAndContinence.continenceManagementPlan}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    toiletingAndContinence: {
                                                        ...formData.toiletingAndContinence,
                                                        continenceManagementPlan: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <Label htmlFor="bowelRisks" className="text-sm font-medium">
                                            Potential Risks with Bowel Care & Management (e.g., Autonomic Dysreflexia)
                                        </Label>
                                        <textarea
                                            id="bowelRisks"
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter potential risks..."
                                            value={formData.toiletingAndContinence.potentialBowelCareRisks}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    toiletingAndContinence: {
                                                        ...formData.toiletingAndContinence,
                                                        potentialBowelCareRisks: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <Label htmlFor="toiletingAids" className="text-sm font-medium">
                                            Toileting Aids (e.g., Hand rails)
                                        </Label>
                                        <textarea
                                            id="toiletingAids"
                                            rows={2}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="List any toileting aids..."
                                            value={formData.toiletingAndContinence.toiletingAids}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    toiletingAndContinence: {
                                                        ...formData.toiletingAndContinence,
                                                        toiletingAids: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <Label htmlFor="toiletingRegime" className="text-sm font-medium">
                                            Toileting Regime
                                        </Label>
                                        <textarea
                                            id="toiletingRegime"
                                            rows={2}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Describe toileting schedule and routine..."
                                            value={formData.toiletingAndContinence.toiletingRegime}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    toiletingAndContinence: {
                                                        ...formData.toiletingAndContinence,
                                                        toiletingRegime: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {step === 6 && (
                            <Card className="border-blue-100 shadow-lg">
                                <CardHeader className="border-b">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Bandage className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <CardTitle>Wound Care</CardTitle>
                                            <CardDescription>Wound management and treatment details</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-6">
                                    <div className="space-y-4">
                                        <Label htmlFor="woundType" className="text-sm font-medium">
                                            Type of Wound
                                        </Label>
                                        <Input
                                            id="woundType"
                                            placeholder="e.g., Pressure ulcer, Surgical wound"
                                            value={formData.woundCare.woundType}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    woundCare: { ...formData.woundCare, woundType: e.target.value },
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <Label htmlFor="woundDescription" className="text-sm font-medium">
                                            Wound Description
                                        </Label>
                                        <textarea
                                            id="woundDescription"
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Describe the wound location, size, appearance..."
                                            value={formData.woundCare.woundDescription}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    woundCare: { ...formData.woundCare, woundDescription: e.target.value },
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="woundAssessmentChart"
                                                checked={formData.woundCare.completedWoundAssessmentChart}
                                                onCheckedChange={(checked) =>
                                                    setFormData({
                                                        ...formData,
                                                        woundCare: {
                                                            ...formData.woundCare,
                                                            completedWoundAssessmentChart: checked as boolean,
                                                        },
                                                    })
                                                }
                                            />
                                            <Label htmlFor="woundAssessmentChart" className="cursor-pointer">
                                                Completed Wound Assessment Chart
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="woundTreatmentForm"
                                                checked={formData.woundCare.completedWoundAssessmentTreatmentForm}
                                                onCheckedChange={(checked) =>
                                                    setFormData({
                                                        ...formData,
                                                        woundCare: {
                                                            ...formData.woundCare,
                                                            completedWoundAssessmentTreatmentForm: checked as boolean,
                                                        },
                                                    })
                                                }
                                            />
                                            <Label htmlFor="woundTreatmentForm" className="cursor-pointer">
                                                Completed Wound Assessment Treatment Form
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="treatmentDiscussed"
                                                checked={formData.woundCare.treatmentFormDiscussedWithConsent}
                                                onCheckedChange={(checked) =>
                                                    setFormData({
                                                        ...formData,
                                                        woundCare: {
                                                            ...formData.woundCare,
                                                            treatmentFormDiscussedWithConsent: checked as boolean,
                                                        },
                                                    })
                                                }
                                            />
                                            <Label htmlFor="treatmentDiscussed" className="cursor-pointer text-sm">
                                                Wound Assessment Treatment form discussed with client, family, treating doctor and any other
                                                concerned parties with client&apos;s consent?
                                            </Label>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label htmlFor="woundTreatmentGoals" className="text-sm font-medium">
                                            Treatment Goals
                                        </Label>
                                        <textarea
                                            id="woundTreatmentGoals"
                                            rows={2}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter treatment goals..."
                                            value={formData.woundCare.treatmentGoals}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    woundCare: { ...formData.woundCare, treatmentGoals: e.target.value },
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <Label htmlFor="woundTreatmentPlan" className="text-sm font-medium">
                                            Treatment Plan (Include dressing schedule / creams)
                                        </Label>
                                        <textarea
                                            id="woundTreatmentPlan"
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter detailed treatment plan..."
                                            value={formData.woundCare.treatmentPlan}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    woundCare: { ...formData.woundCare, treatmentPlan: e.target.value },
                                                })
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {step === 7 && (
                            <Card className="border-blue-100 shadow-lg">
                                <CardHeader className="border-b">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Utensils className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <CardTitle>Nutrition</CardTitle>
                                            <CardDescription>Nutrition and dietary management</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-8">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                            Completed Checklists
                                        </h3>
                                        <div className="space-y-3 pl-7">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="mealtimeSupport"
                                                    checked={formData.nutrition.completedChecklists.mealtimeSupportPlan}
                                                    onCheckedChange={(checked) =>
                                                        setFormData({
                                                            ...formData,
                                                            nutrition: {
                                                                ...formData.nutrition,
                                                                completedChecklists: {
                                                                    ...formData.nutrition.completedChecklists,
                                                                    mealtimeSupportPlan: checked as boolean,
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="mealtimeSupport" className="cursor-pointer">
                                                    Mealtime Support Plan
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="dysphagiaPlan"
                                                    checked={formData.nutrition.completedChecklists.severeDysphagiaManagementPlan}
                                                    onCheckedChange={(checked) =>
                                                        setFormData({
                                                            ...formData,
                                                            nutrition: {
                                                                ...formData.nutrition,
                                                                completedChecklists: {
                                                                    ...formData.nutrition.completedChecklists,
                                                                    severeDysphagiaManagementPlan: checked as boolean,
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="dysphagiaPlan" className="cursor-pointer">
                                                    Severe Dysphagia Management Plan
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="swallowingRisk"
                                                    checked={formData.nutrition.completedChecklists.nutritionAndSwallowingRiskChecklist}
                                                    onCheckedChange={(checked) =>
                                                        setFormData({
                                                            ...formData,
                                                            nutrition: {
                                                                ...formData.nutrition,
                                                                completedChecklists: {
                                                                    ...formData.nutrition.completedChecklists,
                                                                    nutritionAndSwallowingRiskChecklist: checked as boolean,
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="swallowingRisk" className="cursor-pointer">
                                                    Nutrition and Swallowing Risk Checklist
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="pegFeed"
                                                    checked={formData.nutrition.completedChecklists.pegOrEnteralFeedingCarePlan}
                                                    onCheckedChange={(checked) =>
                                                        setFormData({
                                                            ...formData,
                                                            nutrition: {
                                                                ...formData.nutrition,
                                                                completedChecklists: {
                                                                    ...formData.nutrition.completedChecklists,
                                                                    pegOrEnteralFeedingCarePlan: checked as boolean,
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="pegFeed" className="cursor-pointer">
                                                    PEG Feed / Enteral Feeding Care Plan
                                                </Label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg flex items-center gap-2">
                                            <Utensils className="w-5 h-5 text-blue-600" />
                                            Swallowing and Feeding
                                        </h3>
                                        <div className="space-y-3 pl-7">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="difficultySwallowing"
                                                    checked={formData.nutrition.swallowingAndFeeding.difficultySwallowing}
                                                    onCheckedChange={(checked) =>
                                                        setFormData({
                                                            ...formData,
                                                            nutrition: {
                                                                ...formData.nutrition,
                                                                swallowingAndFeeding: {
                                                                    ...formData.nutrition.swallowingAndFeeding,
                                                                    difficultySwallowing: checked as boolean,
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="difficultySwallowing" className="cursor-pointer">
                                                    Difficulty swallowing?
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="riskOfChoking"
                                                    checked={formData.nutrition.swallowingAndFeeding.riskOfChoking}
                                                    onCheckedChange={(checked) =>
                                                        setFormData({
                                                            ...formData,
                                                            nutrition: {
                                                                ...formData.nutrition,
                                                                swallowingAndFeeding: {
                                                                    ...formData.nutrition.swallowingAndFeeding,
                                                                    riskOfChoking: checked as boolean,
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="riskOfChoking" className="cursor-pointer">
                                                    Risk of choking?
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="nutritionalSupport"
                                                    checked={formData.nutrition.swallowingAndFeeding.requiresNutritionalSupport}
                                                    onCheckedChange={(checked) =>
                                                        setFormData({
                                                            ...formData,
                                                            nutrition: {
                                                                ...formData.nutrition,
                                                                swallowingAndFeeding: {
                                                                    ...formData.nutrition.swallowingAndFeeding,
                                                                    requiresNutritionalSupport: checked as boolean,
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="nutritionalSupport" className="cursor-pointer">
                                                    Requires nutritional support with feeding?
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="texturedFoods"
                                                    checked={formData.nutrition.swallowingAndFeeding.requiresTexturedFoods}
                                                    onCheckedChange={(checked) =>
                                                        setFormData({
                                                            ...formData,
                                                            nutrition: {
                                                                ...formData.nutrition,
                                                                swallowingAndFeeding: {
                                                                    ...formData.nutrition.swallowingAndFeeding,
                                                                    requiresTexturedFoods: checked as boolean,
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="texturedFoods" className="cursor-pointer">
                                                    Requires textured foods?
                                                </Label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg">Professional Reviews</h3>
                                        <div className="space-y-4">
                                            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="dietitianReviewed"
                                                        checked={formData.nutrition.dietitianReview.reviewed}
                                                        onCheckedChange={(checked) =>
                                                            setFormData({
                                                                ...formData,
                                                                nutrition: {
                                                                    ...formData.nutrition,
                                                                    dietitianReview: {
                                                                        ...formData.nutrition.dietitianReview,
                                                                        reviewed: checked as boolean,
                                                                    },
                                                                },
                                                            })
                                                        }
                                                    />
                                                    <Label htmlFor="dietitianReviewed" className="cursor-pointer font-medium">
                                                        Reviewed by Dietitian?
                                                    </Label>
                                                </div>
                                                {formData.nutrition.dietitianReview.reviewed && (
                                                    <div className="space-y-2 ml-6">
                                                        <Label htmlFor="dietitianNextReview">Next review date</Label>
                                                        <Input
                                                            id="dietitianNextReview"
                                                            type="date"
                                                            value={formData.nutrition.dietitianReview.nextReviewDate}
                                                            onChange={(e) =>
                                                                setFormData({
                                                                    ...formData,
                                                                    nutrition: {
                                                                        ...formData.nutrition,
                                                                        dietitianReview: {
                                                                            ...formData.nutrition.dietitianReview,
                                                                            nextReviewDate: e.target.value,
                                                                        },
                                                                    },
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="speechPathReviewed"
                                                        checked={formData.nutrition.speechPathologistReview.reviewed}
                                                        onCheckedChange={(checked) =>
                                                            setFormData({
                                                                ...formData,
                                                                nutrition: {
                                                                    ...formData.nutrition,
                                                                    speechPathologistReview: {
                                                                        ...formData.nutrition.speechPathologistReview,
                                                                        reviewed: checked as boolean,
                                                                    },
                                                                },
                                                            })
                                                        }
                                                    />
                                                    <Label htmlFor="speechPathReviewed" className="cursor-pointer font-medium">
                                                        Reviewed by Speech Pathologist?
                                                    </Label>
                                                </div>
                                                {formData.nutrition.speechPathologistReview.reviewed && (
                                                    <div className="space-y-2 ml-6">
                                                        <Label htmlFor="speechPathNextReview">Next review date</Label>
                                                        <Input
                                                            id="speechPathNextReview"
                                                            type="date"
                                                            value={formData.nutrition.speechPathologistReview.nextReviewDate}
                                                            onChange={(e) =>
                                                                setFormData({
                                                                    ...formData,
                                                                    nutrition: {
                                                                        ...formData.nutrition,
                                                                        speechPathologistReview: {
                                                                            ...formData.nutrition.speechPathologistReview,
                                                                            nextReviewDate: e.target.value,
                                                                        },
                                                                    },
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label htmlFor="nutritionGoals" className="text-sm font-medium">
                                            Nutrition Goals
                                        </Label>
                                        <textarea
                                            id="nutritionGoals"
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter nutrition goals..."
                                            value={formData.nutrition.nutritionGoals}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    nutrition: { ...formData.nutrition, nutritionGoals: e.target.value },
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <Label htmlFor="nutritionManagementPlan" className="text-sm font-medium">
                                            Management Plan
                                        </Label>
                                        <textarea
                                            id="nutritionManagementPlan"
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter nutrition management plan..."
                                            value={formData.nutrition.managementPlan}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    nutrition: { ...formData.nutrition, managementPlan: e.target.value },
                                                })
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {step === 8 && (
                            <Card className="border-blue-100 shadow-lg">
                                <CardHeader className="border-b">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <AlertTriangle className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <CardTitle>Risks and Emergency Management</CardTitle>
                                            <CardDescription>Risk assessment and emergency procedures</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-8">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg flex items-center gap-2">
                                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                                            Potential Risks and Incident Management
                                        </h3>
                                        <div className="space-y-4 pl-7">
                                            <div className="space-y-2">
                                                <Label htmlFor="riskOptions">Options (comma separated)</Label>
                                                <Input
                                                    id="riskOptions"
                                                    placeholder="e.g., Falls risk, Choking risk, Medication error"
                                                    value={formData.risksAndEmergencyManagement.potentialRisksAndIncidentManagement.options.join(
                                                        ", ",
                                                    )}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            risksAndEmergencyManagement: {
                                                                ...formData.risksAndEmergencyManagement,
                                                                potentialRisksAndIncidentManagement: {
                                                                    ...formData.risksAndEmergencyManagement.potentialRisksAndIncidentManagement,
                                                                    options: e.target.value.split(",").map((item) => item.trim()),
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="riskProcedures">Procedures (comma separated)</Label>
                                                <textarea
                                                    id="riskProcedures"
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Describe procedures for managing risks..."
                                                    value={formData.risksAndEmergencyManagement.potentialRisksAndIncidentManagement.procedures.join(
                                                        ", ",
                                                    )}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            risksAndEmergencyManagement: {
                                                                ...formData.risksAndEmergencyManagement,
                                                                potentialRisksAndIncidentManagement: {
                                                                    ...formData.risksAndEmergencyManagement.potentialRisksAndIncidentManagement,
                                                                    procedures: e.target.value.split(",").map((item) => item.trim()),
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg flex items-center gap-2">
                                            <AlertTriangle className="w-5 h-5 text-red-600" />
                                            Emergency Management
                                        </h3>
                                        <div className="space-y-4 pl-7">
                                            <div className="space-y-2">
                                                <Label htmlFor="emergencyOptions">Options (comma separated)</Label>
                                                <Input
                                                    id="emergencyOptions"
                                                    placeholder="e.g., Medical emergency, Fire, Natural disaster"
                                                    value={formData.risksAndEmergencyManagement.emergencyManagement.options.join(", ")}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            risksAndEmergencyManagement: {
                                                                ...formData.risksAndEmergencyManagement,
                                                                emergencyManagement: {
                                                                    ...formData.risksAndEmergencyManagement.emergencyManagement,
                                                                    options: e.target.value.split(",").map((item) => item.trim()),
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="emergencyProcedures">Procedures (comma separated)</Label>
                                                <textarea
                                                    id="emergencyProcedures"
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Describe emergency procedures..."
                                                    value={formData.risksAndEmergencyManagement.emergencyManagement.procedures.join(", ")}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            risksAndEmergencyManagement: {
                                                                ...formData.risksAndEmergencyManagement,
                                                                emergencyManagement: {
                                                                    ...formData.risksAndEmergencyManagement.emergencyManagement,
                                                                    procedures: e.target.value.split(",").map((item) => item.trim()),
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label htmlFor="reportableInfo" className="text-sm font-medium">
                                            Information which must be reported to a health practitioner
                                        </Label>
                                        <textarea
                                            id="reportableInfo"
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="List information that requires reporting..."
                                            value={formData.risksAndEmergencyManagement.reportableInformationToHealthPractitioner}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    risksAndEmergencyManagement: {
                                                        ...formData.risksAndEmergencyManagement,
                                                        reportableInformationToHealthPractitioner: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <Label htmlFor="specificInstructions" className="text-sm font-medium">
                                            Specific instructions, details and considerations for management and changes
                                        </Label>
                                        <textarea
                                            id="specificInstructions"
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter specific instructions..."
                                            value={formData.risksAndEmergencyManagement.specificInstructionsAndConsiderations}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    risksAndEmergencyManagement: {
                                                        ...formData.risksAndEmergencyManagement,
                                                        specificInstructionsAndConsiderations: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {step === 9 && (
                            <Card className="border-blue-100 shadow-lg">
                                <CardHeader className="border-b ">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <User className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <CardTitle>Checklist & Role of Others in Care Plan</CardTitle>
                                            <CardDescription>Bowel care checklist and partnership roles</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-8">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                            Bowel Care Checklist
                                        </h3>
                                        <div className="space-y-3 pl-7">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="doctorsOrders"
                                                    checked={formData.bowelCareChecklistAndPartnership.doctorsOrdersForBowelCareCompleted}
                                                    onCheckedChange={(checked) =>
                                                        setFormData({
                                                            ...formData,
                                                            bowelCareChecklistAndPartnership: {
                                                                ...formData.bowelCareChecklistAndPartnership,
                                                                doctorsOrdersForBowelCareCompleted: checked as boolean,
                                                            },
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="doctorsOrders" className="cursor-pointer">
                                                    Doctor&apos;s orders for bowel care are completed
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="bowelChart"
                                                    checked={formData.bowelCareChecklistAndPartnership.bowelChartInPlace}
                                                    onCheckedChange={(checked) =>
                                                        setFormData({
                                                            ...formData,
                                                            bowelCareChecklistAndPartnership: {
                                                                ...formData.bowelCareChecklistAndPartnership,
                                                                bowelChartInPlace: checked as boolean,
                                                            },
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="bowelChart" className="cursor-pointer">
                                                    Bowel Chart in place
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="staffTrained"
                                                    checked={formData.bowelCareChecklistAndPartnership.staffTrainedAndCompetentForClientCare}
                                                    onCheckedChange={(checked) =>
                                                        setFormData({
                                                            ...formData,
                                                            bowelCareChecklistAndPartnership: {
                                                                ...formData.bowelCareChecklistAndPartnership,
                                                                staffTrainedAndCompetentForClientCare: checked as boolean,
                                                            },
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="staffTrained" className="cursor-pointer">
                                                    Staff trained and competent to assist with all client care needs
                                                </Label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg flex items-center gap-2">
                                            <User className="w-5 h-5 text-blue-600" />
                                            Role of Others in Care Plan / Agreed Partnership Actions
                                        </h3>
                                        {[0, 1, 2, 3, 4].map((index) => (
                                            <Card key={index} className="bg-blue-50/50 border-blue-200">
                                                <CardContent className="pt-6 space-y-4">
                                                    <h4 className="font-medium text-blue-900">Person {index + 1}</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label>Name</Label>
                                                            <Input
                                                                placeholder="Enter name"
                                                                value={formData.roleOfOthersInCarePlanAgreedPartnershipActions[index]?.name || ""}
                                                                onChange={(e) => {
                                                                    const updatedRoles = [...formData.roleOfOthersInCarePlanAgreedPartnershipActions]
                                                                    if (!updatedRoles[index]) {
                                                                        updatedRoles[index] = {
                                                                            name: "",
                                                                            relationship: "",
                                                                            details: "",
                                                                            responsibilities: "",
                                                                        }
                                                                    }
                                                                    updatedRoles[index] = {
                                                                        ...updatedRoles[index],
                                                                        name: e.target.value,
                                                                    }
                                                                    setFormData({
                                                                        ...formData,
                                                                        roleOfOthersInCarePlanAgreedPartnershipActions: updatedRoles,
                                                                    })
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Relationship</Label>
                                                            <Input
                                                                placeholder="e.g., Family member, GP, Specialist"
                                                                value={formData.roleOfOthersInCarePlanAgreedPartnershipActions[index]?.relationship || ""}
                                                                onChange={(e) => {
                                                                    const updatedRoles = [...formData.roleOfOthersInCarePlanAgreedPartnershipActions]
                                                                    if (!updatedRoles[index]) {
                                                                        updatedRoles[index] = {
                                                                            name: "",
                                                                            relationship: "",
                                                                            details: "",
                                                                            responsibilities: "",
                                                                        }
                                                                    }
                                                                    updatedRoles[index] = {
                                                                        ...updatedRoles[index],
                                                                        relationship: e.target.value,
                                                                    }
                                                                    setFormData({
                                                                        ...formData,
                                                                        roleOfOthersInCarePlanAgreedPartnershipActions: updatedRoles,
                                                                    })
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="space-y-2 md:col-span-2">
                                                            <Label>Details / Responsibilities</Label>
                                                            <textarea
                                                                rows={2}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                                placeholder="Describe their role and responsibilities..."
                                                                value={formData.roleOfOthersInCarePlanAgreedPartnershipActions[index]?.details || ""}
                                                                onChange={(e) => {
                                                                    const updatedRoles = [...formData.roleOfOthersInCarePlanAgreedPartnershipActions]
                                                                    if (!updatedRoles[index]) {
                                                                        updatedRoles[index] = {
                                                                            name: "",
                                                                            relationship: "",
                                                                            details: "",
                                                                            responsibilities: "",
                                                                        }
                                                                    }
                                                                    updatedRoles[index] = {
                                                                        ...updatedRoles[index],
                                                                        details: e.target.value,
                                                                    }
                                                                    setFormData({
                                                                        ...formData,
                                                                        roleOfOthersInCarePlanAgreedPartnershipActions: updatedRoles,
                                                                    })
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {step === 10 && (
                            <Card className="border-blue-100 shadow-lg">
                                <CardHeader className="border-b">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <CardTitle>Completion and Review</CardTitle>
                                            <CardDescription>Finalizing and reviewing the care plan</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-8">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg flex items-center gap-2">
                                            <User className="w-5 h-5 text-blue-600" />
                                            Care Plan Completed By
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label>Printed Name</Label>
                                                <Input
                                                    placeholder="Enter name"
                                                    value={formData.completionAndReview.carePlanCompletedBy.printedName}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            completionAndReview: {
                                                                ...formData.completionAndReview,
                                                                carePlanCompletedBy: {
                                                                    ...formData.completionAndReview.carePlanCompletedBy,
                                                                    printedName: e.target.value,
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Signature</Label>
                                                <Input
                                                    placeholder="Enter signature"
                                                    value={formData.completionAndReview.carePlanCompletedBy.signature}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            completionAndReview: {
                                                                ...formData.completionAndReview,
                                                                carePlanCompletedBy: {
                                                                    ...formData.completionAndReview.carePlanCompletedBy,
                                                                    signature: e.target.value,
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Date</Label>
                                                <Input
                                                    type="date"
                                                    value={formData.completionAndReview.carePlanCompletedBy.date}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            completionAndReview: {
                                                                ...formData.completionAndReview,
                                                                carePlanCompletedBy: {
                                                                    ...formData.completionAndReview.carePlanCompletedBy,
                                                                    date: e.target.value,
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg flex items-center gap-2">
                                            <User className="w-5 h-5 text-blue-600" />
                                            Client Acknowledgment
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label>Printed Name</Label>
                                                <Input
                                                    placeholder="Enter name"
                                                    value={formData.completionAndReview.clientAcknowledgment.printedName}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            completionAndReview: {
                                                                ...formData.completionAndReview,
                                                                clientAcknowledgment: {
                                                                    ...formData.completionAndReview.clientAcknowledgment,
                                                                    printedName: e.target.value,
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Signature</Label>
                                                <Input
                                                    placeholder="Enter signature"
                                                    value={formData.completionAndReview.clientAcknowledgment.signature}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            completionAndReview: {
                                                                ...formData.completionAndReview,
                                                                clientAcknowledgment: {
                                                                    ...formData.completionAndReview.clientAcknowledgment,
                                                                    signature: e.target.value,
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Date</Label>
                                                <Input
                                                    type="date"
                                                    value={formData.completionAndReview.clientAcknowledgment.date}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            completionAndReview: {
                                                                ...formData.completionAndReview,
                                                                clientAcknowledgment: {
                                                                    ...formData.completionAndReview.clientAcknowledgment,
                                                                    date: e.target.value,
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg flex items-center gap-2">
                                            <User className="w-5 h-5 text-blue-600" />
                                            Client Advocate Acknowledgment
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div className="space-y-2">
                                                <Label>Printed Name</Label>
                                                <Input
                                                    placeholder="Enter name"
                                                    value={formData.completionAndReview.clientAdvocateAcknowledgment.printedName}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            completionAndReview: {
                                                                ...formData.completionAndReview,
                                                                clientAdvocateAcknowledgment: {
                                                                    ...formData.completionAndReview.clientAdvocateAcknowledgment,
                                                                    printedName: e.target.value,
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Relationship</Label>
                                                <Input
                                                    placeholder="Enter relationship"
                                                    value={formData.completionAndReview.clientAdvocateAcknowledgment.relationship}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            completionAndReview: {
                                                                ...formData.completionAndReview,
                                                                clientAdvocateAcknowledgment: {
                                                                    ...formData.completionAndReview.clientAdvocateAcknowledgment,
                                                                    relationship: e.target.value,
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Signature</Label>
                                                <Input
                                                    placeholder="Enter signature"
                                                    value={formData.completionAndReview.clientAdvocateAcknowledgment.signature}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            completionAndReview: {
                                                                ...formData.completionAndReview,
                                                                clientAdvocateAcknowledgment: {
                                                                    ...formData.completionAndReview.clientAdvocateAcknowledgment,
                                                                    signature: e.target.value,
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Date</Label>
                                                <Input
                                                    type="date"
                                                    value={formData.completionAndReview.clientAdvocateAcknowledgment.date}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            completionAndReview: {
                                                                ...formData.completionAndReview,
                                                                clientAdvocateAcknowledgment: {
                                                                    ...formData.completionAndReview.clientAdvocateAcknowledgment,
                                                                    date: e.target.value,
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}


                        {step === 11 && ( // Updated step number to 12 for Completion and Review
                            <Card className="border-none shadow-lg bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm">
                                <CardHeader className="border-b">
                                    <CardTitle className="text-2xl font-bold text-blue-900 flex items-center gap-3">
                                        <FileCheck className="w-7 h-7 text-blue-600" />
                                        Completion & Review
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6 p-6">
                                    <div className="space-y-6 p-5 bg-white rounded-xl border border-blue-100 shadow-sm">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                                            <h3 className="text-lg font-semibold text-gray-900">Care Plan Review</h3>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                                <div className="flex items-center space-x-3">
                                                    <Checkbox
                                                        id="carePlanReviewed"
                                                        checked={formData.completionAndReview.carePlanReviewed}
                                                        onCheckedChange={(checked) =>
                                                            setFormData({
                                                                ...formData,
                                                                completionAndReview: {
                                                                    ...formData.completionAndReview,
                                                                    carePlanReviewed: checked as boolean,
                                                                },
                                                            })
                                                        }
                                                        className="data-[state=checked]:bg-blue-600"
                                                    />
                                                    <Label
                                                        htmlFor="carePlanReviewed"
                                                        className="cursor-pointer text-base font-medium text-gray-900"
                                                    >
                                                        Care Plan Reviewed
                                                    </Label>
                                                </div>
                                            </div>

                                            {formData.completionAndReview.carePlanReviewed && (
                                                <div className="space-y-5 pl-4 border-l-2 border-blue-200">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                        <div className="space-y-2">
                                                            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                                <Calendar className="w-4 h-4 text-blue-600" />
                                                                Date of Review
                                                            </Label>
                                                            <Input
                                                                type="date"
                                                                value={formData.completionAndReview.dateOfReview}
                                                                onChange={(e) =>
                                                                    setFormData({
                                                                        ...formData,
                                                                        completionAndReview: {
                                                                            ...formData.completionAndReview,
                                                                            dateOfReview: e.target.value,
                                                                        },
                                                                    })
                                                                }
                                                                className="border-gray-300 focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                                <Users className="w-4 h-4 text-blue-600" />
                                                                Names of Persons Involved
                                                            </Label>
                                                            <Input
                                                                placeholder="Enter names..."
                                                                value={formData.completionAndReview.namesOfPersonsInvolved}
                                                                onChange={(e) =>
                                                                    setFormData({
                                                                        ...formData,
                                                                        completionAndReview: {
                                                                            ...formData.completionAndReview,
                                                                            namesOfPersonsInvolved: e.target.value,
                                                                        },
                                                                    })
                                                                }
                                                                className="border-gray-300 focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                            <FileText className="w-4 h-4 text-blue-600" />
                                                            Reasons for Review
                                                        </Label>
                                                        <textarea
                                                            rows={3}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                                            placeholder="Enter reasons for review..."
                                                            value={formData.completionAndReview.reasonsForReview}
                                                            onChange={(e) =>
                                                                setFormData({
                                                                    ...formData,
                                                                    completionAndReview: {
                                                                        ...formData.completionAndReview,
                                                                        reasonsForReview: e.target.value,
                                                                    },
                                                                })
                                                            }
                                                        />
                                                    </div>

                                                    {/* Changes Required Section */}
                                                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                                                        <div className="flex items-center space-x-3">
                                                            <Checkbox
                                                                id="changesRequired"
                                                                checked={formData.completionAndReview.changesToCarePlanRequired}
                                                                onCheckedChange={(checked) =>
                                                                    setFormData({
                                                                        ...formData,
                                                                        completionAndReview: {
                                                                            ...formData.completionAndReview,
                                                                            changesToCarePlanRequired: checked as boolean,
                                                                        },
                                                                    })
                                                                }
                                                                className="data-[state=checked]:bg-amber-600"
                                                            />
                                                            <Label
                                                                htmlFor="changesRequired"
                                                                className="cursor-pointer text-base font-medium text-gray-900"
                                                            >
                                                                Changes to Care Plan Required
                                                            </Label>
                                                        </div>
                                                    </div>

                                                    {formData.completionAndReview.changesToCarePlanRequired && (
                                                        <div className="space-y-5 pl-4 border-l-2 border-amber-200">
                                                            <div className="space-y-2">
                                                                <Label className="text-sm font-semibold text-gray-700">
                                                                    Outline Changes Required / Why
                                                                </Label>
                                                                <textarea
                                                                    rows={3}
                                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                                                                    placeholder="Outline the changes and reasons..."
                                                                    value={formData.completionAndReview.outlineChangesRequired}
                                                                    onChange={(e) =>
                                                                        setFormData({
                                                                            ...formData,
                                                                            completionAndReview: {
                                                                                ...formData.completionAndReview,
                                                                                outlineChangesRequired: e.target.value,
                                                                            },
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-sm font-semibold text-gray-700">
                                                                    Person Responsible to Implement Changes
                                                                </Label>
                                                                <Input
                                                                    placeholder="Enter name..."
                                                                    value={formData.completionAndReview.personResponsibleToImplement}
                                                                    onChange={(e) =>
                                                                        setFormData({
                                                                            ...formData,
                                                                            completionAndReview: {
                                                                                ...formData.completionAndReview,
                                                                                personResponsibleToImplement: e.target.value,
                                                                            },
                                                                        })
                                                                    }
                                                                    className="border-gray-300 focus:ring-2 focus:ring-amber-500"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Status Checkboxes */}
                                                    <div className="space-y-3 pt-4 border-t border-gray-200">
                                                        <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                                                            <div className="flex items-center space-x-3">
                                                                <Checkbox
                                                                    id="clientOrAdvocateInformed"
                                                                    checked={formData.completionAndReview.clientOrAdvocateInformed}
                                                                    onCheckedChange={(checked) =>
                                                                        setFormData({
                                                                            ...formData,
                                                                            completionAndReview: {
                                                                                ...formData.completionAndReview,
                                                                                clientOrAdvocateInformed: checked as boolean,
                                                                            },
                                                                        })
                                                                    }
                                                                    className="data-[state=checked]:bg-green-600"
                                                                />
                                                                <Label
                                                                    htmlFor="clientOrAdvocateInformed"
                                                                    className="cursor-pointer font-medium text-gray-900"
                                                                >
                                                                    Client / Advocate Informed of Changes
                                                                </Label>
                                                            </div>
                                                        </div>

                                                        <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                                                            <div className="flex items-center space-x-3">
                                                                <Checkbox
                                                                    id="carePlanUpdated"
                                                                    checked={formData.completionAndReview.carePlanUpdated}
                                                                    onCheckedChange={(checked) =>
                                                                        setFormData({
                                                                            ...formData,
                                                                            completionAndReview: {
                                                                                ...formData.completionAndReview,
                                                                                carePlanUpdated: checked as boolean,
                                                                            },
                                                                        })
                                                                    }
                                                                    className="data-[state=checked]:bg-green-600"
                                                                />
                                                                <Label htmlFor="carePlanUpdated" className="cursor-pointer font-medium text-gray-900">
                                                                    Care Plan Updated
                                                                </Label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Supervisor Sign-off Section */}
                                    <div className="space-y-4 p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 shadow-sm">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Shield className="w-5 h-5 text-indigo-600" />
                                            <h3 className="text-lg font-semibold text-gray-900">Supervisor Sign-off</h3>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="supervisorName" className="text-sm font-semibold text-gray-700">
                                                Supervisor Name (for final approval)
                                            </Label>
                                            <Input
                                                id="supervisorName"
                                                placeholder="Enter supervisor name"
                                                value={formData.completionAndReview.supervisorName}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        completionAndReview: {
                                                            ...formData.completionAndReview,
                                                            supervisorName: e.target.value,
                                                        },
                                                    })
                                                }
                                                className="border-indigo-200 focus:ring-2 focus:ring-indigo-500 bg-white"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <div className="flex items-center justify-between pt-6 pb-12">
                            <Button
                                onClick={handlePrev}
                                disabled={step === 1}
                                variant="outline"
                                size="lg"
                                className="min-w-[120px] bg-transparent"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </Button>

                            <div className="hidden gap-2 md:flex">
                                {steps.map((s) => (
                                    <button
                                        key={s.number}
                                        onClick={() => setStep(s.number)}
                                        className={`w-2 h-2 rounded-full transition-all ${s.number === step ? "bg-blue-600 w-6" : s.number < step ? "bg-blue-300" : "bg-gray-300"
                                            }`}
                                        aria-label={`Go to step ${s.number}`}
                                    />
                                ))}
                            </div>

                            {step < totalSteps ? (
                                <Button
                                    onClick={handleNext}
                                    size="lg"
                                    className="min-w-[120px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => {
                                        setStatus("completed")
                                        handleSubmit()
                                    }}
                                    size="lg"
                                    className="min-w-[120px] bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Submit
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </main>


        </div>
    )
}
