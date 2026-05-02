import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// 路由守卫: 未登录时跳转到登录页
router.beforeEach((to) => {
  const token = localStorage.getItem('access_token')
  if (to.meta.requiresAuth !== false && !token) {
    return { name: 'login' }
  }
  if (to.name === 'login' && token) {
    return { name: 'environments' }
  }
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
