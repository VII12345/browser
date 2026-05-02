import { apiClient } from './client'
import type {
  DeleteRemoteFilesRequest,
  SyncResponse,
} from '@/types/environment'
import type { ApiResponse } from '@/types/api'

/** 获取用户的环境列表 */
export function getEnvironments(userId: string) {
  return apiClient.get<{ instances: { files: { file_name: string; url: string }[] }[] }>(
    `/upload/instances/${userId}`,
  )
}

/** 上传环境配置 (config + fingerprint 双文件上传) */
export function uploadEnvironment(formData: FormData) {
  return apiClient.post<ApiResponse>('/upload/upload/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

/** 删除远程环境文件 */
export function deleteRemoteFiles(data: DeleteRemoteFilesRequest) {
  return apiClient.post<ApiResponse>('/upload/delete_files_by_folder', data)
}

/** 同步下载用户所有配置 */
export function syncDownload(userId: string) {
  return apiClient.get<SyncResponse>(`/upload/instances/${userId}`)
}
