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
        // 在你的脚本顶部或合适位置定义一份 UA 列表：
        const UA_LIST = [
            // Chrome 系列
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.63 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.5938.92 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.96 Safari/537.36',

            // Firefox 系列
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:117.0) Gecko/20100101 Firefox/117.0',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:116.0) Gecko/20100101 Firefox/116.0',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0',

            // Edge 系列
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.63 Safari/537.36 Edg/118.0.2088.57',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.5938.92 Safari/537.36 Edg/117.0.2045.47',

            // Opera 系列
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.63 Safari/537.36 OPR/104.0.4815.75',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.5938.92 Safari/537.36 OPR/103.0.4928.34',

            // Brave 浏览器（基于 Chromium）
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.63 Safari/537.36 Brave/1.60.114',

            // Vivaldi 浏览器
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.63 Safari/537.36 Vivaldi/6.2.3105.58'
        ];


        // 随机选一个 UA 然后填到输入框里
        const randomUA = UA_LIST[Math.floor(Math.random() * UA_LIST.length)];
        fillInput('#user-agent', randomUA);

        // const proxy_num = 4;
        // const input = document.getElementById('form_proxy');
        // const proxyTypeContainer = document.getElementById('proxy-type');

        // if (!input || !proxyTypeContainer) return;

        // // 随机端口号：20000–20007
        // const port = 20000 + Math.floor(Math.random() * 2 * proxy_num);
        // const isEven = port % 2 === 0;

        // // 协议与代理类型
        // const protocol = isEven ? 'socks5://' : 'http://';
        // const proxyValue = isEven ? 'socks5' : 'http';

        // // 设置输入框值
        // input.value = `${protocol}127.0.0.1:${port}`;

        // proxyTypeContainer.querySelectorAll('.setting-option').forEach(option => {
        //     option.classList.remove('active');
        // });

        // // 设置对应代理类型为 active
        // const selectedOption = proxyTypeContainer.querySelector(`.setting-option[data-value="${proxyValue}"]`);
        // if (selectedOption) {
        //     selectedOption.classList.add('active');
        // }




        fillInput('#group', ['测试组', '主账号', '备用组'][Math.floor(Math.random() * 3)]);
        fillInput('.form-input[placeholder="请输入备注"]', ['自动生成配置', '广告投放用', '指纹测试'][Math.floor(Math.random() * 3)]);
        activateRandom('#os-group');

        // 基础指纹选项
        activateRandom('#webrtc-group');
        activateRandom('#timezone-group');
        //activateRandom('#language-group');
        activateRandom('#resolution-group');
        activateByLabel('WebGL元数据');
        activateByLabel('Do Not Track');
        activateByLabel('硬件加速');
        activateByLabel('TLS');
        //fillInput('.custom-resolution-input', ['1920x1080', '1366x768', '2560x1440'][Math.floor(Math.random() * 3)]);
        selectRandom('.timezone-select');
        //selectRandom('.language-select');

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



