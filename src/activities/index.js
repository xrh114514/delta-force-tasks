import { markRaw, defineAsyncComponent } from 'vue'

// 全局音乐播放列表 - 包含所有活动的音乐
export const globalMusicPlaylist = [
    // Event1 - 突击行动 (Ave Mujica instrumental)
    {
        title: 'Ave Mujica-Crucifix X instrumental',
        audio: '/assets/audio/Ave Mujica-Crucifix X instrumental.mp3',
        cover: '/assets/cover/Ave Mujica-Crucifix X.jpg',
        artist: 'Ave Mujica',
        event: '突击行动'
    },
    {
        title: 'Ave Mujica-Imprisoned XII instrumental',
        audio: '/assets/audio/Ave Mujica-Imprisoned XII instrumental.mp3',
        cover: '/assets/cover/Ave Mujica-Imprisoned XII.jpg',
        artist: 'Ave Mujica',
        event: '突击行动'
    },
    {
        title: 'Ave Mujica-天球 (そら) のMúsica instrumental',
        audio: '/assets/audio/Ave Mujica-天球 (そら) のMúsica instrumental.mp3',
        cover: '/assets/cover/Ave Mujica-天球 (そら) のMúsica.jpg',
        artist: 'Ave Mujica',
        event: '突击行动'
    },

    // Event3 - 孤独摇滚
    {
        title: 'あのバンド',
        audio: '/assets/1/music/結束バンド-あのバンド (TV Version).mp3',
        cover: '/assets/1/music/結束バンド-あのバンド.jpg',
        artist: '結束バンド',
        event: '孤独摇滚'
    },
    {
        title: 'ギターと孤独と蒼い惑星',
        audio: '/assets/1/music/結束バンド-ギターと孤独と蒼い惑星 (Anime Ver.).mp3',
        cover: '/assets/1/music/結束バンド-ギターと孤独と蒼い惑星.jpg',
        artist: '結束バンド',
        event: '孤独摇滚'
    },
    {
        title: '星座になれたら',
        audio: '/assets/1/music/結束バンド-星座になれたら.mp3',
        cover: '/assets/1/music/結束バンド-星座になれたら.jpg',
        artist: '結束バンド',
        event: '孤独摇滚'
    },
    {
        title: '忘れてやらない',
        audio: '/assets/1/music/結束バンド-忘れてやらない.mp3',
        cover: '/assets/1/music/結束バンド-忘れてやらない.jpg',
        artist: '結束バンド',
        event: '孤独摇滚'
    },
    {
        title: 'Distortion‼',
        audio: '/assets/1/music/結束バンド-Distortion‼ (Inst.).mp3',
        cover: '/assets/1/music/結束バンド-Distortion‼.jpg',
        artist: '結束バンド',
        event: '孤独摇滚'
    },
    {
        title: 'なにが悪い',
        audio: '/assets/1/music/結束バンド-なにが悪い (Inst.).mp3',
        cover: '/assets/1/music/結束バンド-なにが悪い.jpg',
        artist: '結束バンド',
        event: '孤独摇滚'
    },
    {
        title: 'カラカラ',
        audio: '/assets/1/music/結束バンド-カラカラ (Inst.).mp3',
        cover: '/assets/1/music/結束バンド-カラカラ.jpg',
        artist: '結束バンド',
        event: '孤独摇滚'
    },
    {
        title: '結束バンド-翻转',
        audio: '/assets/1/music/結束バンド-結束バンド-翻转 (結束バンド remix).mp3',
        cover: '/assets/1/music/結束バンド-結束バンド-翻转.jpg',
        artist: '結束バンド',
        event: '孤独摇滚'
    },

    // Event4 - GIRLS BAND CRY
    {
        title: 'ダレモ',
        audio: '/assets/1/music/トゲナシトゲアリ-ダレモ.mp3',
        cover: '/assets/1/music/トゲナシトゲアリ-ダレモ.jpg',
        artist: 'トゲナシトゲアリ',
        event: 'GIRLS BAND CRY'
    },
    {
        title: 'サヨナラサヨナラサヨナラ',
        audio: '/assets/1/music/トゲナシトゲアリ-サヨナラサヨナラサヨナラ.mp3',
        cover: '/assets/1/music/トゲナシトゲアリ-サヨナラサヨナラサヨナラ.jpg',
        artist: 'トゲナシトゲアリ',
        event: 'GIRLS BAND CRY'
    },
    {
        title: 'arrow',
        audio: '/assets/1/music/トゲナシトゲアリ-arrow.mp3',
        cover: '/assets/1/music/トゲナシトゲアリ-arrow.jpg',
        artist: 'トゲナシトゲアリ',
        event: 'GIRLS BAND CRY'
    },
    {
        title: 'もう何もいらない未来',
        audio: '/assets/1/music/トゲナシトゲアリ-もう何もいらない未来.mp3',
        cover: '/assets/1/music/トゲナシトゲアリ-もう何もいらない未来.jpg',
        artist: 'トゲナシトゲアリ',
        event: 'GIRLS BAND CRY'
    },
    {
        title: '空白とカタルシス',
        audio: '/assets/1/music/トゲナシトゲアリ-空白とカタルシス.mp3',
        cover: '/assets/1/music/トゲナシトゲアリ-空白とカタルシス.jpg',
        artist: 'トゲナシトゲアリ',
        event: 'GIRLS BAND CRY'
    },
    {
        title: '心象的フラクタル',
        audio: '/assets/1/music/トゲナシトゲアリ-心象的フラクタル (beni-shouga).mp3',
        cover: '/assets/1/music/トゲナシトゲアリ-心象的フラクタル.jpg',
        artist: 'トゲナシトゲアリ',
        event: 'GIRLS BAND CRY'
    },
    {
        title: '爆ぜて咲く',
        audio: '/assets/1/music/トゲナシトゲアリ-爆ぜて咲く.mp3',
        cover: '/assets/1/music/トゲナシトゲアリ-爆ぜて咲く.jpg',
        artist: 'トゲナシトゲアリ',
        event: 'GIRLS BAND CRY'
    },
    {
        title: '理想的パラドクスとは',
        audio: '/assets/1/music/トゲナシトゲアリ-理想的パラドクスとは.mp3',
        cover: '/assets/1/music/トゲナシトゲアリ-理想的パラドクスとは.jpg',
        artist: 'トゲナシトゲアリ',
        event: 'GIRLS BAND CRY'
    },
    {
        title: '誰にもなれない私だから',
        audio: '/assets/1/music/トゲナシトゲアリ-誰にもなれない私だから.mp3',
        cover: '/assets/1/music/トゲナシトゲアリ-誰にもなれない私だから.jpg',
        artist: 'トゲナシトゲアリ',
        event: 'GIRLS BAND CRY'
    },
    {
        title: '雑踏、僕らの街',
        audio: '/assets/1/music/トゲナシトゲアリ-雑踏、僕らの街.mp3',
        cover: '/assets/1/music/トゲナシトゲアリ-雑踏、僕らの街.jpg',
        artist: 'トゲナシトゲアリ',
        event: 'GIRLS BAND CRY'
    },

    // Event5 - MyGO!!!!!
    {
        title: '「僕は...」',
        audio: '/assets/1/music/MyGO!!!!!-「僕は...」 (I am…).mp3',
        cover: '/assets/1/music/MyGO!!!!!-「僕は...」.jpg',
        artist: 'MyGO!!!!!',
        event: 'MyGO!!!!!'
    },
    {
        title: 'エガクミライ',
        audio: '/assets/1/music/MyGO!!!!!-エガクミライ.mp3',
        cover: '/assets/1/music/MyGO!!!!!-エガクミライ.jpg',
        artist: 'MyGO!!!!!',
        event: 'MyGO!!!!!'
    },
    {
        title: '壱雫空',
        audio: '/assets/1/music/MyGO!!!!!-壱雫空.mp3',
        cover: '/assets/1/music/MyGO!!!!!-壱雫空.jpg',
        artist: 'MyGO!!!!!',
        event: 'MyGO!!!!!'
    },
    {
        title: '影色舞',
        audio: '/assets/1/music/MyGO!!!!!-影色舞.mp3',
        cover: '/assets/1/music/MyGO!!!!!-影色舞.jpg',
        artist: 'MyGO!!!!!',
        event: 'MyGO!!!!!'
    },
    {
        title: '迷星叫',
        audio: '/assets/1/music/MyGO!!!!!-迷星叫.mp3',
        cover: '/assets/1/music/MyGO!!!!!-迷星叫.jpg',
        artist: 'MyGO!!!!!',
        event: 'MyGO!!!!!'
    },
    {
        title: '春日影',
        audio: '/assets/1/music/MyGO!!!!!-春日影 (MyGO!!!!! ver.).mp3',
        cover: '/assets/1/music/MyGO!!!!!-春日影.jpg',
        artist: 'MyGO!!!!!',
        event: 'MyGO!!!!!'
    },
    {
        title: '詩超絆',
        audio: '/assets/1/music/MyGO!!!!!-詩超絆.mp3',
        cover: '/assets/1/music/MyGO!!!!!-詩超絆.jpg',
        artist: 'MyGO!!!!!',
        event: 'MyGO!!!!!'
    },
    {
        title: 'Henceforth',
        audio: '/assets/1/music/MyGO!!!!!-Henceforth.mp3',
        cover: '/assets/1/music/MyGO!!!!!-Henceforth.jpg',
        artist: 'MyGO!!!!!',
        event: 'MyGO!!!!!'
    },
    {
        title: '名無声',
        audio: '/assets/1/music/MyGO!!!!!-名無声.mp3',
        cover: '/assets/1/music/MyGO!!!!!-名無声.jpg',
        artist: 'MyGO!!!!!',
        event: 'MyGO!!!!!'
    },
    {
        title: '回層浮',
        audio: '/assets/1/music/MyGO!!!!!-回層浮.mp3',
        cover: '/assets/1/music/MyGO!!!!!-回層浮.jpg',
        artist: 'MyGO!!!!!',
        event: 'MyGO!!!!!'
    },

    // Event6 - Ave Mujica
    {
        title: 'Ave Mujica',
        audio: '/assets/1/music/Ave Mujica-Ave Mujica.mp3',
        cover: '/assets/1/music/Ave Mujica-Ave Mujica.jpg',
        artist: 'Ave Mujica',
        event: 'Ave Mujica'
    },
    {
        title: 'Crucifix X',
        audio: '/assets/1/music/Ave Mujica-Crucifix X.mp3',
        cover: '/assets/1/music/Ave Mujica-Crucifix X.jpg',
        artist: 'Ave Mujica',
        event: 'Ave Mujica'
    },
    {
        title: 'Imprisoned XII',
        audio: '/assets/1/music/Ave Mujica-Imprisoned XII.mp3',
        cover: '/assets/1/music/Ave Mujica-Imprisoned XII.jpg',
        artist: 'Ave Mujica',
        event: 'Ave Mujica'
    },
    {
        title: '天球 (そら) のMúsica',
        audio: '/assets/1/music/Ave Mujica-天球 (そら) のMúsica.mp3',
        cover: '/assets/1/music/Ave Mujica-天球 (そら) のMúsica.jpg',
        artist: 'Ave Mujica',
        event: 'Ave Mujica'
    },
    {
        title: 'DIVINE',
        audio: '/assets/1/music/Ave Mujica-DIVINE.mp3',
        cover: '/assets/1/music/Ave Mujica-DIVINE.jpg',
        artist: 'Ave Mujica',
        event: 'Ave Mujica'
    },
    {
        title: 'KiLLKiSS',
        audio: '/assets/1/music/Ave Mujica-KiLLKiSS.mp3',
        cover: '/assets/1/music/Ave Mujica-KiLLKiSS.jpg',
        artist: 'Ave Mujica',
        event: 'Ave Mujica'
    },
    {
        title: 'Georgette Me, Georgette You',
        audio: '/assets/1/music/Ave Mujica-Georgette Me, Georgette You.mp3',
        cover: '/assets/1/music/Ave Mujica-Georgette Me, Georgette You.jpg',
        artist: 'Ave Mujica',
        event: 'Ave Mujica'
    },
    {
        title: 'Ether',
        audio: '/assets/1/music/Ave Mujica-Ether.mp3',
        cover: '/assets/1/music/Ave Mujica-Ether.jpg',
        artist: 'Ave Mujica',
        event: 'Ave Mujica'
    },
    {
        title: 'Choir \'S\' Choir',
        audio: '/assets/1/music/Ave Mujica-Choir \'S\' Choir.mp3',
        cover: '/assets/1/music/Ave Mujica-Choir \'S\' Choir.jpg',
        artist: 'Ave Mujica',
        event: 'Ave Mujica'
    },
    {
        title: 'Angles',
        audio: '/assets/1/music/Ave Mujica-Angles.mp3',
        cover: '/assets/1/music/Ave Mujica-Angles.jpg',
        artist: 'Ave Mujica',
        event: 'Ave Mujica'
    }
]

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
        name: '生存挑战',
        title: '生存挑战',
        desc: '在极端环境下坚持最久，登上排行榜！',
        hero: 'https://picsum.photos/1920/1080?random=2',
        preview: 'https://picsum.photos/300/200?random=2',
        musicStrategy: 'keep',
        component: markRaw(defineAsyncComponent(() => import('./Event2.vue')))
    },
    event2: {
        id: 'event2',
        name: '突击行动',
        title: '突击行动 - 精英模式',
        desc: '参与高强度突击任务，赢取限定皮肤与武器。',
        hero: '/assets/covers/battle1.jpg',
        preview: '/assets/covers/1724062863299.jpg',
        musicStrategy: 'global',
        component: markRaw(defineAsyncComponent(() => import('./Event1.vue')))
    },
    event3: {
        id: 'event3',
        name: '孤独摇滚',
        title: '孤独摇滚',
        desc: '直女爱上帅气贝斯手，发现偶像在和队友恋爱',
        hero: '/assets/1/孤独摇滚.jpg',
        preview: '/assets/1/孤独摇滚.jpg',
        musicStrategy: 'global',
        component: markRaw(defineAsyncComponent(() => import('./Event3.vue')))
    },
    event4: {
        id: 'event4',
        name: 'GIRLS BAND CRY',
        title: 'GIRLS BAND CRY',
        desc: '五个日本女孩跳楼视频',
        hero: '/assets/1/gbc.jpg',
        preview: '/assets/1/gbc.jpg',
        musicStrategy: 'global',
        component: markRaw(defineAsyncComponent(() => import('./Event4.vue')))
    },
    event5: {
        id: 'event5',
        name: 'MyGO!!!!!',
        title: "It's MyGO!!!!!",
        desc: '咕咕嘎嘎——高松燈',
        hero: '/assets/1/mygo.jpg',
        preview: '/assets/1/mygo.jpg',
        musicStrategy: 'global',
        component: markRaw(defineAsyncComponent(() => import('./Event5.vue')))
    },
    event6: {
        id: 'event6',
        name: 'Ave Mujica',
        title: 'BanG Dream! Ave Mujica',
        desc: 'saki酱saki酱saki酱saki酱saki酱saki酱——三角初華',
        hero: '/assets/1/mujica.jpg',
        preview: '/assets/1/mujica.jpg',
        musicStrategy: 'global',
        component: markRaw(defineAsyncComponent(() => import('./Event6.vue')))
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