<template>
  <div class="layout">
    <!-- 背景层 -->
    <div class="hero-bg" :style="{ backgroundImage: `url('${currentHeroImage}')` }"></div>
    <video v-if="currentVideo" ref="heroVideo" class="hero-video" :class="{ active: showVideo }" :src="currentVideo"
      loop muted autoplay></video>

    <!-- 侧边栏 -->
    <Sidebar :activities="activityList" :current-activity-id="currentActivityId" @select-activity="loadActivity" />

    <!-- 主内容区 -->
    <div class="details">
        <div class="title" :key="`title-${currentActivityId}`">{{ currentTitle }}</div>
        <div class="desc" :key="`desc-${currentActivityId}`">{{ currentDescription }}</div>

        <!-- 动态组件区域 -->
        <div id="dynamicComponents">
          <!-- 通用的HUD组件 -->
          <component v-for="component in hudComponents" :key="component.id" :is="component.type"
            v-bind="component.props" @claim="handleClaimReward" />

          <!-- 活动特定的组件 -->
          <transition name="activity-fade" mode="out-in">
            <component v-if="currentActivityComponent" :is="currentActivityComponent" :key="currentActivityId" />
          </transition>
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
import { useRouter, useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import MusicPlayer from './components/MusicPlayer.vue'
import ClaimButton from './components/ClaimButton.vue'
import { ElNotification } from 'element-plus'

// 导入活动配置和组件
import {
  activities,
  getActivityConfig,
  getActivityComponent
} from './activities'

// 状态管理
const currentActivityId = computed(() => route.params.id || 'event1')
const currentHeroImage = ref('')
const currentVideo = ref('')
const showVideo = ref(false)
const currentTitle = ref('')
const currentDescription = ref('')
const hudComponents = ref([])

// 音乐播放器状态
const musicPlayer = ref(null)
const playlist = ref([])
const currentTrackIndex = ref(0)
const isPlaying = ref(false)
const heroVideo = ref(null)

// 计算属性
const currentActivityConfig = computed(() => {
  return getActivityConfig(currentActivityId.value)
})

const currentActivityComponent = computed(() => {
  return getActivityComponent(currentActivityId.value)
})

const activityList = computed(() => {
  return Object.values(activities).map(config => ({
    id: config.id,
    name: config.name,
    preview: config.preview
  }))
})

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

  showTextPanel: (html, duration = 5000) => {
    ElNotification({
      message: html,
      position: 'bottom-left',
      duration: duration > 0 ? duration : 5000,
      dangerouslyUseHTMLString: true,
      customClass: 'hud-notification',
      showClose: false
    })
  },

  addClaimButton: (id, text = '领取奖励') => {
    const existingBtn = hudComponents.value.find(c => c.id === `claim-btn-${id}`)
    if (existingBtn) {
      console.warn(`按钮 ${id} 已存在，跳过添加`)
      return
    }
    hudComponents.value.push({
      id: `claim-btn-${id}`,
      type: markRaw(ClaimButton),
      props: {
        buttonId: id,
        text,
        claimed: false
      }
    })
  },

  clearDynamic: () => {
    hudComponents.value = []
    showVideo.value = false
    if (heroVideo.value) {
      heroVideo.value.pause()
    }
  }
}

// 提供UI上下文给子组件
provide('ui', ui)

// 加载活动
const loadActivity = async (id) => {
  const config = getActivityConfig(id)
  if (!config) {
    console.error(`活动 ${id} 不存在`)
    return
  }
  ui.clearDynamic()
  // 设置基础信息
  if (config.title) ui.setTitle(config.title)
  if (config.desc) ui.setDesc(config.desc)
  if (config.hero) ui.setHero(config.hero)
  // 处理音乐策略
  if (config.musicStrategy === 'force' && config.music) {
    playlist.value = config.music
    currentTrackIndex.value = 0
    isPlaying.value = true
    if (musicPlayer.value && typeof musicPlayer.value.updatePlayer === 'function') {
      musicPlayer.value.updatePlayer()
    }
  } else if (config.musicStrategy === 'stop') {
    isPlaying.value = false
    if (musicPlayer.value && typeof musicPlayer.value.updatePlayer === 'function') {
      musicPlayer.value.updatePlayer()
    }
  }
}

// 处理奖励领取
const handleClaimReward = (id) => {
  console.log(`领取奖励: ${id}`)

  if (window.app && typeof window.app.claimReward === 'function') {
    window.app.claimReward(id)
  }

  // 安全地更新按钮状态
  const btnIndex = hudComponents.value.findIndex(c => c.id === `claim-btn-${id}`)
  if (btnIndex > -1) {
    hudComponents.value[btnIndex].props.claimed = true
  }
}

// 音乐播放器控制
const togglePlayPause = () => {
  isPlaying.value = !isPlaying.value
}

const playNextTrack = () => {
  currentTrackIndex.value = (currentTrackIndex.value + 1) % playlist.value.length
}

const selectTrack = (index) => {
  currentTrackIndex.value = index
}

// 初始化
onMounted(() => {
  window.ui = ui
  if (currentActivityId.value) {
    loadActivity(currentActivityId.value)
  }
})
watch(() => route.params.id, (newId) => {
  if (newId) {
    loadActivity(newId)
  }
})

// 监听视频状态变化
watch(showVideo, (newVal) => {
  if (newVal && heroVideo.value) {
    heroVideo.value.play()
  } else if (heroVideo.value) {
    heroVideo.value.pause()
  }
})
</script>

<style scoped>
/* 响应式布局样式 */
.layout {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  position: relative;
  background: #000;
  margin: 0 auto;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: brightness(0.75);
  transition: background-image 0.4s ease-out;
}

.hero-video {
  position: absolute;
  inset: 0;
  object-fit: cover;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 1s ease;
}

.hero-video.active {
  opacity: 1;
}

.details {
  flex: 1;
  position: relative;
  padding: 40px 50px;
  color: var(--text-main);
  text-shadow: 0 0 4px #000;
  overflow: auto;
}

@media (max-width: 768px) {
  .details {
    padding: 20px 25px;
  }
}

@media (max-width: 480px) {
  .details {
    padding: 15px 20px;
  }
}

.title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 12px;
}

@media (max-width: 768px) {
  .title {
    font-size: 36px;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 28px;
  }
}

.desc {
  font-size: 18px;
  line-height: 1.5;
  color: var(--text-sub);
  max-width: 60%;
}

@media (max-width: 768px) {
  .desc {
    font-size: 16px;
    max-width: 80%;
  }
}

@media (max-width: 480px) {
  .desc {
    font-size: 14px;
    max-width: 100%;
  }
}

/* 活动切换过渡动画 */
.activity-fade-enter-active,
.activity-fade-leave-active {
  transition: all 0.3s ease;
}

.activity-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.activity-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.title,
.desc {
  transition: all 0.3s ease;
}
</style>