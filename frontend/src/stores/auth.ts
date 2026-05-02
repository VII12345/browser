import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginRequest, RegisterRequest } from '@/types/auth'
import * as authApi from '@/api/auth'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  // === State ===
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // === Getters ===
  const isLoggedIn = computed(() => !!token.value)
  const userId = computed(() => user.value?.id || '')
  const userEmail = computed(() => user.value?.email || '')

  // === 初始化: 从 localStorage 恢复状态 ===
  function init() {
    const savedToken = localStorage.getItem('access_token')
    const savedUserId = localStorage.getItem('user_id')
    const savedEmail = localStorage.getItem('email')

    if (savedToken && savedUserId) {
      token.value = savedToken
      user.value = { id: savedUserId, email: savedEmail || '' }
    }
  }

  // === Actions ===
  async function login(data: LoginRequest) {
    loading.value = true
    error.value = null

    try {
      const res = await authApi.login(data)
      const { access_token, user: userData } = res.data

      token.value = access_token
      user.value = {
        id: userData?.id || '',
        email: data.email,
      }

      // 持久化
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('user_id', user.value.id)
      localStorage.setItem('email', data.email)

      router.push({ name: 'environments' })
      return true
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || '登录失败'
      error.value = message
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(data: RegisterRequest) {
    loading.value = true
    error.value = null

    try {
      await authApi.register(data)
      return true
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || '注册失败'
      error.value = message
      return false
    } finally {
      loading.value = false
    }
  }

  async function resetPassword(email: string, newPassword: string) {
    loading.value = true
    error.value = null

    try {
      await authApi.resetPassword({ email, new_password: newPassword })
      return true
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || '密码重置失败'
      error.value = message
      return false
    } finally {
      loading.value = false
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_id')
    localStorage.removeItem('email')
    router.push({ name: 'login' })
  }

  return {
    // state
    user,
    token,
    loading,
    error,
    // getters
    isLoggedIn,
    userId,
    userEmail,
    // actions
    init,
    login,
    register,
    resetPassword,
    logout,
  }
})
