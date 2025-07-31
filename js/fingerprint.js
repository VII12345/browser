document.addEventListener('DOMContentLoaded', () => {
  console.log("页面开始初始化交互绑定");


  // 通用点击激活组内选项
  document.querySelectorAll('.setting-options').forEach(group => {
    group.querySelectorAll('.setting-option').forEach(option => {
      option.addEventListener('click', () => {
        group.querySelectorAll('.setting-option').forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
      });
    });
  });

  // 分辨率模块（含预设和自定义切换）
  const resolutionGroup = document.getElementById('resolution-group');
  if (resolutionGroup) {
    const options = resolutionGroup.querySelectorAll('.setting-option');
    const presetContainer = resolutionGroup.querySelector('.preset-options');
    const customInput = resolutionGroup.querySelector('.custom-resolution-input');

    options.forEach(option => {
      option.addEventListener('click', () => {
        options.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        const type = option.dataset.type;
        presetContainer.style.display = type === 'preset' ? 'flex' : 'none';
        customInput.style.display = type === 'custom' ? 'block' : 'none';
        if (type !== 'custom') customInput.value = '';
      });
    });

    presetContainer?.querySelectorAll('.preset-item').forEach(item => {
      item.addEventListener('click', () => {
        const value = item.textContent;
        customInput.style.display = 'block';
        customInput.value = value;
        options.forEach(opt => {
          opt.classList.remove('active');
          if (opt.dataset.type === 'custom') opt.classList.add('active');
        });
        presetContainer.style.display = 'none';
      });
    });
  }

  // 统一绑定模块函数
  bindCustomSelectToggle('timezone-group', 'timezone-select');
  bindCustomSelectToggle('language-group', 'language-select');
  bindSelectToggle('cpu-group', 'cpu-select');
  bindSelectToggle('lang-group', 'lang-select');
  bindSelectToggle('ram-group', 'ram-select');
  bindInputToggle('device-group', 'device-input');
  bindInputToggle('mac-group', 'mac-input', true);
});

// 模块函数：切换下拉框显示
function bindCustomSelectToggle(groupId, selectClass) {
  const group = document.getElementById(groupId);
  if (!group) return;
  const options = group.querySelectorAll('.setting-option');
  const select = group.querySelector(`.${selectClass}`);
  if (!select) return;

  options.forEach(option => {
    option.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('active'));
      option.classList.add('active');

      const type = option.dataset.type;
      select.style.display = type === 'custom' ? 'block' : 'none';
      if (type !== 'custom') select.value = '';
    });
  });
}

function bindSelectToggle(groupId, selectClass) {
  bindCustomSelectToggle(groupId, selectClass); // 可以直接复用上面逻辑
}

function bindInputToggle(groupId, inputClass, isMac = false) {
  const group = document.getElementById(groupId);
  if (!group) return;
  const options = group.querySelectorAll('.setting-option');
  const input = group.querySelector(`.${inputClass}`);
  if (!input) return;

  options.forEach(option => {
    option.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('active'));
      option.classList.add('active');

      const type = option.dataset.type;
      if (type === 'custom') {
        input.style.display = 'block';
        if (isMac) input.value = generateRandomMac();
      } else {
        input.style.display = 'none';
        input.value = '';
      }
    });
  });
}

function generateRandomMac() {
  return Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join('-').toUpperCase();
}

function getNoiseSettings() {
  const switches = document.querySelectorAll('.noise-switch');
  const noiseConfig = {};
  switches.forEach(input => {
    if (input.dataset.name) {
      noiseConfig[input.dataset.name] = input.checked;
    }
  });
  return noiseConfig;
}
