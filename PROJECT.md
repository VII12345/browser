# 指纹浏览器管理系统 (Browser Manager)

## 项目简介

这是一个专为自研指纹浏览器设计的环境管理系统，用于创建、管理和启动具有不同指纹配置的浏览器环境。每个环境可以独立配置操作系统、User-Agent、WebRTC、时区、语言、分辨率、GPU、硬件噪音等参数，实现浏览器指纹的隔离和伪装。

## 技术栈

### 前端
- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **UI 组件库**: shadcn-vue
- **样式**: TailwindCSS v4
- **状态管理**: Pinia
- **路由**: Vue Router

### 后端
- **框架**: FastAPI (Python)
- **数据库**: SQLite + SQLAlchemy ORM
- **认证**: JWT (JSON Web Token)
- **文件存储**: 本地文件系统

### 桌面端 (暂不处理)
- **框架**: Electron (electron-forge)
- **预构建**: 保留现有 Electron 配置

## 目录结构

```
browser/
├── PROJECT.md          # 项目文档
├── REPORT.md           # 工作汇报
├── backend/            # 后端代码
│   ├── app/
│   │   ├── api/        # API 路由
│   │   ├── models/     # 数据库模型
│   │   ├── services/   # 业务逻辑
│   │   └── config.py   # 配置
│   ├── requirements.txt
│   └── .env
├── frontend/           # 前端代码
│   ├── src/
│   │   ├── components/ # Vue 组件
│   │   ├── views/      # 页面视图
│   │   ├── stores/     # Pinia 状态
│   │   ├── router/     # 路由配置
│   │   ├── types/      # TypeScript 类型
│   │   └── composables/# 组合函数
│   ├── package.json
│   └── vite.config.ts
└── public/             # 静态资源
```

## 核心功能

### 1. 用户认证
- 用户注册
- 用户登录
- 密码重置
- JWT Token 认证

### 2. 浏览器环境管理
- 创建新环境
- 编辑环境配置
- 删除环境（本地 + 远程）
- 环境列表展示（卡片布局）
- 批量选择和启动

### 3. 分组管理
- 按分组筛选环境
- 分组内批量操作

### 4. 指纹配置
- **基础设置**: 环境名称、操作系统、User-Agent、分组、备注
- **代理配置**: HTTP/SOCKS4/SOCKS5/直连、Host:Port、启动标签页
- **指纹特征**:
  - WebRTC 模式（转发/替换/真实/禁用）
  - 时区（真实/自定义）
  - 语言（真实/自定义）
  - 分辨率（随机/真实）
  - GPU 厂商和渲染器
  - TLS 指纹
  - 硬件噪音开关（Canvas/WebGL/AudioContext/ClientRects/Plugin）
  - CPU/RAM 伪装
  - Do Not Track
  - 端口扫描保护
  - 自定义启动参数

### 5. 其他功能
- 一键随机指纹生成
- 远程调试模式（自定义调试端口）
- 配置同步（从服务器下载）
- 配置总览面板（实时预览）

## API 接口

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/reset-password` - 重置密码

### 环境管理
- `GET /api/environments` - 获取环境列表
- `POST /api/environments` - 创建环境
- `GET /api/environments/{id}` - 获取环境详情
- `PUT /api/environments/{id}` - 更新环境
- `DELETE /api/environments/{id}` - 删除环境

### 分组管理
- `GET /api/groups` - 获取分组列表
- `GET /api/groups/{name}/environments` - 获取分组下的环境

### 文件同步
- `POST /api/sync/upload` - 上传配置文件
- `GET /api/sync/download/{user_id}` - 下载用户配置
- `POST /api/sync/delete` - 删除远程文件

## 运行指南

### 后端
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或 venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 前端
```bash
cd frontend
npm install
npm run dev
```

## 部署说明

### 开发环境
- 后端: `http://localhost:8000`
- 前端: `http://localhost:5173`
- Vite 开发服务器已配置代理到后端

### 生产环境
1. 构建前端: `npm run build`
2. 部署后端到服务器
3. 配置 Nginx 反向代理
4. 配置 HTTPS (可选)

## 注意事项

1. 所有配置文件存储在 `userData/configs/` 目录下
2. 每个环境有两个 JSON 文件：`config_{src}.json` 和 `fingerprint_{src}.json`
3. 环境启动命令需要根据实际 Chromium 路径调整
4. 远程调试模式会开启指定端口的调试接口
