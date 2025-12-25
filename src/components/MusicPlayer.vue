<template>
    <div class="music-player">
        <div class="player-disc">
            <div class="disc-cover" :class="{ playing: isPlaying }" :style="{
                backgroundImage: currentTrack?.cover ? `url('${currentTrack.cover}')` : 'none'
            }"></div>
            <el-button 
                class="play-pause-btn" 
                @click="$emit('play-pause')"
                circle
                type="primary"
                plain
                size="small"
            >
                {{ isPlaying ? '❚❚' : '▶' }}
            </el-button>
        </div>

        <div class="player-content">
            <div class="track-info">
                {{ currentTrack?.title || '加载中...' }}
            </div>
            
            <!-- 进度条 - 使用Element Plus Slider -->
            <div class="progress-container">
                <span class="time-current">{{ formatTime(currentTime) }}</span>
                <el-slider
                    v-model="progressBar"
                    :min="0"
                    :max="duration"
                    :step="0.1"
                    @change="seekProgress"
                    class="progress-bar"
                    style="--el-slider-runway-background-color: rgba(255, 255, 255, 0.1);"
                >
                    <template #button>
                        <div class="slider-button">
                            <div class="slider-button-inner"></div>
                        </div>
                    </template>
                </el-slider>
                <span class="time-total">{{ formatTime(duration) }}</span>
            </div>
        </div>

        <div class="player-controls">
            <!-- 上一曲按钮 -->
            <el-button 
                class="control-btn" 
                @click="$emit('prev-track')"
                circle
                size="small"
            >
                ⏮
            </el-button>
            
            <!-- 音量控制 - 使用Element Plus Slider -->
            <div class="volume-control">
                <el-button 
                    class="volume-icon" 
                    @click="toggleMute"
                    circle
                    size="small"
                    plain
                >
                    {{ isMuted ? '🔇' : volume > 70 ? '🔊' : volume > 30 ? '🔉' : '🔈' }}
                </el-button>
                <div class="volume-slider-container">
                    <el-slider
                        v-model="volume"
                        :min="0"
                        :max="100"
                        :step="1"
                        @input="updateVolume"
                        @change="updateVolume"
                        class="volume-slider"
                        style="--el-slider-runway-background-color: rgba(255, 255, 255, 0.1);"
                    />
                </div>
            </div>
            
            <el-button 
                class="control-btn" 
                @click="$emit('next-track')"
                circle
                size="small"
            >
                ⏭
            </el-button>
            
            <!-- 菜单 - 使用Element Plus Dropdown -->
            <el-dropdown @command="selectTrack">
                <el-button 
                    class="menu-btn" 
                    circle
                    size="small"
                >
                    ⋮
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item 
                            v-for="(track, index) in playlist" 
                            :key="index"
                            :command="index"
                        >
                            {{ track.title }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>

        <audio ref="audioElement" v-show="false" @timeupdate="updateProgress" @loadedmetadata="updateDuration"></audio>
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

const emit = defineEmits(['play-pause', 'next-track', 'prev-track', 'select-track'])

const showMenu = ref(false)
const audioElement = ref(null)

// 状态变量
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(70)
const isMuted = ref(false)
const lastVolume = ref(70)
const progressBar = ref(0) // 使用单一状态变量控制进度条

const currentTrack = computed(() => {
    return props.playlist[props.currentTrackIndex] || null
})

const selectTrack = (index) => {
    emit('select-track', index)
}

// 更新播放进度
const updateProgress = () => {
    if (audioElement.value) {
        currentTime.value = audioElement.value.currentTime
        progressBar.value = currentTime.value
    }
}

// 更新总时长
const updateDuration = () => {
    if (audioElement.value) {
        duration.value = audioElement.value.duration || 0
        progressBar.value = 0 // 重置进度条
    }
}

// 格式化时间为分:秒
const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === 0) return '0:00'
    
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

// 切换静音状态
const toggleMute = () => {
    if (audioElement.value) {
        if (isMuted.value) {
            // 取消静音，恢复之前的音量
            volume.value = lastVolume.value
            audioElement.value.volume = lastVolume.value / 100
        } else {
            // 静音，保存当前音量
            lastVolume.value = volume.value
            volume.value = 0
            audioElement.value.volume = 0
        }
        isMuted.value = !isMuted.value
    }
}

// 更新音量
const updateVolume = () => {
    if (audioElement.value) {
        audioElement.value.volume = volume.value / 100
        isMuted.value = volume.value === 0
    }
}

// 点击进度条定位播放位置
const seekProgress = () => {
    if (audioElement.value && duration.value > 0) {
        const newTime = progressBar.value
        currentTime.value = newTime
        audioElement.value.currentTime = newTime
    }
}

const currentState = reactive({})

const play = function () {
    if (audioElement.value) {
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
                        emit('play-pause') // 播放成功后重置isPlaying为true
                    }).catch(() => {
                        ElMessage.error('播放失败，请检查音频文件')
                    })
                }
            }, { once: true })
        })
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
                // 确保音量设置正确
                updateVolume()
                if (newState.isPlaying) {
                    play()
                }
            }
            else nextTick(() => {
                if (audioElement.value) {
                    audioElement.value.src = newState.url
                    // 确保音量设置正确
                    updateVolume()
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
    width: 380px;
    height: auto;
    min-height: 100px;
    padding: 10px 15px;
    background: rgba(26, 26, 26, 0.6);
    backdrop-filter: blur(4px);
    border: 1px solid var(--line-thin);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 10;
    gap: 10px;
    box-sizing: border-box;
    overflow: visible;
}

@media (max-width: 768px) {
    .music-player {
        width: 320px;
        right: 15px;
        bottom: 15px;
        gap: 8px;
    }
}

@media (max-width: 480px) {
    .music-player {
        width: calc(100% - 20px);
        left: 10px;
        right: 10px;
        bottom: 10px;
        padding: 8px;
        gap: 6px;
        flex-wrap: wrap;
        height: auto;
        min-height: 120px;
    }
    
    .player-disc {
        width: 50px;
        height: 50px;
    }
    
    .player-content {
        flex: 1;
        min-width: 0;
    }
    
    .player-controls {
        width: 100%;
        justify-content: center;
        margin-top: 5px;
    }
}

.player-disc {
    position: relative;
    width: 60px;
    height: 60px;
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
    position: absolute !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    width: 35px !important;
    height: 35px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    z-index: 1 !important;
}

.player-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
}

.track-info {
    font-size: 13px;
    color: var(--text-sub);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.2;
}

/* 进度条样式 */
.progress-container {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: var(--text-sub);
    width: 100%;
}

.time-current, .time-total {
    min-width: 30px;
    text-align: center;
    font-family: monospace;
    flex-shrink: 0;
}

.progress-bar {
    flex: 1;
    min-width: 80px;
}

/* Element Plus Slider 自定义样式 */
:deep(.el-slider__runway) {
    height: 4px;
    border-radius: 2px;
}

:deep(.el-slider__bar) {
    height: 4px;
    background-color: var(--accent-green);
    border-radius: 2px;
}

:deep(.el-slider:hover .el-slider__runway) {
    height: 6px;
}

:deep(.el-slider:hover .el-slider__bar) {
    height: 6px;
}

:deep(.el-slider__button) {
    width: 12px !important;
    height: 12px !important;
    border-color: var(--accent-green) !important;
    background-color: var(--accent-green) !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

:deep(.el-slider__button:hover) {
    transform: scale(1.2);
    border-color: #4ade80 !important;
    background-color: #4ade80 !important;
}

.player-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
    flex-shrink: 0;
}

.control-btn, .volume-icon, .menu-btn {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    z-index: 1 !important;
}

/* 音量控制样式 */
.volume-control {
    position: relative;
    display: flex;
    align-items: center;
    gap: 5px;
}

.volume-slider-container {
    position: relative;
    display: flex;
    align-items: center;
}

.volume-slider {
    width: 60px;
    transition: width 0.2s;
    min-width: 40px;
}

.volume-control:hover .volume-slider {
    width: 80px;
}

/* 确保Element Plus下拉菜单可以正常显示 */
:deep(.el-dropdown-menu) {
    background-color: var(--bg-secondary);
    border: 1px solid var(--line-thin);
    padding: 5px 0;
    max-height: 200px;
    overflow-y: auto;
    min-width: 180px;
}

:deep(.el-dropdown-item) {
    color: var(--text-sub);
    font-size: 12px;
    padding: 6px 16px;
    transition: background-color 0.2s, color 0.2s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
}

:deep(.el-dropdown-item:hover) {
    color: var(--accent-green);
    background-color: rgba(255, 255, 255, 0.05);
}

/* 滚动条样式 */
:deep(.el-dropdown-menu::-webkit-scrollbar) {
    width: 4px;
}

:deep(.el-dropdown-menu::-webkit-scrollbar-track) {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 2px;
}

:deep(.el-dropdown-menu::-webkit-scrollbar-thumb) {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
}

:deep(.el-dropdown-menu::-webkit-scrollbar-thumb:hover) {
    background: rgba(255, 255, 255, 0.3);
}

/* 确保所有可点击元素都有足够的点击区域 */
:deep(.el-button),
:deep(.el-slider),
:deep(.el-dropdown) {
    cursor: pointer;
    user-select: none;
}

/* 确保移动端下按钮不会太小 */
@media (max-width: 480px) {
    :deep(.el-button--small) {
        padding: 4px !important;
        min-width: 32px !important;
    }
    
    .volume-slider {
        width: 50px;
    }
    
    .volume-control:hover .volume-slider {
        width: 70px;
    }
}
</style>