// 导入所有活动组件
import Event1 from './Event1.vue'
import Event2 from './Event2.vue'
import Event3 from './Event3.vue'
import { markRaw } from 'vue'

// 活动配置映射表
export const activities = {
    event1: {
        id: 'event1',
        name: '突击行动',
        title: '突击行动 - 精英模式',
        desc: '参与高强度突击任务，赢取限定皮肤与武器。',
        hero: 'https://picsum.photos/1920/1080?random=1',
        preview: 'https://picsum.photos/300/200?random=1',
        musicStrategy: 'force',
        music: [
            {
                title: 'Sample Music 1',
                audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
                cover: 'https://picsum.photos/200/200?random=10'
            },
            {
                title: 'Sample Music 2',
                audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-04.wav',
                cover: 'https://picsum.photos/200/200?random=11'
            }
        ],
        component: markRaw(Event1)
    },
    event2: {
        id: 'event2',
        name: '生存挑战',
        title: '生存挑战',
        desc: '在极端环境下坚持最久，登上排行榜！',
        hero: 'https://picsum.photos/1920/1080?random=2',
        preview: 'https://picsum.photos/300/200?random=2',
        musicStrategy: 'keep',
        component: markRaw(Event2)
    },
    event3: {
        id: 'event3',
        name: '特别活动',
        title: '限时特别活动',
        desc: '神秘活动开启，奖励丰厚，先到先得！',
        hero: 'https://picsum.photos/1920/1080?random=3',
        preview: 'https://picsum.photos/300/200?random=3',
        musicStrategy: 'stop',
        component: markRaw(Event3)
    },
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