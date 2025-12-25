"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import AppNavbar from "@/components/AppNavbar"
import PageContainer from "@/components/PageContainer"
import Footer from "@/components/Footer"
import Link from "next/link"
import { Eye, Trash2, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { NavBarOfInternalPage } from "@/components/NavBarOfInternalPage"
import axiosClient from "@/lib/axiosClient"

export default function DailyNotesTablePage() {
    const [notes, setNotes] = useState<any[]>([])
    const [page, setPage] = useState(1)

    const handleFetch = async () => {
        try {
            const res = await axiosClient.get("/daily-notes", {
                params: { page, limit: 10 },
            });
            if (res.status === 200 || res.status === 201) {
                setNotes(res.data);
            } else {
                alert("Error fetching daily notes");
            }
        } catch (error) {
            alert("Error fetching daily notes");
        }
    };


    useEffect(() => {
        handleFetch()
    }, [page])

    const handleDelete = async (id: number) => {
        try {
            if (!confirm("Delete this daily note?")) return
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/daily-notes/${id}`)
            setNotes((prev) => prev.filter((n) => n.id !== id))
        } catch (error) {
            alert("Error deleting daily note")
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOfInternalPage linkCreate="/daily-notes/create" title="Daily Notes" subtitle="Manage and review all daily notes" />

            <PageContainer title="Daily Notes" subtitle="Manage and review documentation">

                <div className="overflow-x-auto bg-card rounded-2xl shadow-lg border border-border hover:shadow-xl transition-shadow">

                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-foreground border-b border-border">
                            <tr>
                                <th className="p-4 text-left font-semibold">Client</th>
                                <th className="p-4 font-semibold">Date</th>
                                <th className="p-4 font-semibold">Notes</th>
                                <th className="p-4 font-semibold">Created</th>
                                <th className="p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notes.map((note) => (
                                <tr key={note.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                                    <td className="p-4 font-medium text-foreground">{note.clientName}</td>
                                    <td className="p-4 text-center text-muted-foreground">{note.timeStamps}</td>
                                    <td className="p-4 text-muted-foreground">{note.notes.slice(0, 40)}...</td>
                                    <td className="p-4 text-center text-muted-foreground">
                                        {new Date(note.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-3 justify-center">
                                            <Link
                                                href={`/daily-notes/view/${note.id}`}
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

                <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl hover:bg-muted/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        <ChevronLeft size={16} />
                        Previous
                    </button>
                    <span className="text-sm text-muted-foreground font-medium">Page {page}</span>
                    <button
                        onClick={() => setPage((p) => p + 1)}
                        className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl hover:bg-muted/50 transition-all font-medium"
                    >
                        Next
                        <ChevronRight size={16} />
                    </button>
                </div>
            </PageContainer>
            <Footer />
        </div>
    )
}
