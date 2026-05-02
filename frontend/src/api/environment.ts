import { apiClient } from './client'
import type { EnvironmentListItem } from '@/types/environment'

export interface EnvironmentConfig {
  src: string
  name: string
  os: string
  user_agent: string
  group: string
  notes: string
  proxy_mode: string
  proxy_type: string
  proxy_ip_channel: string
  proxy_account_platform: string
  proxy_tabs: string
  webrtc: string
  timezone_mode: string
  timezone: string
  language_mode: string
  language: string
  resolution_mode: string
  resolution: string
  webgl_metadata: string
  webgl_vendor: string
  webgl_renderer: string
  canvas: string
  webgl_image: string
  audiocontext: string
  media_devices: string
  clientrects: string
  plugin: string
  cpu_mode: string
  cpu: string
  ram_mode: string
  ram: string
  device_name_mode: string
  device_name: string
  mac_mode: string
  mac_address: string
  do_not_track: string
  port_scan_mode: string
  port_scan_ports: string
  hardware_acceleration: string
  tls: string
  startup_args: string
}

export interface GroupInfo {
  name: string
  count: number
}

export async function fetchEnvironments(): Promise<EnvironmentListItem[]> {
  const res = await apiClient.get('/environments/')
  return res.data.items
}

export async function fetchEnvironmentDetail(id: number): Promise<EnvironmentConfig> {
  const res = await apiClient.get(`/environments/${id}`)
  return res.data
}

export async function createEnvironment(data: EnvironmentConfig): Promise<{ id: number; src: string }> {
  const res = await apiClient.post('/environments/', data)
  return res.data.data
}

export async function updateEnvironment(id: number, data: Partial<EnvironmentConfig>): Promise<void> {
  await apiClient.put(`/environments/${id}`, data)
}

export async function deleteEnvironment(id: number): Promise<void> {
  await apiClient.delete(`/environments/${id}`)
}

export async function fetchGroups(): Promise<GroupInfo[]> {
  const res = await apiClient.get('/groups/')
  return res.data.groups
}

export async function fetchGroupEnvironments(groupName: string): Promise<EnvironmentListItem[]> {
  const res = await apiClient.get(`/groups/${encodeURIComponent(groupName)}/environments`)
  return res.data.items
}
