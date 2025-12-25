const handleLogout = async () => {
    try {
        await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/authentication/logout`,
            {
                method: "POST",
                credentials: "include", // 🔥 important
            }
        );
    } catch (err) {
        console.error(err);
    } finally {
        sessionStorage.clear();
        window.location.href = "/login";
    }
};
