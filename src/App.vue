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
      <div class="title">{{ currentTitle }}</div>
      <div class="desc">{{ currentDescription }}</div>

      <!-- 动态组件区域 -->
      <div id="dynamicComponents">
        <!-- 通用的HUD组件 -->
        <component v-for="component in hudComponents" :key="component.id" :is="component.type"
          v-bind="component.props" />

        <!-- 活动特定的组件 -->
        <component v-if="currentActivityComponent" :is="currentActivityComponent" :key="currentActivityId" />
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
import Sidebar from './components/Sidebar.vue'
import MusicPlayer from './components/MusicPlayer.vue'
import HudTextPanel from './components/HudTextPanel.vue'
import ClaimButton from './components/ClaimButton.vue'

// 导入活动配置和组件
import {
  activities,
  getActivityConfig,
  getActivityComponent
} from './activities'

// 状态管理
const currentActivityId = ref('event1') // 默认第一个活动
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

  showTextPanel: (html, duration = 0) => {
    const id = `text-panel-${Date.now()}`
    hudComponents.value.push({
      id,
      type: markRaw(HudTextPanel),
      props: {
        html,
        duration,
        visible: true
      }
    })

    if (duration > 0) {
      setTimeout(() => {
        const index = hudComponents.value.findIndex(c => c.id === id)
        if (index > -1) {
          hudComponents.value[index].props.visible = false
        }
      }, duration)
    }
  },

  addClaimButton: (id, text = '领取奖励') => {
    hudComponents.value.push({
      id: `claim-btn-${id}`,
      type: markRaw(ClaimButton),
      props: {
        buttonId: id,
        text,
        claimed: false,
        onClick: () => handleClaimReward(id)
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
  if (currentActivityId.value === id) return

  const config = getActivityConfig(id)
  if (!config) {
    console.error(`活动 ${id} 不存在`)
    return
  }

  // 清理当前活动
  ui.clearDynamic()

  // 更新当前活动ID
  currentActivityId.value = id

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
    // 直接更新状态而不是调用不存在的pause方法
    isPlaying.value = false
  }
  // 'keep' 策略：保持当前播放状态，不做处理
}

// 处理奖励领取
const handleClaimReward = (id) => {
  console.log(`领取奖励: ${id}`)

  if (window.app && typeof window.app.claimReward === 'function') {
    window.app.claimReward(id)
  }

  // 更新按钮状态
  const btn = hudComponents.value.find(c => c.id === `claim-btn-${id}`)
  if (btn) {
    btn.props.claimed = true
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
  // 注册全局UI对象
  window.ui = ui

  // 加载默认活动
  if (currentActivityConfig.value) {
    loadActivity(currentActivityId.value)
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

// 监听当前活动变化
watch(currentActivityId, (newId) => {
  const config = getActivityConfig(newId)
  if (config) {
    currentTitle.value = config.title || ''
    currentDescription.value = config.desc || ''
    currentHeroImage.value = config.hero || ''
  }
})
</script>

<style scoped>
/* 保持原有的样式 */
.layout {
  width: 100vw;
  max-width: 100%;
  aspect-ratio: 4 / 3;
  height: auto;
  max-height: 100vh;
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
}

.title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 12px;
}

.desc {
  font-size: 18px;
  line-height: 1.5;
  color: var(--text-sub);
  max-width: 60%;
}
</style>