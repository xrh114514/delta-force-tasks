import { createApp } from 'vue'
import App from './App.vue'
import './styles/main.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

// 使用 Element Plus
app.use(ElementPlus)

// 全局配置
app.config.globalProperties.$ui = window.ui

app.mount('#app')