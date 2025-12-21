<template>
    <div class="sidebar">
        <router-link 
            v-for="activity in activities" 
            :key="activity.id" 
            class="sidebar-item"
            :class="{ active: activity.id === currentActivityId }" 
            :style="{
                backgroundImage: activity.preview ? `url('${activity.preview}')` : 'none'
            }" 
            :to="`/${activity.id}`"
            exact
        >
            <span class="sidebar-item-name">{{ activity.name }}</span>
        </router-link>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

defineProps({
    activities: {
        type: Array,
        required: true
    },
    currentActivityId: {
        type: String,
        default: null
    }
})

// 不再需要emit事件
// defineEmits(['select-activity'])
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
    cursor: pointer;
    transition: all 0.3s ease;
    background-size: cover;
    background-position: center;
    text-decoration: none;
    color: inherit;
}

.sidebar-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.sidebar-item.active {
    border-color: var(--accent);
    box-shadow: 0 0 8px var(--accent-glow);
}

.sidebar-item-name {
    padding: 8px 16px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 16px;
    font-size: 14px;
    font-weight: 600;
    backdrop-filter: blur(4px);
    color: var(--text-main);
}
</style>