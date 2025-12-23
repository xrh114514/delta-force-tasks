<template>
    <div class="event4-container">
        <h2>测试活动 - 音频播放中心</h2>

        <!-- 当前播放信息 -->
        <div class="current-track-section">
            <div class="track-display">
                <div class="album-art">
                    <img :src="currentTrack?.cover || 'https://via.placeholder.com/200x200/00d4aa/ffffff?text=Music'"
                         :alt="currentTrack?.title || '未知歌曲'" />
                    <div class="play-overlay" v-if="!isPlaying" @click="playCurrentTrack">
                        <span>▶</span>
                    </div>
                </div>
                <div class="track-info">
                    <h3>{{ currentTrack?.title || '未选择歌曲' }}</h3>
                    <div class="track-controls">
                        <button @click="previousTrack" class="control-btn">⏮</button>
                        <button @click="togglePlayPause" class="control-btn play-btn">
                            {{ isPlaying ? '⏸' : '▶' }}
                        </button>
                        <button @click="nextTrack" class="control-btn">⏭</button>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
                    </div>
                    <div class="time-display">
                        <span>{{ formatTime(currentTime) }}</span>
                        <span>{{ formatTime(duration) }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 播放列表 -->
        <div class="playlist-section">
            <h3>播放列表 ({{ audioTracks.length }} 首歌曲)</h3>
            <div class="track-list">
                <div
                    v-for="(track, index) in audioTracks"
                    :key="index"
                    class="track-item"
                    :class="{ active: currentTrackIndex === index, playing: isPlaying && currentTrackIndex === index }"
                    @click="selectTrack(index)"
                >
                    <div class="track-number">{{ index + 1 }}</div>
                    <div class="track-cover">
                        <img :src="track.cover" :alt="track.title" />
                    </div>
                    <div class="track-details">
                        <div class="track-title">{{ track.title }}</div>
                        <div class="track-duration">{{ track.duration }}</div>
                    </div>
                    <div class="track-actions">
                        <button @click.stop="toggleTrackPlay(index)" class="mini-play-btn">
                            {{ isPlaying && currentTrackIndex === index ? '⏸' : '▶' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 音频控制面板 -->
        <div class="audio-controls-panel">
            <h3>播放设置</h3>
            <div class="control-row">
                <label>
                    <input type="checkbox" v-model="autoPlay" />
                    自动播放下一首
                </label>
            </div>
            <div class="control-row">
                <label>
                    <input type="checkbox" v-model="loopMode" />
                    单曲循环
                </label>
            </div>
            <div class="control-row">
                <label>
                    音量:
                    <input type="range" v-model="volume" min="0" max="1" step="0.1" @input="setVolume" />
                    {{ Math.round(volume * 100) }}%
                </label>
            </div>
        </div>

        <!-- 播放统计 -->
        <div class="stats-section">
            <div class="stat-item">
                <span class="stat-label">播放次数</span>
                <span class="stat-value">{{ playCount }}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">总时长</span>
                <span class="stat-value">{{ formatTime(totalDuration) }}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">播放状态</span>
                <span class="stat-value">{{ playStatus }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUI } from '../composables/useUI'

const ui = useUI()

// 音频数据
const audioTracks = ref([
    {
        title: '背景音乐 1',
        audio: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
        cover: 'https://picsum.photos/200/200?random=301',
        duration: '00:39'
    },
    {
        title: '背景音乐 2',
        audio: 'https://sample-videos.com/zip/10/mp3/SampleAudio_0.4mb.mp3',
        cover: 'https://picsum.photos/200/200?random=302',
        duration: '00:28'
    },
    {
        title: '背景音乐 3',
        audio: 'https://sample-videos.com/zip/10/mp3/SampleAudio_0.5mb.mp3',
        cover: 'https://picsum.photos/200/200?random=303',
        duration: '00:35'
    },
    {
        title: '背景音乐 4',
        audio: 'https://sample-videos.com/zip/10/mp3/SampleAudio_0.7mb.mp3',
        cover: 'https://picsum.photos/200/200?random=304',
        duration: '00:42'
    }
])

// 播放状态
const currentTrackIndex = ref(0)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.7)
const autoPlay = ref(true)
const loopMode = ref(false)
const playCount = ref(0)
const playStatus = ref('未播放')

// 计算属性
const currentTrack = computed(() => audioTracks.value[currentTrackIndex.value])
const progressPercent = computed(() => {
    return duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
})
const totalDuration = computed(() => {
    return audioTracks.value.reduce((total, track) => {
        const [min, sec] = track.duration.split(':').map(Number)
        return total + min * 60 + sec
    }, 0)
})

// 音频控制方法
const playCurrentTrack = () => {
    // 这里会通过父组件的音乐播放器控制
    ui.showTextPanel(`播放: ${currentTrack.value.title}`, 2000)
    playCount.value++
    playStatus.value = '播放中'
}

const pauseCurrentTrack = () => {
    playStatus.value = '已暂停'
}

const togglePlayPause = () => {
    if (isPlaying.value) {
        pauseCurrentTrack()
    } else {
        playCurrentTrack()
    }
    isPlaying.value = !isPlaying.value
}

const selectTrack = (index) => {
    currentTrackIndex.value = index
    playStatus.value = '就绪'
    if (autoPlay.value) {
        setTimeout(() => {
            playCurrentTrack()
        }, 500)
    }
}

const previousTrack = () => {
    if (currentTrackIndex.value > 0) {
        selectTrack(currentTrackIndex.value - 1)
    } else if (loopMode.value) {
        selectTrack(audioTracks.value.length - 1)
    }
}

const nextTrack = () => {
    if (currentTrackIndex.value < audioTracks.value.length - 1) {
        selectTrack(currentTrackIndex.value + 1)
    } else if (loopMode.value) {
        selectTrack(0)
    } else if (autoPlay.value) {
        playStatus.value = '播放完毕'
    }
}

const toggleTrackPlay = (index) => {
    if (currentTrackIndex.value === index) {
        togglePlayPause()
    } else {
        selectTrack(index)
    }
}

const setVolume = () => {
    ui.showTextPanel(`音量设置为: ${Math.round(volume.value * 100)}%`, 1500)
}

// 工具函数
const formatTime = (seconds) => {
    if (!seconds || !isFinite(seconds)) return '00:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 初始化活动
onMounted(() => {
    ui.showTextPanel('欢迎来到音频播放中心！享受美妙的音乐时光。', 5000)
})

// 清理活动
onUnmounted(() => {
    // 清理音频相关状态
})
</script>

<style scoped>
.event4-container {
    padding: 20px;
    color: white;
    max-width: 1000px;
    margin: 0 auto;
}

.event4-container h2 {
    color: #00d4aa;
    margin-bottom: 30px;
    text-align: center;
}

.current-track-section {
    margin-bottom: 40px;
}

.track-display {
    display: flex;
    gap: 30px;
    align-items: center;
    background: rgba(26, 26, 26, 0.6);
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.album-art {
    position: relative;
    width: 200px;
    height: 200px;
    border-radius: 12px;
    overflow: hidden;
    flex-shrink: 0;
    cursor: pointer;
}

.album-art img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.play-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    color: #00d4aa;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.album-art:hover .play-overlay {
    opacity: 1;
}

.track-info {
    flex: 1;
}

.track-info h3 {
    color: #e5e5e5;
    margin: 0 0 20px 0;
    font-size: 24px;
}

.track-controls {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
}

.control-btn {
    width: 50px;
    height: 50px;
    background: rgba(0, 212, 170, 0.9);
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.control-btn:hover {
    background: #00d4aa;
    transform: scale(1.1);
}

.play-btn {
    width: 60px;
    height: 60px;
    font-size: 24px;
}

.progress-bar {
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 10px;
}

.progress-fill {
    height: 100%;
    background: #00d4aa;
    border-radius: 3px;
    transition: width 0.3s ease;
}

.time-display {
    display: flex;
    justify-content: space-between;
    color: #888;
    font-size: 14px;
}

.playlist-section h3 {
    color: #e5e5e5;
    margin-bottom: 20px;
    font-size: 18px;
}

.track-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 30px;
}

.track-item {
    display: flex;
    align-items: center;
    padding: 15px;
    background: rgba(26, 26, 26, 0.4);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;
}

.track-item:hover {
    background: rgba(26, 26, 26, 0.6);
    transform: translateX(5px);
}

.track-item.active {
    border-color: #00d4aa;
    background: rgba(0, 212, 170, 0.1);
}

.track-item.playing {
    border-color: #ff8800;
    background: rgba(255, 136, 0, 0.1);
}

.track-number {
    width: 30px;
    text-align: center;
    color: #888;
    font-weight: bold;
}

.track-cover {
    width: 50px;
    height: 50px;
    border-radius: 6px;
    overflow: hidden;
    margin-right: 15px;
}

.track-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.track-details {
    flex: 1;
}

.track-title {
    color: #e5e5e5;
    font-weight: 500;
    margin-bottom: 4px;
}

.track-duration {
    color: #888;
    font-size: 14px;
}

.track-actions {
    margin-left: 15px;
}

.mini-play-btn {
    width: 35px;
    height: 35px;
    background: rgba(0, 212, 170, 0.8);
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.mini-play-btn:hover {
    background: #00d4aa;
    transform: scale(1.1);
}

.audio-controls-panel {
    background: rgba(26, 26, 26, 0.6);
    padding: 25px;
    border-radius: 12px;
    margin-bottom: 30px;
}

.audio-controls-panel h3 {
    color: #e5e5e5;
    margin-bottom: 20px;
    font-size: 18px;
}

.control-row {
    margin-bottom: 15px;
}

.control-row label {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #e5e5e5;
    cursor: pointer;
}

.control-row input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: #00d4aa;
}

.control-row input[type="range"] {
    flex: 1;
    max-width: 200px;
    height: 6px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    outline: none;
    -webkit-appearance: none;
}

.control-row input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    background: #00d4aa;
    border-radius: 50%;
    cursor: pointer;
}

.stats-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
    margin-top: 30px;
}

.stat-item {
    text-align: center;
    padding: 20px;
    background: rgba(26, 26, 26, 0.6);
    border-radius: 8px;
}

.stat-label {
    display: block;
    color: #888;
    font-size: 14px;
    margin-bottom: 8px;
}

.stat-value {
    display: block;
    color: #00d4aa;
    font-size: 24px;
    font-weight: bold;
}

@media (max-width: 768px) {
    .track-display {
        flex-direction: column;
        text-align: center;
        gap: 20px;
    }

    .album-art {
        width: 150px;
        height: 150px;
    }

    .track-controls {
        justify-content: center;
    }

    .stats-section {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>