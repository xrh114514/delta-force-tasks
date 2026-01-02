import { markRaw, defineAsyncComponent } from 'vue'

// 活动配置映射表
export const activities = {
    event0: {
        id: 'event0',
        name: '新活动',
        title: '新活动标题',
        desc: '新活动描述',
        hero: 'https://picsum.photos/1920/1080?random=0',
        preview: 'https://picsum.photos/300/200?random=0',
        musicStrategy: 'keep',
        component: markRaw(defineAsyncComponent(() => import('./Event0.vue')))
    },
    event1: {
        id: 'event1',
        name: '突击行动',
        title: '突击行动 - 精英模式',
        desc: '参与高强度突击任务，赢取限定皮肤与武器。',
        hero: '/assets/covers/battle1.jpg',
        preview: '/assets/covers/1724062863299.jpg',
        musicStrategy: 'force',
        music: [
            {
                title: 'Ave Mujica-Crucifix X instrumental',
                audio: '/assets/audio/Ave Mujica-Crucifix X instrumental.mp3',
                cover: '/assets/cover/Ave Mujica-Crucifix X.jpg'
            },
            {
                title: 'Ave Mujica-Imprisoned XII instrumental',
                audio: '/assets/audio/Ave Mujica-Imprisoned XII instrumental.mp3',
                cover: '/assets/cover/Ave Mujica-Imprisoned XII.jpg'
            },  
            {
                title: 'Ave Mujica-天球 (そら) のMúsica instrumental',
                audio: '/assets/audio/Ave Mujica-天球 (そら) のMúsica instrumental.mp3',
                cover: '/assets/cover/Ave Mujica-天球 (そら) のMúsica.jpg'
            },
        ],
        component: markRaw(defineAsyncComponent(() => import('./Event1.vue')))
    },
    event2: {
        id: 'event2',
        name: '生存挑战',
        title: '生存挑战',
        desc: '在极端环境下坚持最久，登上排行榜！',
        hero: 'https://picsum.photos/1920/1080?random=2',
        preview: 'https://picsum.photos/300/200?random=2',
        musicStrategy: 'keep',
        component: markRaw(defineAsyncComponent(() => import('./Event2.vue')))
    },
    event3: {
        id: 'event3',
        name: '特别活动',
        title: '限时特别活动',
        desc: '神秘活动开启，奖励丰厚，先到先得！',
        hero: 'https://picsum.photos/1920/1080?random=3',
        preview: 'https://picsum.photos/300/200?random=3',
        musicStrategy: 'force',
        music: Array.from({length: 12}, (_, i) => ({
            title: `特别活动歌曲 ${i + 1}`,
            audio: `/assets/audio/special${i + 1}.mp3`,
            cover: `/assets/cover/special${i + 1}.jpg`
        })),
        component: markRaw(defineAsyncComponent(() => import('./Event3.vue')))
    },
    event4: {
        id: 'event4',
        name: '特别活动4',
        title: '限时特别活动4',
        desc: '神秘活动开启，奖励丰厚，先到先得！',
        hero: 'https://picsum.photos/1920/1080?random=4',
        preview: 'https://picsum.photos/300/200?random=4',
        musicStrategy: 'force',
        music: Array.from({length: 13}, (_, i) => ({
            title: `特别活动4歌曲 ${i + 1}`,
            audio: `/assets/audio/special4_${i + 1}.mp3`,
            cover: `/assets/cover/special4_${i + 1}.jpg`
        })),
        component: markRaw(defineAsyncComponent(() => import('./Event3.vue')))
    },
    event5: {
        id: 'event5',
        name: '特别活动5',
        title: '限时特别活动5',
        desc: '神秘活动开启，奖励丰厚，先到先得！',
        hero: 'https://picsum.photos/1920/1080?random=5',
        preview: 'https://picsum.photos/300/200?random=5',
        musicStrategy: 'force',
        music: Array.from({length: 13}, (_, i) => ({
            title: `特别活动5歌曲 ${i + 1}`,
            audio: `/assets/audio/special5_${i + 1}.mp3`,
            cover: `/assets/cover/special5_${i + 1}.jpg`
        })),
        component: markRaw(defineAsyncComponent(() => import('./Event3.vue')))
    },
    event6: {
        id: 'event6',
        name: '特别活动6',
        title: '限时特别活动6',
        desc: '神秘活动开启，奖励丰厚，先到先得！',
        hero: 'https://picsum.photos/1920/1080?random=6',
        preview: 'https://picsum.photos/300/200?random=6',
        musicStrategy: 'force',
        music: Array.from({length: 13}, (_, i) => ({
            title: `特别活动6歌曲 ${i + 1}`,
            audio: `/assets/audio/special6_${i + 1}.mp3`,
            cover: `/assets/cover/special6_${i + 1}.jpg`
        })),
        component: markRaw(defineAsyncComponent(() => import('./Event3.vue')))
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