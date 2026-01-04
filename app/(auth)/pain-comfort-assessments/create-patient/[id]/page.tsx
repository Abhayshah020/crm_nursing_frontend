"use client"

import { formattedDate } from "@/app/(auth)/daily-notes/create/page"
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage"
import PageContainer from "@/components/PageContainer"
import { useToast } from "@/components/toast/ToastContext"
import axiosClient from "@/lib/axiosClient"
import { Save, Sparkles } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

export default function CreatePainComfortAssessmentPage() {
    const [formData, setFormData] = useState({
        patientId: "",
        patientName: "",
        painScore: "",
        painLocation: "",
        painDescription: "Sharp",
        painManagementRequired: "No",
        actionTaken: "",
        comments: "",
        timestamp: '',
        date: "",
        time: "",
    });
    const { id } = useParams<{ id: string }>();

    const { showToast } = useToast();
    const router = useRouter()

    useMemo(() => {
        const data = formattedDate()
        setFormData((prev) => ({
            ...prev,
            timestamp: data,
        }))
    }, []);

    const fetchPatients = async () => {
        try {
            const res = await axiosClient.get(`/patients/${id}`);
            if (res.status === 200) {
                setFormData((prev) => ({
                    ...prev,
                    patientId: res.data.data.id,
                    patientName: res.data.data.name,
                }))
            };
        } catch (err) {
            console.error("Error fetching patients:", err);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: any) => {
        try {
            e.preventDefault()

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
            await axiosClient.post("/pain-comfort-assessments", {
                ...formData,
                painScore: Number(formData.painScore),
                patientId: Number(formData.patientId),
                ...createdPerson,
            })
            showToast({
                message: "Pain & Comfort Assessment Created",
                type: "success",
            });
            router.push(`/pain-comfort-assessments/patients-all-notes/${id}`);
        } catch (err) {
            console.error("Error fetching patients:", err);
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage title="Pain & Comfort Assessment" subtitle="Create assessment" dontShowCreate />
            <PageContainer
                title="New Pain & Comfort Assessment"
                subtitle="Document patient pain level and comfort status"
            >
                <form
                    onSubmit={handleSubmit}
                    className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8 space-y-6 max-w-7xl hover:shadow-xl transition-shadow"
                >

                    {/* Patient */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">
                            Patient
                        </label>
                        <input
                            name="patientName"
                            defaultValue={formData.patientName}
                            readOnly
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
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
                    {/* Pain Score */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">
                            Pain Score (0–10)
                        </label>
                        <input
                            type="number"
                            min={0}
                            max={10}
                            name="painScore"
                            value={formData.painScore}
                            onChange={handleChange}
                            placeholder="Enter pain score"
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    {/* Pain Location */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">
                            Pain Location
                        </label>
                        <input
                            type="text"
                            name="painLocation"
                            value={formData.painLocation}
                            onChange={handleChange}
                            placeholder="e.g. Lower back, knee, chest"
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    {/* Pain Description */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">
                            Pain Description
                        </label>
                        <select
                            name="painDescription"
                            value={formData.painDescription}
                            onChange={handleChange}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        >
                            <option value="">Select description</option>
                            <option value="Sharp">Sharp</option>
                            <option value="Dull">Dull</option>
                            <option value="Burning">Burning</option>
                            <option value="Constant">Constant</option>
                        </select>
                    </div>

                    {/* Pain Management Required */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">
                            Pain Management Required
                        </label>
                        <select
                            name="painManagementRequired"
                            value={formData.painManagementRequired}
                            onChange={handleChange}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        >
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                        </select>
                    </div>

                    {/* Action Taken */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">
                            Action Taken
                        </label>
                        <input
                            type="text"
                            name="actionTaken"
                            value={formData.actionTaken}
                            onChange={handleChange}
                            placeholder="Medication, repositioning, escalation, etc."
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    {/* Comments */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">
                            Comments
                        </label>
                        <textarea
                            rows={4}
                            name="comments"
                            value={formData.comments}
                            onChange={handleChange}
                            placeholder="Additional observations or notes..."
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Submit */}
                    <button type="submit" className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl">
                        <Save size={18} /> Save Record <Sparkles size={14} />
                    </button>
                </form>
            </PageContainer>



        </div>
    )
}
