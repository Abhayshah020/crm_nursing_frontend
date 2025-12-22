"use client";

import React, { useState } from "react";
import axios from "axios";

type FormDataType = {
    clientName: string;
    dateOfBirth: string;
    medicalDoctorName: string;
    medicalDoctorContactNumber: string;
    nextOfKinName: string;
    createdBy: number;
    nextOfKinContactNumber: string;
    carePlanDevelopedDate: string;
    nextCarePlanReviewDate: string;
    communication: {
        preferredMethodOfCommunication: string;
        interpreterRequired: boolean;
    };
    sensory: {
        vision: { usesVisionAids: boolean; eyeCareRequired: boolean };
        hearing: { usesHearingAids: boolean; earCareRequired: boolean };
    };
    clinicalAssessment: {
        medicalHistoryAndDiagnoses: string;
        baselineObservations: {
            bloodPressure: string;
            heartRate: number;
            temperature: number;
            oxygenSaturation: number;
            respiratoryRate: number;
            bloodGlucoseLevel: number;
            painLevel: number;
        };
        allergies: string;
        historyOfCognitiveImpairment: string;
        mentalIllnessOrBehavioursOfConcern: string;
    };
    generalCare: { careNeeds: string; goals: string; treatmentPlan: string };
    chronicDiseases: Array<{ diseaseName: string; careNeeds: string; goals: string; treatmentPlan: string }>;
    otherIdentifiedIssues: { issueDescription: string; careNeeds: string; goals: string; treatmentPlan: string };
    medicationManagement: {
        currentMedications: string;
        administrationMethod: { requiresFullAssistance: boolean; promptingRequired: boolean; selfAdministering: boolean };
        completedChecklists: {
            selfAdministrationAssessmentForm: boolean;
            medicationPlanAndConsentForm: boolean;
            medicationRiskAssessment: boolean;
            medicationRiskIndemnityForm: boolean;
            prnIntakeChecklist: boolean;
        };
    };
    toiletingAndContinence: {
        careNeeds: string;
        goals: string;
        bowelManagementPlan: string;
        continenceManagementPlan: string;
        potentialBowelCareRisks: string;
        toiletingAids: string;
        toiletingRegime: string;
    };
    woundCare: {
        woundType: string;
        woundDescription: string;
        completedWoundAssessmentChart: boolean;
        completedWoundAssessmentTreatmentForm: boolean;
        treatmentFormDiscussedWithConsent: boolean;
        treatmentGoals: string;
        treatmentPlan: string;
    };
    nutrition: {
        completedChecklists: {
            mealtimeSupportPlan: boolean;
            severeDysphagiaManagementPlan: boolean;
            nutritionAndSwallowingRiskChecklist: boolean;
            pegOrEnteralFeedingCarePlan: boolean;
        };
        swallowingAndFeeding: {
            difficultySwallowing: boolean;
            riskOfChoking: boolean;
            requiresNutritionalSupport: boolean;
            requiresTexturedFoods: boolean;
        };
        dietitianReview: { reviewed: boolean; nextReviewDate: string };
        speechPathologistReview: { reviewed: boolean; nextReviewDate: string };
        nutritionGoals: string;
        managementPlan: string;
    };
    risksAndEmergencyManagement: {
        potentialRisksAndIncidentManagement: { options: string[]; procedures: string[] };
        emergencyManagement: { options: string[]; procedures: string[] };
        reportableInformationToHealthPractitioner: string;
        specificInstructionsAndConsiderations: string;
    };
    bowelCareChecklistAndPartnership: {
        doctorsOrdersForBowelCareCompleted: boolean;
        bowelChartInPlace: boolean;
        staffTrainedAndCompetentForClientCare: boolean;
    };
    roleOfOthersInCarePlanAgreedPartnershipActions: Array<{ name: string; relationship: string; details: string; responsibilities: string }>;

    completionAndReview: {
        carePlanCompletedBy: { printedName: string; signature: string; date: string };
        clientAcknowledgment: { printedName: string; signature: string; date: string };
        clientAdvocateAcknowledgment: { printedName: string; relationship: string; signature: string; date: string };
        carePlanReviewed: boolean;
        dateOfReview: string;
        reasonsForReview: string;
        namesOfPersonsInvolved: string;
        changesToCarePlanRequired: boolean;
        outlineChangesRequired: string;
        personResponsibleToImplement: string;
        clientOrAdvocateInformed: boolean;
        carePlanUpdated: boolean;
        supervisorName: string;
    };
};

export default function CarePlanForm() {
    const [step, setStep] = useState(1);
    const [status, setStatus] = useState<"draft" | "completed">("draft");

    const [formData, setFormData] = useState<FormDataType>({
        clientName: "",
        dateOfBirth: "",
        medicalDoctorName: "",
        medicalDoctorContactNumber: "",
        nextOfKinName: "",
        nextOfKinContactNumber: "",
        carePlanDevelopedDate: "",
        nextCarePlanReviewDate: "",
        communication: { preferredMethodOfCommunication: "", interpreterRequired: false },
        sensory: { vision: { usesVisionAids: false, eyeCareRequired: false }, hearing: { usesHearingAids: false, earCareRequired: false } },
        clinicalAssessment: {
            medicalHistoryAndDiagnoses: "",
            baselineObservations: { bloodPressure: "", heartRate: 0, temperature: 0, oxygenSaturation: 0, respiratoryRate: 0, bloodGlucoseLevel: 0, painLevel: 0 },
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
            completedChecklists: { selfAdministrationAssessmentForm: false, medicationPlanAndConsentForm: false, medicationRiskAssessment: false, medicationRiskIndemnityForm: false, prnIntakeChecklist: false },
        },
        toiletingAndContinence: { careNeeds: "", goals: "", bowelManagementPlan: "", continenceManagementPlan: "", potentialBowelCareRisks: "", toiletingAids: "", toiletingRegime: "" },
        woundCare: { woundType: "", woundDescription: "", completedWoundAssessmentChart: false, completedWoundAssessmentTreatmentForm: false, treatmentFormDiscussedWithConsent: false, treatmentGoals: "", treatmentPlan: "" },
        nutrition: {
            completedChecklists: { mealtimeSupportPlan: false, severeDysphagiaManagementPlan: false, nutritionAndSwallowingRiskChecklist: false, pegOrEnteralFeedingCarePlan: false },
            swallowingAndFeeding: { difficultySwallowing: false, riskOfChoking: false, requiresNutritionalSupport: false, requiresTexturedFoods: false },
            dietitianReview: { reviewed: false, nextReviewDate: "" },
            speechPathologistReview: { reviewed: false, nextReviewDate: "" },
            nutritionGoals: "",
            managementPlan: "",
        },
        createdBy: 1,
        risksAndEmergencyManagement: { potentialRisksAndIncidentManagement: { options: [], procedures: [] }, emergencyManagement: { options: [], procedures: [] }, reportableInformationToHealthPractitioner: "", specificInstructionsAndConsiderations: "" },
        bowelCareChecklistAndPartnership: { doctorsOrdersForBowelCareCompleted: false, bowelChartInPlace: false, staffTrainedAndCompetentForClientCare: false },
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
    });

    const handleNext = () => setStep(step + 1);
    const handlePrev = () => setStep(step - 1);

    const handleChange = (section: keyof FormDataType, field: string, value: any) => {
        setFormData((prev) => {
            const sectionData = prev[section];
            if (typeof sectionData === 'object' && sectionData !== null && !Array.isArray(sectionData)) {
                return {
                    ...prev,
                    [section]: { ...sectionData, [field]: value },
                };
            }
            return prev;
        });
    };

    const handleSubmit = async () => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/care-plans`, { ...formData, status });
            alert("Care Plan saved successfully");
        } catch (err) {
            console.error(err);
            alert("Error saving Care Plan");
        }
    };

    return (
        <div>

            <h1>step: {step}</h1>

            {step === 1 && (
                <div>
                    <h2>Client Information</h2>
                    <input
                        placeholder="Client Name"
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    />
                    <input
                        type="date"
                        placeholder="Date of Birth"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                    <input
                        placeholder="Medical Doctor Name"
                        value={formData.medicalDoctorName}
                        onChange={(e) => setFormData({ ...formData, medicalDoctorName: e.target.value })}
                    />
                    <input
                        placeholder="Medical Doctor Contact Number"
                        value={formData.medicalDoctorContactNumber}
                        onChange={(e) => setFormData({ ...formData, medicalDoctorContactNumber: e.target.value })}
                    />
                    <input
                        placeholder="Next of Kin Name"
                        value={formData.nextOfKinName}
                        onChange={(e) => setFormData({ ...formData, nextOfKinName: e.target.value })}
                    />
                    <input
                        placeholder="Next of Kin Contact Number"
                        value={formData.nextOfKinContactNumber}
                        onChange={(e) => setFormData({ ...formData, nextOfKinContactNumber: e.target.value })}
                    />
                    <input
                        type="date"
                        placeholder="Care Plan Developed Date"
                        value={formData.carePlanDevelopedDate}
                        onChange={(e) => setFormData({ ...formData, carePlanDevelopedDate: e.target.value })}
                    />
                    <input
                        type="date"
                        placeholder="Next Care Plan Review Date"
                        value={formData.nextCarePlanReviewDate}
                        onChange={(e) => setFormData({ ...formData, nextCarePlanReviewDate: e.target.value })}
                    />
                </div>
            )}

            {step === 2 && (
                <div>
                    <h2>Communication & Sensory</h2>

                    {/* Communication */}
                    <div>
                        <label>Preferred method of communication:</label>
                        <input
                            type="text"
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

                    <div>
                        <label>Interpreter required?</label>
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.communication.interpreterRequired}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        communication: {
                                            ...formData.communication,
                                            interpreterRequired: e.target.checked,
                                        },
                                    })
                                }
                            />
                            YES
                        </label>
                    </div>

                    {/* Vision */}
                    <h3>Vision</h3>
                    <div>
                        <label>Uses Vision Aids:</label>
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.sensory.vision.usesVisionAids}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        sensory: {
                                            ...formData.sensory,
                                            vision: {
                                                ...formData.sensory.vision,
                                                usesVisionAids: e.target.checked,
                                            },
                                        },
                                    })
                                }
                            />
                            YES
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.sensory.vision.eyeCareRequired}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        sensory: {
                                            ...formData.sensory,
                                            vision: {
                                                ...formData.sensory.vision,
                                                eyeCareRequired: e.target.checked,
                                            },
                                        },
                                    })
                                }
                            />
                            Eye Care Required
                        </label>
                    </div>

                    {/* Hearing */}
                    <h3>Hearing</h3>
                    <div>
                        <label>Uses Hearing Aids:</label>
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.sensory.hearing.usesHearingAids}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        sensory: {
                                            ...formData.sensory,
                                            hearing: {
                                                ...formData.sensory.hearing,
                                                usesHearingAids: e.target.checked,
                                            },
                                        },
                                    })
                                }
                            />
                            YES
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.sensory.hearing.earCareRequired}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        sensory: {
                                            ...formData.sensory,
                                            hearing: {
                                                ...formData.sensory.hearing,
                                                earCareRequired: e.target.checked,
                                            },
                                        },
                                    })
                                }
                            />
                            Ear Care Required
                        </label>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div>
                    <h2>Clinical Assessment & Diagnoses</h2>

                    {/* Medical History / Diagnoses */}
                    <div>
                        <label>Medical History / Diagnoses:</label>
                        <textarea
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

                    {/* Baseline Observations */}
                    <h3>Baseline Observations</h3>
                    <div>
                        <label>Blood Pressure:</label>
                        <input
                            type="text"
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

                    <div>
                        <label>Heart Rate:</label>
                        <input
                            type="number"
                            value={formData.clinicalAssessment.baselineObservations.heartRate}
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

                    <div>
                        <label>Temperature:</label>
                        <input
                            type="number"
                            value={formData.clinicalAssessment.baselineObservations.temperature}
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

                    <div>
                        <label>Oxygen Saturation:</label>
                        <input
                            type="number"
                            value={formData.clinicalAssessment.baselineObservations.oxygenSaturation}
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

                    <div>
                        <label>Respiratory Rate:</label>
                        <input
                            type="number"
                            value={formData.clinicalAssessment.baselineObservations.respiratoryRate}
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

                    <div>
                        <label>Blood Glucose Level:</label>
                        <input
                            type="number"
                            value={formData.clinicalAssessment.baselineObservations.bloodGlucoseLevel}
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

                    <div>
                        <label>Pain Level (if applicable):</label>
                        <input
                            type="number"
                            value={formData.clinicalAssessment.baselineObservations.painLevel}
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

                    {/* Allergies, Cognitive Impairment, Mental Illness */}
                    <div>
                        <label>Allergies:</label>
                        <textarea
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

                    <div>
                        <label>History of Cognitive Impairment:</label>
                        <textarea
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

                    <div>
                        <label>Mental Illness / Behaviours of Concern:</label>
                        <textarea
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

                    {/* Care Needs, Goals, Treatment Plan */}
                    <div>
                        <label>Care Needs:</label>
                        <textarea
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

                    <div>
                        <label>Goals:</label>
                        <textarea
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

                    <div>
                        <label>Treatment Plan:</label>
                        <textarea
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

                    {/* Chronic Diseases */}
                    <h3>Chronic Diseases</h3>
                    {formData.chronicDiseases.map((disease, index) => (
                        <div key={index}>
                            <label>Disease Name:</label>
                            <input
                                type="text"
                                value={disease.diseaseName}
                                onChange={(e) => {
                                    const newDiseases = [...formData.chronicDiseases];
                                    newDiseases[index].diseaseName = e.target.value;
                                    setFormData({ ...formData, chronicDiseases: newDiseases });
                                }}
                            />
                            <label>Care Needs:</label>
                            <textarea
                                value={disease.careNeeds}
                                onChange={(e) => {
                                    const newDiseases = [...formData.chronicDiseases];
                                    newDiseases[index].careNeeds = e.target.value;
                                    setFormData({ ...formData, chronicDiseases: newDiseases });
                                }}
                            />
                            <label>Goals:</label>
                            <textarea
                                value={disease.goals}
                                onChange={(e) => {
                                    const newDiseases = [...formData.chronicDiseases];
                                    newDiseases[index].goals = e.target.value;
                                    setFormData({ ...formData, chronicDiseases: newDiseases });
                                }}
                            />
                            <label>Treatment Plan:</label>
                            <textarea
                                value={disease.treatmentPlan}
                                onChange={(e) => {
                                    const newDiseases = [...formData.chronicDiseases];
                                    newDiseases[index].treatmentPlan = e.target.value;
                                    setFormData({ ...formData, chronicDiseases: newDiseases });
                                }}
                            />
                        </div>
                    ))}
                    <button
                        type="button"
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
                    </button>

                    {/* Other Identified Issues */}
                    <h3>Other Identified Issues</h3>
                    <div>
                        <label>Issue Description:</label>
                        <textarea
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
                    <div>
                        <label>Care Needs:</label>
                        <textarea
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
                    <div>
                        <label>Goals:</label>
                        <textarea
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
                    <div>
                        <label>Treatment Plan:</label>
                        <textarea
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
            )}


            {step === 4 && (
                <div>
                    <h2>Medication Management</h2>

                    {/* Current Medications */}
                    <div>
                        <label>Current Medications:</label>
                        <textarea
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

                    {/* Administration Method */}
                    <h3>Administration Method</h3>
                    <div>
                        <label>
                            Requires Full Assistance:
                            <input
                                type="checkbox"
                                checked={formData.medicationManagement.administrationMethod.requiresFullAssistance}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        medicationManagement: {
                                            ...formData.medicationManagement,
                                            administrationMethod: {
                                                ...formData.medicationManagement.administrationMethod,
                                                requiresFullAssistance: e.target.checked,
                                            },
                                        },
                                    })
                                }
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            Prompting Required:
                            <input
                                type="checkbox"
                                checked={formData.medicationManagement.administrationMethod.promptingRequired}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        medicationManagement: {
                                            ...formData.medicationManagement,
                                            administrationMethod: {
                                                ...formData.medicationManagement.administrationMethod,
                                                promptingRequired: e.target.checked,
                                            },
                                        },
                                    })
                                }
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            Self-administering:
                            <input
                                type="checkbox"
                                checked={formData.medicationManagement.administrationMethod.selfAdministering}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        medicationManagement: {
                                            ...formData.medicationManagement,
                                            administrationMethod: {
                                                ...formData.medicationManagement.administrationMethod,
                                                selfAdministering: e.target.checked,
                                            },
                                        },
                                    })
                                }
                            />
                        </label>
                    </div>

                    {/* Completed Checklists */}
                    <h3>Completed Checklists</h3>
                    <div>
                        <label>
                            Self-Administration of Medication Assessment Form:
                            <input
                                type="checkbox"
                                checked={formData.medicationManagement.completedChecklists.selfAdministrationAssessmentForm}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        medicationManagement: {
                                            ...formData.medicationManagement,
                                            completedChecklists: {
                                                ...formData.medicationManagement.completedChecklists,
                                                selfAdministrationAssessmentForm: e.target.checked,
                                            },
                                        },
                                    })
                                }
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            Medication Plan and Consent Form:
                            <input
                                type="checkbox"
                                checked={formData.medicationManagement.completedChecklists.medicationPlanAndConsentForm}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        medicationManagement: {
                                            ...formData.medicationManagement,
                                            completedChecklists: {
                                                ...formData.medicationManagement.completedChecklists,
                                                medicationPlanAndConsentForm: e.target.checked,
                                            },
                                        },
                                    })
                                }
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            Medication Risk Assessment:
                            <input
                                type="checkbox"
                                checked={formData.medicationManagement.completedChecklists.medicationRiskAssessment}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        medicationManagement: {
                                            ...formData.medicationManagement,
                                            completedChecklists: {
                                                ...formData.medicationManagement.completedChecklists,
                                                medicationRiskAssessment: e.target.checked,
                                            },
                                        },
                                    })
                                }
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            Medication Risk Indemnity Form (if applicable):
                            <input
                                type="checkbox"
                                checked={formData.medicationManagement.completedChecklists.medicationRiskIndemnityForm}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        medicationManagement: {
                                            ...formData.medicationManagement,
                                            completedChecklists: {
                                                ...formData.medicationManagement.completedChecklists,
                                                medicationRiskIndemnityForm: e.target.checked,
                                            },
                                        },
                                    })
                                }
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            PRN Intake Checklist (if applicable):
                            <input
                                type="checkbox"
                                checked={formData.medicationManagement.completedChecklists.prnIntakeChecklist}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        medicationManagement: {
                                            ...formData.medicationManagement,
                                            completedChecklists: {
                                                ...formData.medicationManagement.completedChecklists,
                                                prnIntakeChecklist: e.target.checked,
                                            },
                                        },
                                    })
                                }
                            />
                        </label>
                    </div>
                </div>
            )}

            {step === 5 && (
                <div>
                    <h2>Toileting and Continence</h2>

                    {/* Care Needs */}
                    <div>
                        <label>Care Needs:</label>
                        <textarea
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

                    {/* Goals */}
                    <div>
                        <label>Goals:</label>
                        <textarea
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

                    {/* Bowel Management Plan */}
                    <div>
                        <label>Bowel Management Plan:</label>
                        <textarea
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

                    {/* Continence Management Plan */}
                    <div>
                        <label>Continence Management Plan:</label>
                        <textarea
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

                    {/* Potential Risks */}
                    <div>
                        <label>Potential Risks with Bowel Care & Management (e.g., Autonomic Dysreflexia):</label>
                        <textarea
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

                    {/* Toileting Aids */}
                    <div>
                        <label>Toileting Aids (e.g., Hand rails):</label>
                        <textarea
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

                    {/* Toileting Regime */}
                    <div>
                        <label>Toileting Regime:</label>
                        <textarea
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
                </div>
            )}

            {step === 6 && (
                <div>
                    <h2>Wound Care</h2>

                    {/* Type of Wound */}
                    <div>
                        <label>Type of Wound:</label>
                        <input
                            type="text"
                            value={formData.woundCare.woundType}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    woundCare: { ...formData.woundCare, woundType: e.target.value },
                                })
                            }
                        />
                    </div>

                    {/* Wound Description */}
                    <div>
                        <label>Wound Description:</label>
                        <textarea
                            value={formData.woundCare.woundDescription}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    woundCare: { ...formData.woundCare, woundDescription: e.target.value },
                                })
                            }
                        />
                    </div>

                    {/* Completed Wound Assessment Chart */}
                    <div>
                        <label>Completed Wound Assessment Chart:</label>
                        <input
                            type="checkbox"
                            checked={formData.woundCare.completedWoundAssessmentChart}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    woundCare: {
                                        ...formData.woundCare,
                                        completedWoundAssessmentChart: e.target.checked,
                                    },
                                })
                            }
                        />
                    </div>

                    {/* Completed Wound Assessment Treatment Form */}
                    <div>
                        <label>Completed Wound Assessment Treatment Form:</label>
                        <input
                            type="checkbox"
                            checked={formData.woundCare.completedWoundAssessmentTreatmentForm}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    woundCare: {
                                        ...formData.woundCare,
                                        completedWoundAssessmentTreatmentForm: e.target.checked,
                                    },
                                })
                            }
                        />
                    </div>

                    {/* Wound Assessment Treatment Form Discussed with Consent */}
                    <div>
                        <label>
                            Wound Assessment Treatment form discussed with client, family, treating doctor
                            and any other concerned parties with client’s consent?
                        </label>
                        <input
                            type="checkbox"
                            checked={formData.woundCare.treatmentFormDiscussedWithConsent}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    woundCare: {
                                        ...formData.woundCare,
                                        treatmentFormDiscussedWithConsent: e.target.checked,
                                    },
                                })
                            }
                        />
                    </div>

                    {/* Treatment Goals */}
                    <div>
                        <label>Treatment Goals:</label>
                        <textarea
                            value={formData.woundCare.treatmentGoals}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    woundCare: { ...formData.woundCare, treatmentGoals: e.target.value },
                                })
                            }
                        />
                    </div>

                    {/* Treatment Plan */}
                    <div>
                        <label>Treatment Plan (Include dressing schedule / creams):</label>
                        <textarea
                            value={formData.woundCare.treatmentPlan}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    woundCare: { ...formData.woundCare, treatmentPlan: e.target.value },
                                })
                            }
                        />
                    </div>
                </div>
            )}

            {step === 7 && (
                <div>
                    <h2>Nutrition</h2>

                    {/* Completed Checklists */}
                    <div>
                        <label>Mealtime Support Plan:</label>
                        <input
                            type="checkbox"
                            checked={formData.nutrition.completedChecklists.mealtimeSupportPlan}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    nutrition: {
                                        ...formData.nutrition,
                                        completedChecklists: {
                                            ...formData.nutrition.completedChecklists,
                                            mealtimeSupportPlan: e.target.checked,
                                        },
                                    },
                                })
                            }
                        />
                    </div>

                    <div>
                        <label>Severe Dysphagia Management Plan:</label>
                        <input
                            type="checkbox"
                            checked={formData.nutrition.completedChecklists.severeDysphagiaManagementPlan}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    nutrition: {
                                        ...formData.nutrition,
                                        completedChecklists: {
                                            ...formData.nutrition.completedChecklists,
                                            severeDysphagiaManagementPlan: e.target.checked,
                                        },
                                    },
                                })
                            }
                        />
                    </div>

                    <div>
                        <label>Nutrition and Swallowing Risk Checklist:</label>
                        <input
                            type="checkbox"
                            checked={formData.nutrition.completedChecklists.nutritionAndSwallowingRiskChecklist}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    nutrition: {
                                        ...formData.nutrition,
                                        completedChecklists: {
                                            ...formData.nutrition.completedChecklists,
                                            nutritionAndSwallowingRiskChecklist: e.target.checked,
                                        },
                                    },
                                })
                            }
                        />
                    </div>

                    <div>
                        <label>PEG Feed / Enteral Feeding Care Plan:</label>
                        <input
                            type="checkbox"
                            checked={formData.nutrition.completedChecklists.pegOrEnteralFeedingCarePlan}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    nutrition: {
                                        ...formData.nutrition,
                                        completedChecklists: {
                                            ...formData.nutrition.completedChecklists,
                                            pegOrEnteralFeedingCarePlan: e.target.checked,
                                        },
                                    },
                                })
                            }
                        />
                    </div>

                    {/* Swallowing and Feeding */}
                    <div>
                        <label>Difficulty swallowing?</label>
                        <input
                            type="checkbox"
                            checked={formData.nutrition.swallowingAndFeeding.difficultySwallowing}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    nutrition: {
                                        ...formData.nutrition,
                                        swallowingAndFeeding: {
                                            ...formData.nutrition.swallowingAndFeeding,
                                            difficultySwallowing: e.target.checked,
                                        },
                                    },
                                })
                            }
                        />
                    </div>

                    <div>
                        <label>Risk of choking?</label>
                        <input
                            type="checkbox"
                            checked={formData.nutrition.swallowingAndFeeding.riskOfChoking}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    nutrition: {
                                        ...formData.nutrition,
                                        swallowingAndFeeding: {
                                            ...formData.nutrition.swallowingAndFeeding,
                                            riskOfChoking: e.target.checked,
                                        },
                                    },
                                })
                            }
                        />
                    </div>

                    <div>
                        <label>Requires nutritional support with feeding?</label>
                        <input
                            type="checkbox"
                            checked={formData.nutrition.swallowingAndFeeding.requiresNutritionalSupport}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    nutrition: {
                                        ...formData.nutrition,
                                        swallowingAndFeeding: {
                                            ...formData.nutrition.swallowingAndFeeding,
                                            requiresNutritionalSupport: e.target.checked,
                                        },
                                    },
                                })
                            }
                        />
                    </div>

                    <div>
                        <label>Requires textured foods?</label>
                        <input
                            type="checkbox"
                            checked={formData.nutrition.swallowingAndFeeding.requiresTexturedFoods}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    nutrition: {
                                        ...formData.nutrition,
                                        swallowingAndFeeding: {
                                            ...formData.nutrition.swallowingAndFeeding,
                                            requiresTexturedFoods: e.target.checked,
                                        },
                                    },
                                })
                            }
                        />
                    </div>

                    {/* Dietitian Review */}
                    <div>
                        <label>Reviewed by Dietitian?</label>
                        <input
                            type="checkbox"
                            checked={formData.nutrition.dietitianReview.reviewed}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    nutrition: {
                                        ...formData.nutrition,
                                        dietitianReview: {
                                            ...formData.nutrition.dietitianReview,
                                            reviewed: e.target.checked,
                                        },
                                    },
                                })
                            }
                        />
                    </div>

                    {formData.nutrition.dietitianReview.reviewed && (
                        <div>
                            <label>Next review date:</label>
                            <input
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

                    {/* Speech Pathologist Review */}
                    <div>
                        <label>Reviewed by Speech Pathologist?</label>
                        <input
                            type="checkbox"
                            checked={formData.nutrition.speechPathologistReview.reviewed}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    nutrition: {
                                        ...formData.nutrition,
                                        speechPathologistReview: {
                                            ...formData.nutrition.speechPathologistReview,
                                            reviewed: e.target.checked,
                                        },
                                    },
                                })
                            }
                        />
                    </div>

                    {formData.nutrition.speechPathologistReview.reviewed && (
                        <div>
                            <label>Next review date:</label>
                            <input
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

                    {/* Nutrition Goals */}
                    <div>
                        <label>Nutrition Goals:</label>
                        <textarea
                            value={formData.nutrition.nutritionGoals}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    nutrition: { ...formData.nutrition, nutritionGoals: e.target.value },
                                })
                            }
                        />
                    </div>

                    {/* Management Plan */}
                    <div>
                        <label>Management Plan:</label>
                        <textarea
                            value={formData.nutrition.managementPlan}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    nutrition: { ...formData.nutrition, managementPlan: e.target.value },
                                })
                            }
                        />
                    </div>
                </div>
            )}

            {step === 8 && (
                <div>
                    <h2>Risks and Emergency Management</h2>

                    {/* Potential Risks and Incident Management */}
                    <div>
                        <label>Potential Risk and Incident Management - Options (comma separated):</label>
                        <input
                            type="text"
                            value={formData.risksAndEmergencyManagement.potentialRisksAndIncidentManagement.options.join(', ')}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    risksAndEmergencyManagement: {
                                        ...formData.risksAndEmergencyManagement,
                                        potentialRisksAndIncidentManagement: {
                                            ...formData.risksAndEmergencyManagement.potentialRisksAndIncidentManagement,
                                            options: e.target.value.split(',').map((item) => item.trim()),
                                        },
                                    },
                                })
                            }
                        />
                    </div>

                    <div>
                        <label>Potential Risk and Incident Management - Procedures (comma separated):</label>
                        <input
                            type="text"
                            value={formData.risksAndEmergencyManagement.potentialRisksAndIncidentManagement.procedures.join(', ')}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    risksAndEmergencyManagement: {
                                        ...formData.risksAndEmergencyManagement,
                                        potentialRisksAndIncidentManagement: {
                                            ...formData.risksAndEmergencyManagement.potentialRisksAndIncidentManagement,
                                            procedures: e.target.value.split(',').map((item) => item.trim()),
                                        },
                                    },
                                })
                            }
                        />
                    </div>

                    {/* Emergency Management */}
                    <div>
                        <label>Emergency Management - Options (comma separated):</label>
                        <input
                            type="text"
                            value={formData.risksAndEmergencyManagement.emergencyManagement.options.join(', ')}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    risksAndEmergencyManagement: {
                                        ...formData.risksAndEmergencyManagement,
                                        emergencyManagement: {
                                            ...formData.risksAndEmergencyManagement.emergencyManagement,
                                            options: e.target.value.split(',').map((item) => item.trim()),
                                        },
                                    },
                                })
                            }
                        />
                    </div>

                    <div>
                        <label>Emergency Management - Procedures (comma separated):</label>
                        <input
                            type="text"
                            value={formData.risksAndEmergencyManagement.emergencyManagement.procedures.join(', ')}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    risksAndEmergencyManagement: {
                                        ...formData.risksAndEmergencyManagement,
                                        emergencyManagement: {
                                            ...formData.risksAndEmergencyManagement.emergencyManagement,
                                            procedures: e.target.value.split(',').map((item) => item.trim()),
                                        },
                                    },
                                })
                            }
                        />
                    </div>

                    {/* Reportable Information */}
                    <div>
                        <label>Information which must be reported to a health practitioner:</label>
                        <textarea
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

                    <div>
                        <label>Specific instructions, details and considerations for management and changes:</label>
                        <textarea
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
                </div>
            )}

            {step === 9 && (
                <div>
                    <h2>Checklist & Role of Others in Care Plan</h2>

                    {/* Bowel Care Checklist */}
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.bowelCareChecklistAndPartnership.doctorsOrdersForBowelCareCompleted}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        bowelCareChecklistAndPartnership: {
                                            ...formData.bowelCareChecklistAndPartnership,
                                            doctorsOrdersForBowelCareCompleted: e.target.checked,
                                        },
                                    })
                                }
                            />
                            Doctor’s orders for bowel care are completed
                        </label>
                    </div>

                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.bowelCareChecklistAndPartnership.bowelChartInPlace}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        bowelCareChecklistAndPartnership: {
                                            ...formData.bowelCareChecklistAndPartnership,
                                            bowelChartInPlace: e.target.checked,
                                        },
                                    })
                                }
                            />
                            Bowel Chart in place
                        </label>
                    </div>

                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.bowelCareChecklistAndPartnership.staffTrainedAndCompetentForClientCare}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        bowelCareChecklistAndPartnership: {
                                            ...formData.bowelCareChecklistAndPartnership,
                                            staffTrainedAndCompetentForClientCare: e.target.checked,
                                        },
                                    })
                                }
                            />
                            Staff trained and competent to assist with all client care needs
                        </label>
                    </div>

                    {/* Role of Others */}
                    <h3>Role of Others in Care Plan / Agreed Partnership Actions</h3>
                    {[0, 1, 2, 3, 4].map((index) => (
                        <div key={index}>
                            <label>Name:</label>
                            <input
                                type="text"
                                value={formData.roleOfOthersInCarePlanAgreedPartnershipActions[index]?.name || ""}
                                onChange={(e) => {
                                    const updatedRoles = [...formData.roleOfOthersInCarePlanAgreedPartnershipActions];
                                    updatedRoles[index] = {
                                        ...updatedRoles[index],
                                        name: e.target.value,
                                    };
                                    setFormData({
                                        ...formData,
                                        roleOfOthersInCarePlanAgreedPartnershipActions: updatedRoles,
                                    });
                                }}
                            />
                            <label>Relationship:</label>
                            <input
                                type="text"
                                value={formData.roleOfOthersInCarePlanAgreedPartnershipActions[index]?.relationship || ""}
                                onChange={(e) => {
                                    const updatedRoles = [...formData.roleOfOthersInCarePlanAgreedPartnershipActions];
                                    updatedRoles[index] = {
                                        ...updatedRoles[index],
                                        relationship: e.target.value,
                                    };
                                    setFormData({
                                        ...formData,
                                        roleOfOthersInCarePlanAgreedPartnershipActions: updatedRoles,
                                    });
                                }}
                            />
                            <label>Details / Responsibilities:</label>
                            <input
                                type="text"
                                value={formData.roleOfOthersInCarePlanAgreedPartnershipActions[index]?.details || ""}
                                onChange={(e) => {
                                    const updatedRoles = [...formData.roleOfOthersInCarePlanAgreedPartnershipActions];
                                    updatedRoles[index] = {
                                        ...updatedRoles[index],
                                        details: e.target.value,
                                    };
                                    setFormData({
                                        ...formData,
                                        roleOfOthersInCarePlanAgreedPartnershipActions: updatedRoles,
                                    });
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}


            {step === 10 && (
                <div>
                    <h2>Care Plan Completion & Review</h2>

                    <h3>Care Plan Completed By</h3>
                    <input type="text" placeholder="Printed Name" value={formData.completionAndReview.carePlanCompletedBy.printedName} onChange={e => setFormData({
                        ...formData,
                        completionAndReview: { ...formData.completionAndReview, carePlanCompletedBy: { ...formData.completionAndReview.carePlanCompletedBy, printedName: e.target.value } }
                    })} />
                    <input type="text" placeholder="Signature" value={formData.completionAndReview.carePlanCompletedBy.signature} onChange={e => setFormData({
                        ...formData,
                        completionAndReview: { ...formData.completionAndReview, carePlanCompletedBy: { ...formData.completionAndReview.carePlanCompletedBy, signature: e.target.value } }
                    })} />
                    <input type="date" value={formData.completionAndReview.carePlanCompletedBy.date} onChange={e => setFormData({
                        ...formData,
                        completionAndReview: { ...formData.completionAndReview, carePlanCompletedBy: { ...formData.completionAndReview.carePlanCompletedBy, date: e.target.value } }
                    })} />

                    <h3>Client Acknowledgment</h3>
                    <input type="text" placeholder="Printed Name" value={formData.completionAndReview.clientAcknowledgment.printedName} onChange={e => setFormData({
                        ...formData,
                        completionAndReview: { ...formData.completionAndReview, clientAcknowledgment: { ...formData.completionAndReview.clientAcknowledgment, printedName: e.target.value } }
                    })} />
                    <input type="text" placeholder="Signature" value={formData.completionAndReview.clientAcknowledgment.signature} onChange={e => setFormData({
                        ...formData,
                        completionAndReview: { ...formData.completionAndReview, clientAcknowledgment: { ...formData.completionAndReview.clientAcknowledgment, signature: e.target.value } }
                    })} />
                    <input type="date" value={formData.completionAndReview.clientAcknowledgment.date} onChange={e => setFormData({
                        ...formData,
                        completionAndReview: { ...formData.completionAndReview, clientAcknowledgment: { ...formData.completionAndReview.clientAcknowledgment, date: e.target.value } }
                    })} />

                    <h3>Client Advocate Acknowledgment</h3>
                    <input type="text" placeholder="Printed Name" value={formData.completionAndReview.clientAdvocateAcknowledgment.printedName} onChange={e => setFormData({
                        ...formData,
                        completionAndReview: { ...formData.completionAndReview, clientAdvocateAcknowledgment: { ...formData.completionAndReview.clientAdvocateAcknowledgment, printedName: e.target.value } }
                    })} />
                    <input type="text" placeholder="Relationship" value={formData.completionAndReview.clientAdvocateAcknowledgment.relationship} onChange={e => setFormData({
                        ...formData,
                        completionAndReview: { ...formData.completionAndReview, clientAdvocateAcknowledgment: { ...formData.completionAndReview.clientAdvocateAcknowledgment, relationship: e.target.value } }
                    })} />
                    <input type="text" placeholder="Signature" value={formData.completionAndReview.clientAdvocateAcknowledgment.signature} onChange={e => setFormData({
                        ...formData,
                        completionAndReview: { ...formData.completionAndReview, clientAdvocateAcknowledgment: { ...formData.completionAndReview.clientAdvocateAcknowledgment, signature: e.target.value } }
                    })} />
                    <input type="date" value={formData.completionAndReview.clientAdvocateAcknowledgment.date} onChange={e => setFormData({
                        ...formData,
                        completionAndReview: { ...formData.completionAndReview, clientAdvocateAcknowledgment: { ...formData.completionAndReview.clientAdvocateAcknowledgment, date: e.target.value } }
                    })} />

                    <h3>Care Plan Review</h3>
                    <label>
                        <input type="checkbox" checked={formData.completionAndReview.carePlanReviewed} onChange={e => setFormData({ ...formData, completionAndReview: { ...formData.completionAndReview, carePlanReviewed: e.target.checked } })} />
                        Care plan reviewed
                    </label>
                    <input type="date" value={formData.completionAndReview.dateOfReview} onChange={e => setFormData({ ...formData, completionAndReview: { ...formData.completionAndReview, dateOfReview: e.target.value } })} />
                    <input type="text" placeholder="Reasons for review" value={formData.completionAndReview.reasonsForReview} onChange={e => setFormData({ ...formData, completionAndReview: { ...formData.completionAndReview, reasonsForReview: e.target.value } })} />
                    <input type="text" placeholder="Names of persons involved" value={formData.completionAndReview.namesOfPersonsInvolved} onChange={e => setFormData({ ...formData, completionAndReview: { ...formData.completionAndReview, namesOfPersonsInvolved: e.target.value } })} />

                    <label>
                        <input type="checkbox" checked={formData.completionAndReview.changesToCarePlanRequired} onChange={e => setFormData({ ...formData, completionAndReview: { ...formData.completionAndReview, changesToCarePlanRequired: e.target.checked } })} />
                        Changes to care plan required
                    </label>
                    <input type="text" placeholder="Outline changes required/why" value={formData.completionAndReview.outlineChangesRequired} onChange={e => setFormData({ ...formData, completionAndReview: { ...formData.completionAndReview, outlineChangesRequired: e.target.value } })} />
                    <input type="text" placeholder="Name of person responsible to implement changes" value={formData.completionAndReview.personResponsibleToImplement} onChange={e => setFormData({ ...formData, completionAndReview: { ...formData.completionAndReview, personResponsibleToImplement: e.target.value } })} />

                    <label>
                        <input type="checkbox" checked={formData.completionAndReview.clientOrAdvocateInformed} onChange={e => setFormData({ ...formData, completionAndReview: { ...formData.completionAndReview, clientOrAdvocateInformed: e.target.checked } })} />
                        Client/advocate informed
                    </label>

                    <label>
                        <input type="checkbox" checked={formData.completionAndReview.carePlanUpdated} onChange={e => setFormData({ ...formData, completionAndReview: { ...formData.completionAndReview, carePlanUpdated: e.target.checked } })} />
                        Care plan updated
                    </label>

                    <input type="text" placeholder="Supervisor Name" value={formData.completionAndReview.supervisorName} onChange={e => setFormData({ ...formData, completionAndReview: { ...formData.completionAndReview, supervisorName: e.target.value } })} />
                </div>
            )}

            <div>
                {step > 1 && <button onClick={handlePrev}>Previous</button>}
                {step <= 9 && <button onClick={handleNext}>Next</button>}
                {step === 10 && <button onClick={handleSubmit}>Submit</button>}
            </div>
        </div>
    );
}
