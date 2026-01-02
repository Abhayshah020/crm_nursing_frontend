"use client";

import { useEffect, useState } from "react";
import axiosClient from "@/lib/axiosClient";
import { useToast } from "../toast/ToastContext";
import ConfirmModal from "../ConfirmModal";

export default function UserForm({ editingUser, setEditingUser, onSuccess }: any) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "employee",
    });
    const [showConfirm, setShowConfirm] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        if (editingUser) {
            setForm({ ...editingUser, password: "" });
        }
    }, [editingUser]);

    const cancel = async () => {
        setEditingUser(null)
        setForm({
            name: "",
            email: "",
            password: "",
            role: "employee",
        })
    };

    const submit = async () => {
        if (editingUser) {
            setShowConfirm(true);
            return;
        }
        executeSubmit();
    };

    const executeSubmit = async () => {
        try {
            if (editingUser) {
                await axiosClient.put(`/users/update-users/${editingUser.id}`, form);
                showToast({ message: "User updated successfully!", type: "success" });
            } else {
                await axiosClient.post("/users/create-user", form);
                showToast({ message: "User created successfully!", type: "success" });
            }

            setForm({ name: "", email: "", password: "", role: "employee" });
            setShowConfirm(false);
            onSuccess();
        } catch {
            showToast({
                message: `Error ${editingUser ? "updating" : "creating"} user!`,
                type: "error",
            });
        }
    };


    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <ConfirmModal
                open={showConfirm}
                title="Confirm Update"
                description="Are you sure you want to update this user? Changes will be applied immediately."
                confirmText="Yes, Update"
                onCancel={() => setShowConfirm(false)}
                onConfirm={executeSubmit}
            />
            <div className="mb-4">
                <h2 className="text-lg font-semibold">
                    {editingUser ? "Edit User" : "Create New User"}
                </h2>
                <p className="text-sm text-gray-500">
                    {editingUser
                        ? "Update user details or reset password"
                        : "Add a new user to the system"}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm text-gray-600">Full Name</label>
                    <input
                        className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600">Email Address</label>
                    <input
                        className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600">
                        {editingUser ? "New Password (optional)" : "Password"}
                    </label>
                    <input
                        type="password"
                        className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600">Role</label>
                    <select
                        className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                    >
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
                {editingUser && (<button
                    onClick={cancel}
                    className="px-5 py-2 cursor-pointer rounded-lg text-white bg-red-600 hover:bg-red-700 transition"
                >
                    Cancel
                </button>)}
                <button
                    onClick={submit}
                    className="px-5 py-2 cursor-pointer rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                    {editingUser ? "Update User" : "Create User"}
                </button>
            </div>
        </div>
    );
}
