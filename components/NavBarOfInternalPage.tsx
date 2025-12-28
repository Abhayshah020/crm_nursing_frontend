"use client"
import { ArrowLeft, FileText, Plus } from "lucide-react"
import { Button } from "./ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export const NavBarOfInternalPage = ({ mainPage = false, linkCreate, dontShowCreate = false, title, subtitle }: { mainPage?: boolean; linkCreate?: string; dontShowCreate?: boolean; title: string; subtitle: string }) => {
    const router = useRouter();

    return (
        <div className=" bg-white/80 backdrop-blur-lg border-b border-slate-200/60 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button onClick={() => mainPage ? router.push('/dashboard') : router.back()} variant="ghost" size="icon" className="hover:bg-primary/10">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            {title}
                        </h1>
                        <p className="text-slate-600 mt-1 text-sm">{subtitle}</p>
                    </div>
                    {!dontShowCreate && (
                        <div className="flex items-center gap-3">
                            <Link
                                href={linkCreate}
                                className="flex items-center gap-2 bg-[#007bff] text-primary-foreground px-3 sm:px-4 py-2 rounded-lg text-sm hover:bg-[#a07baf]/90 transition-all shadow-md hover:shadow-lg"
                            >
                                <Plus size={16} />
                                <span className="hidden sm:inline">Create</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}