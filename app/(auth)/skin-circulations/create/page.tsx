"use client";

import { useState, useEffect, useMemo } from "react";
import PageContainer from "@/components/PageContainer";
import axiosClient from "@/lib/axiosClient";
import Footer from "@/components/Footer";
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";
import { useToast } from "@/components/toast/ToastContext";
import { useRouter } from "next/navigation";
import { formattedDate } from "../../daily-notes/create/page";
import { Save, Sparkles } from "lucide-react";

export default function NewSkinCirculation() {
    const [patients, setPatients] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        patientId: "",
        patientName: "",
        skinColour: "Normal",
        skinTemperature: "Warm",
        skinIntegrityIssues: "Nil",
        capillaryRefill: "<2 sec",
        comments: "",
        timestamp: '',
        date: "",
        time: "",
    });
    const { showToast } = useToast();
    const router = useRouter();

    const fetchPatients = async () => {
        try {
            const res = await axiosClient.get("/patients");
            if (res.status === 200) setPatients(res.data.data);
        } catch (err) {
            console.error("Error fetching patients:", err);
        }
    };

    useMemo(() => {
        const data = formattedDate()
        setFormData((prev) => ({
            ...prev,
            timestamp: data,
        }))
    }, []);

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (formData.date === "" || formData.time === "" || formData.patientName === "") {
                showToast({
                    message: "Please fill the data for patient name, date and time.",
                    type: "error",
                });
                return;
            }
            const parsed = JSON.parse(sessionStorage.getItem("user"));
            const createdBy = parsed?.name || "Unknown Staff"
            const createdById = parsed?.id || 0
            const createdPerson = { createdBy, createdById }

            const res = await axiosClient.post("/skin-circulations", { ...formData, ...createdPerson });
            if (res.status === 201 || res.status === 200) {
                showToast({
                    message: "Skin & Circulation record created",
                    type: "success",
                });

                router.push("/skin-circulations");
            } else {
                showToast({
                    message: "Something went wrong!",
                    type: "error",
                });
            }
        } catch (error) {
            showToast({
                message: "Something went wrong!",
                type: "error",
            });
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage dontShowCreate={true} title="Skin & Circulation Record" subtitle="Manage and review" />

            <PageContainer title="Skin & Circulation Record" subtitle="Document patient skin and circulation">
                <form
                    onSubmit={handleSubmit}
                    className="
    bg-card/95 backdrop-blur
    rounded-2xl
    shadow-lg hover:shadow-xl
    border border-border
    p-6 sm:p-8
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

                    <div className="flex gap-4 items-center flex-wrap">
                        <div className="space-y-2 flex-1">
                            <label className="block text-sm font-medium text-foreground">Date</label>
                            <input
                                type="date"
                                name="date"
                                defaultValue={formData.date}
                                onChange={handleChange}
                                required
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2 flex-1">
                            <label className="block text-sm font-medium text-foreground">Time</label>
                            <input
                                type="time"
                                name="time"
                                defaultValue={formData.time}
                                onChange={handleChange}
                                required
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                        </div>
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

                    <button type="submit" className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl">
                        <Save size={18} /> Save Record <Sparkles size={14} />
                    </button>
                </form>

            </PageContainer>

        </div>
    );
}
