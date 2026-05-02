<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// 'login' | 'register' | 'reset'
const activeTab = ref<'login' | 'register' | 'reset'>('login')

// 表单数据
const loginForm = ref({ email: '', password: '' })
const registerForm = ref({ email: '', password: '', confirm: '' })
const resetForm = ref({ email: '', newPassword: '', confirm: '' })

// 本地错误提示
const localError = ref('')

async function handleLogin() {
  localError.value = ''
  if (!loginForm.value.email || !loginForm.value.password) {
    localError.value = '请填写完整信息'
    return
  }
  const ok = await authStore.login(loginForm.value)
  if (!ok) {
    localError.value = authStore.error || '登录失败'
  }
}

async function handleRegister() {
  localError.value = ''
  if (!registerForm.value.email || !registerForm.value.password) {
    localError.value = '请填写完整信息'
    return
  }
  if (registerForm.value.password !== registerForm.value.confirm) {
    localError.value = '两次密码不一致'
    return
  }
  const ok = await authStore.register({
    email: registerForm.value.email,
    password: registerForm.value.password,
  })
  if (ok) {
    activeTab.value = 'login'
    localError.value = ''
    loginForm.value.email = registerForm.value.email
  } else {
    localError.value = authStore.error || '注册失败'
  }
}

async function handleReset() {
  localError.value = ''
  if (!resetForm.value.email || !resetForm.value.newPassword || !resetForm.value.confirm) {
    localError.value = '请填写完整信息'
    return
  }
  if (resetForm.value.newPassword !== resetForm.value.confirm) {
    localError.value = '两次密码不一致'
    return
  }
  const ok = await authStore.resetPassword(resetForm.value.email, resetForm.value.newPassword)
  if (ok) {
    activeTab.value = 'login'
    localError.value = ''
  } else {
    localError.value = authStore.error || '密码重置失败'
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background">
    <div class="w-full max-w-sm space-y-6 rounded-lg border border-border bg-card p-8 shadow-sm">
      <!-- Logo -->
      <div class="text-center">
        <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
          BM
        </div>
        <h2 class="text-xl font-bold">指纹浏览器管理系统</h2>
      </div>

      <!-- Tab 切换 -->
      <div class="flex rounded-md border border-border p-1">
        <button
          :class="[
            'flex-1 rounded-sm py-1.5 text-sm font-medium transition-colors',
            activeTab === 'login'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground',
          ]"
          @click="activeTab = 'login'; localError = ''"
        >
          登录
        </button>
        <button
          :class="[
            'flex-1 rounded-sm py-1.5 text-sm font-medium transition-colors',
            activeTab === 'register'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground',
          ]"
          @click="activeTab = 'register'; localError = ''"
        >
          注册
        </button>
        <button
          :class="[
            'flex-1 rounded-sm py-1.5 text-sm font-medium transition-colors',
            activeTab === 'reset'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground',
          ]"
          @click="activeTab = 'reset'; localError = ''"
        >
          重置密码
        </button>
      </div>

      <!-- 错误提示 -->
      <div
        v-if="localError"
        class="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
      >
        {{ localError }}
      </div>

      <!-- 登录表单 -->
      <form v-if="activeTab === 'login'" class="space-y-4" @submit.prevent="handleLogin">
        <div>
          <input
            v-model="loginForm.email"
            type="text"
            placeholder="用户名"
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {{ authStore.loading ? '登录中...' : '登录' }}
        </button>
        <div class="flex justify-between text-xs text-muted-foreground">
          <button type="button" class="hover:text-foreground" @click="activeTab = 'register'">注册账号</button>
          <button type="button" class="hover:text-foreground" @click="activeTab = 'reset'">忘记密码？</button>
        </div>
      </form>

      <!-- 注册表单 -->
      <form v-if="activeTab === 'register'" class="space-y-4" @submit.prevent="handleRegister">
        <div>
          <input
            v-model="registerForm.email"
            type="text"
            placeholder="用户名"
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <input
            v-model="registerForm.password"
            type="password"
            placeholder="密码"
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <input
            v-model="registerForm.confirm"
            type="password"
            placeholder="确认密码"
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {{ authStore.loading ? '注册中...' : '注册' }}
        </button>
      </form>

      <!-- 重置密码表单 -->
      <form v-if="activeTab === 'reset'" class="space-y-4" @submit.prevent="handleReset">
        <div>
          <input
            v-model="resetForm.email"
            type="text"
            placeholder="用户名"
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <input
            v-model="resetForm.newPassword"
            type="password"
            placeholder="新密码"
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <input
            v-model="resetForm.confirm"
            type="password"
            placeholder="确认新密码"
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {{ authStore.loading ? '提交中...' : '重设密码' }}
        </button>
      </form>
    </div>
  </div>
</template>
