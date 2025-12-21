<template>
  <div class="layout">
    <!-- 背景层 -->
    <div class="hero-bg" :style="{ backgroundImage: `url('${currentHeroImage}')` }"></div>
    <video v-if="currentVideo" ref="heroVideo" class="hero-video" :class="{ active: showVideo }" :src="currentVideo"
      loop muted autoplay></video>

    <!-- 侧边栏 -->
    <Sidebar :activities="activityList" :current-activity-id="currentRouteName" />

    <!-- 主内容区 -->
    <div class="details">
      <div class="title">{{ currentTitle }}</div>
      <div class="desc">{{ currentDescription }}</div>

      <!-- 动态组件区域 - 替换为路由视图 -->
      <div id="dynamicComponents">
        <!-- 路由视图 -->
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="currentRouteName" />
          </transition>
        </router-view>
      </div>

      <!-- 音乐播放器 -->
      <MusicPlayer ref="musicPlayer" :playlist="playlist" :current-track-index="currentTrackIndex"
        :is-playing="isPlaying" @play-pause="togglePlayPause" @next-track="playNextTrack" @select-track="selectTrack" />
    </div>
  </div>
</template>

<script setup>
// 导入所有必要的组件
import { ref, computed, onMounted, watch, provide, markRaw } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import MusicPlayer from './components/MusicPlayer.vue'

// 导入活动配置
import {
  activities,
  getActivityConfig
} from './activities'

// 获取当前路由信息
const route = useRoute()

// 状态管理
const currentHeroImage = ref('')
const currentVideo = ref('')
const showVideo = ref(false)
const currentTitle = ref('')
const currentDescription = ref('')

// 音乐播放器状态
const musicPlayer = ref(null)
const playlist = ref([])
const currentTrackIndex = ref(0)
const isPlaying = ref(false)
const heroVideo = ref(null)

// 计算属性
const currentRouteName = computed(() => route.name || 'Event1')

const currentActivityConfig = computed(() => {
  // 根据路由名称获取活动配置
  const routePath = route.path.replace('/', '')
  return getActivityConfig(routePath) || activities.event1
})

const activityList = computed(() => {
  return Object.values(activities).map(config => ({
    id: config.id,
    name: config.name,
    preview: config.preview
  }))
})

// 监听路由变化，更新页面内容
watch(
  () => currentActivityConfig.value,
  (newConfig) => {
    if (newConfig) {
      currentTitle.value = newConfig.title
      currentDescription.value = newConfig.desc
      currentHeroImage.value = newConfig.hero
      
      // 更新播放列表
      if (newConfig.music) {
        playlist.value = newConfig.music
      }
    }
  },
  { immediate: true }
)

// 初始化
onMounted(() => {
  // 加载默认活动内容
  const initialConfig = currentActivityConfig.value
  if (initialConfig) {
    currentTitle.value = initialConfig.title
    currentDescription.value = initialConfig.desc
    currentHeroImage.value = initialConfig.hero
    
    // 初始化播放列表
    if (initialConfig.music) {
      playlist.value = initialConfig.music
    }
  }
})

// 播放控制方法
const togglePlayPause = () => {
  isPlaying.value = !isPlaying.value
}

const playNextTrack = () => {
  currentTrackIndex.value = (currentTrackIndex.value + 1) % playlist.value.length
}

const selectTrack = (index) => {
  currentTrackIndex.value = index
}

// 注册全局UI方法
const ui = {
  setTitle: (text) => {
    currentTitle.value = text
  },

  setDesc: (text) => {
    currentDescription.value = text
  },

  setHero: (imagePath) => {
    currentHeroImage.value = imagePath
    showVideo.value = false
  },

  playVideo: (videoPath) => {
    currentVideo.value = videoPath
    showVideo.value = true
    if (heroVideo.value) {
      heroVideo.value.play()
    }
  },

  stopVideo: () => {
    showVideo.value = false
    if (heroVideo.value) {
      heroVideo.value.pause()
    }
  },

  showTextPanel: (message, duration = 5000) => {
    // 这里应该实现显示文本面板的逻辑
    // 由于没有看到具体的TextPanel组件使用方式，这里先留空实现
    console.log('Show text panel:', message, 'for', duration, 'ms')
  },

  addClaimButton: (id, text) => {
    // 这里应该实现添加领取按钮的逻辑
    // 由于没有看到具体的按钮添加实现，这里先留空实现
    console.log('Add claim button:', id, text)
  },

  clearDynamic: () => {
    showVideo.value = false
    if (heroVideo.value) {
      heroVideo.value.pause()
    }
  }
}

// 提供全局UI方法
provide('ui', ui)

// 暴露给全局使用
window.ui = ui
</script>

<style scoped>
/* 添加过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 其他样式保持不变 */
.layout {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: background-image 1s ease-in-out;
  z-index: -1;
}

.hero-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 1s ease-in-out;
  z-index: -1;
  opacity: 0;
}

.hero-video.active {
  opacity: 1;
}

.details {
  position: relative;
  z-index: 1;
}

#dynamicComponents {
  margin-top: 20px;
}
</style>