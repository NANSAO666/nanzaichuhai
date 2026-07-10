<template>
    <view class="admin-ai">
        <view class="form-card">
            <view class="form-title">AI接口配置</view>
            
            <!-- 平台一键切换 -->
            <view class="platform-section">
                <view class="section-label">快速切换平台</view>
                <view class="platform-grid">
                    <view class="platform-btn" @click="switchPlatform('siliconflow')">硅基流动</view>
                    <view class="platform-btn" @click="switchPlatform('zhipu')">智谱AI</view>
                    <view class="platform-btn" @click="switchPlatform('kimi')">Kimi</view>
                    <view class="platform-btn" @click="switchPlatform('deepseek')">DeepSeek</view>
                </view>
            </view>

            <view class="form-item">
                <view class="form-label">接口地址</view>
                <input class="form-input" v-model="form.apiUrl" placeholder="API地址"/>
            </view>

            <view class="form-item">
                <view class="form-label">API Key</view>
                <input class="form-input" v-model="form.apiKey" placeholder="API密钥"/>
            </view>

            <view class="form-item">
                <view class="form-label">模型名称</view>
                <input class="form-input" v-model="form.model" placeholder="模型ID"/>
            </view>

            <view class="form-item">
                <view class="form-label">角色词(System Prompt)</view>
                <textarea class="form-textarea" v-model="form.systemPrompt" placeholder="AI角色设定"/>
            </view>
        </view>

        <view class="save-btn" @click="saveConfig">
            保存配置
        </view>
    </view>
</template>

<script>
import { configApi, storage } from '@/utils/api.js'

export default {
    data() {
        return {
            form: {
                apiUrl: '',
                apiKey: '',
                model: '',
                systemPrompt: ''
            },
            platforms: {
                siliconflow: {
                    url: 'https://api.siliconflow.cn/v1/chat/completions',
                    model: 'Qwen/Qwen2.5-7B-Instruct',
                    name: '硅基流动'
                },
                zhipu: {
                    url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
                    model: 'glm-4-flash',
                    name: '智谱AI'
                },
                kimi: {
                    url: 'https://api.moonshot.cn/v1/chat/completions',
                    model: 'moonshot-v1-8k',
                    name: 'Kimi'
                },
                deepseek: {
                    url: 'https://api.deepseek.com/v1/chat/completions',
                    model: 'deepseek-chat',
                    name: 'DeepSeek'
                }
            }
        }
    },
    onLoad() {
        this.loadData()
    },
    methods: {
        async loadData() {
            const saved = storage.get('ai', null)
            if (saved) this.form = saved
            try {
                const res = await configApi.getAI()
                if (res) {
                    this.form.apiUrl = res.apiUrl || this.form.apiUrl
                    this.form.model = res.model || this.form.model
                    this.form.systemPrompt = res.systemPrompt || this.form.systemPrompt
                }
            } catch (e) {}
        },
        switchPlatform(key) {
            const p = this.platforms[key]
            if (!p) return
            this.form.apiUrl = p.url
            this.form.model = p.model
            uni.showToast({ title: '已切换到' + p.name, icon: 'success' })
        },
        async saveConfig() {
            if (!this.form.apiUrl) {
                uni.showToast({ title: '请输入接口地址', icon: 'none' })
                return
            }
            uni.showLoading({ title: '保存中...' })
            try {
                const res = await configApi.saveAI(this.form)
                uni.hideLoading()
                if (res.success !== false) {
                    storage.set('ai', this.form)
                    uni.showToast({ title: '保存成功', icon: 'success' })
                } else {
                    uni.showToast({ title: '保存失败', icon: 'none' })
                }
            } catch (e) {
                uni.hideLoading()
                storage.set('ai', this.form)
                uni.showToast({ title: '本地已保存', icon: 'success' })
            }
        }
    }
}
</script>

<style scoped>
.admin-ai {
    padding: 20rpx;
    padding-bottom: 160rpx;
}

.form-card {
    background: #fff;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
}

.form-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #004A7C;
    margin-bottom: 24rpx;
    font-family: Georgia, serif;
}

.platform-section {
    margin-bottom: 30rpx;
    padding-bottom: 24rpx;
    border-bottom: 1rpx solid #f0f0f0;
}

.section-label {
    font-size: 26rpx;
    color: #666;
    margin-bottom: 16rpx;
}

.platform-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
}

.platform-btn {
    flex: 1;
    min-width: 45%;
    background: linear-gradient(135deg, #E8F1F8, #D4E8F5);
    color: #004A7C;
    padding: 20rpx;
    text-align: center;
    border-radius: 12rpx;
    font-size: 26rpx;
    font-weight: 500;
}

.form-item {
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
}

.form-item:last-child {
    border-bottom: none;
}

.form-label {
    font-size: 26rpx;
    color: #666;
    margin-bottom: 12rpx;
}

.form-input {
    background: #F0F4F8;
    border-radius: 12rpx;
    padding: 18rpx 24rpx;
    font-size: 28rpx;
}

.form-textarea {
    background: #F0F4F8;
    border-radius: 12rpx;
    padding: 18rpx 24rpx;
    font-size: 28rpx;
    width: 100%;
    height: 200rpx;
    box-sizing: border-box;
}

.save-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 20rpx 30rpx;
    background: linear-gradient(135deg, #004A7C, #006699);
    color: #fff;
    border-radius: 50rpx;
    padding: 28rpx;
    text-align: center;
    font-size: 30rpx;
    font-weight: bold;
}
</style>
