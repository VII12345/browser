const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const resetForm = document.getElementById("reset-form");
const loginTab = document.getElementById("login-tab");
const registerTab = document.getElementById("register-tab");
const resetTab = document.getElementById("reset-tab");



loginTab.onclick = () => {
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
    resetForm.classList.add("hidden");
};
registerTab.onclick = () => {
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    resetForm.classList.add("hidden");
};
resetTab.onclick = () => {
    resetForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    registerForm.classList.add("hidden");
};

loginForm.onsubmit = async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();

    try {
        const res = await fetch("http://vpn.xzzzs.xyz:12809/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "登录失败");
        }

        const data = await res.json();


        const userId = data.user?.id || "";

        if (!data.access_token || !userId) {
            alert("登录响应缺少必要信息");
            return;
        }

        // 保存登录状态
        window.electronAPI.saveUser({
            email,
            access_token: data.access_token,
            user_id: userId
        });

        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user_id", userId);
        localStorage.setItem("email", email); // 也同步缓存


        await window.electronAPI.confirm("登录成功！");
        console.log("登录结果:", data);
        window.location.href = "index.html";
    } catch (err) {
        console.error("登录失败:", err.message);
        await window.electronAPI.confirm("用户名或密码错误");
    }
};



registerForm.onsubmit = async (e) => {
    e.preventDefault();

    const email = document.getElementById("register-username").value.trim();
    const password = document.getElementById("register-password").value.trim();
    const confirm = document.getElementById("register-confirm").value.trim();

    if (password !== confirm) {
        await window.electronAPI.confirm("两次密码不一致");
        return;
    }


    try {
        const res = await fetch("http://vpn.xzzzs.xyz:12809/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "注册失败");
        }

        const data = await res.json();
        await window.electronAPI.confirm("注册成功！");
        console.log("🧾 注册结果:", data);
        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");
    } catch (err) {
        console.error("注册失败:", err.message);
        await window.electronAPI.confirm("注册失败，请检查邮箱是否已注册");
    }
};


resetForm.onsubmit = async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const newPassword = document.getElementById("new_password").value.trim();
    const confirm = document.getElementById("reset-confirm").value.trim();

    if (!email || !newPassword || !confirm) {
        await window.electronAPI.confirm("❗请填写完整信息");
        return;
    }

    if (newPassword !== confirm) {
        await window.electronAPI.confirm("❌ 两次密码不一致");
        return;
    }

    try {
        const res = await fetch("http://vpn.xzzzs.xyz:12809/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, new_password: newPassword }) // ✅ 传入密码
        });

        const rawText = await res.clone().text();
        console.log("📨 原始响应:", rawText);

        let data = {};
        try {
            data = await res.json();
        } catch {
            console.warn("⚠️ 后端返回非 JSON 格式");
        }

        if (!res.ok || !data.message?.includes("成功")) {
            throw new Error(data.detail || "密码重设失败");
        }

        await window.electronAPI.confirm("✅ 密码重设成功，请使用新密码登录");
        window.location.href = "index.html";
    } catch (err) {
        console.error("重设失败:", err.message);
        await window.electronAPI.confirm(`❌ 重设失败：${err.message || "未知错误"}`);
    }
};


function fakeLogin(user, pass) {
    return user === "admin" && pass === "123456"; // 演示用途
}

async function fakePasswordReset(user, newPass) {
    // 模拟逻辑，可改为 fetch 请求
    return user === "admin"; // 仅演示用途
}

document.getElementById("show-register").onclick = () => {
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
    resetForm.classList.add("hidden");
};

document.getElementById("show-reset").onclick = () => {
    loginForm.classList.add("hidden");
    registerForm.classList.add("hidden");
    resetForm.classList.remove("hidden");
};




