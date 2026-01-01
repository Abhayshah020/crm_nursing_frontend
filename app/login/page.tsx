"use client"

import { useState } from "react"
import Image from "next/image"
import { Stethoscope, Lock, Mail, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/toast/ToastContext"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/authentication/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include", // 🔥 REQUIRED FOR COOKIES
                    body: JSON.stringify({ email, password }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

            // ✅ Store user only (UI use)
            sessionStorage.setItem("user", JSON.stringify(data.user));

            router.push("/dashboard")

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
            <div className="relative hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-[#007bff] via-[#a040cf] to-[#007bff]/80 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -ml-40 -mb-40" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-lg bg-[#007bff]/50 flex items-center justify-center">
                            <Stethoscope className="w-6 h-6 text-white" strokeWidth={1.5} />
                        </div>
                        <h1 className="text-3xl font-bold">Holistic Disablity & Care Services</h1>
                    </div>
                    <p className="text-lg text-white/80 max-w-sm leading-relaxed">
                        Modern care management built for nursing teams who care about excellence.
                    </p>
                </div>

                <div className="relative z-10 space-y-5">
                    <FeatureItem
                        icon="📋"
                        title="Smart Care Planning"
                        description="Organize and track patient care with intuitive daily notes and structured plans."
                    />
                    <FeatureItem
                        icon="🔐"
                        title="Secure & Compliant"
                        description="Enterprise-grade security with role-based access and encryption."
                    />
                    <FeatureItem
                        icon="📊"
                        title="Real-time Analytics"
                        description="Monitor team performance and patient outcomes at a glance."
                    />
                    <FeatureItem
                        icon="⚡"
                        title="Designed for Nurses"
                        description="Intuitive interface built by healthcare professionals for healthcare professionals."
                    />
                </div>

                <div className="absolute inset-0 w-full h-full object-cover brightness-40">
                    <Image
                        src="/bg-login.jpg"
                        alt="Healthcare team"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>

            <div className="flex items-center justify-center p-6 lg:p-8">
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex items-center gap-2 mb-8">
                        <div className="w-10 h-10 rounded-lg bg-[#007bff] flex items-center justify-center">
                            <Stethoscope className="w-5 h-5 text-white" strokeWidth={1.5} />
                        </div>
                        <h1 className="text-l sm:text-xl md:text-2xl font-bold text-foreground">Holistic Disability & Care Services</h1>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-foreground text-balance">Welcome back</h2>
                        <p className="text-muted-foreground mt-2 leading-relaxed">Sign in to your nursing care dashboard</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
                            <div className="text-destructive text-xl flex-shrink-0">⚠️</div>
                            <p className="text-sm text-destructive/80">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email field */}
                        <div>
                            <label className="text-sm font-semibold text-foreground block mb-2">Email address</label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none"
                                    strokeWidth={1.5}
                                />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                    placeholder="nurse@careflow.com"
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div>
                            {/* <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-semibold text-foreground">Password</label>
                                <a href="#" className="text-xs text-primary hover:text-primary/80 transition font-medium">
                                    Forgot password?
                                </a>
                            </div> */}
                            <div className="relative">
                                <Lock
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none"
                                    strokeWidth={1.5}
                                />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Sign in button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg bg-[#007bff] text-primary-foreground cursor-pointer font-semibold hover:bg-[#0056b3] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-6"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign in
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-border">
                        <a href="https://smsitsolutions.com.au/" className="text-xs text-muted-foreground text-center">
                            © {new Date().getFullYear()} SMS IT Solutions. All rights reserved.
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* Feature item component */
function FeatureItem({ icon, title, description }) {
    return (
        <div className="flex items-start gap-4">
            <span className="text-3xl flex-shrink-0">{icon}</span>
            <div>
                <h3 className="font-semibold text-white mb-1">{title}</h3>
                <p className="text-sm text-white/70">{description}</p>
            </div>
        </div>
    )
}
