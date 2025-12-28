"use client";

import { useState, useEffect } from "react";
import PageContainer from "@/components/PageContainer";
import { Save, Sparkles } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import Footer from "@/components/Footer";
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";

export const dynamic = "force-dynamic"; // ✅ prevent prerender

export default function NewGeneralHygieneCare() {
    const [patients, setPatients] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        patientId: "",
        patientName: "",
        sponge: false,
        shower: false,
        hairWash: false,
        oralCare: false,
        teethCleaned: false,
        denturesCleaned: false,
        bedBath: false,
        comments: "",
        staffName: "Unknown Staff",
    });

    // ✅ Safe browser-only sessionStorage access
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

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await axiosClient.get("/patients");
                if (res.status === 200) setPatients(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchPatients();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handlePatientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedPatient = patients.find((p) => p.name === e.target.value);
        setFormData((prev) => ({
            ...prev,
            patientName: e.target.value,
            patientId: selectedPatient ? selectedPatient.id : "",
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axiosClient.post("/general-hygiene-care", formData);
            if (res.status === 200 || res.status === 201) {
                alert("Record created successfully");
                window.location.href = "/general-hygiene-care";
            }
        } catch (err) {
            console.error(err);
            alert("Error creating record");
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage subtitle="" dontShowCreate title="New General Hygiene Care" />

            <PageContainer title="New General Hygiene Care" subtitle="Document hygiene care observations">
                <form
                    onSubmit={handleSubmit}
                    className="bg-card rounded-2xl shadow-lg border p-6 sm:p-8 space-y-6 max-w-5xl"
                >
                    <div>
                        <label className="block text-sm font-medium">Patient Name</label>
                        <select
                            value={formData.patientName}
                            onChange={handlePatientSelect}
                            className="w-full bg-background border rounded-xl px-4 py-3"
                        >
                            <option value="">Select a patient</option>
                            {patients.map((p) => (
                                <option key={p.id} value={p.name}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                        {[
                            "sponge",
                            "shower",
                            "hairWash",
                            "oralCare",
                            "teethCleaned",
                            "denturesCleaned",
                            "bedBath",
                        ].map((field) => (
                            <label key={field} className="flex items-center gap-2 bg-muted/30 p-4 rounded-xl">
                                <input
                                    type="checkbox"
                                    name={field}
                                    checked={formData[field as keyof typeof formData] as boolean}
                                    onChange={handleChange}
                                />
                                {field.replace(/([A-Z])/g, " $1")}
                            </label>
                        ))}
                    </div>

                    <textarea
                        name="comments"
                        value={formData.comments}
                        onChange={handleChange}
                        rows={4}
                        className="w-full border rounded-xl px-4 py-3"
                        placeholder="Comments"
                    />

                    <input
                        type="text"
                        value={formData.staffName}
                        readOnly
                        className="w-full border rounded-xl px-4 py-3"
                    />

                    <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl">
                        <Save size={18} /> Save Record <Sparkles size={14} />
                    </button>
                </form>
            </PageContainer>

            <Footer />
        </div>
    );
}
