<template>
    <div class="sidebar">
        <div v-for="activity in activities" :key="activity.id" class="sidebar-item"
            :class="{ active: activity.id === currentActivityId }" :style="{
                backgroundImage: activity.preview ? `url('${activity.preview}')` : 'none'
            }" @click="$emit('select-activity', activity.id)">
            <span class="sidebar-item-name">{{ activity.name }}</span>
        </div>
    </div>
</template>

<script setup>
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

defineEmits(['select-activity'])
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
</style>