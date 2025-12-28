"use client";
import { useEffect, useState } from "react";
import PageContainer from "@/components/PageContainer"; // adjust path
import { Save, Sparkles } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import Footer from "@/components/Footer";
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";

export default function CreateFoodFluidIntake() {
    const [formData, setFormData] = useState({
        patientId: "",
        patientName: "",
        inputFluidsMl: "",
        foodDescription: "",
        totalFluid: "",
        fluidDetails: "",
        comments: "",
        staffName: JSON.parse(sessionStorage.getItem("user") || "{}")?.name || "Unknown Staff",
    });
    const [patients, setPatients] = useState<any[]>([]);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const res = await axiosClient.get("/patients");
            if (res.status === 200) setPatients(res.data);
        } catch (err) {
            console.error("Error fetching patients:", err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            const res = await axiosClient.post("/food-fluid-intakes", formData);
            if (res.status === 201 || res.status === 200) {
                alert("Record created successfully");
                setFormData({
                    patientId: "",
                    patientName: "",
                    inputFluidsMl: "",
                    foodDescription: "",
                    totalFluid: "",
                    fluidDetails: "",
                    comments: "",
                    staffName: "",
                });
                window.location.href = "/food-fluid-intakes"; // redirect to table page
            } else {
                alert("Error creating record");
            }
        } catch (error) {
            console.error(error);
            alert("Error creating record");
        }
    };


    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage dontShowCreate title="Food & Fluid Intake" subtitle="Manage and review all food & fluid intake records" />

            <PageContainer title="New Food & Fluid Intake" subtitle="Document patient intake details">
                <form
                    onSubmit={handleSubmit}
                    className="
    bg-card/95 backdrop-blur
    rounded-2xl
    shadow-lg hover:shadow-xl
    border border-border
    p-6 sm:p-8
    space-y-8
    max-w-4xl
    transition-all
  "
                >
                    {/* Header */}
                    <div className="space-y-1">
                        <h2 className="text-xl font-semibold text-foreground">
                            Intake & Fluid Monitoring
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Record fluid intake, food details, and daily totals
                        </p>
                    </div>

                    {/* Patient Info */}
                    <div className="grid sm:grid-cols-2 gap-5">
                        {/* <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Patient ID
                            </label>
                            <input
                                name="patientId"
                                value={formData.patientId}
                                onChange={handleChange}
                                className="
          w-full rounded-xl
          bg-background border border-border
          px-4 py-3
          text-foreground
          focus:ring-2 focus:ring-primary/50
          outline-none transition
        "
                            />
                        </div> */}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Patient Name
                            </label>

                            <select
                                name="patientName"
                                value={formData.patientName}
                                onChange={() => {
                                    const select = event?.target as HTMLSelectElement;
                                    const selectedPatient = patients.find((p) => p.name === select.value);
                                    setFormData({
                                        ...formData,
                                        patientName: select.value,
                                        patientId: selectedPatient ? selectedPatient.id : "",
                                    });
                                }}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                            >
                                <option value="">Select a patient</option>
                                {patients.map((p) => (
                                    <option key={p.id} value={p.name}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Intake */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground">
                            Intake Details
                        </h3>

                        <div className="grid sm:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Input Fluids (ml)
                                </label>
                                <input
                                    name="inputFluidsMl"
                                    type="number"
                                    value={formData.inputFluidsMl}
                                    onChange={handleChange}
                                    className="
            w-full rounded-xl
            bg-background border border-border
            px-4 py-3
            focus:ring-2 focus:ring-primary/50
            outline-none transition
          "
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Total Fluid (ml)
                                </label>
                                <input
                                    name="totalFluid"
                                    type="number"
                                    value={formData.totalFluid}
                                    onChange={handleChange}
                                    className="
            w-full rounded-xl
            bg-background border border-border
            px-4 py-3
            focus:ring-2 focus:ring-primary/50
            outline-none transition
          "
                                />
                            </div>
                        </div>
                    </div>

                    {/* Descriptions */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Food Description
                            </label>
                            <textarea
                                name="foodDescription"
                                rows={3}
                                value={formData.foodDescription}
                                onChange={handleChange}
                                placeholder="Meals, consistency, appetite…"
                                className="
          w-full rounded-xl
          bg-background border border-border
          px-4 py-3
          text-foreground
          placeholder:text-muted-foreground
          focus:ring-2 focus:ring-primary/50
          outline-none transition resize-none
        "
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Fluid Details
                            </label>
                            <textarea
                                name="fluidDetails"
                                rows={3}
                                value={formData.fluidDetails}
                                onChange={handleChange}
                                placeholder="Water, juice, supplements, IV fluids…"
                                className="
          w-full rounded-xl
          bg-background border border-border
          px-4 py-3
          text-foreground
          placeholder:text-muted-foreground
          focus:ring-2 focus:ring-primary/50
          outline-none transition resize-none
        "
                            />
                        </div>
                    </div>

                    {/* Comments */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            Comments / Notes
                        </label>
                        <textarea
                            name="comments"
                            rows={3}
                            value={formData.comments}
                            onChange={handleChange}
                            className="
        w-full rounded-xl
        bg-background border border-border
        px-4 py-3
        text-foreground
        focus:ring-2 focus:ring-primary/50
        outline-none transition resize-none
      "
                        />
                    </div>

                    {/* Staff */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            Staff Name
                        </label>
                        <input
                            name="staffName"
                            value={formData.staffName}
                            // onChange={handleChange}
                            readOnly
                            className="
        w-full rounded-xl
        bg-background border border-border
        px-4 py-3
        text-foreground
        focus:ring-2 focus:ring-primary/50
        outline-none transition
      "
                        />
                    </div>

                    {/* Action */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="
        inline-flex items-center gap-2
        bg-primary text-primary-foreground
        px-6 py-3 rounded-xl
        font-medium
        shadow-md hover:shadow-lg
        hover:bg-primary/90
        active:scale-[0.98]
        transition-all
        group
      "
                        >
                            <Save size={18} className="group-hover:scale-110 transition-transform" />
                            Save Intake
                            <Sparkles size={14} className="ml-1 opacity-70" />
                        </button>
                    </div>
                </form>

            </PageContainer>
            <Footer />
        </div>
    );
}
