<template>
    <button class="claim-btn" :class="{ claimed }" :style="buttonStyle" @click="handleClick">
        {{ claimed ? '已领取' : text }}
    </button>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
    buttonId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        default: '领取奖励'
    },
    claimed: {
        type: Boolean,
        default: false
    },
    onClick: {
        type: Function,
        default: () => { }
    }
})

const emit = defineEmits(['claim'])

// 根据buttonId计算不同的位置偏移量
const buttonStyle = computed(() => {
    // 基于buttonId的hash值计算y轴偏移，确保不同按钮位置不同
    let offset = 0
    if (props.buttonId.includes('weekly')) {
        offset = -120 // 周常奖励按钮上移120px
    } else if (props.buttonId.includes('daily')) {
        offset = 0 // 每日奖励按钮保持原位
    }
    
    return {
        transform: `translateY(${offset}px)`
    }
})

const handleClick = () => {
    if (!props.claimed) {
        emit('claim', props.buttonId)
    }
}
</script>

<style scoped>
.claim-btn {
    position: absolute;
    bottom: 100px;
    right: 350px;
    padding: 12px 30px;
    background: transparent;
    border: 2px solid var(--accent-green);
    color: var(--accent-green);
    font-size: 18px;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.3s;
    z-index: 1;
}

@media (max-width: 768px) {
    .claim-btn {
        right: 280px;
        padding: 10px 24px;
        font-size: 16px;
        bottom: 80px;
    }
}

@media (max-width: 480px) {
    .claim-btn {
        right: 220px;
        padding: 8px 20px;
        font-size: 14px;
        bottom: 60px;
    }
}

.claim-btn:hover:not(.claimed) {
    background: rgba(0, 212, 170, 0.2);
    transform: translateY(calc(var(--translate-y, 0px) - 2px));
}

.claim-btn.claimed {
    border-color: #666;
    color: #666;
    cursor: not-allowed;
}
</style>