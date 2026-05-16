import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/assets/main.css'
import { useAuth } from '@/composables/useAuth'
import App from './App.vue'
import router from './router'

(async () => {
  const app = createApp(App)

  app.use(createPinia())
  app.use(router)

  const { getSession } = useAuth()
  await getSession()

  app.mount('#app')
})()
