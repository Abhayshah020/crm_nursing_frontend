"use client";

import PageContainer from "@/components/PageContainer";
import axiosClient from "@/lib/axiosClient";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
    const router = useRouter();
    const [records, setRecords] = useState<any[]>([]);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };
    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    useEffect(() => {
        const handleFetch = async () => {
            try {
                const res = await axiosClient.get("/patients/all-with-profile", {
                    params: { page: currentPage, limit: itemsPerPage },
                });
                setRecords(res.data.data);
                setTotalPages(res.data.total);
            } catch (error) {
                alert("Error fetching patients");
            }
        };
        handleFetch();
    }, [currentPage, itemsPerPage]);

    return (
        <div className="w-full flex flex-col px-4 sm:px-6 py-8 sm:py-12 space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                    Dashboard
                </h1>
            </div>

            {/* MOBILE CARDS */}
            <div className="md:hidden flex flex-col gap-4">
                {records.map((patient) => (
                    <div
                        key={patient.id}
                        className="bg-white rounded-2xl shadow-md p-4 flex flex-col gap-4"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200">
                                <img
                                    src={`${process.env.NEXT_PUBLIC_API_URL}${patient.image}`}
                                    alt={patient.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <p className="font-semibold text-lg">{patient.name}</p>
                                <p className="text-sm text-gray-500">Age: {patient.age ?? "-"}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {[
                                ["Care Plans", "care-plans"],
                                ["Daily Notes", "daily-notes"],
                                ["Core Vitals", "core-vital-signs"],
                                ["Pain", "pain-comfort-assessments"],
                                ["Neuro", "neuro-general-observations"],
                                ["Skin", "skin-circulations"],
                                ["Food", "food-fluid-intakes"],
                                ["Hygiene", "general-hygiene-care"],
                                ["Bowel", "bowel-charts"],
                                ["Urine", "urine-monitoring"],
                            ].map(([label, route]) => (
                                <button
                                    key={route}
                                    onClick={() =>
                                        router.push(`/${route}/pateints-all-notes/${patient.id}`)
                                    }
                                    className="bg-blue-500 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2 hover:brightness-110 transition"
                                >
                                    {label}
                                    <Eye size={16} />
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden md:block overflow-x-auto">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 min-w-max">
                    <table className="w-full text-sm table-auto">
                        <thead className="bg-gray-100 border-b border-gray-200">
                            <tr>
                                <th className="p-4 text-left font-semibold">Patient</th>
                                <th className="p-4 font-semibold">Care Plans</th>
                                <th className="p-4 font-semibold">Daily Notes</th>
                                <th className="p-4 font-semibold">Core Vitals</th>
                                <th className="p-4 font-semibold">Pain</th>
                                <th className="p-4 font-semibold">Neuro</th>
                                <th className="p-4 font-semibold">Skin</th>
                                <th className="p-4 font-semibold">Food</th>
                                <th className="p-4 font-semibold">Hygiene</th>
                                <th className="p-4 font-semibold">Bowel</th>
                                <th className="p-4 font-semibold">Urine</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((patient) => (
                                <tr
                                    key={patient.id}
                                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
                                                <img
                                                    src={`${process.env.NEXT_PUBLIC_API_URL}${patient.image}`}
                                                    alt={patient.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <span className="font-medium">{patient.name}</span>
                                        </div>
                                    </td>

                                    {[
                                        "care-plans",
                                        "daily-notes",
                                        "core-vital-signs",
                                        "pain-comfort-assessments",
                                        "neuro-general-observations",
                                        "skin-circulations",
                                        "food-fluid-intakes",
                                        "general-hygiene-care",
                                        "bowel-charts",
                                        "urine-monitoring",
                                    ].map((route) => (
                                        <td key={route} className="p-4 text-center">
                                            <button
                                                onClick={() =>
                                                    router.push(`/${route}/pateints-all-notes/${patient.id}`)
                                                }
                                                className="cursor-pointer bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 mx-auto hover:brightness-110 transition"
                                            >
                                                View <Eye size={14} />
                                            </button>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="flex justify-end items-center gap-2 mt-4">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="p-2 border rounded disabled:opacity-50 hover:bg-gray-100 transition"
                    >
                        <ChevronLeft />
                    </button>
                    <span className="p-2 font-medium">{currentPage}</span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="p-2 border rounded disabled:opacity-50 hover:bg-gray-100 transition"
                    >
                        <ChevronRight />
                    </button>
                </div>
            )}
        </div>
    );
}
