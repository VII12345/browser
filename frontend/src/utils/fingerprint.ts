import type { EnvironmentConfig } from '@/api/environment'

/** GPU 型号列表 */
export const GPU_MODELS = [
  'ANGLE (AMD Radeon RX 6400)',
  'ANGLE (AMD Radeon RX 6500 XT)',
  'ANGLE (AMD Radeon RX 6600)',
  'ANGLE (AMD Radeon RX 6600 XT)',
  'ANGLE (AMD Radeon RX 6650 XT)',
  'ANGLE (AMD Radeon RX 6700)',
  'ANGLE (AMD Radeon RX 6700 XT)',
  'ANGLE (AMD Radeon RX 6750 GRE)',
  'ANGLE (AMD Radeon RX 6750 XT)',
  'ANGLE (AMD Radeon RX 6800)',
  'ANGLE (AMD Radeon RX 6800 XT)',
  'ANGLE (AMD Radeon RX 6900 XT)',
  'ANGLE (AMD Radeon RX 6950 XT)',
  'ANGLE (AMD Radeon RX 7600)',
  'ANGLE (AMD Radeon RX 7600 XT)',
  'ANGLE (AMD Radeon RX 7700 XT)',
  'ANGLE (AMD Radeon RX 7800 XT)',
  'ANGLE (AMD Radeon RX 7900 GRE)',
  'ANGLE (AMD Radeon RX 7900 XT)',
  'ANGLE (AMD Radeon RX 7900 XTX)',
]

/** 时区列表 */
export const TIMEZONES = [
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Asia/Hong_Kong',
  'Asia/Seoul',
  'Asia/Kolkata',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
  'Australia/Sydney',
  'UTC',
]

/** 语言列表 */
export const LANGUAGES = [
  { value: 'zh-CN', label: '中文（简体）' },
  { value: 'en-US', label: '英语（美国）' },
  { value: 'en-GB', label: '英语（英国）' },
  { value: 'ja', label: '日语' },
  { value: 'zh-TW', label: '中文（繁体）' },
  { value: 'ko', label: '韩语' },
  { value: 'de', label: '德语' },
  { value: 'fr', label: '法语' },
  { value: 'es', label: '西班牙语' },
  { value: 'pt-BR', label: '葡萄牙语（巴西）' },
  { value: 'ru', label: '俄语' },
  { value: 'it', label: '意大利语' },
  { value: 'hi', label: '印地语' },
]

/** User-Agent 列表 */
export const USER_AGENTS = [
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
]

/** CPU 核数选项 */
export const CPU_OPTIONS = [
  { value: '4', label: '4 核' },
  { value: '8', label: '8 核' },
  { value: '12', label: '12 核' },
  { value: '16', label: '16 核' },
  { value: '24', label: '24 核' },
]

/** RAM 选项 */
export const RAM_OPTIONS = [
  { value: '4', label: '4 GB' },
  { value: '8', label: '8 GB' },
  { value: '16', label: '16 GB' },
  { value: '32', label: '32 GB' },
  { value: '64', label: '64 GB' },
]

/** WebRTC 模式选项 */
export const WEBRTC_MODES = ['转发', '替换', '真实', '禁用']

/** 生成随机环境标识 */
export function generateSrc(): string {
  return `SRC-${Date.now()}-${Math.floor(Math.random() * 100000)}`
}

/** 创建空的环境配置 */
export function createEmptyConfig(): EnvironmentConfig {
  return {
    src: generateSrc(),
    name: '',
    os: 'Windows11',
    user_agent: '',
    group: '',
    notes: '',
    proxy_mode: '自定义',
    proxy_type: 'no',
    proxy_ip_channel: '',
    proxy_account_platform: '',
    proxy_tabs: '',
    webrtc: '禁用',
    timezone_mode: '自定义',
    timezone: 'Asia/Shanghai',
    language_mode: '真实',
    language: '',
    resolution_mode: '真实',
    resolution: '',
    webgl_metadata: '',
    webgl_vendor: 'Google Inc. (AMD)',
    webgl_renderer: 'ANGLE (AMD Radeon RX 6700)',
    canvas: 'real',
    webgl_image: 'real',
    audiocontext: 'real',
    media_devices: 'real',
    clientrects: 'real',
    plugin: 'real',
    cpu_mode: '真实',
    cpu: '',
    ram_mode: '真实',
    ram: '',
    device_name_mode: '真实',
    device_name: '',
    mac_mode: '真实',
    mac_address: '',
    do_not_track: '默认',
    port_scan_mode: '启用',
    port_scan_ports: '',
    hardware_acceleration: '启用',
    tls: '真实',
    startup_args: '',
  }
}

/** 生成随机配置 */
export function generateRandomConfig(): EnvironmentConfig {
  const config = createEmptyConfig()
  const rand = () => Math.random().toString(36).slice(2, 6).toUpperCase()

  config.name = `环境-${rand()}`
  config.user_agent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
  config.group = ['测试组', '主账号', '备用组'][Math.floor(Math.random() * 3)]
  config.notes = ['自动生成配置', '广告投放用', '指纹测试'][Math.floor(Math.random() * 3)]

  // OS
  config.os = Math.random() > 0.5 ? 'Windows11' : 'Windows10'

  // WebRTC
  config.webrtc = WEBRTC_MODES[Math.floor(Math.random() * WEBRTC_MODES.length)]

  // 时区
  config.timezone = TIMEZONES[Math.floor(Math.random() * TIMEZONES.length)]

  // 分辨率
  config.resolution_mode = Math.random() > 0.5 ? '随机' : '真实'

  // TLS
  config.tls = Math.random() > 0.5 ? '随机' : '真实'

  // GPU
  config.webgl_renderer = GPU_MODELS[Math.floor(Math.random() * GPU_MODELS.length)]

  // CPU / RAM
  config.cpu_mode = Math.random() > 0.5 ? '自定义' : '真实'
  if (config.cpu_mode === '自定义') {
    config.cpu = CPU_OPTIONS[Math.floor(Math.random() * CPU_OPTIONS.length)].value
  }
  config.ram_mode = Math.random() > 0.5 ? '自定义' : '真实'
  if (config.ram_mode === '自定义') {
    config.ram = RAM_OPTIONS[Math.floor(Math.random() * RAM_OPTIONS.length)].value
  }

  // 噪音
  const noiseFields = ['canvas', 'webgl_image', 'audiocontext', 'media_devices', 'clientrects', 'plugin'] as const
  for (const field of noiseFields) {
    ;(config as unknown as Record<string, string>)[field] = Math.random() > 0.5 ? 'noise' : 'real'
  }

  return config
}
