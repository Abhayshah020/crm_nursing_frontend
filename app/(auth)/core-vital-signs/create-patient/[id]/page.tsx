"use client"

import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage"
import PageContainer from "@/components/PageContainer"
import { useToast } from "@/components/toast/ToastContext"
import axiosClient from "@/lib/axiosClient"
import { Save, Sparkles } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function CreateCoreVitalSignPage() {
    const router = useRouter()
    const { id } = useParams<{ id: string }>();

    const [form, setFormData] = useState({
        patientId: "",
        patientName: "",
        temperature: "",
        temperatureNote: "Normal",
        pulseRate: "",
        pulseNote: "Regular",
        bloodPressureSystolic: "",
        bloodPressureDiastolic: "",
        bloodPressurePosition: "Sitting",
        respiratoryRate: "",
        respiratoryNote: "Normal",
        oxygenSaturation: "",
        oxygenNote: "On Air",
        comments: "",
        staffId: 1,
        staffName: "Unknown Staff",
    });
    const { showToast } = useToast();

    useEffect(() => {
        fetchPatients()
    }, [])

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
        } catch (error) {
            showToast({
                message: "Error fetching care plans",
                type: "error",
            });
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await axiosClient.post("/core-vital-signs", form)
            showToast({
                message: "Core vital sign created",
                type: "success",
            });
            router.push("/core-vital-signs")
        } catch (error) {
            showToast({
                message: "Error creating vital sign",
                type: "error",
            });
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage dontShowCreate={true} linkCreate="" title="Core Vital Signs" subtitle="Record patient vital measurements" />

            <PageContainer title="Add Core Vital Sign" subtitle="Document essential patient vitals">
                <form
                    onSubmit={handleSubmit}
                    className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8 space-y-6 max-w-7xl hover:shadow-xl transition-shadow"
                >
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Patient</label>
                        <input
                            name="patientName"
                            value={form.patientName}
                            readOnly
                            className="w-full bg-background border border-border rounded-xl px-4 py-3"
                        />

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-foreground">Temperature</label>
                            <input
                                type="number"
                                step="0.1"
                                name="temperature"
                                value={form.temperature}
                                onChange={handleChange}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                                required
                            />
                            <select name="temperatureNote" value={form.temperatureNote} onChange={handleChange} className="w-full border border-border rounded-xl px-3 py-2">
                                <option>Normal</option>
                                <option>Monitor</option>
                                <option>Escalate</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-foreground">Pulse Rate</label>
                            <input
                                type="number"
                                name="pulseRate"
                                value={form.pulseRate}
                                onChange={handleChange}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                                required
                            />
                            <select name="pulseNote" value={form.pulseNote} onChange={handleChange} className="w-full border border-border rounded-xl px-3 py-2">
                                <option>Regular</option>
                                <option>Irregular</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-foreground">Blood Pressure</label>
                            <div className="flex gap-2">
                                <input type="number" placeholder="Systolic" name="bloodPressureSystolic" value={form.bloodPressureSystolic} onChange={handleChange} className="w-1/2 bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all" required />
                                <input type="number" placeholder="Diastolic" name="bloodPressureDiastolic" value={form.bloodPressureDiastolic} onChange={handleChange} className="w-1/2 bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all" required />
                            </div>
                            <select name="bloodPressurePosition" value={form.bloodPressurePosition} onChange={handleChange} className="w-full border border-border rounded-xl px-3 py-2">
                                <option>Sitting</option>
                                <option>Standing</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-foreground">Respiratory Rate</label>
                            <input type="number" name="respiratoryRate" value={form.respiratoryRate} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all" required />
                            <select name="respiratoryNote" value={form.respiratoryNote} onChange={handleChange} className="w-full border border-border rounded-xl px-3 py-2">
                                <option>Normal</option>
                                <option>Laboured</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-foreground">Oxygen Saturation</label>
                            <input type="number" name="oxygenSaturation" value={form.oxygenSaturation} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all" required />
                            <select name="oxygenNote" value={form.oxygenNote} onChange={handleChange} className="w-full border border-border rounded-xl px-3 py-2">
                                <option>On Air</option>
                                <option>On O₂</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Comments</label>
                        <textarea
                            name="comments"
                            value={form.comments}
                            onChange={handleChange}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                            rows={4}
                        />
                    </div>

                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg font-medium group"
                    >
                        <Save size={18} className="group-hover:scale-110 transition-transform" />
                        Save Vitals
                        <Sparkles size={14} className="ml-1 opacity-70" />
                    </button>
                </form>
            </PageContainer>

        </div>
    )
}
