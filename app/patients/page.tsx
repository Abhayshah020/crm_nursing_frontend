"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import PageContainer from "@/components/PageContainer";
import Footer from "@/components/Footer";
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage";
import Link from "next/link";
import axiosClient from "@/lib/axiosClient";

export default function PatientsTablePage() {
    const [patients, setPatients] = useState([]);
    const [page, setPage] = useState(1);

    const handleFetch = async () => {
        try {
            const res = await axiosClient.get("/patients", {
                params: { page, limit: 10 },
            });
            if (res.status === 200 || res.status === 201) {
                setPatients(res.data);
            } else {
                alert("Error fetching patients");
            }
        } catch (error) {
            alert("Error fetching patients");
        }
    };

    useEffect(() => {
        handleFetch();
    }, [page]);

    const handleDelete = async (id) => {
        try {
            if (!confirm("Delete this patient?")) return;
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/patients/${id}`);
            setPatients((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            alert("Error deleting patient");
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage mainPage={true} linkCreate="/patients/create" title="Patients" subtitle="Manage all patients" />

            <PageContainer title="Patients" subtitle="List of all patients in the system">
                <div className="overflow-x-auto bg-card rounded-2xl shadow-lg border border-border hover:shadow-xl transition-shadow">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-foreground border-b border-border">
                            <tr>
                                <th className="p-4 text-left font-semibold">Name</th>
                                <th className="p-4 font-semibold">Contact</th>
                                <th className="p-4 font-semibold">Email</th>
                                <th className="p-4 font-semibold">Age</th>
                                <th className="p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map((patient) => (
                                <tr key={patient.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                                    <td className="p-4 font-medium text-foreground">{patient.name}</td>
                                    <td className="p-4 text-muted-foreground">{patient.contact || "-"}</td>
                                    <td className="p-4 text-muted-foreground">{patient.email || "-"}</td>
                                    <td className="p-4 text-center text-muted-foreground">{patient.age || "-"}</td>
                                    <td className="p-4">
                                        <div className="flex gap-3 justify-center">
                                            <Link
                                                href={`/patients/view/${patient.id}`}
                                                className="text-primary hover:text-primary/80 transition-colors p-2 hover:bg-primary/10 rounded-lg"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            {/* <button
                                                onClick={() => handleDelete(patient.id)}
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


                {/* Pagination */}
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={() => setPage((p) => Math.max(p - 1, 1))} className="p-2 border rounded"><ChevronLeft /></button>
                    <span className="p-2">{page}</span>
                    <button onClick={() => setPage((p) => p + 1)} className="p-2 border rounded"><ChevronRight /></button>
                </div>
            </PageContainer>

            <Footer />
        </div>
    );
}
