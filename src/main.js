import { createApp } from 'vue'
import App from './App.vue'
import './styles/main.css'

const app = createApp(App)

// 全局配置
app.config.globalProperties.$ui = window.ui

app.mount('#app')