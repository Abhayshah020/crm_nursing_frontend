"use client";

import { useState } from "react";
import axios from "axios";
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";
import PageContainer from "@/components/PageContainer";
import { Save, Sparkles } from "lucide-react"
import Footer from "@/components/Footer";
import axiosClient from "@/lib/axiosClient";

export default function CreatePatientPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contact: "",
        age: "",
        address: "",
        details: {},
    });

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosClient.post("/patients", formData);
            if (res.status === 201 || res.status === 200) {
                alert("Patient created successfully");
                window.location.href = "/patients";
            } else {
                alert("Error creating patient");
            }
        } catch (error) {
            alert("Error creating patient");
        }
    };


    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage dontShowCreate={true} title="Patients" subtitle="Create a new patient" />

            <PageContainer title="Create Patient" subtitle="Enter patient details to add to the system">
                <form
                    onSubmit={handleSubmit}
                    className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8 space-y-6 max-w-7xl hover:shadow-xl transition-shadow"
                >
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Patient Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter patient name"
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    {/* Contact */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Contact</label>
                        <input
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Email</label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email address"
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    {/* Age */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Age</label>
                        <input
                            name="age"
                            type="number"
                            value={formData.age}
                            onChange={handleChange}
                            placeholder="Enter age"
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Address</label>
                        <textarea
                            name="address"
                            rows={4}
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter address"
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg font-medium group"
                    >
                        <Save size={18} className="group-hover:scale-110 transition-transform" />
                        Save Patient
                        <Sparkles size={14} className="ml-1 opacity-70" />
                    </button>
                </form>

            </PageContainer>
            <Footer />
        </div>
    );
}
