"use client";

import { useState, useEffect } from "react";
import PageContainer from "@/components/PageContainer";
import axiosClient from "@/lib/axiosClient";
import Footer from "@/components/Footer";
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";

export default function NewSkinCirculation() {
    const [patients, setPatients] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        patientId: "",
        patientName: "",
        skinColour: "",
        skinTemperature: "",
        skinIntegrityIssues: "",
        capillaryRefill: "<2 sec",
        comments: "",
        staffName: "Unknown Staff",
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const user = sessionStorage.getItem("user");
            if (user) {
                const parsed = JSON.parse(user);
                setFormData((prev) => ({
                    ...prev,
                    staffName: parsed?.name || "Unknown Staff",
                }));
            }
        }
    }, []);

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
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axiosClient.post("/skin-circulations", formData);
            if (res.status === 201 || res.status === 200) {
                alert("Skin & Circulation record created");
                setFormData({
                    patientId: "",
                    patientName: "",
                    skinColour: "",
                    skinTemperature: "",
                    skinIntegrityIssues: "",
                    capillaryRefill: "",
                    comments: "",
                    staffName: "",
                });
                window.location.href = "/skin-circulations";
            } else alert("Error creating record");
        } catch (error) {
            alert("Error creating record");
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage dontShowCreate={true} title="New Skin & Circulation Record" subtitle="Manage and review" />

            <PageContainer title="New Skin & Circulation Record" subtitle="Document patient skin and circulation">
                <form
                    onSubmit={handleSubmit}
                    className="
    bg-card/95 backdrop-blur
    rounded-2xl
    shadow-lg hover:shadow-xl
    border border-border
    p-6 sm:p-8
    max-w-4xl
    space-y-8
    transition-all
  "
                >
                    {/* Header */}
                    <div className="space-y-1">
                        <h2 className="text-xl font-semibold text-foreground">
                            Skin Circulation Observation
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Document skin colour, temperature, integrity, and circulation status
                        </p>
                    </div>

                    {/* Patient */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            Patient
                        </label>
                        <select
                            name="patientName"
                            value={formData.patientName}
                            onChange={(e) => {
                                handleChange(e);
                                const selectedPatient = patients.find(p => p.name === e.target.value);
                                setFormData(prev => ({
                                    ...prev,
                                    patientId: selectedPatient?.id || "",
                                }));
                            }}
                            className="
        w-full
        rounded-xl
        bg-background
        border border-border
        px-4 py-3
        text-foreground
        focus:ring-2 focus:ring-primary/50
        focus:border-primary
        outline-none
        transition
      "
                        >
                            <option value="">Select a patient</option>
                            {patients.map(patient => (
                                <option key={patient.id} value={patient.name}>
                                    {patient.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Skin Assessment */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-foreground">
                            Skin Assessment
                        </h3>

                        <div className="grid sm:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Skin Colour
                                </label>
                                <select
                                    name="skinColour"
                                    value={formData.skinColour}
                                    onChange={handleChange}
                                    className="w-full rounded-xl bg-background border border-border px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none transition"
                                >
                                    <option value="">Select</option>
                                    <option>Normal</option>
                                    <option>Pale</option>
                                    <option>Flushed</option>
                                    <option>Cyanotic</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Skin Temperature
                                </label>
                                <select
                                    name="skinTemperature"
                                    value={formData.skinTemperature}
                                    onChange={handleChange}
                                    className="w-full rounded-xl bg-background border border-border px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none transition"
                                >
                                    <option value="">Select</option>
                                    <option>Warm</option>
                                    <option>Cool</option>
                                    <option>Cold</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Skin Integrity
                                </label>
                                <select
                                    name="skinIntegrityIssues"
                                    value={formData.skinIntegrityIssues}
                                    onChange={handleChange}
                                    className="w-full rounded-xl bg-background border border-border px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none transition"
                                >
                                    <option value="">Select</option>
                                    <option>Nil</option>
                                    <option>Bruising</option>
                                    <option>Wound</option>
                                    <option>Pressure Area</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Capillary Refill
                                </label>
                                <select
                                    name="capillaryRefill"
                                    value={formData.capillaryRefill}
                                    onChange={handleChange}
                                    className="w-full rounded-xl bg-background border border-border px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none transition"
                                >
                                    <option value="">Select</option>
                                    <option value={"<2 sec"}>&lt; 2 sec</option>
                                    <option value={">2 sec"}>&gt; 2 sec</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Comments */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            Comments / Notes
                        </label>
                        <textarea
                            name="comments"
                            rows={4}
                            value={formData.comments}
                            onChange={handleChange}
                            placeholder="Add any relevant skin observations..."
                            className="
        w-full
        rounded-xl
        bg-background
        border border-border
        px-4 py-3
        text-foreground
        placeholder:text-muted-foreground
        focus:ring-2 focus:ring-primary/50
        focus:border-primary
        outline-none
        transition
        resize-none
      "
                        />
                    </div>

                    {/* Staff */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            Staff Name
                        </label>
                        <input
                            type="text"
                            name="staffName"
                            value={formData.staffName}
                            // onChange={handleChange}
                            readOnly
                            className="
        w-full
        rounded-xl
        bg-background
        border border-border
        px-4 py-3
        text-foreground
        focus:ring-2 focus:ring-primary/50
        focus:border-primary
        outline-none
        transition
      "
                        />
                    </div>

                    {/* Action */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="
        inline-flex items-center gap-2
        rounded-xl
        bg-primary
        px-6 py-3
        text-sm font-semibold text-primary-foreground
        shadow-md
        hover:bg-primary/90
        hover:shadow-lg
        active:scale-[0.98]
        transition-all
      "
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
