import Link from "next/link"

export default function Footer() {
    return (
        <footer className="bg-card border-t border-border py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-muted-foreground text-sm">
                        &copy; {new Date().getFullYear()} SMS IT Solutions. All rights reserved.
                    </div>
                    <Link
                        href="https://smsitsolutions.com.au/"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Visit our website
                    </Link>
                </div>
            </div>
        </footer>
    )
}
