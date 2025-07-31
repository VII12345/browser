document.addEventListener('DOMContentLoaded', () => {
  const detailMap = {
    '浏览器': () => 'Chromium',
    '环境名称': () => document.getElementById('env-name')?.value || '未命名环境',
    '操作系统': () => document.querySelector('#os-group .setting-option.active')?.textContent || '未选择',
    '分组': () => document.getElementById('group')?.value || '未分组',
    '备注': () => document.querySelector('input[placeholder="请输入备注"]')?.value || '无',

    // 代理信息
    '代理类型': () => {
      const proxyTypeGroup = document.querySelector('#proxy .setting-item .setting-options');
      const active = proxyTypeGroup?.querySelector('.setting-option.active');
      return active?.textContent || 'No Proxy';
    },
    '代理地址': () => {
      const input = document.querySelector('#proxy input[placeholder*="http"]');
      return input?.value || '未填写';
    },
    '启动标签页': () => document.querySelector('#proxy input[placeholder*="网址"]')?.value || '无',

    // 指纹信息
    'User-Agent': () => document.getElementById('user-agent')?.value || '默认值',
    'WebRTC': () => getActiveText('#webrtc-group'),
    '时区': () => {
      const activeType = document.querySelector('#timezone-group .setting-option.active')?.dataset.type;
      if (activeType === 'custom') {
        const select = document.querySelector('.timezone-select');
        return select?.value || 'Asia/Shanghai';
      }
      return '真实';
    },
    '语言': () => {
      const activeType = document.querySelector('#language-group .setting-option.active')?.dataset.type;
      if (activeType === 'custom') {
        const select = document.querySelector('.language-select');
        return select?.value || 'zh-CN';
      }
      return '真实';
    },

    '分辨率': () => getResolutionSummary(),
    'Canvas': () => getSwitchState('canvas'),
    'WebGL图像': () => getSwitchState('webgl'),
    'AudioContext': () => getSwitchState('audio'),
    '厂商': () => document.querySelector('#fingerprint input')?.value || '默认',
    '渲染器': () => document.querySelector('.selected-gpu')?.textContent || '未选择',
    'TLS': () => getActiveText('#fingerprint .setting-group:nth-of-type(6)'),

    // 噪音开关
    'Canvas噪音': () => getCheckboxState('canvas'),
    'WebGL噪音': () => getCheckboxState('webgl'),
    'AudioContext噪音': () => getCheckboxState('audio'),
    '媒体设备噪音': () => getCheckboxState('media'),
    'ClientRects噪音': () => getCheckboxState('rects'),
    'Plugin噪音': () => getCheckboxState('plugin'),

    // 硬件配置
    'CPU': () => getHardwareState('cpu'),
    'RAM': () => getHardwareState('ram'),

    // 其他
    'Do Not Track': () => getActiveText('#fingerprint .setting-group:nth-of-type(10)'),
    '端口扫描保护': () => getActiveText('#fingerprint .setting-group:nth-of-type(11)'),
    '启动参数': () => document.querySelector('#fingerprint input[placeholder*="example"]')?.value || '无'
  };

  function getActiveText(selector) {
    const active = document.querySelector(`${selector} .setting-option.active`);
    return active ? active.textContent : '未设置';
  }

  function getResolutionSummary() {
    const group = document.querySelector('#resolution-group');
    const active = group.querySelector('.setting-option.active')?.dataset.type;
    if (active === 'custom') {
      return group.querySelector('.custom-resolution-input')?.value || '自定义';
    }
    return getActiveText('#resolution-group');
  }

  function getCheckboxState(name) {
    const input = document.querySelector(`#hardware-noise-group input[data-name="${name}"]`);
    return input?.checked ? '启用' : '关闭';
  }

  function getSwitchState(name) {
    const input = document.querySelector(`#hardware-noise-group input[data-name="${name}"]`);
    return input?.checked ? '噪声' : '真实';
  }

  function getHardwareState(type) {
    const group = document.getElementById(`${type}-group`);
    const active = group.querySelector('.setting-option.active')?.dataset.type;
    if (active === 'custom') {
      const select = group.querySelector(`.${type}-select`);
      return select?.value ? `${select.value} ${type === 'cpu' ? '核' : 'GB'}` : '自定义';
    }
    return '真实';
  }

  function updateDetailPanel() {
    document.querySelectorAll('.overview-item').forEach(item => {
      const label = item.dataset.label;
      const valueSpan = item.querySelector('.overview-value') || item.querySelector('.detail-value');

      const getValue = detailMap[label];
      if (getValue && valueSpan) {
        valueSpan.textContent = getValue();
      }
    });
  }

  // 初次加载
  updateDetailPanel();

  // 全局更新监听
  document.body.addEventListener('click', updateDetailPanel);
  document.body.addEventListener('input', updateDetailPanel);
  document.body.addEventListener('change', updateDetailPanel);
});
