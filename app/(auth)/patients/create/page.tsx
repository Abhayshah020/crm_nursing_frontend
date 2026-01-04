"use client";

import { useState } from "react";
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";
import PageContainer from "@/components/PageContainer";
import { Save, Sparkles } from "lucide-react";
import Footer from "@/components/Footer";
import axiosClient from "@/lib/axiosClient";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast/ToastContext";

export default function CreatePatientPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contact: "",
        age: "",
        address: "",
        details: {},
        date: "",
        time: "",
    });
    const { showToast } = useToast();

    const router = useRouter()
    const [patientImage, setPatientImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setPatientImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.date === "" || formData.time === "" || formData.name === "") {
            showToast({
                message: "Please fill the data for patient name, date and time.",
                type: "error",
            });
            return;
        }

        try {
            const payload = new FormData();
            payload.append("name", formData.name);
            payload.append("email", formData.email);
            payload.append("contact", formData.contact);
            payload.append("age", formData.age);
            payload.append("address", formData.address);
            payload.append("details", JSON.stringify(formData.details));

            const parsed = JSON.parse(sessionStorage.getItem("user"));
            const createdBy = parsed?.name || "Unknown Staff"
            const createdById = parsed?.id || 0

            payload.append("createdBy", createdBy);
            payload.append("createdById", createdById);
            payload.append("date", formData.date);
            payload.append("time", formData.time);

            if (patientImage) {
                payload.append("patientImage", patientImage);
            }

            const res = await axiosClient.post("/patients", payload, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.status === 201 || res.status === 200) {
                showToast({
                    message: "Patient created successfully",
                    type: "success",
                });
                router.push("/patients")
            } else {
                showToast({
                    message: "Something went wrong!",
                    type: "error",
                });
            }
        } catch (error) {
            console.error(error);
            showToast({
                message: "Something went wrong!",
                type: "error",
            });
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage
                dontShowCreate={true}
                title="Patients"
                subtitle="Create a new patient"
            />

            <PageContainer title="Create Patient" subtitle="Enter patient details to add to the system">
                <form
                    onSubmit={handleSubmit}
                    className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8 space-y-6 max-w-7xl hover:shadow-xl transition-shadow"
                >
                    {/* Patient Image */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">
                            Patient Face Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                        />

                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Patient preview"
                                className="mt-3 w-32 h-32 rounded-xl object-cover border"
                            />
                        )}
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">
                            Patient Name
                        </label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter patient name"
                            className="w-full bg-background border border-border rounded-xl px-4 py-3"
                        />
                    </div>
                    <div className="flex gap-4 items-center flex-wrap">
                        <div className="space-y-2 flex-1">
                            <label className="block text-sm font-medium text-foreground">Admission Date</label>
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
                            <label className="block text-sm font-medium text-foreground">Admission Time</label>
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
                    {/* Contact */}
                    <div className="space-y-2">
                        <label className="flex gap-2 block text-sm font-medium text-foreground">
                            Contact <p className="text-gray-500">(Only accept numbers [0-9])</p>
                        </label>
                        <input
                            name="contact"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={formData.contact}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            className="w-full bg-background border border-border rounded-xl px-4 py-3"
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">
                            Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email address"
                            className="w-full bg-background border border-border rounded-xl px-4 py-3"
                        />
                    </div>

                    {/* Age */}
                    <div className="space-y-2">
                        <label className="flex gap-2 block text-sm font-medium text-foreground">
                            Age <p className="text-gray-500">(min:30 & max: 130)</p>
                        </label>
                        <input
                            name="age"
                            type="number"
                            min={30}
                            max={130}
                            value={formData.age}
                            onChange={handleChange}
                            placeholder="Enter age"
                            className="w-full bg-background border border-border rounded-xl px-4 py-3"
                        />
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">
                            Address
                        </label>
                        <textarea
                            name="address"
                            rows={4}
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter address"
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 resize-none"
                        />
                    </div>

                    {/* Submit */}
                    <button type="submit" className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl">
                        <Save size={18} /> Save Record <Sparkles size={14} />
                    </button>
                </form>
            </PageContainer>


        </div>
    );
}
