from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from database import Base

class Environment(Base):
    __tablename__ = "environments"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    src = Column(String(255), unique=True, nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    
    # Basic fields
    name = Column(String(255), default="")
    os = Column(String(50), default="Windows11")
    user_agent = Column(String(1024), default="")
    group_name = Column(String(255), default="未分组")
    notes = Column(String(1024), default="")
    
    # Proxy fields
    proxy_mode = Column(String(50), default="")
    proxy_type = Column(String(50), default="no")
    proxy_ip_channel = Column(String(255), default="")
    proxy_account_platform = Column(String(255), default="")
    proxy_tabs = Column(String(255), default="")
    
    # Fingerprint fields
    webrtc = Column(String(50), default="禁用")
    timezone_mode = Column(String(50), default="自定义")
    timezone = Column(String(100), default="Asia/Shanghai")
    language_mode = Column(String(50), default="真实")
    language = Column(String(50), default="zh-CN")
    resolution_mode = Column(String(50), default="真实")
    resolution = Column(String(50), default="")
    webgl_metadata = Column(String(255), default="")
    webgl_vendor = Column(String(255), default="Google Inc.")
    webgl_renderer = Column(String(255), default="")
    
    # Noise fields
    canvas = Column(String(50), default="real")
    webgl_image = Column(String(50), default="real")
    audiocontext = Column(String(50), default="real")
    media_devices = Column(String(50), default="real")
    clientrects = Column(String(50), default="real")
    plugin = Column(String(50), default="real")
    
    # Hardware fields
    cpu_mode = Column(String(50), default="真实")
    cpu = Column(String(50), default="real")
    ram_mode = Column(String(50), default="真实")
    ram = Column(String(50), default="real")
    device_name_mode = Column(String(50), default="真实")
    device_name = Column(String(255), default="real")
    mac_mode = Column(String(50), default="真实")
    mac_address = Column(String(50), default="real")
    
    # Privacy fields
    do_not_track = Column(String(50), default="默认")
    port_scan_mode = Column(String(50), default="启用")
    port_scan_ports = Column(String(255), default="")
    hardware_acceleration = Column(String(50), default="")
    tls = Column(String(50), default="真实")
    startup_args = Column(String(1024), default="")
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
