"use client";

import { useEffect, useState } from "react";
import axiosClient from "@/lib/axiosClient";
import UserForm from "@/components/users/UserForm";
import UserTable from "@/components/users/UserTable";
import { useToast } from "@/components/toast/ToastContext";
import ConfirmModal from "@/components/ConfirmModal";

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState<any>(null);
    const { showToast } = useToast();
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [userExist, setUserExist] = useState<any>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const user = sessionStorage.getItem("user");
        if (user) {
            try {
                setUserExist(JSON.parse(user));
            } catch {
                setUserExist(null);
            }
        }
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axiosClient.get("/users/get-users");
            setUsers(res.data);
        } catch {
            showToast({ message: "Error fetching users!", type: "error" });
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteId) return;
        if (!userExist) return;
        if (userExist && userExist.role !== "admin") return;
        try {
            await axiosClient.delete(`/users/delete-users/${deleteId}`);
            showToast({ message: "User deleted successfully!", type: "success" });
            setDeleteId(null);
            fetchUsers();
        } catch {
            showToast({ message: "Error deleting user!", type: "error" });
        }
    };


    useEffect(() => {
        fetchUsers();
    }, []);

    // debugger;
    if (!userExist) {
        return (
            <div>
                Loading...
            </div>
        )
    }
    if (userExist.role !== "admin") {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6 bg-gray-100 flex-1">
            <ConfirmModal
                open={deleteId !== null}
                title="Delete User"
                description="This action cannot be undone. Are you sure you want to delete this user?"
                confirmText="Delete"
                danger
                onCancel={() => setDeleteId(null)}
                onConfirm={handleDeleteConfirm}
            />

            <div>
                <h1 className="text-2xl font-semibold">User Management</h1>
                <p className="text-sm text-gray-600">
                    Manage system users and admin access
                </p>
            </div>

            <UserForm
                editingUser={editingUser}
                setEditingUser={setEditingUser}
                onSuccess={() => {
                    setEditingUser(null);
                    fetchUsers();
                }}
            />

            <UserTable
                users={users}
                onEdit={setEditingUser}
                onDelete={(id) => setDeleteId(id)}
            />

        </div>
    );
}
