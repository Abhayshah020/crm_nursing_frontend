"use client";
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";
import PageContainer from "@/components/PageContainer";
import { useToast } from "@/components/toast/ToastContext";
import axiosClient from "@/lib/axiosClient";
import { Clock, User } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FoodFluidIntakeView() {
    const { id } = useParams();
    const [data, setData] = useState<any>(null);
    const { showToast } = useToast();

    const fetchFoodFluidIntakeById = async (id) => {
        try {
            const res = await axiosClient.get(`/food-fluid-intakes/${id}`);
            if (res.status === 200) {
                setData(res.data);
            }
        } catch (err) {
            showToast({
                message: "Something went wrong!",
                type: "error",
            });
        }
    };


    useEffect(() => {
        if (id) {
            fetchFoodFluidIntakeById(id);
        }
    }, [id]);

    if (!data) return <div>Loading...</div>;

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage mainPage={true} linkCreate="/food-fluid-intakes/create" title="Food & Fluid Intake" subtitle="Manage and review all food & fluid intake records" />

            <PageContainer title="Intake Details" subtitle="Patient food & fluid record">
                <div className="bg-card rounded-2xl shadow-lg border p-6 space-y-4 hover:shadow-xl transition-shadow">
                    <div className="flex gap-3 bg-muted/30 p-4 rounded-xl">
                        <User className="text-primary" />
                        <div>
                            <p className="text-sm text-muted-foreground">Patient</p>
                            <p className="font-semibold">{data.patientName}</p>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-muted/30 p-4 rounded-xl">
                            <p className="text-sm text-muted-foreground">Input Fluids (ml)</p>
                            <p className="text-lg font-bold">{data.inputFluidsMl}</p>
                        </div>

                        <div className="bg-muted/30 p-4 rounded-xl">
                            <p className="text-sm text-muted-foreground">Total Fluid (ml)</p>
                            <p className="text-lg font-bold">{data.totalFluid}</p>
                        </div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-xl">
                        <strong>Food Description:</strong>
                        <p className="whitespace-pre-line">{data.foodDescription}</p>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-xl">
                        <strong>Fluid Details:</strong>
                        <p className="whitespace-pre-line">{data.fluidDetails}</p>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-xl whitespace-pre-line">
                        <strong>Comments:</strong>
                        <p>{data.comments}</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex-1 flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                            <Clock className="text-primary mt-1" size={20} />
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground mb-1">Date</p>
                                <p className="font-medium text-foreground">{data.date}</p>
                            </div>
                        </div>
                        <div className="flex-1 flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                            <Clock className="text-primary mt-1" size={20} />
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground mb-1">Time</p>
                                <p className="font-medium text-foreground">{data.time}</p>
                            </div>
                        </div>
                    </div>

                    {/* ================= Footer ================= */}
                    <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground pt-4 border-t">
                        <div className="flex gap-1 items-center">
                            <Clock size={16} />
                            <span>
                                Time Stamp: {new Date(data.timestamp).toLocaleString()}
                            </span>
                        </div>

                        <div className="flex gap-1 items-center">
                            <User size={16} />
                            <span>
                                Created: {data.createdBy}
                            </span>
                        </div>

                    </div>
                </div>
            </PageContainer>

        </div>
    );
}
