"use client";

import { useState, useEffect } from "react";
import PageContainer from "@/components/PageContainer";
import { Save, Sparkles } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import Footer from "@/components/Footer";
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";
import { useToast } from "@/components/toast/ToastContext";
import { useParams, useRouter } from "next/navigation";

export const dynamic = "force-dynamic"; // ✅ prevent prerender

export default function NewGeneralHygieneCare() {
    const [patients, setPatients] = useState<any[]>([]);
    const { id } = useParams<{ id: string }>();

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
    });
    const { showToast } = useToast();
    const router = useRouter();
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const staffName = JSON.parse(sessionStorage.getItem("user")).name;
            const res = await axiosClient.post("/general-hygiene-care", { ...formData, staffName });
            if (res.status === 200 || res.status === 201) {
                showToast({
                    message: "Record created successfully",
                    type: "success",
                });
                router.push("/general-hygiene-care");
            }
        } catch (err) {
            showToast({
                message: "Something went wrong!",
                type: "error",
            });
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage subtitle="" dontShowCreate title="General Hygiene Care" />

            <PageContainer title="General Hygiene Care" subtitle="Document hygiene care observations">
                <form
                    onSubmit={handleSubmit}
                    className="bg-card rounded-2xl shadow-lg border p-6 sm:p-8 space-y-6"
                >
                    <div>
                        <label className="block text-sm font-medium">Patient Name</label>
                        <input
                            value={formData.patientName}
                            readOnly
                            className="w-full bg-background border rounded-xl px-4 py-3"
                        />

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

                    <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl">
                        <Save size={18} /> Save Record <Sparkles size={14} />
                    </button>
                </form>
            </PageContainer>


        </div>
    );
}
