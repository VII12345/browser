/** 操作系统类型 */
export type OSType = 'Windows11' | 'Windows10'

/** 代理类型 */
export type ProxyType = 'no' | 'http' | 'socks4' | 'socks5'

/** WebRTC 模式 */
export type WebRTCMode = '转发' | '替换' | '真实' | '禁用'

/** 时区设置模式 */
export type SettingMode = '真实' | '自定义'

/** 噪音开关字段 */
export type NoiseField = 'canvas' | 'webgl_image' | 'audiocontext' | 'media_devices' | 'clientrects' | 'plugin'

/** 环境配置 - 完整版 (从原始 JS 迁移) */
export interface EnvironmentConfig {
  /** 用户 ID */
  user_id: string
  /** 环境唯一标识 (SRC-timestamp-random) */
  src: string
  /** 环境名称 */
  name: string
  /** 操作系统 */
  os: OSType
  /** User-Agent */
  user_agent: string
  /** 分组 */
  group: string
  /** 备注 */
  notes: string

  // === 代理配置 ===
  proxy_mode: string
  proxy_type: string
  proxy_ip_channel: string
  proxy_account_platform: string
  proxy_tabs: string

  // === 指纹特征 ===
  webrtc: WebRTCMode | string
  timezone_mode: SettingMode | string
  timezone: string
  language_mode: SettingMode | string
  language: string
  resolution_mode: string
  resolution: string
  webgl_metadata: string
  webgl_vendor: string
  webgl_renderer: string

  // === 噪音特征 ===
  canvas: string       // 'noise' | 'real'
  webgl_image: string
  audiocontext: string
  media_devices: string
  clientrects: string
  plugin: string

  // === 硬件伪装 ===
  cpu_mode: SettingMode | string
  cpu: string
  ram_mode: SettingMode | string
  ram: string
  device_name_mode: SettingMode | string
  device_name: string
  mac_mode: SettingMode | string
  mac_address: string

  // === 隐私特性 ===
  do_not_track: string
  port_scan_mode: string
  port_scan_ports: string
  hardware_acceleration: string
  tls: string
  startup_args: string
}

/** 指纹配置子集 (用于生成 fingerprint JSON) */
export interface FingerprintConfig {
  src: number
  proxy: string
  url: string
  os: string
  canvas: string
  webgl_image: string
  audiocontext: string
  media_devices: string
  clientrects: string
  plugin: string
  cpu: string
  ram: string
  tls: string
  timezone: string
  resolution: string
  user_agent: string
  gpu: string
  webrtc: string
  language: string
  port_scan_ports: string
  startup_args: string
}

/** 环境列表项 (用于列表展示) */
export interface EnvironmentListItem {
  id: number
  src: string
  name: string
  os: string
  user_agent: string
  group: string
  notes: string
  proxy_type: string
  proxy_ip_channel: string
}

/** 分组信息 */
export interface GroupInfo {
  name: string
  count: number
}

/** 文件同步响应 */
export interface SyncInstance {
  files: {
    file_name: string
    url: string
  }[]
}

export interface SyncResponse {
  status: 'success' | 'error'
  message?: string
  instances: SyncInstance[]
}

/** 删除远程文件请求 */
export interface DeleteRemoteFilesRequest {
  user_id: string
  folder_name: string
  files: string[]
}
