"use client";

import { useEffect, useState } from "react";
import PageContainer from "@/components/PageContainer";
import axiosClient from "@/lib/axiosClient";
import Footer from "@/components/Footer";
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";

const initialFormData = {
    patientId: "",
    patientName: "",
    reasonForCharting: {
        routineMonitoring: false,
        continenceAssessment: false,
        utiMonitoring: false,
        postHospitalReview: false,
        catheterCare: false,
        medicationReview: false,
    },
    colour: null,
    clarity: null,
    odour: null,
    otherObservations: {
        blood: false,
        foam: false,
        mucus: false,
    },
    dysuria: false,
    frequency: null,
    urgency: false,
    nocturia: false,
    lowerAbdominalPain: false,
    painNotes: "",
    continenceStatus: null,
    aidsUsed: {
        pad: false,
        pullUp: false,
        urinal: false,
        commode: false,
    },
    catheterType: null,
    siteCleanAndIntact: false,
    bagBelowBladder: false,
    totalFluidIntake: 0,
    totalUrineOutput: 0,
    balance: null,
    redFlags: {
        noUrine8Hours: false,
        bloodInUrine: false,
        painfulUrination: false,
        cloudyOffensiveUrine: false,
        feverWithUrinarySymptoms: false,
    },
    rnGpManagerNotified: false,
    comments: "",
    staffName: JSON.parse(sessionStorage.getItem("user") || "{}")?.name || "Unknown Staff",
};

export default function UrineMonitoringForm() {
    const [formData, setFormData] = useState(initialFormData);
    const [patients, setPatients] = useState<any[]>([]);

    const fetchPatients = async () => {
        try {
            const res = await axiosClient.get("/patients");
            if (res.status === 200) setPatients(res.data);
        } catch (err) {
            console.error("Error fetching patients:", err);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type, dataset } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        if (dataset.group) {
            setFormData({
                ...formData,
                [dataset.group]: { ...formData[dataset.group], [name]: checked },
            });
        } else {
            setFormData({
                ...formData,
                [name]: type === "checkbox" ? checked : value,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axiosClient.post("/urine-monitoring", formData);
            if (res.status === 201 || res.status === 200) {
                alert("Urine Monitoring record created successfully");
                setFormData(initialFormData);
                window.location.href = "/urine-monitoring";
            }
        } catch (err) {
            console.error("Error creating record:", err);
            alert("Error creating record");
        }
    };

    return (
        <div className="flex flex-col min-h-screen">

            <NavBarOfInternalPage dontShowCreate={true} title="New Neurological Observation" subtitle="Manage and review" />

            <PageContainer title="Urine Monitoring Form" subtitle="Document bladder & urine observations">
                <form
                    onSubmit={handleSubmit}
                    className="bg-card rounded-3xl border border-border shadow-lg hover:shadow-xl transition-all
               p-6 sm:p-8 max-w-7xl mx-auto space-y-8"
                >
                    {/* ================= Patient & Staff ================= */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold text-foreground border-b pb-2">
                            Patient & Staff Details
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Patient</label>
                                <select
                                    name="patientName"
                                    value={formData.patientName}
                                    onChange={(e) => {
                                        handleChange(e);
                                        const selectedPatient = patients.find(p => p.name === e.target.value);
                                        setFormData(prev => ({ ...prev, patientId: selectedPatient?.id || "" }));
                                    }}
                                    className="input"
                                >
                                    <option value="">Select patient</option>
                                    {patients.map(p => (
                                        <option key={p.id} value={p.name}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Staff Name</label>
                                <input
                                    name="staffName"
                                    value={formData.staffName}
                                    // onChange={handleChange}
                                    readOnly
                                    className="input"
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    {/* ================= Reason for Charting ================= */}
                    <section className="bg-muted/30 rounded-2xl p-5 space-y-3">
                        <h3 className="font-semibold text-foreground">
                            Reason for Charting
                        </h3>

                        <div className="flex flex-wrap gap-4">
                            {Object.keys(formData.reasonForCharting).map(key => (
                                <label key={key} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name={key}
                                        checked={formData.reasonForCharting[key as keyof typeof formData.reasonForCharting]}
                                        onChange={handleChange}
                                        data-group="reasonForCharting"
                                        className="checkbox"
                                    />
                                    {key.replace(/([A-Z])/g, " $1")}
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* ================= Urine Characteristics ================= */}
                    <section className="bg-muted/30 rounded-2xl p-5 space-y-4">
                        <h3 className="font-semibold">Urine Characteristics</h3>

                        <div className="grid sm:grid-cols-3 gap-4">
                            <select name="colour" value={formData.colour || ""} onChange={handleChange} className="input">
                                <option value="">Colour</option>
                                <option>Pale Yellow</option>
                                <option>Dark Yellow</option>
                                <option>Amber</option>
                                <option>Red / Pink</option>
                                <option>Brown</option>
                            </select>

                            <select name="clarity" value={formData.clarity || ""} onChange={handleChange} className="input">
                                <option value="">Clarity</option>
                                <option>Clear</option>
                                <option>Cloudy</option>
                                <option>Sediment Present</option>
                            </select>

                            <select name="odour" value={formData.odour || ""} onChange={handleChange} className="input">
                                <option value="">Odour</option>
                                <option>Normal</option>
                                <option>Strong</option>
                                <option>Offensive</option>
                            </select>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            {Object.keys(formData.otherObservations).map(key => (
                                <label key={key} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name={key}
                                        checked={formData.otherObservations[key as keyof typeof formData.otherObservations]}
                                        onChange={handleChange}
                                        data-group="otherObservations"
                                        className="checkbox"
                                    />
                                    {key}
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* ================= Pain & Symptoms ================= */}
                    <section className="bg-muted/30 rounded-2xl p-5 space-y-4">
                        <h3 className="font-semibold">Pain & Symptoms</h3>

                        <div className="grid sm:grid-cols-3 gap-4">
                            <label className="checkbox-label">
                                <input type="checkbox" name="dysuria" checked={formData.dysuria} onChange={handleChange} className="checkbox" />
                                Dysuria
                            </label>

                            <select name="frequency" value={formData.frequency || ""} onChange={handleChange} className="input">
                                <option value="">Frequency</option>
                                <option>Normal</option>
                                <option>Increased</option>
                                <option>Reduced</option>
                            </select>

                            <label className="checkbox-label">
                                <input type="checkbox" name="urgency" checked={formData.urgency} onChange={handleChange} className="checkbox" />
                                Urgency
                            </label>

                            <label className="checkbox-label">
                                <input type="checkbox" name="nocturia" checked={formData.nocturia} onChange={handleChange} className="checkbox" />
                                Nocturia
                            </label>

                            <label className="checkbox-label">
                                <input type="checkbox" name="lowerAbdominalPain" checked={formData.lowerAbdominalPain} onChange={handleChange} className="checkbox" />
                                Lower Abdominal Pain
                            </label>
                        </div>

                        <textarea
                            name="painNotes"
                            value={formData.painNotes}
                            onChange={handleChange}
                            placeholder="Pain notes"
                            className="input h-24"
                        />
                    </section>

                    {/* ================= Continence & Devices ================= */}
                    <section className="bg-muted/30 rounded-2xl p-5 space-y-4">
                        <h3 className="font-semibold">Continence & Devices</h3>

                        <select name="continenceStatus" value={formData.continenceStatus || ""} onChange={handleChange} className="input">
                            <option value="">Continence Status</option>
                            <option>Continent</option>
                            <option>Partially Continent</option>
                            <option>Incontinent</option>
                        </select>

                        <div className="flex flex-wrap gap-4">
                            {Object.keys(formData.aidsUsed).map(key => (
                                <label key={key} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name={key}
                                        checked={formData.aidsUsed[key as keyof typeof formData.aidsUsed]}
                                        onChange={handleChange}
                                        data-group="aidsUsed"
                                        className="checkbox"
                                    />
                                    {key}
                                </label>
                            ))}
                        </div>

                        <select name="catheterType" value={formData.catheterType || ""} onChange={handleChange} className="input">
                            <option value="">Catheter Type</option>
                            <option>None</option>
                            <option>IDC</option>
                            <option>SPC</option>
                        </select>

                        <div className="flex gap-6">
                            <label className="checkbox-label">
                                <input type="checkbox" name="siteCleanAndIntact" checked={formData.siteCleanAndIntact} onChange={handleChange} className="checkbox" />
                                Site clean & intact
                            </label>

                            <label className="checkbox-label">
                                <input type="checkbox" name="bagBelowBladder" checked={formData.bagBelowBladder} onChange={handleChange} className="checkbox" />
                                Bag below bladder
                            </label>
                        </div>
                    </section>

                    {/* ================= Comments ================= */}
                    <section className="space-y-2">
                        <label className="font-medium">Comments</label>
                        <textarea
                            name="comments"
                            value={formData.comments}
                            onChange={handleChange}
                            className="input h-28"
                        />
                    </section>

                    {/* ================= Submit ================= */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="bg-primary text-primary-foreground px-8 py-3 rounded-xl
                       font-medium shadow-md hover:shadow-lg hover:bg-primary/90 transition-all"
                        >
                            Save Record
                        </button>
                    </div>
                </form>
            </PageContainer>
            <Footer />
        </div>

    );
}
