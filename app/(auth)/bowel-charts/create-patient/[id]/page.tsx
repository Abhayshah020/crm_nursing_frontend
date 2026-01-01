"use client";

import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";
import PageContainer from "@/components/PageContainer";
import { useToast } from "@/components/toast/ToastContext";
import axiosClient from "@/lib/axiosClient";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
export const dynamic = "force-dynamic"; // ✅ prevent prerender

export default function BowelChartForm() {
    const { showToast } = useToast();
    const { id } = useParams<{ id: string }>();

    const [patients, setPatients] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        patientId: "",
        patientName: "",
        bowelMotion: false,
        bristolType: "Separate hard lumps (severe constipation)",
        bristolAmount: "Small",
        straining: false,
        painDiscomfort: false,
        bloodMucusPresent: false,
        incompleteEmptying: false,
        unusualOdour: false,
        comments: "",
    });

    useEffect(() => {
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
                    message: "Error creating bowel chart",
                    type: "error",
                });
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
            if (formData.patientName === "") {
                return alert("Please fill the name of the patient!")
            }
            const staffName = JSON.parse(sessionStorage.getItem("user")).name
            const res = await axiosClient.post("/bowel-charts", { ...formData, staffName });
            if (res.status === 200 || res.status === 201) {
                showToast({
                    message: "Bowel charts was success!",
                    type: "success",
                });
                setFormData({
                    patientId: "",
                    patientName: "",
                    bowelMotion: false,
                    bristolType: "Separate hard lumps (severe constipation)",
                    bristolAmount: "Small",
                    straining: false,
                    painDiscomfort: false,
                    bloodMucusPresent: false,
                    incompleteEmptying: false,
                    unusualOdour: false,
                    comments: "",
                });
                window.location.href = "/bowel-charts";
            }
        } catch (error) {
            showToast({
                message: "Error creating bowel chart",
                type: "error",
            });
        }
    };

    return (
        <div className="flex flex-col min-h-screen">

            <NavBarOfInternalPage dontShowCreate={true} title="New Neurological Observation" subtitle="Manage and review" />

            <PageContainer title="New Bowel Chart" subtitle="Document bowel movements and observations">
                <form
                    onSubmit={handleSubmit}
                    className="bg-card rounded-2xl shadow-lg border p-6 space-y-6 hover:shadow-xl transition-shadow"
                >
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Patient</label>
                        <input
                            name="patientName"
                            value={formData.patientName}
                            readOnly
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary outline-none"
                            required
                        />

                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="bowelMotion" checked={formData.bowelMotion} onChange={handleChange} />
                            Bowel Motion (Y/N)
                        </label>

                        <select
                            name="bristolAmount"
                            value={formData.bristolAmount}
                            onChange={handleChange}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary outline-none"
                            required
                        >
                            <option value="">Bristol Amount</option>
                            <option value="Small">Small</option>
                            <option value="Medium">Medium</option>
                            <option value="Large">Large</option>
                        </select>

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

        </div>
    );
}
