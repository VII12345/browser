<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEnvironmentStore } from '@/stores/environment'
import type { EnvironmentListItem } from '@/types/environment'

const router = useRouter()
const envStore = useEnvironmentStore()

// 选中的环境
const selectedEnvs = ref<Set<string>>(new Set())
// 当前查看的分组 (null = 所有)
const activeGroup = ref<string | null>(null)

// 过滤后的环境列表
const filteredEnvironments = computed(() => {
  if (!activeGroup.value) return envStore.environments
  return envStore.getEnvironmentsByGroup(activeGroup.value)
})

// 全选状态
const isAllSelected = computed(() => {
  if (filteredEnvironments.value.length === 0) return false
  return filteredEnvironments.value.every((env) => selectedEnvs.value.has(env.src))
})

onMounted(() => {
  envStore.fetchEnvironments()
})

function toggleSelect(src: string) {
  if (selectedEnvs.value.has(src)) {
    selectedEnvs.value.delete(src)
  } else {
    selectedEnvs.value.add(src)
  }
}

function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedEnvs.value.clear()
  } else {
    for (const env of filteredEnvironments.value) {
      selectedEnvs.value.add(env.src)
    }
  }
}

function editEnvironment(env: EnvironmentListItem) {
  router.push({ name: 'environment-edit', params: { id: env.src } })
}

async function deleteEnvironment(env: EnvironmentListItem) {
  if (!confirm(`确定要删除环境 "${env.name}" 吗？`)) return

  // 从缓存中获取完整配置
  const config = envStore.configCache.get(`config_${env.src}.json`)
  if (config) {
    await envStore.deleteEnvironment(config, `config_${env.src}.json`)
  }
}

function handleSync() {
  envStore.syncEnvironments()
}
</script>

<template>
  <div class="space-y-6">
    <!-- 顶部操作栏 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <h2 class="text-lg font-semibold">我的浏览器环境</h2>
        <button
          :disabled="envStore.syncing"
          class="rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-accent disabled:opacity-50 transition-colors"
          @click="handleSync"
        >
          {{ envStore.syncing ? '同步中...' : '同步' }}
        </button>
      </div>

      <div class="flex items-center gap-3">
        <label class="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            :checked="isAllSelected"
            class="rounded border-input"
            @change="toggleSelectAll"
          />
          全选
        </label>
        <button
          :disabled="selectedEnvs.size === 0"
          class="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          启动勾选环境 ({{ selectedEnvs.size }})
        </button>
      </div>
    </div>

    <!-- Loading 状态 -->
    <div v-if="envStore.loading && envStore.environments.length === 0" class="py-12 text-center text-muted-foreground">
      加载中...
    </div>

    <!-- 空状态 -->
    <div
      v-else-if="envStore.environments.length === 0 && !envStore.loading"
      class="py-12 text-center"
    >
      <p class="text-muted-foreground mb-4">暂无浏览器环境</p>
      <button
        class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        @click="router.push({ name: 'environment-create' })"
      >
        新建环境
      </button>
    </div>

    <!-- 分组标签 -->
    <div v-if="envStore.groups.length > 0" class="flex flex-wrap gap-2">
      <button
        :class="[
          'rounded-full px-3 py-1 text-xs font-medium transition-colors',
          activeGroup === null
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ]"
        @click="activeGroup = null"
      >
        全部 ({{ envStore.environments.length }})
      </button>
      <button
        v-for="group in envStore.groups"
        :key="group.name"
        :class="[
          'rounded-full px-3 py-1 text-xs font-medium transition-colors',
          activeGroup === group.name
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ]"
        @click="activeGroup = group.name"
      >
        {{ group.name }} ({{ group.count }})
      </button>
    </div>

    <!-- 环境卡片列表 -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="env in filteredEnvironments"
        :key="env.src"
        class="rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
      >
        <!-- 卡片头部: 复选框 + 名称 -->
        <div class="mb-3 flex items-center gap-3">
          <input
            type="checkbox"
            :checked="selectedEnvs.has(env.src)"
            class="rounded border-input"
            @change="toggleSelect(env.src)"
          />
          <h3 class="text-sm font-semibold truncate">{{ env.name }}</h3>
        </div>

        <!-- 详情 -->
        <div class="mb-4 space-y-1 text-xs text-muted-foreground">
          <p>UA: <span class="text-foreground">{{ env.user_agent || '默认' }}</span></p>
          <p>系统: <span class="text-foreground">{{ env.os }}</span></p>
          <p>备注: <span class="text-foreground">{{ env.notes || '无' }}</span></p>
          <p>代理: <span class="text-foreground">{{ env.proxy_ip_channel || '未设置' }}</span></p>
        </div>

        <!-- 操作按钮 -->
        <div class="flex gap-2">
          <button class="flex-1 rounded-md bg-primary px-2 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            启动
          </button>
          <button
            class="flex-1 rounded-md border border-border px-2 py-1.5 text-xs font-medium hover:bg-accent transition-colors"
            @click="editEnvironment(env)"
          >
            编辑
          </button>
          <button
            class="rounded-md border border-destructive/30 px-2 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
            @click="deleteEnvironment(env)"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
