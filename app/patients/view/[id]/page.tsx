"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageContainer from "@/components/PageContainer";
import Footer from "@/components/Footer";
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";
import { Calendar, Clock, Home, Mail, Phone, User } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import Image from "next/image";

export default function ViewPatientPage() {
    const { id } = useParams();
    const [patient, setPatient] = useState<any>(null);

    const handleFetch = async () => {
        try {
            const res = await axiosClient.get(`/patients/${id}`);
            if (res.status === 200 || res.status === 201) {
                setPatient(res.data);
            } else {
                alert("Error fetching patient");
            }
        } catch (error) {
            alert("Error fetching patient");
        }
    };

    useEffect(() => {
        handleFetch();
    }, [id]);

    if (!patient) return null;

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage dontShowCreate={true} title="Patient Details" subtitle={``} />

            <PageContainer title="Patient Information" subtitle="Details about the patient">
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8 max-w-7xl space-y-6 hover:shadow-xl transition-shadow">

                    {/* Patient Photo */}
                    {patient.image && (

                        <div className="flex justify-center mb-4">
                            <img
                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${patient.image}`}
                                alt={patient.name}
                                className="w-32 h-32 object-cover rounded-full border"
                            />
                        </div>
                    )}
                    {/* Name */}
                    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                        <User className="text-primary mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-1">Name</p>
                            <p className="font-semibold text-lg text-foreground">{patient.name}</p>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                        <Phone className="text-primary mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-1">Contact</p>
                            <p className="font-medium text-foreground">{patient.contact || "-"}</p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                        <Mail className="text-primary mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-1">Email</p>
                            <p className="font-medium text-foreground">{patient.email || "-"}</p>
                        </div>
                    </div>

                    {/* Age */}
                    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                        <Calendar className="text-primary mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-1">Age</p>
                            <p className="font-medium text-foreground">{patient.age || "-"}</p>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                        <Home className="text-primary mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-1">Address</p>
                            <p className="whitespace-pre-line text-foreground leading-relaxed">{patient.address || "-"}</p>
                        </div>
                    </div>

                    {/* Created at */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t border-border">
                        <Clock size={16} />
                        <span>Created: {new Date(patient.createdAt).toLocaleString()}</span>
                    </div>

                </div>
            </PageContainer>

            <Footer />
        </div>
    );
}
