<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useEnvironmentStore } from '@/stores/environment'
import type { EnvironmentConfig } from '@/types/environment'
import {
  createEmptyConfig,
  generateRandomConfig,
  generateSrc,
  GPU_MODELS,
  TIMEZONES,
  LANGUAGES,
  CPU_OPTIONS,
  RAM_OPTIONS,
  WEBRTC_MODES,
} from '@/utils/fingerprint'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const envStore = useEnvironmentStore()

const isEditing = computed(() => route.name === 'environment-edit')
const pageTitle = computed(() => (isEditing.value ? '编辑浏览器环境' : '新建浏览器环境'))

// 当前活跃的 Tab
const activeTab = ref<'basic' | 'proxy' | 'fingerprint'>('basic')

// 环境配置表单
const config = ref<EnvironmentConfig>(createEmptyConfig(authStore.userId))

// 配置总览数据
const overview = computed(() => ({
  browser: 'Chromium',
  os: config.value.os,
  name: config.value.name || '未命名环境',
  group: config.value.group || '未分组',
  notes: config.value.notes || '无',
  proxyType: config.value.proxy_type || 'No Proxy',
  proxyAddress: config.value.proxy_ip_channel || '未填写',
  startupTabs: config.value.proxy_tabs || '无',
  userAgent: config.value.user_agent || '默认值',
  webrtc: config.value.webrtc || '禁用',
  timezone: config.value.timezone_mode === '自定义' ? config.value.timezone : '真实',
  language: config.value.language_mode === '自定义' ? config.value.language : '真实',
  resolution: config.value.resolution_mode || '真实',
  canvas: config.value.canvas === 'noise' ? '启用' : '关闭',
  webgl: config.value.webgl_image === 'noise' ? '启用' : '关闭',
  audio: config.value.audiocontext === 'noise' ? '启用' : '关闭',
  gpu: `${config.value.webgl_vendor} (${config.value.webgl_renderer})`,
  tls: config.value.tls || '真实',
  cpu: config.value.cpu_mode === '自定义' ? `${config.value.cpu} 核` : '真实',
  ram: config.value.ram_mode === '自定义' ? `${config.value.ram} GB` : '真实',
  doNotTrack: config.value.do_not_track || '默认',
  portScan: config.value.port_scan_mode || '启用',
  startupArgs: config.value.startup_args || '无',
}))

// 初始化: 编辑模式时加载配置
onMounted(() => {
  if (isEditing.value) {
    const editSrc = route.params.id as string
    const cachedConfig = envStore.configCache.get(`config_${editSrc}.json`)
    if (cachedConfig) {
      config.value = { ...cachedConfig }
    }
  }
})

// 随机生成
function handleRandomFingerprint() {
  config.value = generateRandomConfig(authStore.userId)
}

// 提交保存
async function handleSave() {
  // 生成唯一标识
  if (!isEditing.value || !config.value.src) {
    config.value.src = generateSrc()
  }
  config.value.user_id = authStore.userId

  const ok = await envStore.saveEnvironment(config.value)
  if (ok) {
    router.push({ name: 'environments' })
  } else {
    alert(envStore.error || '保存失败')
  }
}
</script>

<template>
  <div class="relative">
    <!-- 页面标题 -->
    <div class="mb-6 flex items-center gap-4">
      <h2 class="text-lg font-semibold">{{ pageTitle }}</h2>
      <button
        class="rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-accent transition-colors"
        @click="handleRandomFingerprint"
      >
        随机指纹生成
      </button>
    </div>

    <div class="flex gap-6">
      <!-- 左侧: 表单区域 -->
      <div class="flex-1 space-y-6">
        <!-- Tab 切换 -->
        <div class="flex border-b border-border">
          <button
            v-for="tab in [
              { key: 'basic', label: '基础设置' },
              { key: 'proxy', label: '代理信息' },
              { key: 'fingerprint', label: '指纹配置' },
            ]"
            :key="tab.key"
            :class="[
              'px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
              activeTab === tab.key
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            ]"
            @click="activeTab = tab.key as typeof activeTab"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- ========== 基础设置 Tab ========== -->
        <div v-if="activeTab === 'basic'" class="space-y-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium">名称</label>
            <input
              v-model="config.name"
              type="text"
              placeholder="输入环境名称"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium">操作系统</label>
            <div class="flex gap-2">
              <button
                v-for="os in ['Windows11', 'Windows10']"
                :key="os"
                :class="[
                  'rounded-md border px-4 py-2 text-sm font-medium transition-colors',
                  config.os === os
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:bg-accent',
                ]"
                @click="config.os = os as EnvironmentConfig['os']"
              >
                {{ os }}
              </button>
            </div>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium">User-Agent</label>
            <input
              v-model="config.user_agent"
              type="text"
              placeholder="自定义 User-Agent"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium">分组</label>
            <input
              v-model="config.group"
              type="text"
              placeholder="未分组"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium">备注</label>
            <input
              v-model="config.notes"
              type="text"
              placeholder="请输入备注"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <!-- ========== 代理信息 Tab ========== -->
        <div v-if="activeTab === 'proxy'" class="space-y-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium">代理类型</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="pt in [
                  { value: 'no', label: 'No Proxy (本地直连)' },
                  { value: 'http', label: 'HTTP' },
                  { value: 'socks4', label: 'SOCKS4' },
                  { value: 'socks5', label: 'SOCKS5' },
                ]"
                :key="pt.value"
                :class="[
                  'rounded-md border px-4 py-2 text-sm font-medium transition-colors',
                  config.proxy_type === pt.label || (pt.value === 'no' && config.proxy_type === 'No Proxy')
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:bg-accent',
                ]"
                @click="config.proxy_type = pt.value === 'no' ? 'No Proxy' : pt.value.toUpperCase()"
              >
                {{ pt.label }}
              </button>
            </div>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium">Host 和端口</label>
            <input
              v-model="config.proxy_ip_channel"
              type="text"
              placeholder="例：http://127.0.0.1:10809"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium">启动标签页</label>
            <input
              v-model="config.proxy_tabs"
              type="text"
              placeholder="输入网址（多个网址空格连接）"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <!-- ========== 指纹配置 Tab ========== -->
        <div v-if="activeTab === 'fingerprint'" class="space-y-6">
          <!-- WebRTC -->
          <div>
            <label class="mb-2 block text-sm font-medium">WebRTC</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="mode in WEBRTC_MODES"
                :key="mode"
                :class="[
                  'rounded-md border px-3 py-1.5 text-sm transition-colors',
                  config.webrtc === mode
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:bg-accent',
                ]"
                @click="config.webrtc = mode"
              >
                {{ mode }}
              </button>
            </div>
          </div>

          <!-- 时区 -->
          <div>
            <label class="mb-2 block text-sm font-medium">时区</label>
            <div class="flex gap-2 mb-2">
              <button
                v-for="mode in ['真实', '自定义']"
                :key="mode"
                :class="[
                  'rounded-md border px-3 py-1.5 text-sm transition-colors',
                  config.timezone_mode === mode
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:bg-accent',
                ]"
                @click="config.timezone_mode = mode"
              >
                {{ mode }}
              </button>
            </div>
            <select
              v-if="config.timezone_mode === '自定义'"
              v-model="config.timezone"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option v-for="tz in TIMEZONES" :key="tz" :value="tz">{{ tz }}</option>
            </select>
          </div>

          <!-- 语言 -->
          <div>
            <label class="mb-2 block text-sm font-medium">语言</label>
            <div class="flex gap-2 mb-2">
              <button
                v-for="mode in ['真实', '自定义']"
                :key="mode"
                :class="[
                  'rounded-md border px-3 py-1.5 text-sm transition-colors',
                  config.language_mode === mode
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:bg-accent',
                ]"
                @click="config.language_mode = mode"
              >
                {{ mode }}
              </button>
            </div>
            <select
              v-if="config.language_mode === '自定义'"
              v-model="config.language"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option v-for="lang in LANGUAGES" :key="lang.value" :value="lang.value">{{ lang.label }}</option>
            </select>
          </div>

          <!-- 分辨率 -->
          <div>
            <label class="mb-2 block text-sm font-medium">分辨率</label>
            <div class="flex gap-2">
              <button
                v-for="mode in ['随机', '真实']"
                :key="mode"
                :class="[
                  'rounded-md border px-3 py-1.5 text-sm transition-colors',
                  config.resolution_mode === mode
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:bg-accent',
                ]"
                @click="config.resolution_mode = mode"
              >
                {{ mode }}
              </button>
            </div>
          </div>

          <!-- GPU 厂商 -->
          <div>
            <label class="mb-1.5 block text-sm font-medium">GPU 厂商</label>
            <input
              v-model="config.webgl_vendor"
              type="text"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <!-- GPU 渲染器 -->
          <div>
            <label class="mb-1.5 block text-sm font-medium">GPU 渲染器</label>
            <select
              v-model="config.webgl_renderer"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option v-for="gpu in GPU_MODELS" :key="gpu" :value="gpu">{{ gpu }}</option>
            </select>
          </div>

          <!-- TLS -->
          <div>
            <label class="mb-2 block text-sm font-medium">TLS</label>
            <div class="flex gap-2">
              <button
                v-for="mode in ['真实', '随机']"
                :key="mode"
                :class="[
                  'rounded-md border px-3 py-1.5 text-sm transition-colors',
                  config.tls === mode
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:bg-accent',
                ]"
                @click="config.tls = mode"
              >
                {{ mode }}
              </button>
            </div>
          </div>

          <!-- 硬件噪音 -->
          <div>
            <label class="mb-3 block text-sm font-medium">硬件噪音</label>
            <div class="space-y-3">
              <label
                v-for="item in [
                  { key: 'canvas', label: 'Canvas' },
                  { key: 'webgl_image', label: 'WebGL 图像' },
                  { key: 'audiocontext', label: 'AudioContext' },
                  { key: 'clientrects', label: 'ClientRects' },
                  { key: 'plugin', label: 'Plugin' },
                ]"
                :key="item.key"
                class="flex items-center justify-between rounded-md border border-border px-4 py-2.5"
              >
                <span class="text-sm">{{ item.label }}</span>
                <button
                  :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    (config as Record<string, string>)[item.key] === 'noise'
                      ? 'bg-primary'
                      : 'bg-input',
                  ]"
                  @click.prevent="(config as Record<string, string>)[item.key] = (config as Record<string, string>)[item.key] === 'noise' ? 'real' : 'noise'"
                >
                  <span
                    :class="[
                      'inline-block h-4 w-4 rounded-full bg-white transition-transform',
                      (config as Record<string, string>)[item.key] === 'noise'
                        ? 'translate-x-6'
                        : 'translate-x-1',
                    ]"
                  />
                </button>
              </label>
            </div>
          </div>

          <!-- CPU -->
          <div>
            <label class="mb-2 block text-sm font-medium">CPU</label>
            <div class="flex gap-2 mb-2">
              <button
                v-for="mode in ['真实', '自定义']"
                :key="mode"
                :class="[
                  'rounded-md border px-3 py-1.5 text-sm transition-colors',
                  config.cpu_mode === mode
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:bg-accent',
                ]"
                @click="config.cpu_mode = mode"
              >
                {{ mode }}
              </button>
            </div>
            <select
              v-if="config.cpu_mode === '自定义'"
              v-model="config.cpu"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option v-for="cpu in CPU_OPTIONS" :key="cpu.value" :value="cpu.value">{{ cpu.label }}</option>
            </select>
          </div>

          <!-- RAM -->
          <div>
            <label class="mb-2 block text-sm font-medium">RAM</label>
            <div class="flex gap-2 mb-2">
              <button
                v-for="mode in ['真实', '自定义']"
                :key="mode"
                :class="[
                  'rounded-md border px-3 py-1.5 text-sm transition-colors',
                  config.ram_mode === mode
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:bg-accent',
                ]"
                @click="config.ram_mode = mode"
              >
                {{ mode }}
              </button>
            </div>
            <select
              v-if="config.ram_mode === '自定义'"
              v-model="config.ram"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option v-for="ram in RAM_OPTIONS" :key="ram.value" :value="ram.value">{{ ram.label }}</option>
            </select>
          </div>

          <!-- Do Not Track -->
          <div>
            <label class="mb-2 block text-sm font-medium">Do Not Track</label>
            <div class="flex gap-2">
              <button
                v-for="mode in ['默认', '启用', '关闭']"
                :key="mode"
                :class="[
                  'rounded-md border px-3 py-1.5 text-sm transition-colors',
                  config.do_not_track === mode
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:bg-accent',
                ]"
                @click="config.do_not_track = mode"
              >
                {{ mode }}
              </button>
            </div>
          </div>

          <!-- 端口扫描保护 -->
          <div>
            <label class="mb-2 block text-sm font-medium">端口扫描保护</label>
            <div class="flex gap-2 mb-2">
              <button
                v-for="mode in ['启用', '关闭']"
                :key="mode"
                :class="[
                  'rounded-md border px-3 py-1.5 text-sm transition-colors',
                  config.port_scan_mode === mode
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:bg-accent',
                ]"
                @click="config.port_scan_mode = mode"
              >
                {{ mode }}
              </button>
            </div>
            <input
              v-if="config.port_scan_mode === '启用'"
              v-model="config.port_scan_ports"
              type="text"
              placeholder="选填，允许被扫描的端口"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <!-- 启动参数 -->
          <div>
            <label class="mb-1.5 block text-sm font-medium">启动参数</label>
            <input
              v-model="config.startup_args"
              type="text"
              placeholder="example:"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <!-- 确定按钮 -->
        <div class="pt-4 border-t border-border">
          <button
            :disabled="envStore.loading"
            class="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            @click="handleSave"
          >
            {{ envStore.loading ? '保存中...' : '确定' }}
          </button>
        </div>
      </div>

      <!-- 右侧: 配置总览面板 -->
      <div class="hidden w-72 shrink-0 lg:block">
        <div class="sticky top-6 rounded-lg border border-border bg-card p-4">
          <h3 class="mb-4 text-sm font-semibold">环境配置总览</h3>
          <div class="space-y-2 text-xs">
            <div v-for="(item, index) in [
              { label: '浏览器', value: overview.browser },
              { label: '操作系统', value: overview.os },
              { label: '名称', value: overview.name },
              { label: '分组', value: overview.group },
              { label: '备注', value: overview.notes },
              { label: '代理类型', value: overview.proxyType },
              { label: '代理地址', value: overview.proxyAddress },
              { label: '启动标签页', value: overview.startupTabs },
              { label: 'User-Agent', value: overview.userAgent },
              { label: 'WebRTC', value: overview.webrtc },
              { label: '时区', value: overview.timezone },
              { label: '语言', value: overview.language },
              { label: '分辨率', value: overview.resolution },
              { label: 'Canvas', value: overview.canvas },
              { label: 'WebGL', value: overview.webgl },
              { label: 'AudioContext', value: overview.audio },
              { label: 'GPU', value: overview.gpu },
              { label: 'TLS', value: overview.tls },
              { label: 'CPU', value: overview.cpu },
              { label: 'RAM', value: overview.ram },
              { label: 'Do Not Track', value: overview.doNotTrack },
              { label: '端口扫描保护', value: overview.portScan },
              { label: '启动参数', value: overview.startupArgs },
            ]"
              :key="index"
              class="flex justify-between gap-2"
            >
              <span class="shrink-0 text-muted-foreground">{{ item.label }}:</span>
              <span class="truncate text-right font-medium">{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
