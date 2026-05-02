import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const authStore = useAuthStore()
authStore.init()

router.beforeEach((to) => {
  if (to.meta.requiresAuth !== false && !authStore.isLoggedIn) {
    return { name: 'login' }
  }
  if (to.name === 'login' && authStore.isLoggedIn) {
    return { name: 'environments' }
  }
})

app.mount('#app')
