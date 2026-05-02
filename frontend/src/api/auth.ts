import { apiClient } from './client'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ResetPasswordRequest,
} from '@/types/auth'
import type { ApiResponse } from '@/types/api'

/** 用户登录 */
export function login(data: LoginRequest) {
  return apiClient.post<LoginResponse>('/auth/login', data)
}

/** 用户注册 */
export function register(data: RegisterRequest) {
  return apiClient.post<ApiResponse>('/auth/register', data)
}

/** 重置密码 */
export function resetPassword(data: ResetPasswordRequest) {
  return apiClient.post<ApiResponse>('/auth/reset-password', data)
}
