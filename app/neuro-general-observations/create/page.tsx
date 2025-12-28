"use client";

import { useState, useEffect } from "react";
import PageContainer from "@/components/PageContainer";
import axiosClient from "@/lib/axiosClient";
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";
import Footer from "@/components/Footer";

export default function CreateNeuroObservation() {
    const [patients, setPatients] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        patientId: "",
        patientName: "",
        levelOfConsciousness: "",
        orientation: "",
        speech: "",
        pupils: "",
        comments: "",
    });

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const res = await axiosClient.get("/patients");
            if (res.status === 200) setPatients(res.data);
        } catch (err) {
            console.error("Error fetching patients:", err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const staffName = JSON.parse(sessionStorage.getItem("user") || "{}")?.name || "Unknown Staff";

            const formDataWithStaff = { ...formData, staffName };
            const res = await axiosClient.post("/neuro-general-observations", formDataWithStaff);
            if (res.status === 201) {
                alert("Observation created");
                setFormData({
                    patientId: "",
                    patientName: "",
                    levelOfConsciousness: "",
                    orientation: "",
                    speech: "",
                    pupils: "",
                    comments: "",
                });
                window.location.href = "/neuro-general-observations";
            } else alert("Error creating observation");
        } catch (err) {
            alert("Error creating observation");
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage dontShowCreate={true} title="New Neurological Observation" subtitle="Manage and review" />

            <PageContainer title="New Neurological Observation" subtitle="Document neurological & general observations">
                <form
                    onSubmit={handleSubmit}
                    className="
    bg-card/95 backdrop-blur
    rounded-2xl
    shadow-lg hover:shadow-xl
    border border-border
    p-6 sm:p-8
    space-y-8
    max-w-4xl
    transition-all
  "
                >
                    {/* Header */}
                    <div className="space-y-1">
                        <h2 className="text-xl font-semibold text-foreground">
                            Neurological Observation
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Record patient neurological status accurately
                        </p>
                    </div>

                    {/* Patient Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            Patient Name
                        </label>
                        <select
                            name="patientName"
                            value={formData.patientName}
                            onChange={(event) => {
                                const selectedPatient = patients.find(
                                    p => p.name === (event.target as HTMLSelectElement).value
                                );
                                setFormData({
                                    ...formData,
                                    patientName: event.target.value,
                                    patientId: selectedPatient ? selectedPatient.id : "",
                                });
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
                            {patients.map(p => (
                                <option key={p.id} value={p.name}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Observation Grid */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-foreground">
                            Neurological Assessment
                        </h3>

                        <div className="grid sm:grid-cols-2 gap-5">
                            {[
                                {
                                    label: "Level of Consciousness",
                                    name: "levelOfConsciousness",
                                    options: ["Alert", "Drowsy", "Confused", "Unresponsive"],
                                },
                                {
                                    label: "Orientation",
                                    name: "orientation",
                                    options: ["Person", "Place", "Time"],
                                },
                                {
                                    label: "Speech",
                                    name: "speech",
                                    options: ["Clear", "Slurred", "Difficult"],
                                },
                                {
                                    label: "Pupils",
                                    name: "pupils",
                                    options: ["Equal", "Reactive", "Unequal"],
                                },
                            ].map(field => (
                                <div key={field.name} className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">
                                        {field.label}
                                    </label>
                                    <select
                                        name={field.name}
                                        value={(formData as any)[field.name]}
                                        onChange={handleChange}
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
                                        <option value="">Select</option>
                                        {field.options.map(opt => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Comments */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            Comments / Additional Notes
                        </label>
                        <textarea
                            name="comments"
                            value={formData.comments}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Enter any additional observations..."
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
      "
                        />
                    </div>

                    {/* Action */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="
        inline-flex items-center justify-center
        rounded-xl
        bg-primary
        px-6 py-3
        text-sm font-semibold text-white
        shadow-md
        hover:bg-primary/90
        hover:shadow-lg
        active:scale-[0.98]
        transition-all
      "
                        >
                            Save Observation
                        </button>
                    </div>
                </form>

            </PageContainer>
            <Footer />
        </div>
    );
}
