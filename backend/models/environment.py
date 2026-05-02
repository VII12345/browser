from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from database import Base

class Environment(Base):
    __tablename__ = "environments"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    src = Column(String, unique=True, nullable=False, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    
    # Basic fields
    name = Column(String, default="")
    os = Column(String, default="Windows11")
    user_agent = Column(String, default="")
    group_name = Column(String, default="未分组")
    notes = Column(String, default="")
    
    # Proxy fields
    proxy_mode = Column(String, default="")
    proxy_type = Column(String, default="no")
    proxy_ip_channel = Column(String, default="")
    proxy_account_platform = Column(String, default="")
    proxy_tabs = Column(String, default="")
    
    # Fingerprint fields
    webrtc = Column(String, default="禁用")
    timezone_mode = Column(String, default="自定义")
    timezone = Column(String, default="Asia/Shanghai")
    language_mode = Column(String, default="真实")
    language = Column(String, default="zh-CN")
    resolution_mode = Column(String, default="真实")
    resolution = Column(String, default="")
    webgl_metadata = Column(String, default="")
    webgl_vendor = Column(String, default="Google Inc.")
    webgl_renderer = Column(String, default="")
    
    # Noise fields
    canvas = Column(String, default="real")
    webgl_image = Column(String, default="real")
    audiocontext = Column(String, default="real")
    media_devices = Column(String, default="real")
    clientrects = Column(String, default="real")
    plugin = Column(String, default="real")
    
    # Hardware fields
    cpu_mode = Column(String, default="真实")
    cpu = Column(String, default="real")
    ram_mode = Column(String, default="真实")
    ram = Column(String, default="real")
    device_name_mode = Column(String, default="真实")
    device_name = Column(String, default="real")
    mac_mode = Column(String, default="真实")
    mac_address = Column(String, default="real")
    
    # Privacy fields
    do_not_track = Column(String, default="默认")
    port_scan_mode = Column(String, default="启用")
    port_scan_ports = Column(String, default="")
    hardware_acceleration = Column(String, default="")
    tls = Column(String, default="真实")
    startup_args = Column(String, default="")
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
