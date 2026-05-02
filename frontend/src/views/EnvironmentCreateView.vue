<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEnvironmentStore } from '@/stores/environment'
import type { EnvironmentConfig } from '@/api/environment'
import {
  createEmptyConfig,
  generateRandomConfig,
  GPU_MODELS,
  TIMEZONES,
  LANGUAGES,
  CPU_OPTIONS,
  RAM_OPTIONS,
  WEBRTC_MODES,
} from '@/utils/fingerprint'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  Shuffle,
  Loader2,
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const envStore = useEnvironmentStore()

const isEditing = computed(() => route.name === 'environment-edit')
const editId = computed(() => {
  const id = route.params.id
  return id ? Number(id) : null
})
const pageTitle = computed(() => (isEditing.value ? '编辑浏览器环境' : '新建浏览器环境'))

// 环境配置表单
const config = ref<EnvironmentConfig>(createEmptyConfig())

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
  deviceName: config.value.device_name_mode === '自定义' ? config.value.device_name : '真实',
  macAddress: config.value.mac_mode === '自定义' ? config.value.mac_address : '真实',
  doNotTrack: config.value.do_not_track || '默认',
  portScan: config.value.port_scan_mode || '启用',
  hardwareAcceleration: config.value.hardware_acceleration || '启用',
  startupArgs: config.value.startup_args || '无',
}))

// 噪音字段
const noiseFields = [
  { key: 'canvas', label: 'Canvas' },
  { key: 'webgl_image', label: 'WebGL 图像' },
  { key: 'audiocontext', label: 'AudioContext' },
  { key: 'media_devices', label: 'MediaDevices' },
  { key: 'clientrects', label: 'ClientRects' },
  { key: 'plugin', label: 'Plugin' },
] as const

// 初始化: 编辑模式时加载配置
onMounted(async () => {
  if (isEditing.value && editId.value) {
    const detail = await envStore.fetchDetail(editId.value)
    if (detail) {
      config.value = { ...detail }
    }
  }
})

// 随机生成
function handleRandomFingerprint() {
  config.value = generateRandomConfig()
}

// 提交保存
async function handleSave() {
  let ok: boolean
  if (isEditing.value && editId.value) {
    ok = await envStore.updateEnvironment(editId.value, config.value)
  } else {
    ok = await envStore.createEnvironment(config.value)
  }
  if (ok) {
    router.push({ name: 'environments' })
  }
}

function getNoiseChecked(key: string): boolean {
  return (config.value as any)[key] === 'noise'
}

function setNoiseChecked(key: string, checked: boolean) {
  ;(config.value as any)[key] = checked ? 'noise' : 'real'
}
</script>

<template>
  <div class="relative">
    <!-- 页面标题 -->
    <div class="mb-6 flex items-center gap-4">
      <Button variant="ghost" size="icon" @click="router.push({ name: 'environments' })">
        <ArrowLeft class="h-5 w-5" />
      </Button>
      <h2 class="text-lg font-semibold">{{ pageTitle }}</h2>
      <Button variant="outline" size="sm" @click="handleRandomFingerprint">
        <Shuffle class="mr-2 h-4 w-4" />
        随机指纹生成
      </Button>
    </div>

    <div class="flex gap-6">
      <!-- 左侧: 表单区域 -->
      <div class="flex-1 space-y-6">
        <Tabs default-value="basic">
          <TabsList>
            <TabsTrigger value="basic">基础设置</TabsTrigger>
            <TabsTrigger value="proxy">代理信息</TabsTrigger>
            <TabsTrigger value="fingerprint">指纹配置</TabsTrigger>
          </TabsList>

          <!-- ========== 基础设置 Tab ========== -->
          <TabsContent value="basic" class="space-y-4">
            <div class="space-y-1.5">
              <Label>名称</Label>
              <Input v-model="config.name" placeholder="输入环境名称" />
            </div>

            <div class="space-y-1.5">
              <Label>操作系统</Label>
              <div class="flex gap-2">
                <Button
                  v-for="os in ['Windows11', 'Windows10']"
                  :key="os"
                  :variant="config.os === os ? 'default' : 'outline'"
                  size="sm"
                  @click="config.os = os"
                >
                  {{ os }}
                </Button>
              </div>
            </div>

            <div class="space-y-1.5">
              <Label>User-Agent</Label>
              <Input v-model="config.user_agent" placeholder="自定义 User-Agent" />
            </div>

            <div class="space-y-1.5">
              <Label>分组</Label>
              <Input v-model="config.group" placeholder="未分组" />
            </div>

            <div class="space-y-1.5">
              <Label>备注</Label>
              <Input v-model="config.notes" placeholder="请输入备注" />
            </div>
          </TabsContent>

          <!-- ========== 代理信息 Tab ========== -->
          <TabsContent value="proxy" class="space-y-4">
            <div class="space-y-1.5">
              <Label>代理类型</Label>
              <div class="flex flex-wrap gap-2">
                <Button
                  v-for="pt in [
                    { value: 'no', label: 'No Proxy' },
                    { value: 'http', label: 'HTTP' },
                    { value: 'socks4', label: 'SOCKS4' },
                    { value: 'socks5', label: 'SOCKS5' },
                  ]"
                  :key="pt.value"
                  :variant="config.proxy_type === pt.label || (pt.value === 'no' && config.proxy_type === 'No Proxy') ? 'default' : 'outline'"
                  size="sm"
                  @click="config.proxy_type = pt.value === 'no' ? 'No Proxy' : pt.value.toUpperCase()"
                >
                  {{ pt.label }}
                </Button>
              </div>
            </div>

            <div class="space-y-1.5">
              <Label>Host 和端口</Label>
              <Input v-model="config.proxy_ip_channel" placeholder="例：http://127.0.0.1:10809" />
            </div>

            <div class="space-y-1.5">
              <Label>启动标签页</Label>
              <Input v-model="config.proxy_tabs" placeholder="输入网址（多个网址空格连接）" />
            </div>
          </TabsContent>

          <!-- ========== 指纹配置 Tab ========== -->
          <TabsContent value="fingerprint" class="space-y-6">
            <!-- WebRTC -->
            <div class="space-y-2">
              <Label>WebRTC</Label>
              <div class="flex flex-wrap gap-2">
                <Button
                  v-for="mode in WEBRTC_MODES"
                  :key="mode"
                  :variant="config.webrtc === mode ? 'default' : 'outline'"
                  size="sm"
                  @click="config.webrtc = mode"
                >
                  {{ mode }}
                </Button>
              </div>
            </div>

            <!-- 时区 -->
            <div class="space-y-2">
              <Label>时区</Label>
              <div class="flex gap-2 mb-2">
                <Button
                  v-for="mode in ['真实', '自定义']"
                  :key="mode"
                  :variant="config.timezone_mode === mode ? 'default' : 'outline'"
                  size="sm"
                  @click="config.timezone_mode = mode"
                >
                  {{ mode }}
                </Button>
              </div>
              <Select v-if="config.timezone_mode === '自定义'" v-model="config.timezone">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="选择时区" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="tz in TIMEZONES" :key="tz" :value="tz">
                    {{ tz }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- 语言 -->
            <div class="space-y-2">
              <Label>语言</Label>
              <div class="flex gap-2 mb-2">
                <Button
                  v-for="mode in ['真实', '自定义']"
                  :key="mode"
                  :variant="config.language_mode === mode ? 'default' : 'outline'"
                  size="sm"
                  @click="config.language_mode = mode"
                >
                  {{ mode }}
                </Button>
              </div>
              <Select v-if="config.language_mode === '自定义'" v-model="config.language">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="选择语言" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="lang in LANGUAGES" :key="lang.value" :value="lang.value">
                    {{ lang.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- 分辨率 -->
            <div class="space-y-2">
              <Label>分辨率</Label>
              <div class="flex gap-2">
                <Button
                  v-for="mode in ['随机', '真实']"
                  :key="mode"
                  :variant="config.resolution_mode === mode ? 'default' : 'outline'"
                  size="sm"
                  @click="config.resolution_mode = mode"
                >
                  {{ mode }}
                </Button>
              </div>
            </div>

            <!-- GPU 厂商 -->
            <div class="space-y-1.5">
              <Label>GPU 厂商</Label>
              <Input v-model="config.webgl_vendor" />
            </div>

            <!-- GPU 渲染器 -->
            <div class="space-y-1.5">
              <Label>GPU 渲染器</Label>
              <Select v-model="config.webgl_renderer">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="选择 GPU" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="gpu in GPU_MODELS" :key="gpu" :value="gpu">
                    {{ gpu }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- TLS -->
            <div class="space-y-2">
              <Label>TLS</Label>
              <div class="flex gap-2">
                <Button
                  v-for="mode in ['真实', '随机']"
                  :key="mode"
                  :variant="config.tls === mode ? 'default' : 'outline'"
                  size="sm"
                  @click="config.tls = mode"
                >
                  {{ mode }}
                </Button>
              </div>
            </div>

            <!-- 硬件噪音 -->
            <div class="space-y-2">
              <Label>硬件噪音</Label>
              <div class="space-y-3">
                <div
                  v-for="item in noiseFields"
                  :key="item.key"
                  class="flex items-center justify-between rounded-md border border-border px-4 py-2.5"
                >
                  <span class="text-sm">{{ item.label }}</span>
                  <Switch
                    :checked="getNoiseChecked(item.key)"
                    @update:checked="(val: boolean) => setNoiseChecked(item.key, val)"
                  />
                </div>
              </div>
            </div>

            <!-- CPU -->
            <div class="space-y-2">
              <Label>CPU</Label>
              <div class="flex gap-2 mb-2">
                <Button
                  v-for="mode in ['真实', '自定义']"
                  :key="mode"
                  :variant="config.cpu_mode === mode ? 'default' : 'outline'"
                  size="sm"
                  @click="config.cpu_mode = mode"
                >
                  {{ mode }}
                </Button>
              </div>
              <Select v-if="config.cpu_mode === '自定义'" v-model="config.cpu">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="选择 CPU 核数" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="cpu in CPU_OPTIONS" :key="cpu.value" :value="cpu.value">
                    {{ cpu.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- RAM -->
            <div class="space-y-2">
              <Label>RAM</Label>
              <div class="flex gap-2 mb-2">
                <Button
                  v-for="mode in ['真实', '自定义']"
                  :key="mode"
                  :variant="config.ram_mode === mode ? 'default' : 'outline'"
                  size="sm"
                  @click="config.ram_mode = mode"
                >
                  {{ mode }}
                </Button>
              </div>
              <Select v-if="config.ram_mode === '自定义'" v-model="config.ram">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="选择内存大小" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="ram in RAM_OPTIONS" :key="ram.value" :value="ram.value">
                    {{ ram.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- 设备名称 -->
            <div class="space-y-2">
              <Label>设备名称</Label>
              <div class="flex gap-2 mb-2">
                <Button
                  v-for="mode in ['真实', '自定义']"
                  :key="mode"
                  :variant="config.device_name_mode === mode ? 'default' : 'outline'"
                  size="sm"
                  @click="config.device_name_mode = mode"
                >
                  {{ mode }}
                </Button>
              </div>
              <Input v-if="config.device_name_mode === '自定义'" v-model="config.device_name" placeholder="自定义设备名称" />
            </div>

            <!-- MAC 地址 -->
            <div class="space-y-2">
              <Label>MAC 地址</Label>
              <div class="flex gap-2 mb-2">
                <Button
                  v-for="mode in ['真实', '自定义']"
                  :key="mode"
                  :variant="config.mac_mode === mode ? 'default' : 'outline'"
                  size="sm"
                  @click="config.mac_mode = mode"
                >
                  {{ mode }}
                </Button>
              </div>
              <Input v-if="config.mac_mode === '自定义'" v-model="config.mac_address" placeholder="例：00:1A:2B:3C:4D:5E" />
            </div>

            <!-- Do Not Track -->
            <div class="space-y-2">
              <Label>Do Not Track</Label>
              <div class="flex gap-2">
                <Button
                  v-for="mode in ['默认', '启用', '关闭']"
                  :key="mode"
                  :variant="config.do_not_track === mode ? 'default' : 'outline'"
                  size="sm"
                  @click="config.do_not_track = mode"
                >
                  {{ mode }}
                </Button>
              </div>
            </div>

            <!-- 端口扫描保护 -->
            <div class="space-y-2">
              <Label>端口扫描保护</Label>
              <div class="flex gap-2 mb-2">
                <Button
                  v-for="mode in ['启用', '关闭']"
                  :key="mode"
                  :variant="config.port_scan_mode === mode ? 'default' : 'outline'"
                  size="sm"
                  @click="config.port_scan_mode = mode"
                >
                  {{ mode }}
                </Button>
              </div>
              <Input
                v-if="config.port_scan_mode === '启用'"
                v-model="config.port_scan_ports"
                placeholder="选填，允许被扫描的端口"
              />
            </div>

            <!-- 硬件加速 -->
            <div class="space-y-2">
              <Label>硬件加速</Label>
              <div class="flex gap-2">
                <Button
                  v-for="mode in ['启用', '关闭']"
                  :key="mode"
                  :variant="config.hardware_acceleration === mode ? 'default' : 'outline'"
                  size="sm"
                  @click="config.hardware_acceleration = mode"
                >
                  {{ mode }}
                </Button>
              </div>
            </div>

            <!-- 启动参数 -->
            <div class="space-y-1.5">
              <Label>启动参数</Label>
              <Input v-model="config.startup_args" placeholder="example:" />
            </div>
          </TabsContent>
        </Tabs>

        <!-- 确定按钮 -->
        <div class="pt-4 border-t border-border">
          <Button :disabled="envStore.loading" @click="handleSave">
            <Loader2 v-if="envStore.loading" class="mr-2 h-4 w-4 animate-spin" />
            {{ envStore.loading ? '保存中...' : (isEditing ? '保存修改' : '创建环境') }}
          </Button>
        </div>
      </div>

      <!-- 右侧: 配置总览面板 -->
      <div class="hidden w-72 shrink-0 lg:block">
        <Card class="sticky top-6">
          <CardHeader class="pb-2">
            <CardTitle class="text-sm">环境配置总览</CardTitle>
          </CardHeader>
          <CardContent>
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
                { label: '设备名称', value: overview.deviceName },
                { label: 'MAC 地址', value: overview.macAddress },
                { label: 'Do Not Track', value: overview.doNotTrack },
                { label: '端口扫描保护', value: overview.portScan },
                { label: '硬件加速', value: overview.hardwareAcceleration },
                { label: '启动参数', value: overview.startupArgs },
              ]"
                :key="index"
                class="flex justify-between gap-2"
              >
                <span class="shrink-0 text-muted-foreground">{{ item.label }}:</span>
                <span class="truncate text-right font-medium">{{ item.value }}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
