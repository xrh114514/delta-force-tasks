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
    // 当父组件状态更新时，确保播放器UI与状态同步
    console.log('播放器更新已触发')
    // 如果isPlaying为true但实际没播放，则触发播放
    if (props.isPlaying && !isPlaying.value) {
      togglePlayPause()
    }
    // 如果isPlaying为false但实际在播放，则触发暂停
    else if (!props.isPlaying && isPlaying.value) {
      togglePlayPause()
    }
  }
})
</script>

<style scoped>
.music-player {
    position: absolute;
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