import { createRouter, createWebHashHistory } from 'vue-router'
import { eventRoutes } from '../activities'

// 创建路由实例
const router = createRouter({
  // 使用createWebHashHistory启用webhashhistory模式
  history: createWebHashHistory(),
  // 定义路由配置
  routes: [
    {
      path: '/',
      name: 'Home',
      // 主页面默认显示第一个活动或其他默认内容
      redirect: '/event1'
    },
    // 导入活动相关的路由
    ...eventRoutes
  ]
})

export default router
