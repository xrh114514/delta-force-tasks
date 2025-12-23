<template>
    <div class="hud-text-panel" :class="{ visible }" v-html="html"></div>
</template>

<script setup>
defineProps({
    html: {
        type: String,
        default: ''
    },
    visible: {
        type: Boolean,
        default: false
    }
})
</script>

<style scoped>
.hud-text-panel {
    position: absolute;
    bottom: 100px;
    left: 50px;
    max-width: 600px;
    padding: 20px;
    background: rgba(26, 26, 26, 0.7);
    backdrop-filter: blur(8px);
    border: 1px solid var(--accent-green);
    border-radius: 4px;
    color: var(--text-sub);
    font-size: 16px;
    opacity: 0;
    transition: opacity 0.8s;
}

@media (max-width: 768px) {
    .hud-text-panel {
        left: 25px;
        max-width: 70vw;
        padding: 15px;
        font-size: 14px;
        bottom: 80px;
    }
}

@media (max-width: 480px) {
    .hud-text-panel {
        left: 20px;
        max-width: 80vw;
        padding: 12px;
        font-size: 12px;
        bottom: 60px;
    }
}

.hud-text-panel.visible {
    opacity: 1;
}
</style>