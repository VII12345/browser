<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, Loader2, Fingerprint } from 'lucide-vue-next'

const authStore = useAuthStore()

const activeTab = ref('login')

const loginForm = ref({ email: '', password: '' })
const registerForm = ref({ email: '', password: '', confirm: '' })
const resetForm = ref({ email: '', newPassword: '', confirm: '' })

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
  <div class="flex min-h-screen items-center justify-center bg-background p-4">
    <Card class="w-full max-w-sm">
      <CardHeader class="text-center space-y-2">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Fingerprint class="h-6 w-6" />
        </div>
        <h2 class="text-xl font-bold">指纹浏览器管理系统</h2>
      </CardHeader>
      <CardContent>
        <Tabs v-model="activeTab" class="w-full">
          <TabsList class="grid w-full grid-cols-3">
            <TabsTrigger value="login">登录</TabsTrigger>
            <TabsTrigger value="register">注册</TabsTrigger>
            <TabsTrigger value="reset">重置密码</TabsTrigger>
          </TabsList>

          <div
            v-if="localError"
            class="mt-4 flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            <AlertCircle class="h-4 w-4 shrink-0" />
            {{ localError }}
          </div>

          <TabsContent value="login">
            <form class="space-y-4" @submit.prevent="handleLogin">
              <div class="space-y-2">
                <Label for="login-email">邮箱</Label>
                <Input
                  id="login-email"
                  v-model="loginForm.email"
                  type="email"
                  placeholder="请输入邮箱"
                />
              </div>
              <div class="space-y-2">
                <Label for="login-password">密码</Label>
                <Input
                  id="login-password"
                  v-model="loginForm.password"
                  type="password"
                  placeholder="请输入密码"
                />
              </div>
              <Button type="submit" class="w-full" :disabled="authStore.loading">
                <Loader2 v-if="authStore.loading" class="mr-2 h-4 w-4 animate-spin" />
                登录
              </Button>
              <div class="flex justify-between text-xs text-muted-foreground">
                <button type="button" class="hover:text-foreground transition-colors" @click="activeTab = 'register'">注册账号</button>
                <button type="button" class="hover:text-foreground transition-colors" @click="activeTab = 'reset'">忘记密码？</button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form class="space-y-4" @submit.prevent="handleRegister">
              <div class="space-y-2">
                <Label for="register-email">邮箱</Label>
                <Input id="register-email" v-model="registerForm.email" type="email" placeholder="请输入邮箱" />
              </div>
              <div class="space-y-2">
                <Label for="register-password">密码</Label>
                <Input id="register-password" v-model="registerForm.password" type="password" placeholder="请输入密码" />
              </div>
              <div class="space-y-2">
                <Label for="register-confirm">确认密码</Label>
                <Input id="register-confirm" v-model="registerForm.confirm" type="password" placeholder="再次输入密码" />
              </div>
              <Button type="submit" class="w-full" :disabled="authStore.loading">
                <Loader2 v-if="authStore.loading" class="mr-2 h-4 w-4 animate-spin" />
                注册
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="reset">
            <form class="space-y-4" @submit.prevent="handleReset">
              <div class="space-y-2">
                <Label for="reset-email">邮箱</Label>
                <Input id="reset-email" v-model="resetForm.email" type="email" placeholder="请输入邮箱" />
              </div>
              <div class="space-y-2">
                <Label for="reset-new-password">新密码</Label>
                <Input id="reset-new-password" v-model="resetForm.newPassword" type="password" placeholder="请输入新密码" />
              </div>
              <div class="space-y-2">
                <Label for="reset-confirm">确认新密码</Label>
                <Input id="reset-confirm" v-model="resetForm.confirm" type="password" placeholder="再次输入新密码" />
              </div>
              <Button type="submit" class="w-full" :disabled="authStore.loading">
                <Loader2 v-if="authStore.loading" class="mr-2 h-4 w-4 animate-spin" />
                重设密码
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  </div>
</template>
