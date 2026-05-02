# 指纹浏览器管理系统 - 前端

## 技术栈

- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **UI 组件库**: shadcn-vue
- **样式**: TailwindCSS v4
- **状态管理**: Pinia
- **路由**: Vue Router
- **HTTP 客户端**: Axios

## 开始

### 安装依赖

```bash
cd frontend
pnpm install
```

### 初始化 shadcn-vue 组件

```bash
# 添加常用组件
pnpm dlx shadcn-vue@latest add button
pnpm dlx shadcn-vue@latest add input
pnpm dlx shadcn-vue@latest add select
pnpm dlx shadcn-vue@latest add dialog
pnpm dlx shadcn-vue@latest add card
pnpm dlx shadcn-vue@latest add tabs
pnpm dlx shadcn-vue@latest add switch
pnpm dlx shadcn-vue@latest add label
pnpm dlx shadcn-vue@latest add checkbox
pnpm dlx shadcn-vue@latest add badge
pnpm dlx shadcn-vue@latest add tooltip
pnpm dlx shadcn-vue@latest add dropdown-menu
pnpm dlx shadcn-vue@latest add sheet
pnpm dlx shadcn-vue@latest add toast
```

### 启动开发服务器

```bash
pnpm dev
```

开发服务器启动后访问 http://localhost:5173

### 构建

```bash
pnpm build
```

## 目录结构

```
frontend/
├── components.json          # shadcn-vue 配置
├── index.html               # 入口 HTML
├── package.json
├── tsconfig.json            # TypeScript 配置
├── tsconfig.app.json        # 应用 TS 配置
├── tsconfig.node.json       # Node TS 配置
├── vite.config.ts           # Vite 配置
├── .env                     # 环境变量
├── .env.development         # 开发环境变量
├── .env.production          # 生产环境变量
├── public/                  # 静态资源
│   └── favicon.svg
└── src/
    ├── api/                 # API 请求层
    │   ├── client.ts        # Axios 实例 & 拦截器
    │   ├── auth.ts          # 认证 API
    │   └── environment.ts   # 环境管理 API
    ├── assets/              # 静态资源
    ├── components/          # 公共组件
    │   └── ui/              # shadcn-vue 组件 (CLI 自动生成)
    ├── composables/         # 组合函数
    ├── layouts/             # 布局组件
    │   └── DefaultLayout.vue
    ├── lib/                 # 工具库
    │   └── utils.ts         # shadcn-vue 工具函数
    ├── router/              # 路由配置
    │   └── routes.ts        # 路由定义
    ├── stores/              # Pinia 状态管理
    │   ├── auth.ts          # 认证状态
    │   └── environment.ts   # 环境管理状态
    ├── types/               # TypeScript 类型定义
    │   ├── api.ts           # 通用 API 类型
    │   ├── auth.ts          # 认证相关类型
    │   └── environment.ts   # 环境相关类型
    ├── utils/               # 工具函数
    │   └── fingerprint.ts   # 指纹相关常量和工具
    ├── views/               # 页面视图
    │   ├── LoginView.vue    # 登录/注册
    │   ├── EnvironmentListView.vue   # 环境列表
    │   ├── EnvironmentCreateView.vue # 新建/编辑环境
    │   └── GroupView.vue    # 分组管理
    ├── App.vue              # 根组件
    ├── main.ts              # 应用入口
    └── style.css            # 全局样式 (TailwindCSS v4)
```

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `VITE_API_BASE_URL` | 后端 API 地址 | `/api` (开发), `http://localhost:8000` (生产) |
| `VITE_APP_TITLE` | 应用标题 | `指纹浏览器管理系统` |

## API 代理

开发环境下, Vite 会将 `/api` 开头的请求代理到 `http://localhost:8000`。
后端 FastAPI 需要在 `http://localhost:8000` 运行。
