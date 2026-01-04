"use client";

import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";
import PageContainer from "@/components/PageContainer";
import { useToast } from "@/components/toast/ToastContext";
import axiosClient from "@/lib/axiosClient";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { formattedDate } from "../../daily-notes/create/page";
import { Save, Sparkles } from "lucide-react";

export default function CreateNeuroObservation() {
    const [patients, setPatients] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        patientId: "",
        patientName: "",
        levelOfConsciousness: "Alert",
        orientation: "Person",
        speech: "Clear",
        pupils: "Equal",
        comments: "",
        timestamp: '',
        date: "",
        time: "",
    });
    const { showToast } = useToast();
    const router = useRouter()
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await axiosClient.get("/patients");
                if (res.status === 200) setPatients(res.data.data);
            } catch (err) {
                showToast({
                    message: "Something went wrong!",
                    type: "error",
                });
            }
        };

        fetchPatients();
    }, []);


    useMemo(() => {
        const data = formattedDate()
        setFormData((prev) => ({
            ...prev,
            timestamp: data,
        }))
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

            const formDataWithStaff = { ...formData, ...createdPerson };
            const res = await axiosClient.post("/neuro-general-observations", formDataWithStaff);
            if (res.status === 201) {
                showToast({
                    message: "Observation created",
                    type: "success",
                });
                router.push("/neuro-general-observations");
            } else {
                showToast({
                    message: "Something went wrong!",
                    type: "error",
                });
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
                            <label className="block text-sm font-medium text-foreground">Times</label>
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
                    <button type="submit" className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl">
                        <Save size={18} /> Save Record <Sparkles size={14} />
                    </button>
                    
                </form>

            </PageContainer>

        </div>
    );
}
