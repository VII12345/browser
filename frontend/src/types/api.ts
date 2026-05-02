/** 通用 API 响应结构 */
export interface ApiResponse<T = unknown> {
  status: 'success' | 'error'
  message?: string
  data?: T
}

/** 分页响应 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}
