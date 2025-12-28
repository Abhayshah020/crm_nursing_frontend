"use client";

import { useState, useEffect } from "react";
import PageContainer from "@/components/PageContainer";
import axiosClient from "@/lib/axiosClient";
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";
import Footer from "@/components/Footer";

export default function BowelChartForm() {
    const [patients, setPatients] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        patientId: "",
        patientName: "",
        bowelMotion: false,
        bristolType: "",
        straining: false,
        painDiscomfort: false,
        bloodMucusPresent: false,
        incompleteEmptying: false,
        unusualOdour: false,
        comments: "",
        staffName: JSON.parse(sessionStorage.getItem("user") || "{}")?.name || "Unknown Staff",
    });

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await axiosClient.get("/patients");
                setPatients(res.data);
            } catch (err) {
                console.error("Error fetching patients:", err);
            }
        };
        fetchPatients();
    }, []);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axiosClient.post("/bowel-charts", formData);
            if (res.status === 200 || res.status === 201) {
                alert("Bowel chart created");
                setFormData({
                    patientId: "",
                    patientName: "",
                    bowelMotion: false,
                    bristolType: "",
                    straining: false,
                    painDiscomfort: false,
                    bloodMucusPresent: false,
                    incompleteEmptying: false,
                    unusualOdour: false,
                    comments: "",
                    staffName: "",
                });
                window.location.href = "/bowel-charts";
            }
        } catch (error) {
            alert("Error creating bowel chart");
        }
    };

    return (
        <div className="flex flex-col min-h-screen">

            <NavBarOfInternalPage dontShowCreate={true} title="New Neurological Observation" subtitle="Manage and review" />

            <PageContainer title="New Bowel Chart" subtitle="Document bowel movements and observations">
                <form
                    onSubmit={handleSubmit}
                    className="bg-card rounded-2xl shadow-lg border p-6 space-y-6 max-w-4xl hover:shadow-xl transition-shadow"
                >
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Patient</label>
                        <select
                            name="patientName"
                            value={formData.patientName}
                            onChange={(e) => {
                                const selected = patients.find(p => p.name === e.target.value);
                                setFormData({
                                    ...formData,
                                    patientId: selected?.id || "",
                                    patientName: e.target.value || "",
                                });
                            }}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary outline-none"
                            required
                        >
                            <option value="">Select a patient</option>
                            {patients.map(p => (
                                <option key={p.name} value={p.name}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="bowelMotion" checked={formData.bowelMotion} onChange={handleChange} />
                            Bowel Motion (Y/N)
                        </label>

                        <select
                            name="bristolType"
                            value={formData.bristolType}
                            onChange={handleChange}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary outline-none"
                            required
                        >
                            <option value="">Bristol Type</option>
                            <option value="Separate hard lumps (severe constipation)">1 - Separate hard lumps</option>
                            <option value="Sausage-shaped but lumpy">2 - Sausage-shaped but lumpy</option>
                            <option value="Sausage with cracks on surface">3 - Sausage with cracks on surface</option>
                            <option value="Smooth, soft sausage or snake (normal)">4 - Smooth, soft sausage or snake (normal)</option>
                            <option value="Soft blobs with clear edges">5 - Soft blobs with clear edges</option>
                            <option value="Mushy stool, fluffy pieces">6 - Mushy stool, fluffy pieces</option>
                            <option value="Watery, no solid pieces (diarrhoea)">7 - Watery, no solid pieces (diarrhoea)</option>
                        </select>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="straining" checked={formData.straining} onChange={handleChange} />
                            Straining
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="painDiscomfort" checked={formData.painDiscomfort} onChange={handleChange} />
                            Pain / Discomfort
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="bloodMucusPresent" checked={formData.bloodMucusPresent} onChange={handleChange} />
                            Blood / Mucus
                        </label>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="incompleteEmptying" checked={formData.incompleteEmptying} onChange={handleChange} />
                            Incomplete Emptying
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="unusualOdour" checked={formData.unusualOdour} onChange={handleChange} />
                            Unusual Odour
                        </label>
                        <input
                            type="text"
                            name="staffName"
                            placeholder="Staff Name"
                            value={formData.staffName}
                            // onChange={handleChange}
                            readOnly
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary outline-none"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Comments</label>
                        <textarea
                            name="comments"
                            value={formData.comments}
                            onChange={handleChange}
                            rows={4}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground resize-none focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-all shadow-md font-medium"
                    >
                        Save Record
                    </button>
                </form>
            </PageContainer>
            <Footer />
        </div>
    );
}
