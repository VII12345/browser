<script setup lang="ts">
import { ref } from 'vue'
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTheme } from '@/composables/useTheme'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Fingerprint,
  LayoutGrid,
  Plus,
  FolderTree,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  Sun,
  Moon,
  Monitor,
} from 'lucide-vue-next'

const authStore = useAuthStore()
const route = useRoute()
const { setTheme } = useTheme()
const sidebarCollapsed = ref(false)

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>

<template>
  <TooltipProvider :delay-duration="0">
    <div class="flex h-screen overflow-hidden bg-background">
      <aside
        :class="[
          'hidden md:flex flex-col border-r border-border bg-sidebar-background transition-all duration-300',
          sidebarCollapsed ? 'w-16' : 'w-56',
        ]"
      >
        <div class="flex h-14 items-center gap-2 border-b border-border px-4">
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Fingerprint class="h-4 w-4" />
          </div>
          <span v-if="!sidebarCollapsed" class="text-sm font-semibold whitespace-nowrap">
            指纹浏览器
          </span>
        </div>

        <nav class="flex-1 space-y-1 p-2">
          <Tooltip v-for="item in [
            { to: { name: 'environments' }, icon: LayoutGrid, label: '我的环境', routeName: 'environments' },
            { to: { name: 'environment-create' }, icon: Plus, label: '新建环境', routeName: 'environment-create' },
            { to: { name: 'groups' }, icon: FolderTree, label: '分组管理', routeName: 'groups' },
          ]" :key="item.routeName">
            <TooltipTrigger as-child>
              <RouterLink
                :to="item.to"
                :class="[
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  route.name === item.routeName
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                ]"
              >
                <component :is="item.icon" class="h-5 w-5 shrink-0" />
                <span v-if="!sidebarCollapsed">{{ item.label }}</span>
              </RouterLink>
            </TooltipTrigger>
            <TooltipContent v-if="sidebarCollapsed" side="right">
              {{ item.label }}
            </TooltipContent>
          </Tooltip>
        </nav>

        <div class="border-t border-border p-2">
          <Button
            variant="ghost"
            size="icon"
            class="w-full"
            @click="toggleSidebar"
          >
            <PanelLeftClose v-if="!sidebarCollapsed" class="h-5 w-5" />
            <PanelLeftOpen v-else class="h-5 w-5" />
          </Button>
        </div>
      </aside>

      <div class="flex flex-1 flex-col overflow-hidden">
        <header class="flex h-14 items-center justify-between border-b border-border px-4 md:px-6">
          <h1 class="text-lg font-semibold">
            {{ route.meta.title || '指纹浏览器管理系统' }}
          </h1>

          <div class="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" size="icon">
                  <Sun class="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon class="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span class="sr-only">切换主题</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem @click="setTheme('light')">
                  <Sun class="mr-2 h-4 w-4" />
                  亮色
                </DropdownMenuItem>
                <DropdownMenuItem @click="setTheme('dark')">
                  <Moon class="mr-2 h-4 w-4" />
                  暗色
                </DropdownMenuItem>
                <DropdownMenuItem @click="setTheme('system')">
                  <Monitor class="mr-2 h-4 w-4" />
                  跟随系统
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" size="sm" class="gap-2">
                  <span class="text-sm text-muted-foreground hidden sm:inline">
                    {{ authStore.userEmail }}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" class="w-48">
                <DropdownMenuLabel class="font-normal">
                  <div class="flex flex-col space-y-1">
                    <p class="text-sm font-medium">{{ authStore.userEmail }}</p>
                    <p class="text-xs text-muted-foreground">已登录</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="authStore.logout()">
                  <LogOut class="mr-2 h-4 w-4" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main class="flex-1 overflow-auto p-4 md:p-6">
          <RouterView />
        </main>
      </div>
    </div>
  </TooltipProvider>
</template>
