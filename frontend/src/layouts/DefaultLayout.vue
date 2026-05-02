<script setup lang="ts">
import { ref } from 'vue'
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const route = useRoute()
const sidebarCollapsed = ref(false)

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-background">
    <!-- 侧边栏 -->
    <aside
      :class="[
        'flex flex-col border-r border-border bg-sidebar-background transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-56',
      ]"
    >
      <!-- Logo -->
      <div class="flex h-14 items-center gap-2 border-b border-border px-4">
        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
          BM
        </div>
        <span v-if="!sidebarCollapsed" class="text-sm font-semibold whitespace-nowrap">
          指纹浏览器
        </span>
      </div>

      <!-- 导航菜单 -->
      <nav class="flex-1 space-y-1 p-2">
        <RouterLink
          :to="{ name: 'environments' }"
          :class="[
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            route.name === 'environments'
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
          ]"
        >
          <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span v-if="!sidebarCollapsed">我的环境</span>
        </RouterLink>

        <RouterLink
          :to="{ name: 'environment-create' }"
          :class="[
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            route.name === 'environment-create'
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
          ]"
        >
          <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span v-if="!sidebarCollapsed">新建环境</span>
        </RouterLink>

        <RouterLink
          :to="{ name: 'groups' }"
          :class="[
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            route.name === 'groups'
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
          ]"
        >
          <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <span v-if="!sidebarCollapsed">分组管理</span>
        </RouterLink>
      </nav>

      <!-- 底部: 折叠按钮 -->
      <div class="border-t border-border p-2">
        <button
          class="flex w-full items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          @click="toggleSidebar"
        >
          <svg
            class="h-5 w-5 shrink-0 transition-transform"
            :class="{ 'rotate-180': sidebarCollapsed }"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </aside>

    <!-- 主内容区 -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <!-- 顶部栏 -->
      <header class="flex h-14 items-center justify-between border-b border-border px-6">
        <h1 class="text-lg font-semibold">
          {{ route.meta.title || '指纹浏览器管理系统' }}
        </h1>

        <div class="flex items-center gap-4">
          <span class="text-sm text-muted-foreground">
            {{ authStore.userEmail }}
          </span>
          <button
            class="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
            @click="authStore.logout()"
          >
            退出登录
          </button>
        </div>
      </header>

      <!-- 页面内容 -->
      <main class="flex-1 overflow-auto p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
