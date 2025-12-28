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
