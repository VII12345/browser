import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  EnvironmentConfig,
  EnvironmentListItem,
  FingerprintConfig,
  GroupInfo,
} from '@/types/environment'
import * as envApi from '@/api/environment'
import { useAuthStore } from './auth'

export const useEnvironmentStore = defineStore('environment', () => {
  // === State ===
  const environments = ref<EnvironmentListItem[]>([])
  const configCache = ref<Map<string, EnvironmentConfig>>(new Map())
  const loading = ref(false)
  const syncing = ref(false)
  const error = ref<string | null>(null)

  // === Getters ===
  const groups = computed<GroupInfo[]>(() => {
    const groupMap = new Map<string, number>()
    for (const env of environments.value) {
      const name = env.group || '未分组'
      groupMap.set(name, (groupMap.get(name) || 0) + 1)
    }
    return Array.from(groupMap.entries()).map(([name, count]) => ({ name, count }))
  })

  // === Actions ===

  /** 从服务器下载并解析环境列表 */
  async function fetchEnvironments() {
    const authStore = useAuthStore()
    if (!authStore.userId) return

    loading.value = true
    error.value = null

    try {
      const res = await envApi.syncDownload(authStore.userId)
      const { instances } = res.data

      const list: EnvironmentListItem[] = []
      const cache = new Map<string, EnvironmentConfig>()

      for (const instance of instances) {
        for (const file of instance.files) {
          if (file.file_name.startsWith('config_') && file.file_name.endsWith('.json')) {
            try {
              const fileRes = await fetch(file.url)
              const config: EnvironmentConfig = await fileRes.json()

              if (config.user_id === authStore.userId) {
                cache.set(file.file_name, config)
                list.push({
                  src: config.src,
                  name: config.name || '未命名环境',
                  os: config.os || 'Windows11',
                  user_agent: config.user_agent || '默认',
                  group: config.group || '未分组',
                  notes: config.notes || '',
                  proxy_type: config.proxy_type || 'No Proxy',
                  proxy_ip_channel: config.proxy_ip_channel || '',
                })
              }
            } catch {
              console.warn(`解析配置文件失败: ${file.file_name}`)
            }
          }
        }
      }

      environments.value = list
      configCache.value = cache
    } catch (err: unknown) {
      const message = (err as Error).message || '获取环境列表失败'
      error.value = message
    } finally {
      loading.value = false
    }
  }

  /** 上传环境配置 */
  async function saveEnvironment(configData: EnvironmentConfig): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      const fingerprintData = extractFingerprintSubset(configData)

      const configJson = JSON.stringify(configData, null, 2)
      const fingerprintJson = JSON.stringify(fingerprintData, null, 2)

      const configFile = new File([configJson], `config_${configData.src}.json`, {
        type: 'application/json',
      })
      const fingerprintFile = new File([fingerprintJson], `fingerprint_${configData.src}.json`, {
        type: 'application/json',
      })

      const formData = new FormData()
      formData.append('user_id', configData.user_id)
      formData.append('config_file', configFile)
      formData.append('fingerprint_file', fingerprintFile)

      const res = await envApi.uploadEnvironment(formData)
      if (res.data.status !== 'success') {
        error.value = '上传失败'
        return false
      }

      return true
    } catch (err: unknown) {
      error.value = (err as Error).message || '保存环境失败'
      return false
    } finally {
      loading.value = false
    }
  }

  /** 删除环境 */
  async function deleteEnvironment(config: EnvironmentConfig, filename: string): Promise<boolean> {
    const authStore = useAuthStore()
    loading.value = true
    error.value = null

    try {
      const baseName = filename.replace(/^config_/, '').replace(/\.json$/, '')
      const fingerprintFilename = `fingerprint_${baseName}.json`

      await envApi.deleteRemoteFiles({
        user_id: authStore.userId,
        folder_name: config.group || '未分组',
        files: [filename, fingerprintFilename],
      })

      // 刷新列表
      await fetchEnvironments()
      return true
    } catch (err: unknown) {
      error.value = (err as Error).message || '删除环境失败'
      return false
    } finally {
      loading.value = false
    }
  }

  /** 同步配置 */
  async function syncEnvironments() {
    syncing.value = true
    try {
      await fetchEnvironments()
    } finally {
      syncing.value = false
    }
  }

  /** 获取指定分组的环境 */
  function getEnvironmentsByGroup(groupName: string): EnvironmentListItem[] {
    return environments.value.filter((env) => (env.group || '未分组') === groupName)
  }

  return {
    // state
    environments,
    configCache,
    loading,
    syncing,
    error,
    // getters
    groups,
    // actions
    fetchEnvironments,
    saveEnvironment,
    deleteEnvironment,
    syncEnvironments,
    getEnvironmentsByGroup,
  }
})

// =============================================
// 辅助函数: 从配置中提取指纹子集
// =============================================

function extractFingerprintSubset(config: EnvironmentConfig): FingerprintConfig {
  const randStr = () => Math.floor(100000000 + Math.random() * 900000000).toString()
  const convert = (value: string) => (value === 'noise' ? randStr() : '')

  const gpuModels = [
    '6400', '6500 XT', '6600', '6600 XT', '6650 XT',
    '6700', '6700 XT', '6750 GRE', '6750 XT', '6800',
    '6800 XT', '6900 XT', '6950 XT', '7600', '7600 XT',
    '7700 XT', '7800 XT', '7900 GRE', '7900 XT', '7900 XTX',
  ]

  function gpuIndexFromLabel(label: string): string {
    for (let i = 0; i < gpuModels.length; i++) {
      if (label.includes(`RX ${gpuModels[i]}`)) {
        return (i + 1000000).toString()
      }
    }
    return ''
  }

  return {
    src: config.os === 'Windows11' ? 5 : 1,
    proxy: config.proxy_ip_channel,
    url: config.proxy_tabs,
    os: config.os,
    canvas: convert(config.canvas),
    webgl_image: convert(config.webgl_image),
    audiocontext: convert(config.audiocontext),
    media_devices: convert(config.media_devices),
    clientrects: convert(config.clientrects),
    plugin: convert(config.plugin),
    cpu: config.cpu_mode === '自定义' ? config.cpu : '',
    ram: config.ram_mode === '自定义' ? config.ram : '',
    tls: config.tls === '随机' ? randStr() : '',
    timezone: config.timezone || 'Asia/Shanghai',
    resolution: config.resolution_mode === '随机' ? randStr() : '',
    user_agent: config.user_agent,
    gpu: gpuIndexFromLabel(config.webgl_renderer || ''),
    webrtc: config.webrtc,
    language: config.language || 'zh-CN',
    port_scan_ports: config.port_scan_mode === '启用' ? config.port_scan_ports : '',
    startup_args: config.startup_args,
  }
}
