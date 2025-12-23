<template>
    <div class="event1-container">
        <h2>突击行动 - 领取奖励测试</h2>

        <!-- 动态插入的图片显示区域 -->
        <div class="image-gallery">
            <h3>奖励预览图片</h3>
            <div class="image-grid">
                <img v-for="(image, index) in rewardImages"
                     :key="index"
                     :src="image.src"
                     :alt="image.alt"
                     @click="selectImage(image)"
                     :class="{ selected: selectedImage?.src === image.src }"
                     class="reward-image" />
            </div>
            <p v-if="selectedImage" class="selected-info">
                已选择: {{ selectedImage.alt }}
            </p>
        </div>

        <!-- 奖励统计 -->
        <div class="reward-stats">
            <div class="stat-item">
                <span class="stat-label">已领取奖励:</span>
                <span class="stat-value">{{ claimedRewards.length }}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">总奖励数:</span>
                <span class="stat-value">{{ rewardImages.length }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useUI } from '../composables/useUI'

const ui = useUI()

// 奖励图片数据
const rewardImages = ref([
    {
        src: 'https://picsum.photos/200/150?random=101',
        alt: '黄金武器皮肤',
        rarity: 'legendary'
    },
    {
        src: 'https://picsum.photos/200/150?random=102',
        alt: '稀有角色皮肤',
        rarity: 'epic'
    },
    {
        src: 'https://picsum.photos/200/150?random=103',
        alt: '精美挂件',
        rarity: 'rare'
    },
    {
        src: 'https://picsum.photos/200/150?random=104',
        alt: '经验加成卡',
        rarity: 'common'
    }
])

const selectedImage = ref(null)
const claimedRewards = ref([])

// 选择图片
const selectImage = (image) => {
    selectedImage.value = image
    ui.showTextPanel(`已选择奖励: ${image.alt}`, 3000)
}

// 领取奖励
const claimReward = (rewardId) => {
    if (selectedImage.value) {
        claimedRewards.value.push({
            id: rewardId,
            image: selectedImage.value,
            timestamp: new Date()
        })
        ui.showTextPanel(`🎉 成功领取奖励: ${selectedImage.value.alt}!`, 5000)
        selectedImage.value = null
    } else {
        ui.showTextPanel('请先选择要领取的奖励！', 3000)
    }
}

// 初始化活动
onMounted(() => {
    ui.showTextPanel('欢迎来到突击行动！请先选择奖励，然后点击领取按钮。', 8000)
    ui.addClaimButton('daily1', '领取每日奖励')
    ui.addClaimButton('weekly1', '领取周常奖励')
})

// 清理活动
onUnmounted(() => {
    selectedImage.value = null
})
</script>

<style scoped>
.event1-container {
    padding: 20px;
    color: white;
}

.event1-container h2 {
    color: #00d4aa;
    margin-bottom: 30px;
    text-align: center;
}

.image-gallery h3 {
    color: #e5e5e5;
    margin-bottom: 15px;
    font-size: 18px;
}

.image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-bottom: 20px;
}

.reward-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 3px solid transparent;
}

.reward-image:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 212, 170, 0.3);
}

.reward-image.selected {
    border-color: #00d4aa;
    box-shadow: 0 0 15px rgba(0, 212, 170, 0.5);
}

.selected-info {
    text-align: center;
    color: #00d4aa;
    font-weight: bold;
    font-size: 16px;
    margin: 10px 0;
}

.reward-stats {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin-top: 30px;
    padding: 20px;
    background: rgba(26, 26, 26, 0.5);
    border-radius: 8px;
}

.stat-item {
    text-align: center;
}

.stat-label {
    display: block;
    color: #e5e5e5;
    font-size: 14px;
    margin-bottom: 5px;
}

.stat-value {
    display: block;
    color: #00d4aa;
    font-size: 24px;
    font-weight: bold;
}
</style>