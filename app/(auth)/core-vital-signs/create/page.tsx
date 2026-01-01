"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Save, Sparkles } from "lucide-react"
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage"
import PageContainer from "@/components/PageContainer"
import Footer from "@/components/Footer"
import axiosClient from "@/lib/axiosClient"

export default function CreateCoreVitalSignPage() {
    const router = useRouter()
    const [patients, setPatients] = useState([])
    const [form, setForm] = useState({
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

    useEffect(() => {
        if (typeof window !== "undefined") {
            const user = sessionStorage.getItem("user");
            if (user) {
                const parsed = JSON.parse(user);
                setForm((prev) => ({
                    ...prev,
                    staffName: parsed?.name || "Unknown Staff",
                }));
            }
        }
    }, []);

    useEffect(() => {
        fetchPatients()
    }, [])

    const fetchPatients = async () => {
        try {
            const res = await axiosClient.get("/patients")
            setPatients(res.data.data)
        } catch (error) {
            console.error("Error fetching patients:", error)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await axiosClient.post("/core-vital-signs", form)
            alert("Core vital sign created")
            router.push("/core-vital-signs")
        } catch (error) {
            console.error("Error creating vital sign:", error)
            alert("Error creating vital sign")
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
                        <select
                            name="patientId"
                            value={form.patientId}
                            onChange={(e) => {
                                const selected = patients.find(p => p.id.toString() === e.target.value)
                                if (selected) {
                                    setForm({
                                        ...form,
                                        patientId: selected.id,
                                        patientName: selected.name,
                                    })
                                }
                            }}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3"
                        >
                            <option value="">Select a patient</option>
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>

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
