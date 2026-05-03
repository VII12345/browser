<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEnvironmentStore } from '@/stores/environment'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FolderTree, Layers } from 'lucide-vue-next'

const router = useRouter()
const store = useEnvironmentStore()

function viewGroup(groupName: string) {
  router.push({ name: 'environments', query: { group: groupName } })
}

onMounted(() => {
  store.fetchGroups()
})
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-2xl font-bold">分组管理</h2>

    <div v-if="store.groups.length === 0" class="text-center py-12 text-muted-foreground">
      <FolderTree class="mx-auto h-12 w-12 mb-4 opacity-50" />
      <p>暂无分组</p>
    </div>

    <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card v-for="group in store.groups" :key="group.name">
        <CardHeader class="pb-2">
          <CardTitle class="flex items-center gap-2 text-lg">
            <FolderTree class="h-5 w-5" />
            {{ group.name }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex items-center justify-between">
            <span class="text-sm text-muted-foreground">
              <Layers class="inline mr-1 h-4 w-4" />
              {{ group.count }} 个环境
            </span>
            <Button variant="outline" size="sm" @click="viewGroup(group.name)">查看</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
