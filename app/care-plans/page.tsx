"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import {
    Search,
    Calendar,
    User,
    Phone,
    FileText,
    Users,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Activity,
    AlertCircle,
    CheckCircle2,
    Clock,
    Plus,
} from "lucide-react"
import Link from "next/link"
import AppNavbar from "@/components/AppNavbar"
import Footer from "@/components/Footer"

interface ChronicDisease {
    id: number
    diseaseName: string
}

interface PartnershipRole {
    id: number
    name: string
    relationship: string
}

interface CarePlan {
    id: number
    clientName: string
    dateOfBirth: string
    medicalDoctorName: string
    medicalDoctorContactNumber: string
    status: string
    createdAt: string
    chronicDiseases: ChronicDisease[]
    partnershipRoles: PartnershipRole[]
}

const CarePlansPage = () => {
    const [carePlans, setCarePlans] = useState<CarePlan[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [itemsPerPage] = useState<number>(5)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [filter, setFilter] = useState<string>("")

    const fetchCarePlans = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/care-plans`) // adjust endpoint as needed
            let data: CarePlan[] = res.data

            // Filter by client name if filter is not empty
            if (filter.trim() !== "") {
                data = data.filter((cp) => cp.clientName.toLowerCase().includes(filter.toLowerCase()))
            }

            setTotalPages(Math.ceil(data.length / itemsPerPage))
            const startIndex = (currentPage - 1) * itemsPerPage
            const paginatedData = data.slice(startIndex, startIndex + itemsPerPage)
            setCarePlans(paginatedData)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchCarePlans()
    }, [currentPage, filter])

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1)
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
            <AppNavbar />

            <div className=" bg-white/80 backdrop-blur-lg border-b border-slate-200/60 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                Care Plans
                            </h1>
                            <p className="text-slate-600 mt-1 text-sm">Manage and monitor patient care plans</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href="/care-plans/create"
                                className="flex items-center gap-2 bg-primary text-primary-foreground px-3 sm:px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
                            >
                                <Plus size={16} />
                                <span className="hidden sm:inline">Create</span>
                            </Link>
                            <div className="px-4 py-2 bg-blue-50 rounded-xl border border-blue-100">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-900">{carePlans.length} Plans</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="space-y-4">
                    {carePlans.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
                            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No care plans found</h3>
                            <p className="text-slate-600">Try adjusting your search or create a new care plan</p>
                        </div>
                    ) : (
                        carePlans.map((cp) => (
                            <div
                                key={cp.id}
                                className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        {/* Left Section - Main Info */}
                                        <div className="flex-1 space-y-4">
                                            {/* Client Name & Status */}
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <Link
                                                        href={`/care-plans/view-care-plan/${cp.id}`}
                                                        className="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors group-hover:text-blue-600 inline-flex items-center gap-2"
                                                    >
                                                        <User className="w-5 h-5" />
                                                        {cp.clientName}
                                                    </Link>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>DOB: {new Date(cp.dateOfBirth).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                                            <Clock className="w-4 h-4" />
                                                            <span>Created: {new Date(cp.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {cp.status === "active" ? (
                                                        <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg flex items-center gap-1.5 text-sm font-medium border border-emerald-100">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                            Active
                                                        </div>
                                                    ) : (
                                                        <div className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg flex items-center gap-1.5 text-sm font-medium border border-slate-200">
                                                            <Clock className="w-4 h-4" />
                                                            {cp.status}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Medical Info Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Medical Doctor */}
                                                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                                                        <Activity className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">
                                                            Medical Doctor
                                                        </div>
                                                        <div className="font-semibold text-slate-900 truncate">{cp.medicalDoctorName}</div>
                                                        <div className="flex items-center gap-1.5 text-sm text-slate-600 mt-1">
                                                            <Phone className="w-3.5 h-3.5" />
                                                            <span>{cp.medicalDoctorContactNumber}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Chronic Diseases */}
                                                {cp.chronicDiseases.length > 0 && (
                                                    <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                                                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                                                            <AlertCircle className="w-5 h-5 text-amber-600" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-0.5">
                                                                Chronic Diseases
                                                            </div>
                                                            <div className="font-semibold text-amber-900 line-clamp-2">
                                                                {cp.chronicDiseases.map((cd) => cd.diseaseName).join(", ")}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Partnership Roles */}
                                            {cp.partnershipRoles.length > 0 && (
                                                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
                                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                                                        <Users className="w-5 h-5 text-purple-600" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="text-xs font-medium text-purple-700 uppercase tracking-wide mb-1">
                                                            Care Team
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {cp.partnershipRoles.map((pr, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-purple-200 rounded-lg text-xs font-medium text-purple-900"
                                                                >
                                                                    {pr.name}
                                                                    <span className="text-purple-600">({pr.relationship})</span>
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Right Section - Actions */}
                                        <button
                                            onClick={async () => {
                                                if (!confirm("Are you sure you want to delete this care plan?")) return
                                                try {
                                                    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/care-plans/${cp.id}`)
                                                    setCarePlans((prev) => prev.filter((item) => item.id !== cp.id))
                                                } catch (err) {
                                                    console.error(err)
                                                    alert("Failed to delete care plan.")
                                                }
                                            }}
                                            className="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-red-100 shrink-0"
                                            title="Delete care plan"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-slate-700 hover:border-slate-300 disabled:hover:bg-white disabled:hover:border-slate-200"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </button>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-600">
                                Page <span className="font-semibold text-slate-900">{currentPage}</span> of{" "}
                                <span className="font-semibold text-slate-900">{totalPages}</span>
                            </span>
                        </div>

                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-slate-700 hover:border-slate-300 disabled:hover:bg-white disabled:hover:border-slate-200"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            <Footer />

        </div>
    )
}

export default CarePlansPage
