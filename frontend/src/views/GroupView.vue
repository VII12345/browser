<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEnvironmentStore } from '@/stores/environment'
import type { EnvironmentListItem } from '@/types/environment'

const router = useRouter()
const envStore = useEnvironmentStore()

const activeGroup = ref<string | null>(null)
const groupEnvironments = ref<EnvironmentListItem[]>([])

onMounted(() => {
  envStore.fetchEnvironments()
})

function selectGroup(groupName: string) {
  activeGroup.value = groupName
  groupEnvironments.value = envStore.getEnvironmentsByGroup(groupName)
}

function editEnvironment(env: EnvironmentListItem) {
  router.push({ name: 'environment-edit', params: { id: env.src } })
}

async function deleteEnvironment(env: EnvironmentListItem) {
  if (!confirm(`确定要删除环境 "${env.name}" 吗？`)) return
  const config = envStore.configCache.get(`config_${env.src}.json`)
  if (config) {
    await envStore.deleteEnvironment(config, `config_${env.src}.json`)
    // 刷新分组列表
    if (activeGroup.value) {
      groupEnvironments.value = envStore.getEnvironmentsByGroup(activeGroup.value)
    }
  }
}

function launchGroup() {
  // TODO: 批量启动 (需要 Electron 集成)
  alert('批量启动功能需要配合 Electron 使用')
}
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-lg font-semibold">分组管理</h2>

    <!-- 分组列表 -->
    <div v-if="envStore.groups.length === 0" class="py-8 text-center text-muted-foreground">
      暂无分组数据
    </div>

    <div v-else class="flex flex-wrap gap-2">
      <button
        v-for="group in envStore.groups"
        :key="group.name"
        :class="[
          'rounded-md border px-4 py-2 text-sm font-medium transition-colors',
          activeGroup === group.name
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border hover:bg-accent',
        ]"
        @click="selectGroup(group.name)"
      >
        {{ group.name }} ({{ group.count }})
      </button>
    </div>

    <!-- 分组内的环境列表 -->
    <div v-if="activeGroup" class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold">{{ activeGroup }} 的环境</h3>
        <button
          class="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          @click="launchGroup"
        >
          启动该分组所有环境
        </button>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="env in groupEnvironments"
          :key="env.src"
          class="rounded-lg border border-border bg-card p-4 shadow-sm"
        >
          <h4 class="mb-2 text-sm font-semibold">{{ env.name }}</h4>
          <div class="mb-3 space-y-1 text-xs text-muted-foreground">
            <p>UA: <span class="text-foreground">{{ env.user_agent || '默认' }}</span></p>
            <p>系统: <span class="text-foreground">{{ env.os }}</span></p>
            <p>备注: <span class="text-foreground">{{ env.notes || '无' }}</span></p>
          </div>
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
  </div>
</template>
