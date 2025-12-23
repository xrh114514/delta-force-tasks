<template>
    <div class="event3-container">
        <h2>特别活动 - 视频播放中心</h2>

        <!-- 视频播放器 -->
        <div class="video-player-section">
            <div class="video-wrapper">
                <video
                    ref="videoPlayer"
                    :src="currentVideo"
                    controls
                    class="main-video"
                    @play="onVideoPlay"
                    @pause="onVideoPause"
                    @ended="onVideoEnded"
                    @timeupdate="onTimeUpdate"
                    @loadedmetadata="onVideoLoaded"
                ></video>

                <!-- 视频控制覆盖层 -->
                <div class="video-overlay" v-if="!isPlaying && !showControls">
                    <div class="play-button" @click="playVideo">
                        <span>▶</span>
                    </div>
                </div>
            </div>

            <!-- 视频信息 -->
            <div class="video-info">
                <h3>{{ currentVideoTitle }}</h3>
                <div class="video-stats">
                    <span>时长: {{ formatTime(videoDuration) }}</span>
                    <span>已播放: {{ formatTime(currentTime) }}</span>
                    <span>状态: {{ playStatus }}</span>
                </div>
            </div>
        </div>

        <!-- 视频播放列表 -->
        <div class="video-playlist">
            <h3>视频列表</h3>
            <div class="playlist">
                <div
                    v-for="(video, index) in videoList"
                    :key="index"
                    class="playlist-item"
                    :class="{ active: currentVideoIndex === index }"
                    @click="selectVideo(index)"
                >
                    <div class="video-thumbnail">
                        <img :src="video.thumbnail" :alt="video.title" />
                        <div class="play-overlay">
                            <span>▶</span>
                        </div>
                    </div>
                    <div class="video-details">
                        <h4>{{ video.title }}</h4>
                        <p>{{ video.description }}</p>
                        <span class="duration">{{ video.duration }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 播放控制 -->
        <div class="playback-controls">
            <button @click="previousVideo" class="control-btn" :disabled="currentVideoIndex === 0">
                ⏮ 上一集
            </button>
            <button @click="togglePlayPause" class="control-btn play-pause-btn">
                {{ isPlaying ? '⏸ 暂停' : '▶ 播放' }}
            </button>
            <button @click="nextVideo" class="control-btn" :disabled="currentVideoIndex === videoList.length - 1">
                下一集 ⏭
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useUI } from '../composables/useUI'

const ui = useUI()

// 视频播放器引用
const videoPlayer = ref(null)

// 视频数据
const videoList = ref([
    {
        title: '特别活动宣传片',
        src: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        thumbnail: 'https://picsum.photos/200/150?random=201',
        description: '精彩的活动宣传视频，展示活动亮点',
        duration: '00:10'
    },
    {
        title: '游戏玩法介绍',
        src: 'https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4',
        thumbnail: 'https://picsum.photos/200/150?random=202',
        description: '详细介绍游戏玩法和技巧',
        duration: '00:08'
    },
    {
        title: '奖励系统说明',
        src: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
        thumbnail: 'https://picsum.photos/200/150?random=203',
        description: '了解各种奖励和成就系统',
        duration: '00:12'
    }
])

// 播放状态
const currentVideoIndex = ref(0)
const currentVideo = ref(videoList.value[0].src)
const currentVideoTitle = ref(videoList.value[0].title)
const isPlaying = ref(false)
const showControls = ref(false)
const currentTime = ref(0)
const videoDuration = ref(0)
const playStatus = ref('未播放')

// 计算属性
const currentVideoData = computed(() => videoList.value[currentVideoIndex.value])

// 播放控制方法
const playVideo = () => {
    if (videoPlayer.value) {
        videoPlayer.value.play()
    }
}

const pauseVideo = () => {
    if (videoPlayer.value) {
        videoPlayer.value.pause()
    }
}

const togglePlayPause = () => {
    if (isPlaying.value) {
        pauseVideo()
    } else {
        playVideo()
    }
}

const selectVideo = (index) => {
    currentVideoIndex.value = index
    currentVideo.value = videoList.value[index].src
    currentVideoTitle.value = videoList.value[index].title
    playStatus.value = '加载中...'
}

const previousVideo = () => {
    if (currentVideoIndex.value > 0) {
        selectVideo(currentVideoIndex.value - 1)
    }
}

const nextVideo = () => {
    if (currentVideoIndex.value < videoList.value.length - 1) {
        selectVideo(currentVideoIndex.value + 1)
    }
}

// 事件处理
const onVideoPlay = () => {
    isPlaying.value = true
    playStatus.value = '播放中'
    ui.showTextPanel(`正在播放: ${currentVideoTitle.value}`, 3000)
}

const onVideoPause = () => {
    isPlaying.value = false
    playStatus.value = '已暂停'
}

const onVideoEnded = () => {
    isPlaying.value = false
    playStatus.value = '播放完毕'
    // 自动播放下一集
    if (currentVideoIndex.value < videoList.value.length - 1) {
        setTimeout(() => {
            nextVideo()
        }, 2000)
    }
}

const onTimeUpdate = () => {
    if (videoPlayer.value) {
        currentTime.value = videoPlayer.value.currentTime
    }
}

const onVideoLoaded = () => {
    if (videoPlayer.value) {
        videoDuration.value = videoPlayer.value.duration
        playStatus.value = '就绪'
    }
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
    ui.showTextPanel('欢迎来到视频播放中心！选择视频开始观看精彩内容。', 5000)
})

// 清理活动
onUnmounted(() => {
    if (videoPlayer.value) {
        videoPlayer.value.pause()
    }
})
</script>

<style scoped>
.event3-container {
    padding: 20px;
    color: white;
    max-width: 1000px;
    margin: 0 auto;
}

.event3-container h2 {
    color: #00d4aa;
    margin-bottom: 30px;
    text-align: center;
}

.video-player-section {
    margin-bottom: 40px;
}

.video-wrapper {
    position: relative;
    width: 100%;
    max-width: 800px;
    margin: 0 auto 20px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.main-video {
    width: 100%;
    height: auto;
    display: block;
    background: #000;
}

.video-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: opacity 0.3s ease;
}

.video-overlay:hover {
    background: rgba(0, 0, 0, 0.2);
}

.play-button {
    width: 80px;
    height: 80px;
    background: rgba(0, 212, 170, 0.9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: white;
    transition: all 0.3s ease;
}

.play-button:hover {
    background: rgba(0, 212, 170, 1);
    transform: scale(1.1);
}

.video-info {
    text-align: center;
}

.video-info h3 {
    color: #e5e5e5;
    margin-bottom: 10px;
    font-size: 20px;
}

.video-stats {
    display: flex;
    justify-content: center;
    gap: 20px;
    color: #888;
    font-size: 14px;
}

.video-playlist h3 {
    color: #e5e5e5;
    margin-bottom: 20px;
    font-size: 18px;
}

.playlist {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.playlist-item {
    background: rgba(26, 26, 26, 0.6);
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;
}

.playlist-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.playlist-item.active {
    border-color: #00d4aa;
    background: rgba(0, 212, 170, 0.1);
}

.video-thumbnail {
    position: relative;
    width: 100%;
    height: 150px;
    overflow: hidden;
}

.video-thumbnail img {
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
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.playlist-item:hover .play-overlay {
    opacity: 1;
}

.video-details {
    padding: 15px;
}

.video-details h4 {
    color: #e5e5e5;
    margin: 0 0 8px 0;
    font-size: 16px;
}

.video-details p {
    color: #888;
    margin: 0 0 8px 0;
    font-size: 14px;
    line-height: 1.4;
}

.duration {
    color: #00d4aa;
    font-size: 12px;
    font-weight: bold;
}

.playback-controls {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 30px;
}

.control-btn {
    padding: 12px 24px;
    background: rgba(26, 26, 26, 0.8);
    border: 2px solid #00d4aa;
    color: #00d4aa;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.control-btn:hover:not(:disabled) {
    background: #00d4aa;
    color: white;
    transform: translateY(-2px);
}

.control-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

.play-pause-btn {
    background: #00d4aa;
    color: white;
}

.play-pause-btn:hover:not(:disabled) {
    background: #00b894;
}

@media (max-width: 768px) {
    .playlist {
        grid-template-columns: 1fr;
    }

    .playback-controls {
        flex-direction: column;
        align-items: center;
    }

    .control-btn {
        width: 200px;
    }
}
</style>