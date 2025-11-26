document.addEventListener("DOMContentLoaded", () => {


    const syncBtn = document.getElementById("sync-button");
    if (!syncBtn) return;

    syncBtn.addEventListener("click", async () => {
        syncBtn.innerHTML = `<span class="loader"></span> 正在同步...`;
        syncBtn.disabled = true;
        const userId = localStorage.getItem("user_id");
        if (!userId) {
            await window.electronAPI.confirm("未登录或未获取到用户 ID");
            return;
        }

        try {
            const res = await fetch(`http://rdp.xzzzs.xyz:12809/upload/instances/${userId}`);
            const json = await res.json();

            if (json.status === "success") {
                for (const instance of json.instances) {
                    for (const file of instance.files) {
                        try {
                            const fileRes = await fetch(file.url);
                            const isJsonFile = file.file_name.endsWith(".json");
                            const fileContent = isJsonFile ? await fileRes.json() : await fileRes.text();

                            console.log("准备写入文件:", file.file_name, fileContent);
                            await window.electronAPI.saveConfig(file.file_name, fileContent);

                            console.log(`写入完成：${file.file_name}`);
                        } catch (err) {
                            console.warn(`下载或写入失败：${file.file_name}`, err);
                        }
                    }

                }

                await window.electronAPI.confirm("所有配置文件已成功同步并保存至 configs 文件夹");

                location.reload();
            } else {
                await window.electronAPI.confirm("同步失败：" + json.message);
            }
        } catch (err) {
            console.error("接口异常：", err);
            await window.electronAPI.confirm("同步失败，请检查后端连接");
        }
        syncBtn.innerHTML = "同步";
        syncBtn.disabled = false;
    });

});
