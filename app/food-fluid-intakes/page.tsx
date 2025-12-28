"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import PageContainer from "@/components/PageContainer";
import axiosClient from "@/lib/axiosClient";
import Footer from "@/components/Footer";
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";
import { Eye } from "lucide-react";

export default function FoodFluidIntakeList() {
    const [intakes, setIntakes] = useState<any[]>([]);

    const fetchFoodFluidIntakes = async () => {
        try {
            const res = await axiosClient.get("/food-fluid-intakes");
            if (res.status === 200) {
                setIntakes(res.data.data); // adjust if your API returns differently
            }
        } catch (err) {
            console.error("Error fetching food & fluid intakes:", err);
        }
    };


    useEffect(() => {
        fetchFoodFluidIntakes()
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage mainPage={true} linkCreate="/food-fluid-intakes/create" title="Food & Fluid Intake" subtitle="Manage and review all food & fluid intake records" />

            <PageContainer title="Food & Fluid Intake Records" subtitle="View all patient intake records">
                <div className="overflow-x-auto bg-card rounded-2xl shadow border border-border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-foreground border-b border-border">
                            <tr>
                                <th className="p-4 text-left font-semibold">Patient</th>
                                <th className="p-4 font-semibold">Input Fluids (ml)</th>
                                <th className="p-4 font-semibold">Food Description</th>
                                <th className="p-4 font-semibold">Total Fluid</th>
                                <th className="p-4 font-semibold">Date</th>
                                <th className="p-4 font-semibold">Actions</th>

                            </tr>
                        </thead>
                        <tbody>
                            {intakes.map(i => (
                                <tr key={i.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                                    <td className="p-4 font-medium text-foreground">
                                            {i.patientName}
                                    </td>
                                    <td className="p-4 text-center">{i.inputFluidsMl}</td>
                                    <td className="p-4">{i.foodDescription.slice(0, 50)}...</td>
                                    <td className="p-4 text-center">{i.totalFluid}</td>
                                    <td className="p-4 text-center">{new Date(i.timestamp).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <div className="flex gap-3 justify-center">
                                            <Link
                                                href={`/food-fluid-intakes/view/${i.id}`}
                                                className="text-primary hover:text-primary/80 transition-colors p-2 hover:bg-primary/10 rounded-lg"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            {/* <button
                                                onClick={() => handleDelete(note.id)}
                                                className="text-destructive hover:text-destructive/80 transition-colors p-2 hover:bg-destructive/10 rounded-lg"
                                            >
                                                <Trash2 size={18} />
                                            </button> */}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </PageContainer>
            <Footer />
        </div>
    );
}
