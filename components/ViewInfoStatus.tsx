export const Info = ({ label, value, multiline }: any) => (
    <div className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {label}
        </p>
        <p className={`text-sm font-medium ${multiline ? "whitespace-pre-line" : ""}`}>
            {value || "N/A"}
        </p>
    </div>
);

export const Status = ({ label, value }: any) => (
    <div className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {label}
        </p>
        <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                ${value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
            {value ? "Yes" : "No"}
        </span>
    </div>
);

export function InfoCard({
    icon: Icon,
    title,
    children
}: {
    icon: any
    title: string
    children: React.ReactNode
}) {
    return (
        <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
            <Icon className="text-primary mt-1" size={20} />
            <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">{title}</p>
                {children}
            </div>
        </div>
    )
}
