document.addEventListener("DOMContentLoaded", () => {
  const confirmBtn = document.getElementById("confirm-button");
  const isEditing = localStorage.getItem("isEditing") === "true";

  confirmBtn?.addEventListener("click", async () => {
    // const confirmed = await window.electronAPI.confirm("是否确定保存当前配置？");
    const confirmed = await window.confirm("是否确定保存当前配置？");
    if (!confirmed) return;

    const configData = collectFormData();

    if (isEditing && configData.src) {
      console.log("编辑模式，保留 src =", configData.src);
    } else {
      configData.src = `SRC-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    }

    const oldFilename = localStorage.getItem("editConfigFile");
    const newFilename = `config_${configData.src}.json`;
    const fingerprintFilename = `fingerprint_${configData.src}.json`;

    try {
      const uploadOk = await uploadToServer(configData);
      if (!uploadOk) {
        await window.electronAPI.confirm("上传失败，配置未保存");
        return;
      }

      const safeData = JSON.parse(JSON.stringify(configData));
      await window.electronAPI.saveConfig(newFilename, safeData);
      console.log("✅ 配置已保存:", newFilename);

      const fingerprintData = extractFingerprintSubset(configData);
      await window.electronAPI.saveConfig(fingerprintFilename, fingerprintData);
      console.log("✅ 指纹文件已保存:", fingerprintFilename);

      if (isEditing && oldFilename) {
        const userId = configData.user_id;
        const folderName = configData.group || "未分组";
        const oldFingerprintFilename = oldFilename.replace("config_", "fingerprint_");

        // 如果旧文件名与新文件名相同，说明我们是在编辑同一个 src，
        // 此时 save 写入的是同名文件，直接删除旧文件会把刚保存的文件也删掉，
        // 因此只在名字不同时才执行删除（本地 & 远程）。
        if (oldFilename !== newFilename) {
          // ✅ 删除本地旧文件
          await window.electronAPI.deleteConfig(oldFilename);
          // 同步删除对应的指纹文件（如果存在）
          await window.electronAPI.deleteConfig(oldFingerprintFilename).catch(() => { });
          console.log("🗑 已删除本地旧配置:", oldFilename, oldFingerprintFilename);

          // ✅ 删除远程旧文件（告诉后端删除旧文件）
          try {
            const res = await fetch("http://hk.xzzzs.xyz:8000/delete_files_by_folder", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user_id: userId,
                folder_name: folderName,
                files: [oldFilename, oldFingerprintFilename]
              })
            });
            const result = await res.json();
            if (result.status !== "success") {
              console.warn("⚠️ 远程删除失败:", result.message);
            } else {
              console.log("✅ 远程文件已删除:", result.deleted_files);
            }
          } catch (err) {
            console.warn("远程删除请求失败:", err);
          }
        } else {
          console.log("⚠️ 编辑模式且旧文件名与新文件名相同，已跳过本地/远程删除以避免误删刚保存的文件。");
        }
      }

      localStorage.removeItem("isEditing");
      localStorage.removeItem("editConfigFile");
      localStorage.removeItem("editConfig");

      window.location.href = "index.html";
    } catch (err) {
      console.error("流程失败:", err);
      await window.electronAPI.confirm("保存失败，请检查权限或网络");
    }
  });
});



// 📋 表单数据采集函数
function collectFormData() {
  const pluginSwitch = document.querySelector(`input[data-name="plugin"]`);
  console.log("插件 checkbox 元素:", pluginSwitch);
  console.log("是否勾选 plugin:", pluginSwitch?.checked);

  const userId = localStorage.getItem("user_id") || "anonymous";
  const getInput = (selector) =>
    document.querySelector(selector)?.value?.trim() || "";

  const getSelect = (selector) =>
    document.querySelector(selector)?.value?.trim() || "";

  const getSwitch = (name) =>
    document.querySelector(`input[data-name="${name}"]`)?.checked ? "noise" : "real";

  const getActiveText = (selector) => {
    const container = document.querySelector(selector);
    const active = container?.querySelector(".setting-option.active");
    return active?.textContent.trim() || "";
  };

  const getVisible = (selector) => {
    const el = document.querySelector(selector);
    return el && el.offsetParent !== null ? el.value.trim() : "";
  };

  const getGroupText = (labelText) => {
    const group = [...document.querySelectorAll(".setting-group")].find(g =>
      g.querySelector(".setting-label")?.textContent.includes(labelText));
    return group?.querySelector(".setting-option.active")?.textContent.trim() || "";
  };

  const getWebGLVendor = () =>
    [...document.querySelectorAll(".form-input")].find(el =>
      el?.value?.includes("Google Inc"))?.value?.trim() || "";

  const getRenderer = () =>
    document.querySelector(".collapsible-trigger")?.textContent.trim() || "";

  const previousConfig = localStorage.getItem("editConfig");
  const previousSrc = previousConfig ? JSON.parse(previousConfig).src : "";
  const activeOS = document.querySelector('#os-group .setting-option.active')?.textContent.trim();
  return {
    // 基本信息
    user_id: userId,
    name: getInput("#env-name"),
    os: activeOS === "Windows11" ? "Windows11" : "Windows10",
    user_agent: getInput("#user-agent"),
    group: getInput("#group"),
    notes: getInput('.form-input[placeholder="请输入备注"]'),
    src: previousSrc, // 用于保留旧 src

    // 网络代理
    proxy_mode: getActiveText("#proxy .form-group:nth-child(1)"),
    proxy_type: getActiveText("#proxy .setting-item"),
    proxy_ip_channel: getInput('#proxy input[placeholder="例：http://127.0.0.1:10809"]'),

    proxy_account_platform: getInput('#proxy input[placeholder="无"]'),
    proxy_tabs: getInput('#proxy input[placeholder^="输入网址"]'),

    // 指纹特征
    webrtc: getActiveText("#webrtc-group"),
    timezone_mode: getActiveText("#timezone-group"),
    timezone: getSelect(".timezone-select"),
    language_mode: getActiveText("#language-group"),
    language: getSelect(".language-select"),
    resolution_mode: getActiveText("#resolution-group"),
    resolution: getVisible(".custom-resolution-input"),
    webgl_metadata: getGroupText("WebGL元数据"),
    webgl_vendor: getWebGLVendor(),
    webgl_renderer: getRenderer(),

    // 噪音特征
    canvas: getSwitch("canvas"),
    webgl_image: getSwitch("webgl"),
    audiocontext: getSwitch("audio"),
    media_devices: getSwitch("media"),
    clientrects: getSwitch("rects"),
    plugin: getSwitch("plugin"),

    // 硬件伪装
    cpu_mode: getActiveText("#cpu-group"),
    cpu: getVisible(".cpu-select") || "real",
    ram_mode: getActiveText("#ram-group"),
    ram: getVisible(".ram-select") || "real",
    device_name_mode: getActiveText("#device-group"),
    device_name: getVisible(".device-input") || "real",
    mac_mode: getActiveText("#mac-group"),
    mac_address: getVisible(".mac-input") || "real",

    // 隐私特性
    do_not_track: getGroupText("Do Not Track"),
    port_scan_mode: getGroupText("端口扫描保护"),
    port_scan_ports: getInput('.form-input[placeholder*="端口"]'),
    hardware_acceleration: getGroupText("硬件加速"),
    tls: getGroupText("TLS"),
    startup_args: getInput('.form-input[placeholder="example:"]')
  };
}


// 指纹字段提取函数
function extractFingerprintSubset(config) {
  // 工具函数：生成随机数串（可定长度或范围）
  const randStr = () => Math.floor(100000000 + Math.random() * 900000000).toString();

  // 转换为值或空
  const convert = (value) => value === "noise" ? randStr() : "";
  const gpuModels = [
    "6400", "6500 XT", "6600", "6600 XT", "6650 XT",
    "6700", "6700 XT", "6750 GRE", "6750 XT", "6800",
    "6800 XT", "6900 XT", "6950 XT", "7600", "7600 XT",
    "7700 XT", "7800 XT", "7900 GRE", "7900 XT", "7900 XTX"
  ];

  function gpuIndexFromLabel(label) {
    for (let i = 0; i < gpuModels.length; i++) {
      if (label.includes(`RX ${gpuModels[i]}`)) {
        const a = i + 1000000;
        return (a).toString(); // 输出为字符串数字
      }
    }
    return ""; // 未匹配则返回空
  }
  return {
    src: config.src === "Windows11" ? 5 : 1,
    proxy: config.proxy_ip_channel,
    url: config.proxy_tabs,
    os: config.os,
    // 噪音特征（噪声 → 随机数字，真实 → 空）
    canvas: convert(config.canvas),
    webgl_image: convert(config.webgl_image),
    audiocontext: convert(config.audiocontext),
    media_devices: convert(config.media_devices),
    clientrects: convert(config.clientrects),
    plugin: convert(config.plugin),

    // 硬件特征（仅在 mode 为 "自定义" 时才处理）
    cpu: config.cpu_mode === "自定义" ? config.cpu : "",
    ram: config.ram_mode === "自定义" ? config.ram : "",
    //device_name: config.device_name_mode === "自定义" ? `PC-${randStr().slice(0, 4)}` : "",
    //mac_address: config.mac_mode === "随机" ? `00:${randStr().slice(0, 2)}:${randStr().slice(2, 4)}:${randStr().slice(4, 6)}:AA:BB` : "",
    tls: config.tls === "随机" ? randStr() : "",
    // 指纹环境字段（保持原值或默认）
    timezone: config.timezone || "Asia/Shanghai",
    resolution: config.resolution_mode === "随机" ? randStr() : "",
    user_agent: config.user_agent,
    gpu: gpuIndexFromLabel(config.webgl_renderer || ""),
    //webgl_vendor: config.webgl_vendor || "",
    webrtc: config.webrtc,
    language: config.language || "zh-CN",
    port_scan_ports: config.port_scan_mode === "启用" ? config.port_scan_ports : "",
    startup_args: config.startup_args
  };
}

async function uploadToServer(configData) {
  const statusEl = document.getElementById("upload-status");
  if (statusEl) {
    statusEl.style.display = "block";
    statusEl.style.color = "blue";
    statusEl.textContent = "正在上传，请稍候...";
  }

  const configJson = JSON.stringify(configData, null, 2);
  const fingerprintJson = JSON.stringify(extractFingerprintSubset(configData), null, 2);

  const configFile = new File([configJson], `config_${configData.src}.json`, {
    type: "application/json"
  });
  const fingerprintFile = new File([fingerprintJson], `fingerprint_${configData.src}.json`, {
    type: "application/json"
  });

  const formData = new FormData();
  formData.append("user_id", configData.user_id);       // 保留 user_id
  formData.append("config_file", configFile);           // 由后端解析 group_name
  formData.append("fingerprint_file", fingerprintFile); // 双文件上传

  try {
    const res = await fetch("http://hk.xzzzs.xyz:8000/upload/upload/", {
      method: "POST",
      body: formData
    });

    const text = await res.clone().text();
    console.log("响应原始文本:", text);

    let json;
    try {
      json = await res.json();
      console.log("后端响应 JSON:", json);
    } catch {
      console.warn("响应不是有效 JSON");
    }

    if (!res.ok || json?.status !== "success") {
      return false;
    }

    return true;
  } catch (err) {
    console.error("上传异常:", err);
    return false;
  }
}



