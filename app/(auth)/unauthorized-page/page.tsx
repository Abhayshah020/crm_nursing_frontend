export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-semibold">Access Denied</h1>
                <p className="text-gray-600 mt-2">
                    You do not have permission to access this page.
                </p>
            </div>
        </div>
    );
}
