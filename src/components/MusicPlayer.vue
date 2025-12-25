<template>
    <div class="music-player">
        <div class="player-disc">
            <div class="disc-cover" :class="{ playing: isPlaying }" :style="{
                backgroundImage: currentTrack?.cover ? `url('${currentTrack.cover}')` : 'none'
            }"></div>
            <button class="play-pause-btn" @click="$emit('play-pause')">
                {{ isPlaying ? '❚❚' : '▶' }}
            </button>
        </div>

        <div class="track-info">
            {{ currentTrack?.title || '加载中...' }}
        </div>

        <div class="player-controls">
            <button class="control-btn" @click="$emit('next-track')">⏭</button>
            <button class="control-btn menu-btn" @click="toggleMenu">⋮</button>
        </div>

        <div class="track-menu" :class="{ active: showMenu }">
            <div v-for="(track, index) in playlist" :key="index" class="menu-item" @click="selectTrack(index)">
                {{ track.title }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    playlist: {
        type: Array,
        default: () => []
    },
    currentTrackIndex: {
        type: Number,
        default: 0
    },
    isPlaying: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['play-pause', 'next-track', 'select-track'])

const showMenu = ref(false)

const currentTrack = computed(() => {
    return props.playlist[props.currentTrackIndex] || null
})

const toggleMenu = () => {
    showMenu.value = !showMenu.value
}

const selectTrack = (index) => {
    emit('select-track', index)
    showMenu.value = false
}

// 暴露方法给父组件
defineExpose({
  updatePlayer() {
    // 这个方法现在只是用于调试，不再尝试修改props
    console.log('播放器状态已同步:', {
      isPlaying: props.isPlaying,
      currentTrack: currentTrack.value?.title,
      trackIndex: props.currentTrackIndex
    })
  }
})
</script>

<style scoped>
.music-player {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 300px;
    height: 60px;
    padding: 8px;
    background: rgba(26, 26, 26, 0.6);
    backdrop-filter: blur(4px);
    border: 1px solid var(--line-thin);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 10;
    gap: 10px;
}

@media (max-width: 768px) {
    .music-player {
        width: 250px;
        right: 15px;
        bottom: 15px;
    }
}

@media (max-width: 480px) {
    .music-player {
        width: 200px;
        right: 10px;
        bottom: 10px;
        padding: 6px;
        gap: 5px;
    }
}

.player-disc {
    position: relative;
    width: 50px;
    height: 50px;
    flex-shrink: 0;
}

.disc-cover {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    animation: rotate 10s linear infinite paused;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.disc-cover.playing {
    animation-play-state: running;
}

.play-pause-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.5);
    border: none;
    color: var(--accent-green);
    font-size: 18px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.track-info {
    font-size: 12px;
    color: var(--text-sub);
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.player-controls {
    display: flex;
    gap: 10px;
}

.control-btn {
    background: none;
    border: none;
    color: var(--text-sub);
    font-size: 16px;
    cursor: pointer;
    transition: color var(--transition-fast);
}

.control-btn:hover {
    color: var(--accent-green);
}

.track-menu {
    display: none;
    position: absolute;
    bottom: 100%;
    right: 0;
    background: var(--bg-secondary);
    border: 1px solid var(--line-thin);
    padding: 10px;
    max-height: 150px;
    overflow-y: auto;
    width: 150px;
    z-index: 20;
}

.track-menu.active {
    display: block;
}

.menu-item {
    padding: 5px;
    cursor: pointer;
    color: var(--text-sub);
    font-size: 12px;
}

.menu-item:hover {
    color: var(--accent-green);
}
</style>