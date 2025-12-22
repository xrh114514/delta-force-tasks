// 导入所有活动组件
import Event1 from './Event1.vue'
import Event2 from './Event2.vue'
import Event3 from './Event3.vue'
import Event4 from './Event4.vue'
import { markRaw } from 'vue'

// 活动配置映射表
export const activities = {
    event1: {
        id: 'event1',
        name: '突击行动',
        title: '突击行动 - 精英模式',
        desc: '参与高强度突击任务，赢取限定皮肤与武器。',
        hero: './assets/images/event1.png',
        preview: './assets/images/event1_thumb.png',
        musicStrategy: 'force',
        music: [
            {
                title: 'Ave Mujica-Crucifix X instrumental',
                audio: './assets/audio/Ave Mujica-Crucifix X instrumental.mp3',
                cover: './assets/covers/battle1.jpg'
            },
            {
                title: 'Ave Mujica-Imprisoned XII instrumental',
                audio: './assets/audio/Ave Mujica-Imprisoned XII instrumental.mp3',
                cover: './assets/covers/battle2.jpg'
            }
        ],
        component: markRaw(Event1)
    },
    event2: {
        id: 'event2',
        name: '生存挑战',
        title: '生存挑战',
        desc: '在极端环境下坚持最久，登上排行榜！',
        hero: './assets/images/event2.jpg',
        preview: './assets/images/event2_thumb.jpg',
        musicStrategy: 'keep',
        component: markRaw(Event2)
    },
    event3: {
        id: 'event3',
        name: '特别活动',
        title: '限时特别活动',
        desc: '神秘活动开启，奖励丰厚，先到先得！',
        hero: './assets/images/event3.jpg',
        preview: './assets/images/event3_thumb.jpg',
        musicStrategy: 'stop',
        component: markRaw(Event3)
    },
    event4: {
        id: 'event4',
        name: '测试活动',
        title: '测试页面',
        desc: '用于测试各种组件的空白活动页。',
        hero: './assets/images/test.jpg',
        preview: './assets/images/test_thumb.jpg',
        musicStrategy: 'keep',
        component: markRaw(Event4)
    }
}

// 按需获取活动配置
export const getActivityConfig = (id) => {
    return activities[id] || null
}

// 获取所有活动ID
export const getAllActivityIds = () => {
    return Object.keys(activities)
}

// 获取活动组件
export const getActivityComponent = (id) => {
    return activities[id]?.component || null
}