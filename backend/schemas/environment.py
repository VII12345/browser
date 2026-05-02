from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class EnvironmentCreate(BaseModel):
    src: str
    name: str = ""
    os: str = "Windows11"
    user_agent: str = ""
    group: str = "未分组"
    notes: str = ""
    proxy_mode: str = ""
    proxy_type: str = "no"
    proxy_ip_channel: str = ""
    proxy_account_platform: str = ""
    proxy_tabs: str = ""
    webrtc: str = "禁用"
    timezone_mode: str = "自定义"
    timezone: str = "Asia/Shanghai"
    language_mode: str = "真实"
    language: str = "zh-CN"
    resolution_mode: str = "真实"
    resolution: str = ""
    webgl_metadata: str = ""
    webgl_vendor: str = "Google Inc."
    webgl_renderer: str = ""
    canvas: str = "real"
    webgl_image: str = "real"
    audiocontext: str = "real"
    media_devices: str = "real"
    clientrects: str = "real"
    plugin: str = "real"
    cpu_mode: str = "真实"
    cpu: str = "real"
    ram_mode: str = "真实"
    ram: str = "real"
    device_name_mode: str = "真实"
    device_name: str = "real"
    mac_mode: str = "真实"
    mac_address: str = "real"
    do_not_track: str = "默认"
    port_scan_mode: str = "启用"
    port_scan_ports: str = ""
    hardware_acceleration: str = ""
    tls: str = "真实"
    startup_args: str = ""

class EnvironmentUpdate(BaseModel):
    name: Optional[str] = None
    os: Optional[str] = None
    user_agent: Optional[str] = None
    group: Optional[str] = None
    notes: Optional[str] = None
    proxy_mode: Optional[str] = None
    proxy_type: Optional[str] = None
    proxy_ip_channel: Optional[str] = None
    proxy_account_platform: Optional[str] = None
    proxy_tabs: Optional[str] = None
    webrtc: Optional[str] = None
    timezone_mode: Optional[str] = None
    timezone: Optional[str] = None
    language_mode: Optional[str] = None
    language: Optional[str] = None
    resolution_mode: Optional[str] = None
    resolution: Optional[str] = None
    webgl_metadata: Optional[str] = None
    webgl_vendor: Optional[str] = None
    webgl_renderer: Optional[str] = None
    canvas: Optional[str] = None
    webgl_image: Optional[str] = None
    audiocontext: Optional[str] = None
    media_devices: Optional[str] = None
    clientrects: Optional[str] = None
    plugin: Optional[str] = None
    cpu_mode: Optional[str] = None
    cpu: Optional[str] = None
    ram_mode: Optional[str] = None
    ram: Optional[str] = None
    device_name_mode: Optional[str] = None
    device_name: Optional[str] = None
    mac_mode: Optional[str] = None
    mac_address: Optional[str] = None
    do_not_track: Optional[str] = None
    port_scan_mode: Optional[str] = None
    port_scan_ports: Optional[str] = None
    hardware_acceleration: Optional[str] = None
    tls: Optional[str] = None
    startup_args: Optional[str] = None

class EnvironmentListItem(BaseModel):
    id: int
    src: str
    name: str
    os: str
    user_agent: str
    group: str
    notes: str
    proxy_type: str
    proxy_ip_channel: str
    
    class Config:
        from_attributes = True

class GroupInfo(BaseModel):
    name: str
    count: int
