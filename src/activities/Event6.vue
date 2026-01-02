<template>
    <div class="event6-container">
        <h2>BanG Dream! Ave Mujica - 视频播放中心</h2>

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
        title: 'BanG Dream! Ave Mujica 第1集',
        src: '/assets/1/Ave Mujica/BanG Dream! Ave Mujica 01.mp4',
        thumbnail: '/assets/1/mujica.jpg',
        description: 'BanG Dream! Ave Mujica第一集',
        duration: '24:00'
    },
    {
        title: 'BanG Dream! Ave Mujica 第2集',
        src: '/assets/1/Ave Mujica/BanG Dream! Ave Mujica 02.mp4',
        thumbnail: '/assets/1/mujica.jpg',
        description: 'BanG Dream! Ave Mujica第二集',
        duration: '24:00'
    },
    {
        title: 'BanG Dream! Ave Mujica 第3集',
        src: '/assets/1/Ave Mujica/BanG Dream! Ave Mujica 03.mp4',
        thumbnail: '/assets/1/mujica.jpg',
        description: 'BanG Dream! Ave Mujica第三集',
        duration: '24:00'
    },
    {
        title: 'BanG Dream! Ave Mujica 第4集',
        src: '/assets/1/Ave Mujica/BanG Dream! Ave Mujica 04.mp4',
        thumbnail: '/assets/1/mujica.jpg',
        description: 'BanG Dream! Ave Mujica第四集',
        duration: '24:00'
    },
    {
        title: 'BanG Dream! Ave Mujica 第5集',
        src: '/assets/1/Ave Mujica/BanG Dream! Ave Mujica 05.mp4',
        thumbnail: '/assets/1/mujica.jpg',
        description: 'BanG Dream! Ave Mujica第五集',
        duration: '24:00'
    },
    {
        title: 'BanG Dream! Ave Mujica 第6集',
        src: '/assets/1/Ave Mujica/BanG Dream! Ave Mujica 06.mp4',
        thumbnail: '/assets/1/mujica.jpg',
        description: 'BanG Dream! Ave Mujica第六集',
        duration: '24:00'
    },
    {
        title: 'BanG Dream! Ave Mujica 第7集',
        src: '/assets/1/Ave Mujica/BanG Dream! Ave Mujica 07.mp4',
        thumbnail: '/assets/1/mujica.jpg',
        description: 'BanG Dream! Ave Mujica第七集',
        duration: '24:00'
    },
    {
        title: 'BanG Dream! Ave Mujica 第8集',
        src: '/assets/1/Ave Mujica/BanG Dream! Ave Mujica 08.mp4',
        thumbnail: '/assets/1/mujica.jpg',
        description: 'BanG Dream! Ave Mujica第八集',
        duration: '24:00'
    },
    {
        title: 'BanG Dream! Ave Mujica 第9集',
        src: '/assets/1/Ave Mujica/BanG Dream! Ave Mujica 09.mp4',
        thumbnail: '/assets/1/mujica.jpg',
        description: 'BanG Dream! Ave Mujica第九集',
        duration: '24:00'
    },
    {
        title: 'BanG Dream! Ave Mujica 第10集',
        src: '/assets/1/Ave Mujica/BanG Dream! Ave Mujica 10.mp4',
        thumbnail: '/assets/1/mujica.jpg',
        description: 'BanG Dream! Ave Mujica第十集',
        duration: '24:00'
    },
    {
        title: 'BanG Dream! Ave Mujica 第11集',
        src: '/assets/1/Ave Mujica/BanG Dream! Ave Mujica 11.mp4',
        thumbnail: '/assets/1/mujica.jpg',
        description: 'BanG Dream! Ave Mujica第十一集',
        duration: '24:00'
    },
    {
        title: 'BanG Dream! Ave Mujica 第12集',
        src: '/assets/1/Ave Mujica/BanG Dream! Ave Mujica 12.mp4',
        thumbnail: '/assets/1/mujica.jpg',
        description: 'BanG Dream! Ave Mujica第十二集',
        duration: '24:00'
    },
    {
        title: 'BanG Dream! Ave Mujica 第13集',
        src: '/assets/1/Ave Mujica/BanG Dream! Ave Mujica 13.mp4',
        thumbnail: '/assets/1/mujica.jpg',
        description: 'BanG Dream! Ave Mujica第十三集',
        duration: '24:00'
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
    ui.showTextPanel('欢迎来到BanG Dream! Ave Mujica视频播放中心！选择视频开始观看精彩内容。', 5000)
})

// 清理活动
onUnmounted(() => {
    if (videoPlayer.value) {
        videoPlayer.value.pause()
    }
})
</script>

<style scoped>
.event6-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    color: #fff;
    font-family: 'Arial', sans-serif;
}

.event6-container h2 {
    text-align: center;
    margin-bottom: 30px;
    color: #ff6b6b;
    font-size: 2.5em;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

/* 视频播放器区域 */
.video-player-section {
    margin-bottom: 30px;
}

.video-wrapper {
    position: relative;
    width: 100%;
    max-width: 800px;
    margin: 0 auto 20px;
    border-radius: 10px;
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
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: opacity 0.3s ease;
}

.video-overlay:hover {
    background: rgba(0, 0, 0, 0.3);
}

.play-button {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.play-button:hover {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 1);
}

.play-button span {
    font-size: 24px;
    color: #333;
    margin-left: 3px;
}

.video-info {
    text-align: center;
    margin-bottom: 20px;
}

.video-info h3 {
    margin: 0 0 10px 0;
    color: #4ecdc4;
    font-size: 1.5em;
}

.video-stats {
    display: flex;
    justify-content: center;
    gap: 20px;
    font-size: 0.9em;
    color: #ccc;
}

/* 播放列表 */
.video-playlist {
    margin-bottom: 30px;
}

.video-playlist h3 {
    text-align: center;
    margin-bottom: 20px;
    color: #ffe66d;
    font-size: 1.8em;
}

.playlist {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    max-height: 600px;
    overflow-y: auto;
    padding: 10px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
}

.playlist-item {
    display: flex;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;
}

.playlist-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    background: rgba(255, 255, 255, 0.15);
}

.playlist-item.active {
    border-color: #ff6b6b;
    background: rgba(255, 107, 107, 0.2);
}

.video-thumbnail {
    position: relative;
    width: 120px;
    height: 80px;
    flex-shrink: 0;
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
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.playlist-item:hover .play-overlay {
    opacity: 1;
}

.play-overlay span {
    font-size: 18px;
    color: white;
}

.video-details {
    padding: 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.video-details h4 {
    margin: 0 0 5px 0;
    font-size: 1em;
    color: #fff;
}

.video-details p {
    margin: 0 0 5px 0;
    font-size: 0.8em;
    color: #ccc;
    line-height: 1.3;
}

.duration {
    font-size: 0.7em;
    color: #999;
    align-self: flex-end;
}

/* 播放控制 */
.playback-controls {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 30px;
}

.control-btn {
    padding: 12px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-size: 1em;
    font-weight: bold;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.control-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.control-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.play-pause-btn {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    padding: 15px 30px;
    font-size: 1.1em;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .event6-container {
        padding: 15px;
    }

    .event6-container h2 {
        font-size: 2em;
    }

    .video-wrapper {
        max-width: 100%;
    }

    .playlist {
        grid-template-columns: 1fr;
        max-height: 400px;
    }

    .video-thumbnail {
        width: 100px;
        height: 70px;
    }

    .playback-controls {
        flex-direction: column;
        align-items: center;
    }

    .control-btn {
        width: 200px;
    }
}

@media (max-width: 480px) {
    .event6-container h2 {
        font-size: 1.5em;
    }

    .video-stats {
        flex-direction: column;
        gap: 10px;
    }

    .playlist-item {
        flex-direction: column;
    }

    .video-thumbnail {
        width: 100%;
        height: 120px;
    }

    .video-details {
        padding: 8px;
    }
}
</style>