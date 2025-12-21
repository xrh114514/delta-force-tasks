<template>
    <div class="music-player">
        <div class="player-disc">
            <div class="disc-cover" :class="{ playing: actualPlaying }" :style="{
                backgroundImage: currentTrack?.cover ? `url('${currentTrack.cover}')` : 'none'
            }"></div>
        </div>

        <div class="track-info">
            {{ currentTrack?.title || (props.playlist && props.playlist.length > 0 ? '未选择音乐' : '暂无音乐列表') }}
        </div>

        <div class="player-controls">
            <button class="play-btn" @click="handlePlayPause" :class="{ playing: actualPlaying }">
                {{ actualPlaying ? '暂停' : '播放' }}
            </button>
            
            <button 
                class="next-btn" 
                @click="() => emit('next-track')"
                :disabled="!Array.isArray(playlist) || playlist.length <= 1"
            >
                下一首
            </button>
            
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
import { ref, computed, onMounted, watch } from 'vue'

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

const emit = defineEmits(['play-pause', 'next-track', 'select-track', 'track-ended', 'update:isPlaying'])

const showMenu = ref(false)
const audio = ref(null)
const actualPlaying = ref(false) // 实际播放状态，用于跟踪浏览器播放情况
const autoplayBlocked = ref(false) // 自动播放是否被阻止
const audioInitialized = ref(false)

// 当前播放曲目
const currentTrack = computed(() => {
    // 添加更健壮的检查逻辑
    if (!props.playlist || !Array.isArray(props.playlist) || props.playlist.length === 0) {
        return null
    }
    
    // 确保索引在有效范围内
    const validIndex = Math.max(0, Math.min(props.currentTrackIndex, props.playlist.length - 1))
    return props.playlist[validIndex] || null
})

// 初始化音频引擎
function initAudio() {
    if (audio.value) {
        audio.value.pause()
        audio.value.removeEventListener('play', handlePlayEvent)
        audio.value.removeEventListener('pause', handlePauseEvent)
        audio.value.removeEventListener('ended', handleEndEvent)
        audio.value.removeEventListener('error', handleErrorEvent)
    }
    
    audio.value = new Audio()
    audio.value.volume = 0.8 // 设置音量为80%
    
    // 添加事件监听器
    audio.value.addEventListener('play', handlePlayEvent)
    audio.value.addEventListener('pause', handlePauseEvent)
    audio.value.addEventListener('ended', handleEndEvent)
    audio.value.addEventListener('error', handleErrorEvent)
    
    audioInitialized.value = true
    console.log('音乐播放器音频引擎初始化完成')
}

// 事件处理函数
function handlePlayEvent() {
    actualPlaying.value = true
    autoplayBlocked.value = false
    console.log('音频开始播放')
}

function handlePauseEvent() {
    actualPlaying.value = false
    console.log('音频暂停播放')
}

function handleEndEvent() {
    actualPlaying.value = false
    emit('track-ended')
    console.log('音频播放结束')
}

function handleErrorEvent(e) {
    actualPlaying.value = false
    console.error('音频播放错误:', e)
    
    // 错误处理
    if (window.ui && typeof window.ui.showTextPanel === 'function') {
        window.ui.showTextPanel('音频播放错误，请检查音频文件是否有效')
    }
}

// 更新播放器状态
function updatePlayer() {
    if (!audioInitialized.value) {
        initAudio()
    }
    
    if (!audio.value) return
    
    const track = currentTrack.value
    if (!track) {
        console.log('没有有效的曲目可播放')
        return
    }
    
    const audioSrc = track.url || track.audio
    if (!audioSrc) {
        console.error('当前曲目缺少音频源')
        return
    }
    
    // 设置音频源
    audio.value.src = audioSrc
    console.log('更新音频源:', audioSrc)
    
    // 如果设置为播放状态，尝试自动播放
    if (props.isPlaying && !autoplayBlocked.value) {
        setTimeout(() => {
            attemptPlay()
        }, 100)
    }
}

// 尝试自动播放
function attemptPlay() {
    if (!audio.value || !currentTrack.value) return false
    
    console.log('尝试自动播放音频')
    
    // 尝试播放
    audio.value.play()
        .then(() => {
            console.log('自动播放成功')
            actualPlaying.value = true
            autoplayBlocked.value = false
            
            // 播放成功时，更新UI状态
            if (window.ui && typeof window.ui.showTextPanel === 'function') {
                window.ui.showTextPanel('音乐自动播放中', 1000)
            }
        })
        .catch(error => {
            console.warn('自动播放被阻止:', error.message)
            actualPlaying.value = false
            autoplayBlocked.value = true
            
            // 显示自动播放失败的提示
            if (window.ui && typeof window.ui.showTextPanel === 'function') {
                window.ui.showTextPanel('自动播放被浏览器阻止，请点击播放按钮开始播放音乐')
            }
        })
}

// 手动播放/暂停切换
function playManually() {
    if (!audio.value || !currentTrack.value) {
        console.warn('播放器或曲目未准备就绪')
        return false
    }
    
    console.log('手动控制播放/暂停')
    
    try {
        if (actualPlaying.value) {
            // 暂停播放
            audio.value.pause()
            actualPlaying.value = false
            emit('play-pause', false)
            emit('update:isPlaying', false)
        } else {
            // 开始播放
            audio.value.play()
                .then(() => {
                    console.log('手动播放成功')
                    actualPlaying.value = true
                    autoplayBlocked.value = false
                    emit('play-pause', true)
                    emit('update:isPlaying', true)
                })
                .catch(error => {
                    console.error('手动播放失败:', error)
                    actualPlaying.value = false
                    
                    if (window.ui && typeof window.ui.showTextPanel === 'function') {
                        window.ui.showTextPanel('播放失败，请重试', 1500)
                    }
                })
        }
        return true
    } catch (error) {
        console.error('播放控制出错:', error)
        return false
    }
}

// 处理播放/暂停按钮点击
function handlePlayPause() {
    console.log('处理播放/暂停按钮点击')
    // 调用playManually方法来处理播放/暂停逻辑
    playManually()
}

// 其他方法
const toggleMenu = () => {
    showMenu.value = !showMenu.value
}

const selectTrack = (index) => {
    emit('select-track', index)
    showMenu.value = false
}

// 组件挂载后初始化
onMounted(() => {
    initAudio()
    // 组件挂载后立即更新播放器状态
    updatePlayer()
})

// 监听props变化
watch(() => props.isPlaying, (newVal) => {
    console.log('播放状态变化:', newVal)
    // 确保UI状态同步
    if (newVal !== actualPlaying.value) {
        if (newVal && !actualPlaying.value) {
            attemptPlay()
        } else if (!newVal && actualPlaying.value && audio.value) {
            audio.value.pause()
        }
    }
})

watch(() => [props.playlist, props.currentTrackIndex], () => {
    updatePlayer()
}, { deep: true })

// 暴露方法给父组件
defineExpose({
    updatePlayer,
    playManually,
    attemptPlay
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
    gap: 8px;
}

.play-btn {
    padding: 4px 8px;
    background-color: var(--primary-color, #3498db);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    transition: background-color 0.2s;
}

.play-btn:hover {
    background-color: var(--primary-color-hover, #2980b9);
}

.play-btn.playing {
    background-color: #e74c3c;
}

.next-btn {
    padding: 4px 8px;
    background-color: var(--secondary-color, #95a5a6);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    transition: background-color 0.2s;
}

.next-btn:hover:not(:disabled) {
    background-color: var(--secondary-color-hover, #7f8c8d);
}

.next-btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.control-btn {
    background: none;
    border: none;
    color: var(--text-sub, #999);
    font-size: 16px;
    cursor: pointer;
    transition: color 0.2s;
}

.control-btn:hover {
    color: var(--accent-green, #2ecc71);
}

.track-menu {
    display: none;
    position: absolute;
    bottom: 100%;
    right: 0;
    background: var(--bg-secondary, #2c3e50);
    border: 1px solid var(--line-thin, #34495e);
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
    color: var(--text-sub, #999);
    font-size: 12px;
}

.menu-item:hover {
    color: var(--accent-green, #2ecc71);
}
</style>