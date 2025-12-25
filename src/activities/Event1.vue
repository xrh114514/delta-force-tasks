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
        <el-dialog v-model="showClaimDialog" title="领取奖励确认" width="350px" :close-on-click-modal="false">
            <div v-if="selectedImage">
                确认领取 <b style="color:#00d4aa">{{ selectedImage.alt }}</b> 吗？
            </div>
            <template #footer>
                <el-button @click="showClaimDialog = false">取消</el-button>
                <el-button type="primary" @click="confirmClaim">确认领取</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useUI } from '../composables/useUI'
import { ElDialog, ElButton } from 'element-plus'

// 导入奖励图片 (使用占位符)
const goldWeaponImg = 'https://picsum.photos/200/200?random=1'
const epicCharacterImg = 'https://picsum.photos/200/200?random=2'
const rareHangerImg = 'https://picsum.photos/200/200?random=3'
const expCardImg = 'https://picsum.photos/200/200?random=4'

const ui = useUI()

// 奖励图片数据
const rewardImages = ref([
    {
        src: goldWeaponImg,
        alt: '黄金武器皮肤',
        rarity: 'legendary'
    },
    {
        src: epicCharacterImg,
        alt: '稀有角色皮肤',
        rarity: 'epic'
    },
    {
        src: rareHangerImg,
        alt: '精美挂件',
        rarity: 'rare'
    },
    {
        src: expCardImg,
        alt: '经验加成卡',
        rarity: 'common'
    }
])

const selectedImage = ref(null)
const claimedRewards = ref([])

const showClaimDialog = ref(false)
const pendingRewardId = ref(null)
const isConfirmed = ref(false)

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
        rewardImages.value.splice(rewardImages.value.indexOf(selectedImage.value), 1)
        ui.showTextPanel(`🎉 成功领取奖励: ${selectedImage.value.alt}!`, 5000)
        selectedImage.value = null
        // 保存到localStorage
        localStorage.setItem('Event1_claimedRewards', JSON.stringify(claimedRewards.value))
        localStorage.setItem('Event1_lastClaimTime', new Date().toISOString())
    } else {
        ui.showTextPanel('请先选择要领取的奖励！', 3000)
    }
}

// 领取按钮点击，弹窗确认
const onClaimBtnClick = (rewardId) => {
    if (!selectedImage.value) {
        ui.showTextPanel('请先选择要领取的奖励！', 3000)
        return false
    }
    pendingRewardId.value = rewardId
    showClaimDialog.value = true
    return new Promise((resolve) => {
        watch(showClaimDialog, (newVal) => {
            resolve(isConfirmed.value)
        }, {
            once: true
        })
    })
}

// 确认领取
const confirmClaim = () => {
    claimReward(pendingRewardId.value)
    showClaimDialog.value = false
    pendingRewardId.value = null
    isConfirmed.value = true
}

// 初始化活动
onMounted(() => {
    ui.showTextPanel('欢迎来到突击行动！请先选择奖励，然后点击领取按钮。', 8000)
    
    // 检查是否需要重置奖励（每天0点）
    const today = new Date().toDateString()
    const lastResetDate = localStorage.getItem('Event1_lastResetDate')
    if (lastResetDate !== today) {
        // 重置奖励
        claimedRewards.value = []
        localStorage.setItem('Event1_lastResetDate', today)
        localStorage.removeItem('Event1_claimedRewards')
    } else {
        // 加载已领取奖励
        const stored = localStorage.getItem('Event1_claimedRewards')
        if (stored) {
            claimedRewards.value = JSON.parse(stored)
            // 从奖励列表中移除已领取的
            claimedRewards.value.forEach(claimed => {
                const index = rewardImages.value.findIndex(img => img.src === claimed.image.src)
                if (index !== -1) rewardImages.value.splice(index, 1)
            })
        }
    }
    
    // 设置全局奖励领取方法
    window.app = {
        claimReward: onClaimBtnClick
    }
})

// 监听选择奖励的变化，动态显示/隐藏按钮
watch(selectedImage, (newVal) => {
    if (newVal) {
        ui.addClaimButton('reward', '领取奖励')
    } else {
        ui.removeClaimButton('reward')
    }
})

// 清理活动
onUnmounted(() => {
    selectedImage.value = null
    ui.removeClaimButton('daily1')
    ui.removeClaimButton('weekly1')
    if (window.app) {
        delete window.app
    }
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