document.addEventListener('DOMContentLoaded', () => {
    const randomBtn = document.getElementById('random-fingerprint-button');
    if (!randomBtn) return;

    randomBtn.addEventListener('click', () => {
        console.log('开始随机生成指纹配置');

        // 通用激活函数
        const activateRandom = (selector) => {
            const options = document.querySelectorAll(`${selector} .setting-option`);
            options.forEach(opt => opt.classList.remove('active'));
            const pick = options[Math.floor(Math.random() * options.length)];
            if (pick) pick.classList.add('active');
        };

        // 通用激活 by label
        const activateByLabel = (label) => {
            const group = Array.from(document.querySelectorAll('.setting-group'))
                .find(g => g.querySelector('.setting-label')?.textContent.includes(label));
            if (!group) return;
            const options = group.querySelectorAll('.setting-option');
            options.forEach(opt => opt.classList.remove('active'));
            const pick = options[Math.floor(Math.random() * options.length)];
            if (pick) pick.classList.add('active');
        };

        // 通用下拉框填充
        const selectRandom = (selector) => {
            const el = document.querySelector(selector);
            if (!el) return;
            el.style.display = 'block';
            el.selectedIndex = Math.floor(Math.random() * el.options.length);
        };

        // 通用输入框填充
        const fillInput = (selector, value) => {
            const el = document.querySelector(selector);
            if (el) {
                el.style.display = 'block';
                el.value = value;
            }
        };

        // 随机值工具
        const rand = () => Math.random().toString(36).slice(2, 6).toUpperCase();

        // 基础设置
        fillInput('#env-name', `环境-${rand()}`);
        fillInput('#user-agent', `Mozilla/${Math.floor(Math.random() * 100)}.0 (Windows NT ${[10, 11][Math.floor(Math.random() * 2)]}; Win64; x64)`);
        fillInput('#group', ['测试组', '主账号', '备用组'][Math.floor(Math.random() * 3)]);
        fillInput('.form-input[placeholder="请输入备注"]', ['自动生成配置', '广告投放用', '指纹测试'][Math.floor(Math.random() * 3)]);
        activateRandom('#os-group');

        // 基础指纹选项
        activateRandom('#webrtc-group');
        activateRandom('#timezone-group');
        activateRandom('#language-group');
        activateRandom('#resolution-group');
        activateByLabel('WebGL元数据');
        activateByLabel('Do Not Track');
        activateByLabel('硬件加速');
        activateByLabel('TLS');
        //fillInput('.custom-resolution-input', ['1920x1080', '1366x768', '2560x1440'][Math.floor(Math.random() * 3)]);
        selectRandom('.timezone-select');
        selectRandom('.language-select');

        // 硬件配置
        const cpuGroup = '#cpu-group';
        const ramGroup = '#ram-group';
        [cpuGroup, ramGroup].forEach(group => {
            const opt = document.querySelector(`${group} .setting-option[data-type="custom"]`);
            if (opt) {
                opt.classList.add('active');
                const select = group.includes('cpu') ? '.cpu-select' : '.ram-select';
                selectRandom(select);
            }
        });


        // 噪音开关
        ['canvas', 'webgl', 'audio', 'media', 'rects', 'plugin'].forEach(name => {
            const cb = document.querySelector(`input[data-name="${name}"]`);
            if (cb) cb.checked = Math.random() > 0.5;
        });



        console.log('所有字段已自动填充完毕');
    });
});



