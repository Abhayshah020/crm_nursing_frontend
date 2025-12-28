"use client";

import { useState, useEffect } from "react";
import PageContainer from "@/components/PageContainer";
import { Save, Sparkles } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import Footer from "@/components/Footer";
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";

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
        staffName: JSON.parse(sessionStorage.getItem("user") || "{}")?.name || "Unknown Staff",
    });

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type, checked } = target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axiosClient.post("/general-hygiene-care", formData);
            if (res.status === 201 || res.status === 200) {
                alert("Record created successfully");
                setFormData({
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
                    staffName: "",
                });
                window.location.href = "/general-hygiene-care";
            } else {
                alert("Error creating record");
            }
        } catch (err) {
            console.error(err);
            alert("Error creating record");
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage dontShowCreate={true} title="New General Hygiene Care" subtitle="" />

            <PageContainer title="New General Hygiene Care" subtitle="Document hygiene care observations">
                <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-lg border p-6 sm:p-8 space-y-6 max-w-5xl hover:shadow-xl transition-shadow">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Patient Name</label>
                        <select
                            name="patientName"
                            value={formData.patientName}
                            onChange={() => {
                                const select = event?.target as HTMLSelectElement;
                                const selectedPatient = patients.find((p) => p.name === select.value);
                                setFormData({
                                    ...formData,
                                    patientName: select.value,
                                    patientId: selectedPatient ? selectedPatient.id : "",
                                });
                            }}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                        >
                            <option value="">Select a patient</option>
                            {patients.map((p) => (
                                <option key={p.id} value={p.name}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                        {["sponge", "shower", "hairWash", "oralCare", "teethCleaned", "denturesCleaned", "bedBath"].map((field) => (
                            <label key={field} className="flex items-center gap-2 bg-muted/30 p-4 rounded-xl cursor-pointer">
                                <input type="checkbox" name={field} checked={formData[field as keyof typeof formData] as boolean} onChange={handleChange} className="accent-primary" />
                                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")}
                            </label>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Comments</label>
                        <textarea
                            name="comments"
                            rows={4}
                            value={formData.comments}
                            onChange={handleChange}
                            placeholder="Enter any comments..."
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Staff Name</label>
                        <input
                            type="text"
                            name="staffName"
                            value={formData.staffName}
                            readOnly
                            // onChange={handleChange}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                        />
                    </div>

                    <button type="submit" className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg font-medium group">
                        <Save size={18} className="group-hover:scale-110 transition-transform" /> Save Record
                        <Sparkles size={14} className="ml-1 opacity-70" />
                    </button>
                </form>
            </PageContainer>
            <Footer />
        </div>
    );
}
