document.getElementById("logout-button").addEventListener("click", async () => {
    const currentEmail = localStorage.getItem("email") || "未知用户";

    const confirmed = await window.electronAPI.confirm(`确定要退出登录吗？\n当前账号：${currentEmail}\n当前user_id：${localStorage.getItem("user_id")}`);
    if (!confirmed) return;

    window.electronAPI.clearUser(); // electron-store
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("email");

    await window.electronAPI.confirm("已成功退出登录");
    window.location.href = "login.html";
});
