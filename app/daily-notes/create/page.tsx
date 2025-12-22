"use client"

import type React from "react"

import { useState } from "react"
import axios from "axios"
import AppNavbar from "@/components/AppNavbar"
import PageContainer from "@/components/PageContainer"
import Footer from "@/components/Footer"
import { Save, Sparkles } from "lucide-react"

export default function CreateDailyNotePage() {
    const [formData, setFormData] = useState({
        clientName: "",
        date: "",
        notes: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault()
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/daily-notes`, formData)
            if (res.status === 201 || res.status === 200) {
                alert("Daily note created")
                setFormData({ clientName: "", date: "", notes: "" })
                window.location.href = "/daily-notes"
            } else {
                alert("Error creating daily note")
            }
        } catch (error) {
            alert("Error creating daily note")
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <AppNavbar />
            <PageContainer title="Create Daily Note" subtitle="Document important care observations and activities">
                <form
                    onSubmit={handleSubmit}
                    className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8 space-y-6 max-w-2xl hover:shadow-xl transition-shadow"
                >
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Client Name</label>
                        <input
                            name="clientName"
                            value={formData.clientName}
                            onChange={handleChange}
                            required
                            placeholder="Enter client name"
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
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

                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg font-medium group"
                    >
                        <Save size={18} className="group-hover:scale-110 transition-transform" />
                        Save Note
                        <Sparkles size={14} className="ml-1 opacity-70" />
                    </button>
                </form>
            </PageContainer>
            <Footer />
        </div>
    )
}
