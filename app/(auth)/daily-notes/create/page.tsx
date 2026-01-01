"use client"

import type React from "react"

import Footer from "@/components/Footer"
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage"
import PageContainer from "@/components/PageContainer"
import axiosClient from "@/lib/axiosClient"
import { Save, Sparkles } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

export default function CreateDailyNotePage() {
    const formattedDate = useMemo(() => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const dayOfMonth = currentDate.getDate();
        const dayOfWeek = currentDate.getDay();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const seconds = currentDate.getSeconds();


        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayName = days[dayOfWeek];

        const offsetMinutes = currentDate.getTimezoneOffset();
        const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
        const offsetMins = Math.abs(offsetMinutes) % 60;
        const offsetSign = offsetMinutes > 0 ? '-' : '+';
        const formattedOffset = `${offsetSign}${offsetHours.toString().padStart(2, '0')}:${offsetMins.toString().padStart(2, '0')}`;

        const formattedDate = `${dayName}, ${month}/${dayOfMonth}/${year} ${hours}:${minutes}:${seconds} UTC${formattedOffset}`;

        return formattedDate;
    }, [])

    const [formData, setFormData] = useState({
        patientId: "",
        patientName: "",
        date: "",
        timeStamps: formattedDate || '',
        notes: "",
        time: "",
    })
    const [patients, setPatients] = useState([]);

    const fetchPatients = async () => {
        try {
            const res = await axiosClient.get("/patients");
            if (res.status === 200) {
                setPatients(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching patients:", err);
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
            const res = await axiosClient.post("/daily-notes", formData);
            if (res.status === 201 || res.status === 200) {
                alert("Daily note created");
                setFormData({ patientId: "", patientName: "", timeStamps: "", notes: "", date: "", time: "" });
                window.location.href = "/daily-notes";
            } else {
                alert("Error creating daily note");
            }
        } catch (error) {
            alert("Error creating daily note");
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
                        <label className="block text-sm font-medium text-foreground">Client Name</label>
                        <select
                            id="patientName"
                            value={formData.patientName}
                            onChange={(e) => {
                                const selectedPatient = patients.find((patient) => patient.name === e.target.value);
                                setFormData((prev) => ({
                                    ...prev,
                                    patientName: e.target.value,
                                    patientId: selectedPatient ? selectedPatient.id : "",
                                }));
                            }}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        >
                            <option value="">Select a client</option>
                            {patients.map((patient) => (
                                <option key={patient.id} value={patient.name}>
                                    {patient.name}
                                </option>
                            ))}
                        </select>
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
                            name="timeStamps"
                            defaultValue={formData.timeStamps}
                            // onChange={handleChange}
                            readOnly
                            required
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
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
            
        </div>
    )
}
