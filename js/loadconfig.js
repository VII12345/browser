let groupedConfigs = {}; // 顶部声明


document.addEventListener('DOMContentLoaded', async () => {


  const user = await window.electronAPI.getUser();

  if (!user?.access_token) {
    console.warn("未登录用户，跳转登录页");
    window.location.href = "login.html";
  } else {
    console.log("自动识别用户:", user.email, user.user_id);
    localStorage.setItem("email", user.email);
    localStorage.setItem("user_id", user.user_id);
    localStorage.setItem("access_token", user.access_token);
  }


  const currentUserId = localStorage.getItem("user_id") || "";

  const token = localStorage.getItem("access_token");

  console.log('页面加载完成');
  localStorage.setItem('isEditing', 'false');
  if (!window.electronAPI || typeof window.electronAPI.loadConfigs !== 'function') {
    console.warn('electronAPI 未定义或 loadConfigs 不存在，可能未通过 Electron 启动');
    return;
  }

  const envContainer = document.getElementById('env-list');
  envContainer.innerHTML = '';

  // 顶部全选和批量加载控件
  const controlPanel = document.createElement('div');
  controlPanel.className = 'env-control-panel';
  controlPanel.innerHTML = `
    <label class="env-select-toggle">
      <input type="checkbox" id="select-all-toggle" onchange="toggleAllEnvs(this)">
      全选
    </label>
    <button onclick="runSelectedEnvs()">启动勾选环境</button>
  `;
  envContainer.appendChild(controlPanel);

  const files = await window.electronAPI.loadConfigs();


  for (const file of files) {
    if (!file.startsWith('config_')) continue;

    const content = await window.electronAPI.readConfig(file);
    if (content.user_id !== currentUserId) continue;
    const groupName = content.group?.trim() || '未定义分组';

    if (!groupedConfigs[groupName]) {
      groupedConfigs[groupName] = [];
    }

    groupedConfigs[groupName].push({ file, content });
  }

  for (const [group, items] of Object.entries(groupedConfigs)) {
    const groupSection = document.createElement('div');
    groupSection.className = 'env-group';

    groupSection.innerHTML = `
      <div class="group-header">
        <h3 class="group-title">${group}</h3>
        <label class="group-select-toggle">
          <input type="checkbox" onchange="toggleGroupEnvs(this, '${group}')">
          全选
        </label>
      </div>
    `;

    for (const { file, content } of items) {
      const card = document.createElement('div');
      card.className = 'env-card';

      card.innerHTML = `
        <label class="env-checkbox">
          <input type="checkbox" class="env-check" data-src="${content.src}" />
        </label>
        <div class="env-card-title">${content.name || '未命名环境'}</div>
        <div class="env-card-details">
          ua：${content.user_agent || '默认'}<br>
          系统：${content.os || '默认'}<br>
          备注：${content.notes || '未设置'}<br>
          代理：${content.proxy || '未设置'}
        </div>
        <div class="env-card-actions">
           <button class="env-button" onclick="runEnvironment('${content.src}')">启动</button>
           <button class="env-button" onclick="runEnvironmentDebug('${content.src}')">远程调试</button>
           <button class="env-button" onclick="editConfig('${file}')">编辑</button>
           <button class="env-button" onclick="deleteConfig('${file}')">删除</button>
        </div>
      `;

      groupSection.appendChild(card);
    }

    envContainer.appendChild(groupSection);
  }




});

async function runEnvironment(src) {
  if (!src) {
    await window.electronAPI.alert('该配置未包含有效的 src 标识，无法加载 fingerprint 文件');
    return;
  }

  const fingerprintFilename = `fingerprint_${src}.json`;
  const config = await window.electronAPI.readConfig(fingerprintFilename);

  const fingerprintMap = {
    os: '--fingerprint_windows',
    canvas: '--fingerprint_canvas',
    webgl_image: '--fingerprint_webgl',
    audiocontext: '--fingerprint_audio',
    media_devices: '--fingerprint_media',
    clientrects: '--fingerprint_client_rect',
    cpu: '--fingerprint_cpu',
    language: '--lang',
    ram: '--fingerprint_memory',
    timezone: '--fingerprint_timezone',
    resolution: '--fingerprint_screen',
    device_name: '--fingerprint_device',
    mac_address: '--fingerprint_mac',
    gpu: '--fingerprint_gpu_amd',
    tls: '--fingerprint_ja4',
    proxy: '--proxy-server',
    port_scan_ports: '--explicitly-allowed-ports',

  };


  const paths = await window.electronAPI.getChromePaths();
  const userDataDir = `${paths.dataDirBase}\\${src}`;
  const args = [`--user-data-dir="${userDataDir}"`];


  if (config.user_agent) args.push(`--user-agent="${config.user_agent}"`);
  for (const [key, flag] of Object.entries(fingerprintMap)) {
    if (config[key]) args.push(`${flag}="${config[key]}"`);
  }


  if (config.webrtc === "禁用") args.push('--fingerprint_webrtc_disable="1"');
  if (config.startup_args) args.push(config.startup_args);
  if (config.url) args.push(config.url);
  const chromeCommand = `"chrome.exe" ${args.join(" ")}`;
  const command = `cd /d "${paths.chromeDir}" && ${chromeCommand}`;
  console.log("生成的命令:", command);
  try {
    const result = await window.electronAPI.runCmd(command);
    await window.electronAPI.alert(`已加载环境：${src}`);
  } catch (err) {
    console.error("加载失败:", err);
    await window.electronAPI.alert("加载环境失败，请检查路径或权限");
  }

}

async function editConfig(filename) {
  const configData = await window.electronAPI.readConfig(filename);
  localStorage.setItem('editConfig', JSON.stringify(configData));
  localStorage.setItem('editConfigFile', filename);
  localStorage.setItem('isEditing', 'true');
  window.location.href = 'create.html';
}

// async function deleteConfig(filename) {
//   const confirmed = await window.electronAPI.confirm(`确定要删除配置文件：${filename}？`);
//   if (!confirmed) return;

//   await window.electronAPI.deleteConfig(filename);
//   await window.electronAPI.alert(`已删除配置：${filename}`);
//   location.reload();
// }



async function deleteConfig(filename) {
  // const confirmed = await window.electronAPI.confirm(`确定要删除配置文件：${filename}？`);
  const confirmed = window.confirm(`确定要删除配置文件：${filename}？`);

  if (!confirmed) return;

  try {
    const accessToken = localStorage.getItem("access_token");
    const userId = localStorage.getItem("user_id");

    const configData = await window.electronAPI.readConfig(filename); // 需要你定义这个 API
    const folderName = configData.group || "default";

    const baseName = filename.replace(/^config_/, "").replace(/\.json$/, "");
    const fingerprintFilename = `fingerprint_${baseName}.json`;
    const filesToDelete = [filename, fingerprintFilename];

    const res = await fetch("http://vpn.xzzzs.xyz:12809/upload/delete_files_by_folder", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: userId,
        folder_name: folderName,
        files: filesToDelete
      })
    });

    const json = await res.json();
    if (json.status !== "success") {
      await window.electronAPI.confirm(`本地已删除，但服务端删除失败：${json.message || "未知错误"}`);
    } else {
      await window.electronAPI.deleteConfig(filename);
      await window.electronAPI.deleteConfig(fingerprintFilename);
      // await window.electronAPI.confirm(`成功删除：${filesToDelete.join("、")}`);
      await window.confirm(`成功删除：${filesToDelete.join("、")}`);
    }

    location.reload();
  } catch (err) {
    await window.electronAPI.confirm(`删除失败：${err.message || err}`);
  }
}




// 全选按钮切换
function toggleAllEnvs(toggleEl) {
  const isChecked = toggleEl.checked;

  // 所有环境卡片勾选状态切换
  document.querySelectorAll('.env-check').forEach(el => el.checked = isChecked);

  // 所有分组复选框状态同步切换
  document.querySelectorAll('.group-select-toggle input[type="checkbox"]').forEach(el => {
    el.checked = isChecked;
  });
}


// 分组全选切换
function toggleGroupEnvs(toggleEl, groupName) {
  const isChecked = toggleEl.checked;

  document.querySelectorAll('.env-group').forEach(section => {
    const title = section.querySelector('.group-title')?.textContent?.trim();
    if (title && title.includes(groupName)) {
      section.querySelectorAll('.env-check').forEach(el => el.checked = isChecked);
    }
  });
}


// 一键加载所有勾选项
function runSelectedEnvs() {
  const selected = [...document.querySelectorAll('.env-check:checked')];
  if (selected.length === 0) {
    window.electronAPI.alert('未勾选任何环境');
    return;
  }

  selected.forEach(el => {
    const src = el.dataset.src;
    if (src) runEnvironment(src);
  });
}



let currentDebugSrc = "";

function runEnvironmentDebug(src) {
  currentDebugSrc = src;
  document.getElementById("debug-port").value = "9222"; // 默认端口
  document.getElementById("debug-modal").classList.remove("hidden"); // 弹出弹窗
}

function closeDebugModal() {
  document.getElementById("debug-modal").classList.add("hidden");
  currentDebugSrc = "";
}

async function confirmDebug() {
  const port = document.getElementById("debug-port").value.trim();
  const src = currentDebugSrc;
  if (!port) {
    await window.electronAPI.alert("请填写端口号");
    return;
  }

  closeDebugModal(); // 关闭弹窗

  if (!src) {
    await window.electronAPI.alert('该配置未包含有效的 src 标识，无法加载 fingerprint 文件');
    return;
  }

  const fingerprintFilename = `fingerprint_${src}.json`;
  const config = await window.electronAPI.readConfig(fingerprintFilename);

  const fingerprintMap = {
    os: '--fingerprint_windows',
    canvas: '--fingerprint_canvas',
    webgl_image: '--fingerprint_webgl',
    audiocontext: '--fingerprint_audio',
    media_devices: '--fingerprint_media',
    clientrects: '--fingerprint_client_rect',
    cpu: '--fingerprint_cpu',
    ram: '--fingerprint_memory',
    timezone: '--fingerprint_timezone',
    resolution: '--fingerprint_screen',
    os: '--fingerprint_windows',
    device_name: '--fingerprint_device',
    mac_address: '--fingerprint_mac',
    gpu: '--fingerprint_gpu_amd',
    tls: '--fingerprint_ja4',
    proxy: '--proxy-server',
    language: '--lang',
  };


  const paths = await window.electronAPI.getChromePaths();
  const userDataDir = `${paths.dataDirBase}\\${src}`;
  const args = [`--user-data-dir="${userDataDir}"`];
  args.push(`--remote-debugging-port=${port}`);



  if (config.user_agent) args.push(`--user-agent="${config.user_agent}"`);
  for (const [key, flag] of Object.entries(fingerprintMap)) {
    if (config[key]) args.push(`${flag}="${config[key]}"`);
  }

  if (config.webrtc === "禁用") args.push('--fingerprint_webrtc_disable="1"');
  if (config.startup_args) args.push(config.startup_args);
  if (config.url) args.push(config.url);
  const chromeCommand = `"chrome.exe" ${args.join(" ")}`;
  const command = `cd /d "${paths.chromeDir}" && ${chromeCommand}`;
  console.log("生成的命令:", command);
  try {
    const result = await window.electronAPI.runCmd(command);
    await window.electronAPI.alert(`已加载环境：${src}`);
  } catch (err) {
    console.error("加载失败:", err);
    await window.electronAPI.alert("加载环境失败，请检查路径或权限");
  }


}

document.addEventListener("DOMContentLoaded", () => {
  const allEnvBtn = document.getElementById("sidebar-all-env");
  const groupManageBtn = document.getElementById("sidebar-group-manage");

  allEnvBtn?.addEventListener("click", () => {
    console.log("allEnvBtn:", allEnvBtn);
    document.getElementById("env-list-container").classList.remove("hidden");
    document.getElementById("group-list-container").classList.add("hidden");
  });

  groupManageBtn?.addEventListener("click", () => {
    console.log("allEnvBtn:", allEnvBtn);
    document.getElementById("env-list-container").classList.add("hidden");
    document.getElementById("group-list-container").classList.remove("hidden");
    renderGroupList();
  });

  // 其他初始化逻辑...
});

function renderGroupList() {
  const listEl = document.getElementById("group-list");
  listEl.innerHTML = "";
  Object.keys(groupedConfigs).forEach(group => {
    const btn = document.createElement("button");
    btn.textContent = group;
    btn.className = "group-list-button";
    btn.onclick = () => renderGroupEnvs(group);
    listEl.appendChild(btn);
  });
}


function runGroupEnvs(groupName) {
  const configs = groupedConfigs[groupName] || [];
  if (configs.length === 0) {
    window.electronAPI.alert(`分组 "${groupName}" 没有可启动的环境`);
    return;
  }

  configs.forEach(({ content }) => {
    const src = content.src;
    if (src) runEnvironment(src);
  });
}


// 展示指定分组下所有环境
function renderGroupEnvs(groupName) {
  const container = document.getElementById("group-env-list");
  container.innerHTML = "";

  const configs = groupedConfigs[groupName] || [];

  // 添加启动按钮
  const header = document.createElement("div");
  header.style.marginBottom = "12px";
  header.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <h3 style="margin: 0;">${groupName} 的环境</h3>
      <button onclick="runGroupEnvs('${groupName}')">启动该分组所有环境</button>
    </div>
  `;
  container.appendChild(header);

  configs.forEach(({ file, content }) => {
    const card = document.createElement("div");
    card.className = "env-card";
    card.innerHTML = `
      <div class="env-card-title">${content.name || '未命名环境'}</div>
      <div class="env-card-details">
        ua：${content.user_agent || '默认'}<br>
        系统：${content.os || '默认'}<br>
        备注：${content.notes || '未设置'}
      </div>
      <div class="env-card-actions">
        <button class="env-button" onclick="runEnvironment('${content.src}')">启动</button>
        <button class="env-button" onclick="editConfig('${file}')">编辑</button>
        <button class="env-button" onclick="deleteConfig('${file}')">删除</button>
      </div>
    `;
    container.appendChild(card);
  });
}









