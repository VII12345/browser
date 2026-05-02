import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { EnvironmentListItem } from '@/types/environment'
import type { EnvironmentConfig, GroupInfo } from '@/api/environment'
import * as envApi from '@/api/environment'

export const useEnvironmentStore = defineStore('environment', () => {
  const environments = ref<EnvironmentListItem[]>([])
  const groups = ref<GroupInfo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchEnvironments() {
    loading.value = true
    error.value = null
    try {
      environments.value = await envApi.fetchEnvironments()
    } catch (e: any) {
      error.value = e.message || '获取环境列表失败'
    } finally {
      loading.value = false
    }
  }

  async function fetchGroups() {
    try {
      groups.value = await envApi.fetchGroups()
    } catch (e: any) {
      console.error('获取分组失败:', e)
    }
  }

  async function fetchDetail(id: number): Promise<EnvironmentConfig | null> {
    try {
      return await envApi.fetchEnvironmentDetail(id)
    } catch (e: any) {
      error.value = e.message || '获取环境详情失败'
      return null
    }
  }

  async function createEnvironment(data: EnvironmentConfig): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      await envApi.createEnvironment(data)
      await fetchEnvironments()
      return true
    } catch (e: any) {
      error.value = e.message || '创建环境失败'
      return false
    } finally {
      loading.value = false
    }
  }

  async function updateEnvironment(id: number, data: Partial<EnvironmentConfig>): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      await envApi.updateEnvironment(id, data)
      await fetchEnvironments()
      return true
    } catch (e: any) {
      error.value = e.message || '更新环境失败'
      return false
    } finally {
      loading.value = false
    }
  }

  async function deleteEnvironment(id: number): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      await envApi.deleteEnvironment(id)
      await fetchEnvironments()
      return true
    } catch (e: any) {
      error.value = e.message || '删除环境失败'
      return false
    } finally {
      loading.value = false
    }
  }

  async function batchDelete(ids: number[]): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      await Promise.all(ids.map(id => envApi.deleteEnvironment(id)))
      await fetchEnvironments()
      return true
    } catch (e: any) {
      error.value = e.message || '批量删除失败'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    environments,
    groups,
    loading,
    error,
    fetchEnvironments,
    fetchGroups,
    fetchDetail,
    createEnvironment,
    updateEnvironment,
    deleteEnvironment,
    batchDelete,
  }
})
