import Image from "next/image"
import Link from "next/link"

export default function Footer() {
    return (
        <footer className="bg-card border-t border-border py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <Link
                        href="https://smsitsolutions.com.au/"
                        target="_blank"
                        className="text-muted-foreground flex items-center gap-2 hover:text-foreground transition-colors"
                    >
                        <Image src="/logo.jpg" alt="SMS IT Solutions Logo" width={40} height={40} />

                        &copy; {new Date().getFullYear()} SMS IT Solutions. All rights reserved.
                    </Link>
                </div>
            </div>
        </footer>
    )
}
