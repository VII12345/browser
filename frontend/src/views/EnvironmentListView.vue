<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useEnvironmentStore } from '@/stores/environment'
import type { EnvironmentListItem } from '@/types/environment'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Plus,
  Search,
  Trash2,
  Pencil,
  Play,
  Loader2,
  RefreshCw,
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const store = useEnvironmentStore()

const searchQuery = ref((route.query.group as string) || '')
const selectedIds = ref<number[]>([])
const deleteDialogOpen = ref(false)
const deleteTarget = ref<number | null>(null)
const isBatchDelete = ref(false)

const filteredEnvironments = computed(() => {
  if (!searchQuery.value) return store.environments
  const query = searchQuery.value.toLowerCase()
  return store.environments.filter(
    (e) =>
      e.name.toLowerCase().includes(query) ||
      e.group.toLowerCase().includes(query) ||
      e.notes.toLowerCase().includes(query)
  )
})

const isAllSelected = computed(() => {
  return filteredEnvironments.value.length > 0 && 
    filteredEnvironments.value.every(e => selectedIds.value.includes(e.id))
})

function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = filteredEnvironments.value.map(e => e.id)
  }
}

function toggleSelect(id: number) {
  const idx = selectedIds.value.indexOf(id)
  if (idx === -1) {
    selectedIds.value.push(id)
  } else {
    selectedIds.value.splice(idx, 1)
  }
}

function openDeleteDialog(id: number) {
  deleteTarget.value = id
  isBatchDelete.value = false
  deleteDialogOpen.value = true
}

function openBatchDeleteDialog() {
  isBatchDelete.value = true
  deleteDialogOpen.value = true
}

async function confirmDelete() {
  if (isBatchDelete.value) {
    await store.batchDelete(selectedIds.value)
    selectedIds.value = []
  } else if (deleteTarget.value !== null) {
    await store.deleteEnvironment(deleteTarget.value)
  }
  deleteDialogOpen.value = false
  deleteTarget.value = null
}

function handleEdit(env: EnvironmentListItem) {
  router.push({ name: 'environment-edit', params: { id: env.id } })
}

function handleCreate() {
  router.push({ name: 'environment-create' })
}

onMounted(() => {
  store.fetchEnvironments()
  store.fetchGroups()
})
</script>

<template>
  <div class="space-y-4">
    <!-- 顶部操作栏 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="relative">
          <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            v-model="searchQuery"
            placeholder="搜索环境..."
            class="pl-9 w-64"
          />
        </div>
        <Button variant="outline" size="icon" @click="store.fetchEnvironments()">
          <RefreshCw class="h-4 w-4" />
        </Button>
      </div>
      <div class="flex items-center gap-2">
        <Button
          v-if="selectedIds.length > 0"
          variant="destructive"
          size="sm"
          @click="openBatchDeleteDialog"
        >
          <Trash2 class="mr-2 h-4 w-4" />
          删除选中 ({{ selectedIds.length }})
        </Button>
        <Button @click="handleCreate">
          <Plus class="mr-2 h-4 w-4" />
          新建环境
        </Button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="store.loading" class="flex items-center justify-center py-12">
      <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
    </div>

    <!-- 空状态 -->
    <div
      v-else-if="filteredEnvironments.length === 0"
      class="flex flex-col items-center justify-center py-12 text-muted-foreground"
    >
      <p class="text-lg font-medium">暂无环境</p>
      <p class="text-sm">点击"新建环境"创建第一个浏览器环境</p>
    </div>

    <!-- 环境列表 -->
    <template v-else>
      <!-- 全选 -->
      <div class="flex items-center gap-2 px-1">
        <Checkbox
          :checked="isAllSelected"
          @update:checked="toggleSelectAll"
        />
        <span class="text-sm text-muted-foreground">全选</span>
      </div>

      <!-- 卡片网格 -->
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="env in filteredEnvironments"
          :key="env.id"
          class="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/50"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-2">
              <Checkbox
                :checked="selectedIds.includes(env.id)"
                @update:checked="toggleSelect(env.id)"
              />
              <div>
                <h3 class="font-medium">{{ env.name || '未命名环境' }}</h3>
                <p class="text-xs text-muted-foreground">{{ env.src }}</p>
              </div>
            </div>
            <Badge variant="secondary">{{ env.os }}</Badge>
          </div>

          <div class="mt-3 space-y-1 text-sm text-muted-foreground">
            <p v-if="env.group">分组: {{ env.group }}</p>
            <p v-if="env.notes">备注: {{ env.notes }}</p>
            <p v-if="env.proxy_type !== 'no'">代理: {{ env.proxy_ip_channel }}</p>
          </div>

          <div class="mt-4 flex items-center gap-2">
            <Button variant="outline" size="sm" class="flex-1" @click="handleEdit(env)">
              <Pencil class="mr-1 h-3 w-3" />
              编辑
            </Button>
            <Button variant="outline" size="sm" class="flex-1">
              <Play class="mr-1 h-3 w-3" />
              启动
            </Button>
            <Button
              variant="ghost"
              size="icon"
              class="h-8 w-8 text-destructive hover:text-destructive"
              @click="openDeleteDialog(env.id)"
            >
              <Trash2 class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </template>

    <!-- 删除确认对话框 -->
    <Dialog v-model:open="deleteDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认删除</DialogTitle>
          <DialogDescription>
            {{ isBatchDelete 
              ? `确定要删除选中的 ${selectedIds.length} 个环境吗？此操作不可撤销。`
              : '确定要删除这个环境吗？此操作不可撤销。'
            }}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="deleteDialogOpen = false">取消</Button>
          <Button variant="destructive" @click="confirmDelete">删除</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
