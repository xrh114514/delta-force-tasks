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

        <audio ref="audioElement" v-show="false"></audio>
    </div>
</template>

<script setup>
import { ref, computed, reactive, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'

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
const audioElement = ref(null)

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

const currentState = reactive({})

const play = function () {
    if (audioElement.value) {
        if (audioElement.value.readyState >= 2) { // HAVE_CURRENT_DATA or higher
            audioElement.value.play().catch(() => {
                // autoplay failed, require user action
                if (!currentState.shownWarning) {
                    currentState.shownWarning = true
                    ElMessage.warning('自动播放被浏览器阻止，请点击任意位置手动开始播放')
                }
                emit('play-pause') // 重置isPlaying为false
                window.addEventListener('click', function onFirstClick() {
                    if (audioElement.value) {
                        audioElement.value.play().then(() => {
                            // emit('play-pause') // 播放成功后重置isPlaying为true
                        }).catch((e) => {
                            ElMessage.error('播放失败，请检查音频文件: '+e)
                            //此时isPlaying已经为false不需要重置
                        })
                    }
                }, { once: true })
            })
        } else {
            // Wait for audio to load
            const onCanPlay = () => {
                audioElement.value.removeEventListener('canplay', onCanPlay)
                audioElement.value.play().catch(() => {
                    if (!currentState.shownWarning) {
                        currentState.shownWarning = true
                        ElMessage.warning('自动播放被浏览器阻止，请点击任意位置手动开始播放')
                    }
                    emit('play-pause')
                    window.addEventListener('click', function onFirstClick() {
                        if (audioElement.value) {
                            audioElement.value.play().then(() => {
                            }).catch((e) => {
                                ElMessage.error('播放失败，请检查音频文件: '+e)
                            })
                        }
                    }, { once: true })
                })
            }
            audioElement.value.addEventListener('canplay', onCanPlay)
        }
    }
}

const pause = function () {
    if (audioElement.value) {
        audioElement.value.pause()
    }
}

// 监听isPlaying属性变化，确保播放器状态与isPlaying一致
watch(() => props.isPlaying, (newValue, oldValue) => {
    if (oldValue !== undefined && audioElement.value) {
        if (newValue) {
            play()
        } else {
            pause()
        }
    }
})

// 监听当前曲目变化
watch(() => props.currentTrackIndex, () => {
    if (audioElement.value && currentTrack.value?.audio) {
        audioElement.value.src = currentTrack.value.audio
        if (props.isPlaying) {
            play()
        }
    }
})

// 暴露方法给父组件
defineExpose({
    async updatePlayer() {
        await nextTick()
        const newState = {
            isPlaying: props.isPlaying,
            currentTrack: currentTrack.value?.title,
            trackIndex: props.currentTrackIndex,
            url: currentTrack.value?.audio || '',
        }
        console.debug('[MusicPlayer] updatePlayer', 'newUrl=', newState.url, 'isPlaying=', newState.isPlaying, 'currentUrl=', currentState.url)
        
        if (currentState.url !== newState.url) {
            if (audioElement.value) {
                audioElement.value.src = newState.url
                if (newState.isPlaying) {
                    play()
                }
            }
            else nextTick(() => {
                if (audioElement.value) {
                    audioElement.value.src = newState.url
                }
                else {
                    console.error('Failed to set audio source')
                    emit('play-pause') // 无法设置音频源时重置isPlaying为false
                }
                if (newState.isPlaying) {
                    play()
                }
            })
        } else {
            // 如果URL相同但播放状态不一致，确保状态同步
            if (audioElement.value) {
                if (newState.isPlaying && audioElement.value.paused) {
                    play()
                } else if (!newState.isPlaying && !audioElement.value.paused) {
                    pause()
                }
            }
        }
        currentState.isPlaying = newState.isPlaying
        currentState.currentTrack = newState.currentTrack
        currentState.trackIndex = newState.trackIndex
        currentState.url = newState.url

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