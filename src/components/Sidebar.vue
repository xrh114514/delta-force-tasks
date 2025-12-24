<template>
    <div class="sidebar" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd"
         @mousedown="handleMouseDown" @mousemove="handleMouseMove" @mouseup="handleMouseUp">
        <div v-for="activity in activities" :key="activity.id" class="sidebar-item"
            :class="{ active: activity.id === currentActivityId }" :style="{
                backgroundImage: activity.preview ? `url('${activity.preview}')` : 'none'
            }" @click="handleSidebarClick(activity.id)">
            <span class="sidebar-item-name">{{ activity.name }}</span>
        </div>

        <!-- 滑动提示 -->
        <div class="swipe-hint" v-if="showSwipeHint">
            <span>👆 滑动切换活动</span>
        </div>

        <!-- 调试信息 -->
        <div class="debug-info" v-if="showDebug">
            <small>触摸: {{ touchCount }} | 鼠标: {{ mouseCount }}</small>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const props = defineProps({
    activities: {
        type: Array,
        required: true
    },
    currentActivityId: {
        type: String,
        default: null
    }
})

const emit = defineEmits(['select-activity'])

// 触摸滑动相关状态
const touchStartX = ref(0)
const touchStartY = ref(0)
const touchEndX = ref(0)
const touchEndY = ref(0)
const minSwipeDistance = 50 // 最小滑动距离
const showSwipeHint = ref(true) // 初始显示滑动提示
const showDebug = ref(false) // 调试信息显示
const touchCount = ref(0)
const mouseCount = ref(0)

// 几秒后隐藏滑动提示
setTimeout(() => {
    showSwipeHint.value = false
}, 5000)

// 按住D键显示调试信息
document.addEventListener('keydown', (e) => {
    if (e.key === 'd' || e.key === 'D') {
        showDebug.value = !showDebug.value
    }
})

const handleTouchStart = (e) => {
    touchCount.value++
    touchStartX.value = e.touches[0].clientX
    touchStartY.value = e.touches[0].clientY
}

const handleTouchMove = (e) => {
    // 防止页面滚动
    e.preventDefault()
}

const handleTouchEnd = (e) => {
    touchEndX.value = e.changedTouches[0].clientX
    touchEndY.value = e.changedTouches[0].clientY
    handleSwipe()
}

// 鼠标事件模拟触摸
let isMouseDown = false

const handleMouseDown = (e) => {
    mouseCount.value++
    isMouseDown = true
    touchStartX.value = e.clientX
    touchStartY.value = e.clientY
}

const handleMouseMove = (e) => {
    if (!isMouseDown) return
    // 可以在这里添加拖拽视觉反馈
}

const handleMouseUp = (e) => {
    if (!isMouseDown) return
    isMouseDown = false
    touchEndX.value = e.clientX
    touchEndY.value = e.clientY
    handleSwipe()
}

const handleSwipe = () => {
    const deltaX = touchEndX.value - touchStartX.value
    const deltaY = touchEndY.value - touchStartY.value

    // 判断是否为水平滑动（水平移动距离大于垂直移动距离）
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
            // 向右滑动 - 切换到上一个活动
            switchToPreviousActivity()
        } else {
            // 向左滑动 - 切换到下一个活动
            switchToNextActivity()
        }
    }
}

const switchToPreviousActivity = () => {
    const currentIndex = props.activities.findIndex(activity => activity.id === props.currentActivityId)
    if (currentIndex > 0) {
        const previousActivity = props.activities[currentIndex - 1]
        emit('select-activity', previousActivity.id)
    }
}

const switchToNextActivity = () => {
    const currentIndex = props.activities.findIndex(activity => activity.id === props.currentActivityId)
    if (currentIndex < props.activities.length - 1) {
        const nextActivity = props.activities[currentIndex + 1]
        emit('select-activity', nextActivity.id)
    }
}

const handleSidebarClick = (id) => {
  router.push({ name: 'Event', params: { id } })
}
</script>

<style scoped>
/* 保持原有的侧边栏样式 */
.sidebar {
    width: var(--sidebar-width);
    height: 100%;
    overflow-y: auto;
    background: rgba(26, 26, 26, 0.6);
    backdrop-filter: blur(4px);
    border-right: 1px solid var(--line-thin);
    padding: 8px 0;
    scrollbar-width: none;
    touch-action: pan-y; /* 允许垂直滚动，但阻止水平滚动 */
    user-select: none; /* 防止文本选择 */
}

.sidebar::-webkit-scrollbar {
    display: none;
}

.sidebar-item {
    height: 100px;
    margin: 6px;
    border: 1px solid var(--line-thin);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-sub);
    font-size: 14px;
    background-size: cover;
    background-position: center;
    cursor: pointer;
    transition: var(--transition-fast);
    position: relative;
}

.sidebar-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
}

.sidebar-item-name {
    position: relative;
    z-index: 1;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.sidebar-item:not(.active) {
    opacity: 0.85;
}

.sidebar-item.active {
    backdrop-filter: blur(var(--blur-amt));
    border-color: var(--accent-green);
    box-shadow: 0 0 12px rgba(0, 212, 170, 0.35);
    opacity: 1;
}

.sidebar-item.active::before {
    background: rgba(0, 212, 170, 0.1);
}

/* 滑动提示样式 */
.swipe-hint {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 212, 170, 0.9);
    color: white;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 12px;
    font-weight: 500;
    opacity: 0.8;
    animation: fade-in-out 3s ease-in-out infinite;
}

@keyframes fade-in-out {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 0.3; }
}

/* 调试信息样式 */
.debug-info {
    position: absolute;
    bottom: 5px;
    left: 5px;
    background: rgba(255, 0, 0, 0.8);
    color: white;
    padding: 2px 5px;
    border-radius: 3px;
    font-size: 10px;
    z-index: 100;
}
</style>