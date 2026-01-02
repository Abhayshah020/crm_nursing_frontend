"use client";

export default function UserTable({ users, onEdit, onDelete }: any) {
    return (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {/* ================= DESKTOP & TABLET TABLE ================= */}
            <div className="hidden md:block">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-4 py-3 text-left text-gray-600 font-medium">
                                Name
                            </th>
                            <th className="px-4 py-3 text-left text-gray-600 font-medium">
                                Email
                            </th>
                            <th className="px-4 py-3 text-left text-gray-600 font-medium">
                                Role
                            </th>
                            <th className="px-4 py-3 text-right text-gray-600 font-medium">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.length === 0 && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="text-center py-8 text-gray-500"
                                >
                                    No users found
                                </td>
                            </tr>
                        )}

                        {users.map((u: any) => (
                            <tr
                                key={u.id}
                                className="border-b hover:bg-gray-50 transition"
                            >
                                <td className="px-4 py-3 font-medium">
                                    {u.name}
                                </td>
                                <td className="px-4 py-3 text-gray-600">
                                    {u.email}
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            u.role === "admin"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-blue-100 text-blue-700"
                                        }`}
                                    >
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right space-x-2">
                                    <button
                                        onClick={() => onEdit(u)}
                                        className="px-3 py-1 rounded-md text-blue-600 hover:bg-blue-50"
                                    >
                                        Edit
                                    </button>
                                    {users.createdBy === "system" &&(<button
                                        onClick={() => onDelete(u.id)}
                                        className="px-3 py-1 rounded-md text-red-600 hover:bg-red-50"
                                    >
                                        Delete
                                    </button>)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ================= MOBILE CARD VIEW ================= */}
            <div className="md:hidden divide-y">
                {users.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No users found
                    </div>
                )}

                {users.map((u: any) => (
                    <div key={u.id} className="p-4 space-y-3">
                        <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-medium">{u.name}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-gray-700 break-all">
                                {u.email}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Role</p>
                            <span
                                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                    u.role === "admin"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-blue-100 text-blue-700"
                                }`}
                            >
                                {u.role}
                            </span>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => onEdit(u)}
                                className="flex-1 px-3 py-2 rounded-lg border text-blue-600 hover:bg-blue-50"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(u.id)}
                                className="flex-1 px-3 py-2 rounded-lg border text-red-600 hover:bg-red-50"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
