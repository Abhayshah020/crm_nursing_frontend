"use client"

import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage"
import PageContainer from "@/components/PageContainer"
import { useToast } from "@/components/toast/ToastContext"
import axiosClient from "@/lib/axiosClient"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function CreatePainComfortAssessmentPage() {
    const [form, setFormData] = useState({
        patientId: "",
        patientName: "",
        painScore: "",
        painLocation: "",
        painDescription: "Sharp",
        painManagementRequired: "No",
        actionTaken: "",
        comments: "",
        staffId: 1,
        staffName: "Unknown Staff",
    });
    const { id } = useParams<{ id: string }>();

    const { showToast } = useToast();
    const router = useRouter()
    useEffect(() => {
        if (typeof window !== "undefined") {
            const user = sessionStorage.getItem("user");
            if (user) {
                const parsed = JSON.parse(user);
                setFormData((prev) => ({
                    ...prev,
                    staffName: parsed?.name || "Unknown Staff",
                }));
            }
        }
    }, []);

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
            console.error("Error fetching patients:", err);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleChange = (e: any) => {
        setFormData({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: any) => {
        try {

            e.preventDefault()
            await axiosClient.post("/pain-comfort-assessments", {
                ...form,
                painScore: Number(form.painScore),
                patientId: Number(form.patientId),
            })
            showToast({
                message: "Pain & Comfort Assessment Created",
                type: "success",
            });
            router.push("/pain-comfort-assessments");
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
                            value={form.patientName}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
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
                            value={form.painScore}
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
                            value={form.painLocation}
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
                            value={form.painDescription}
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
                            value={form.painManagementRequired}
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
                            value={form.actionTaken}
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
                            value={form.comments}
                            onChange={handleChange}
                            placeholder="Additional observations or notes..."
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg font-medium group"
                    >
                        Save Assessment
                    </button>
                </form>
            </PageContainer>



        </div>
    )
}
