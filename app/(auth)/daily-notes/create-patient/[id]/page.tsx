"use client"

import type React from "react"

import Footer from "@/components/Footer"
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage"
import PageContainer from "@/components/PageContainer"
import axiosClient from "@/lib/axiosClient"
import { Save, Sparkles } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { useToast } from "@/components/toast/ToastContext"
import { useRouter } from "next/navigation";
import { formattedDate } from "../../create/page"

export default function CreateDailyNotePage() {
    const { id } = useParams<{ id: string }>();
    const { showToast } = useToast();
    const router = useRouter();

    const [formData, setFormData] = useState({
        patientId: "",
        patientName: "",
        date: "",
        timestamp: '',
        notes: "",
        time: "",
    })

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
            showToast({
                message: "Something went wrong!",
                type: "error",
            });
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            if (
                formData.patientName === "" ||
                formData.date === "" ||
                formData.notes === "" ||
                formData.time === ""
            ) {
                showToast({
                    message: "Please fill all the details of notes!",
                    type: "error",
                });
                return;
            }
            const parsed = JSON.parse(sessionStorage.getItem("user"));
            const createdBy = parsed?.name || "Unknown Staff"
            const createdById = parsed?.id || 0
            const createdPerson = { createdBy, createdById }

            const res = await axiosClient.post("/daily-notes", { ...formData, ...createdPerson });
            if (res.status === 201 || res.status === 200) {
                showToast({
                    message: "Daily note saved successfully",
                    type: "success",
                });
                setFormData({ patientId: "", patientName: "", timestamp: "", notes: "", date: "", time: "" });
                router.push(`/daily-notes/patients-all-notes/${id}`);
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
            <NavBarOfInternalPage dontShowCreate={true} title="Daily Notes" subtitle="Manage and review all daily notes" />

            <PageContainer title="Create Daily Note" subtitle="Document important care observations and activities">
                <form
                    onSubmit={handleSubmit}
                    className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8 space-y-6 max-w-7xl hover:shadow-xl transition-shadow"
                >
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Patient Name</label>
                        <input
                            id="patientName"
                            value={formData.patientName || ""}
                            readOnly
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />

                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Notes</label>
                        <textarea
                            name="notes"
                            rows={6}
                            value={formData.notes}
                            onChange={handleChange}
                            required
                            placeholder="Enter detailed care notes..."
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
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

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Time Stamps</label>
                        <input
                            type="text"
                            name="timestamp"
                            defaultValue={formData.timestamp}
                            // onChange={handleChange}
                            readOnly
                            required
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <button type="submit" className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl">
                        <Save size={18} /> Save Record <Sparkles size={14} />
                    </button>
                </form>
            </PageContainer>

        </div>
    )
}
