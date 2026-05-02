import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: { name: 'environments' },
      },
      {
        path: 'environments',
        name: 'environments',
        component: () => import('@/views/EnvironmentListView.vue'),
        meta: { title: '我的环境' },
      },
      {
        path: 'environments/create',
        name: 'environment-create',
        component: () => import('@/views/EnvironmentCreateView.vue'),
        meta: { title: '新建环境' },
      },
      {
        path: 'environments/:id/edit',
        name: 'environment-edit',
        component: () => import('@/views/EnvironmentCreateView.vue'),
        meta: { title: '编辑环境' },
      },
      {
        path: 'groups',
        name: 'groups',
        component: () => import('@/views/GroupView.vue'),
        meta: { title: '分组管理' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'environments' },
  },
]
