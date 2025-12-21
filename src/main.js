import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/main.css'

const app = createApp(App)

// 使用路由
app.use(router)

// 全局配置
app.config.globalProperties.$ui = window.ui

app.mount('#app')