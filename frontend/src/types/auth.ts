/** 登录请求 */
export interface LoginRequest {
  email: string
  password: string
}

/** 注册请求 */
export interface RegisterRequest {
  email: string
  password: string
}

/** 重置密码请求 */
export interface ResetPasswordRequest {
  email: string
  new_password: string
}

/** 登录响应 */
export interface LoginResponse {
  access_token: string
  token_type: string
  user: {
    id: string
    email: string
  }
}

/** 用户信息 */
export interface User {
  id: string
  email: string
}
