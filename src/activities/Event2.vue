<template>
    <div class="event2-container">
        <h2>生存挑战 - 日志查看</h2>

        <!-- 文档显示区域 -->
        <div class="document-section">
            <div class="document-header">
                <h3>生存挑战日志</h3>
                <div class="document-controls">
                    <button @click="loadDocument" class="load-btn">
                        重新加载
                    </button>
                    <button @click="toggleFormat" class="format-btn">
                        {{ isFormatted ? '原始格式' : '格式化显示' }}
                    </button>
                </div>
            </div>

            <div v-if="loading" class="loading-state">
                正在加载文档...
            </div>

            <div v-else-if="error" class="error-state">
                <p>❌ 加载文档失败: {{ error }}</p>
                <button @click="loadDocument" class="retry-btn">重试</button>
            </div>

            <div v-else class="document-content">
                <pre v-if="!isFormatted" class="raw-content">{{ documentContent }}</pre>
                <div v-else class="formatted-content" v-html="formattedContent"></div>
            </div>
        </div>

        <!-- 文档统计信息 -->
        <div class="document-stats">
            <div class="stat-item">
                <span class="stat-label">文档大小</span>
                <span class="stat-value">{{ documentSize }} KB</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">总字符数</span>
                <span class="stat-value">{{ totalChars }}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">总行数</span>
                <span class="stat-value">{{ totalLines }}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">最后更新</span>
                <span class="stat-value">{{ lastUpdated }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useUI } from '../composables/useUI'

const ui = useUI()

// 文档数据
const documentContent = ref('')
const loading = ref(false)
const error = ref('')
const isFormatted = ref(true)
const lastUpdated = ref('')

// 文档统计
const documentSize = computed(() => {
    return (documentContent.value.length / 1024).toFixed(2)
})

const totalChars = computed(() => {
    return documentContent.value.length
})

const totalLines = computed(() => {
    return documentContent.value.split('\n').length
})

// 格式化内容为HTML
const formattedContent = computed(() => {
    if (!documentContent.value) return ''

    return documentContent.value
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
        .replace(/✅/g, '<span class="checkmark">✅</span>')
        .replace(/🔄/g, '<span class="progress">🔄</span>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
})

// 加载文档
const loadDocument = async () => {
    loading.value = true
    error.value = ''

    try {
        // 在开发环境中，我们需要通过public目录访问文件
        // 在生产环境中，可以直接访问根目录文件
        const response = await fetch('/survival-log.md')

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const content = await response.text()
        documentContent.value = content
        lastUpdated.value = new Date().toLocaleString('zh-CN')

        ui.showTextPanel('✅ 文档加载成功！', 3000)
    } catch (err) {
        error.value = err.message
        ui.showTextPanel('❌ 文档加载失败，请检查文件是否存在', 5000)
        console.error('加载文档失败:', err)
    } finally {
        loading.value = false
    }
}

// 切换显示格式
const toggleFormat = () => {
    isFormatted.value = !isFormatted.value
    ui.showTextPanel(isFormatted.value ? '切换到格式化显示' : '切换到原始格式', 2000)
}

// 初始化活动
onMounted(() => {
    ui.showTextPanel('正在加载生存挑战日志...', 3000)
    loadDocument()
})

// 清理活动
onUnmounted(() => {
    ui.stopVideo()
})
</script>

<style scoped>
.event2-container {
    padding: 20px;
    color: white;
    max-width: 1000px;
    margin: 0 auto;
}

.event2-container h2 {
    color: #00d4aa;
    margin-bottom: 30px;
    text-align: center;
}

.document-section {
    margin-bottom: 40px;
}

.document-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.document-header h3 {
    color: #e5e5e5;
    margin: 0;
    font-size: 20px;
}

.document-controls {
    display: flex;
    gap: 10px;
}

.load-btn, .format-btn, .retry-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.load-btn {
    background: #00d4aa;
    color: white;
}

.load-btn:hover {
    background: #00b894;
    transform: translateY(-1px);
}

.format-btn {
    background: rgba(255, 255, 255, 0.1);
    color: #e5e5e5;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.format-btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

.retry-btn {
    background: #ff8800;
    color: white;
}

.retry-btn:hover {
    background: #e67e22;
}

.loading-state {
    text-align: center;
    color: #00d4aa;
    padding: 40px 20px;
    font-size: 16px;
    background: rgba(0, 212, 170, 0.1);
    border-radius: 8px;
    border: 1px solid rgba(0, 212, 170, 0.3);
}

.error-state {
    text-align: center;
    color: #ff6b6b;
    padding: 30px 20px;
    background: rgba(255, 107, 107, 0.1);
    border-radius: 8px;
    border: 1px solid rgba(255, 107, 107, 0.3);
}

.error-state p {
    margin: 0 0 15px 0;
    font-size: 16px;
}

.document-content {
    background: rgba(26, 26, 26, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    overflow: hidden;
}

.raw-content {
    padding: 20px;
    margin: 0;
    color: #e5e5e5;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.5;
    white-space: pre-wrap;
    word-wrap: break-word;
    max-height: 600px;
    overflow-y: auto;
}

.formatted-content {
    padding: 20px;
    color: #e5e5e5;
    line-height: 1.6;
    max-height: 600px;
    overflow-y: auto;
}

.formatted-content h1 {
    color: #00d4aa;
    font-size: 24px;
    margin: 30px 0 20px 0;
    border-bottom: 2px solid #00d4aa;
    padding-bottom: 10px;
}

.formatted-content h2 {
    color: #4ecdc4;
    font-size: 20px;
    margin: 25px 0 15px 0;
}

.formatted-content h3 {
    color: #45b7d1;
    font-size: 18px;
    margin: 20px 0 10px 0;
}

.formatted-content strong {
    color: #f7dc6f;
    font-weight: 600;
}

.formatted-content em {
    color: #bb8fce;
    font-style: italic;
}

.formatted-content li {
    margin: 5px 0;
    padding-left: 20px;
    position: relative;
}

.formatted-content li::before {
    content: "•";
    color: #00d4aa;
    position: absolute;
    left: 0;
}

.checkmark {
    color: #2ecc71;
    font-weight: bold;
}

.progress {
    color: #f39c12;
    font-weight: bold;
}

.document-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 30px;
}

.stat-item {
    background: rgba(26, 26, 26, 0.6);
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
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
    .event2-container {
        padding: 15px;
    }

    .document-header {
        flex-direction: column;
        gap: 15px;
        align-items: stretch;
    }

    .document-controls {
        justify-content: center;
    }

    .document-stats {
        grid-template-columns: repeat(2, 1fr);
    }

    .raw-content, .formatted-content {
        padding: 15px;
        font-size: 13px;
    }
}
</style>