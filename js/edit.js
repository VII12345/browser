document.addEventListener('DOMContentLoaded', () => {
  const config = localStorage.getItem('editConfig');
  const filename = localStorage.getItem('editConfigFile');
  const isEditing = localStorage.getItem('isEditing') === 'true';
  if (!isEditing || !config) return;
  // localStorage.removeItem("editConfig");
  // localStorage.setItem("isEditing", "false");
  console.log(`正在编辑配置文件: ${filename}`);
  const data = JSON.parse(config);

  // 通用设置器
  const setValue = (selector, value) => {
    const el = document.querySelector(selector);
    if (el) el.value = value || "";
  };

  const setSelect = (selector, value) => {
    const el = document.querySelector(selector);
    if (el) el.value = value || "";
  };

  const setActiveOption = (groupSelector, matchValue) => {
    const group = document.querySelector(groupSelector);
    if (!group) return;
    const options = group.querySelectorAll('.setting-option');
    options.forEach(opt => {
      opt.classList.toggle('active', opt.textContent.trim() === matchValue);
    });
  };

  const setActiveByType = (groupSelector, type) => {
    const options = document.querySelectorAll(`${groupSelector} .setting-option`);
    options.forEach(opt => {
      opt.classList.toggle('active', opt.dataset.type === type);
    });
  };

  const setSwitch = (name, value) => {
    const el = document.querySelector(`input[data-name="${name}"]`);
    if (el) el.checked = value === "noise";
  };

  // 基本信息
  setValue("#env-name", data.name);
  setValue("#user-agent", data.user_agent);
  setValue("#group", data.group);
  setValue('.form-input[placeholder="请输入备注"]', data.notes);
  setValue('.form-input[placeholder="example:"]', data.startup_args);

  // 指纹特征
  setActiveOption("#webrtc-group", data.webrtc);
  setActiveOption("#timezone-group", data.timezone_mode);
  setSelect(".timezone-select", data.timezone);
  setActiveOption("#language-group", data.language_mode);
  setSelect(".language-select", data.language);
  setActiveOption("#resolution-group", data.resolution_mode);
  setValue(".custom-resolution-input", data.resolution);

  setSwitch("canvas", data.canvas);
  setSwitch("webgl", data.webgl_image);
  setSwitch("audio", data.audiocontext);
  setSwitch("media", data.media_devices);
  setSwitch("rects", data.clientrects);
  setSwitch("plugin", data.plugin);

  // WebGL 元数据
  const vendorEl = [...document.querySelectorAll(".form-input")].find(el =>
    el.value.includes("Google Inc") || el.placeholder?.includes("厂商")
  );
  if (vendorEl) vendorEl.value = data.webgl_vendor || "";

  const rendererEl = document.querySelector(".collapsible-trigger");
  if (rendererEl) rendererEl.textContent = data.webgl_renderer || "";

  // 硬件伪装
  setActiveByType("#cpu-group", data.cpu_mode === "real" ? "real" : "custom");
  setSelect(".cpu-select", data.cpu);

  setActiveByType("#ram-group", data.ram_mode === "real" ? "real" : "custom");
  setSelect(".ram-select", data.ram);
  setActiveByType("#device-group", data.device_name_mode === "real" ? "real" : "custom");
  setValue(".device-input", data.device_name);
  setActiveByType("#mac-group", data.mac_mode === "real" ? "real" : "custom");
  setValue(".mac-input", data.mac_address);

  // 隐私特性
  setActiveOption('.setting-group:has(.setting-label:contains("Do Not Track"))', data.do_not_track);
  setActiveOption('.setting-group:has(.setting-label:contains("硬件加速"))', data.hardware_acceleration);
  setActiveOption('.setting-group:has(.setting-label:contains("TLS 特性"))', data.tls_disabled);
  setActiveOption('.setting-group:has(.setting-label:contains("端口扫描保护"))', data.port_scan_mode);
  setValue('.form-input[placeholder*="端口"]', data.port_scan_ports);

  // 代理配置
  setActiveOption('#proxy .form-group:nth-child(1)', data.proxy_mode);
  setActiveOption('#proxy .setting-item', data.proxy_type);
  setValue('#proxy input[placeholder="例：http://127.0.0.1:10809"]', data.proxy_ip_channel);

  setValue('#proxy input[placeholder="无"]', data.proxy_account_platform);
  setValue('#proxy input[placeholder^="输入网址"]', data.proxy_tabs);

  // 状态清理
  localStorage.removeItem("editConfig");
  localStorage.setItem("isEditing", "false");
});
