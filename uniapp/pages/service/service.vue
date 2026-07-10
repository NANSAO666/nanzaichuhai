<template>
    <view class="service-page">
        <!-- 转人工客服 -->
        <view class="human-service">
            <view class="human-header">
                <view>
                    <view class="human-title">需要更多帮助？</view>
                    <view class="human-subtitle">人工客服一对一为您服务</view>
                </view>
                <text class="human-icon">👨‍💼</text>
            </view>
            <view class="human-btns">
                <view class="human-btn primary" @click="callPhone">
                    <text class="btn-icon">📞</text>
                    <text>拨打电话</text>
                </view>
                <view class="human-btn" @click="copyWechat">
                    <text class="btn-icon">💬</text>
                    <text>复制微信</text>
                </view>
            </view>
        </view>

        <!-- AI对话 -->
        <view class="ai-section">
            <view class="ai-title">
                <text class="ai-icon">🤖</text>
                <text>AI智能客服</text>
                <text class="ai-tag">随时为您解答</text>
            </view>
            
            <scroll-view scroll-y class="chat-box" :scroll-top="scrollTop">
                <view class="msg-item ai-msg">
                    <view class="msg-bubble">
                        您好！我是南崽出海专属AI顾问，精通广州五大码头航线与报价。请问有什么可以帮您？
                    </view>
                </view>
                <view class="msg-item user-msg" v-for="(msg, i) in chatHistory" :key="i">
                    <view class="msg-bubble" :class="msg.role === 'user' ? 'user-bubble' : 'ai-bubble'">
                        {{ msg.content }}
                    </view>
                </view>
                <view class="msg-item ai-msg" v-if="loading">
                    <view class="msg-bubble ai-bubble">AI思考中...</view>
                </view>
            </scroll-view>

            <!-- 快捷问题 -->
            <view class="quick-questions" v-if="chatHistory.length === 0">
                <view class="qq-title">快捷问题</view>
                <view class="qq-list">
                    <view class="qq-item" v-for="(q, i) in quickQuestions" :key="i" @click="sendQuestion(q)">
                        {{ q }}
                    </view>
                </view>
            </view>

            <!-- 输入框 -->
            <view class="input-area">
                <input 
                    class="chat-input" 
                    v-model="inputText" 
                    placeholder="输入您的问题..." 
                    @confirm="sendMessage"
                />
                <view class="send-btn" @click="sendMessage">发送</view>
            </view>
        </view>
    </view>
</template>

<script>
import { aiApi, configApi, defaultData, storage } from '@/utils/api.js'

export default {
    data() {
        return {
            inputText: '',
            chatHistory: [],
            loading: false,
            scrollTop: 0,
            quickQuestions: [
                '南沙游艇会怎么走？',
                '求婚推荐哪个码头？',
                '珠江夜游哪家体验最好？',
                '报价包含哪些服务？'
            ],
            brand: {}
        }
    },
    onShow() {
        this.brand = storage.get('brand', defaultData.brand)
        this.loadQuickQuestions()
    },
    methods: {
        async loadQuickQuestions() {
            try {
                const res = await configApi.getAI()
                if (res.quickQuestions && res.quickQuestions.length) {
                    this.quickQuestions = res.quickQuestions
                }
            } catch (e) {}
        },
        sendQuestion(q) {
            this.inputText = q
            this.sendMessage()
        },
        async sendMessage() {
            const text = this.inputText.trim()
            if (!text || this.loading) return
            
            this.chatHistory.push({ role: 'user', content: text })
            this.inputText = ''
            this.loading = true
            this.$nextTick(() => {
                this.scrollTop = 99999
            })

            try {
                const messages = [
                    ...this.chatHistory.slice(-10).map(m => ({ role: m.role, content: m.content }))
                ]
                const res = await aiApi.chat(messages)
                if (res.success) {
                    this.chatHistory.push({ role: 'assistant', content: res.content })
                } else {
                    this.chatHistory.push({ role: 'assistant', content: '抱歉，AI暂时无法回答，请联系人工客服。微信：' + (this.brand.wechat || 'DaogoG') + '，电话：' + (this.brand.phone || '13003192344') })
                }
            } catch (e) {
                this.chatHistory.push({ role: 'assistant', content: '网络异常，请检查网络或联系人工客服。' })
            }
            
            this.loading = false
            this.$nextTick(() => {
                this.scrollTop = 99999
            })
        },
        callPhone() {
            uni.makePhoneCall({
                phoneNumber: this.brand.phone || '13003192344'
            })
        },
        copyWechat() {
            uni.setClipboardData({
                data: this.brand.wechat || 'DaogoG',
                success: () => {
                    uni.showToast({ title: '微信号已复制', icon: 'success' })
                }
            })
        }
    }
}
</script>

<style scoped>
.service-page {
    padding: 20rpx;
    min-height: 100vh;
    box-sizing: border-box;
}

.human-service {
    background: linear-gradient(135deg, #004A7C, #006699);
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    color: #fff;
}

.human-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
}

.human-title {
    font-size: 32rpx;
    font-weight: bold;
}

.human-subtitle {
    font-size: 24rpx;
    color: #D4AF37;
    margin-top: 6rpx;
}

.human-icon {
    font-size: 60rpx;
}

.human-btns {
    display: flex;
    gap: 20rpx;
}

.human-btn {
    flex: 1;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 16rpx;
    padding: 20rpx;
    text-align: center;
    font-size: 26rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6rpx;
}

.human-btn.primary {
    background: linear-gradient(135deg, #D4AF37, #F4D03F);
    color: #004A7C;
    font-weight: 600;
}

.btn-icon {
    font-size: 32rpx;
}

.ai-section {
    background: #fff;
    border-radius: 20rpx;
    padding: 24rpx;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 400rpx);
}

.ai-title {
    display: flex;
    align-items: center;
    gap: 10rpx;
    font-size: 28rpx;
    font-weight: 600;
    color: #004A7C;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #f0f0f0;
    margin-bottom: 16rpx;
}

.ai-icon {
    font-size: 32rpx;
}

.ai-tag {
    margin-left: auto;
    font-size: 20rpx;
    color: #999;
    font-weight: normal;
}

.chat-box {
    flex: 1;
    padding: 10rpx;
}

.msg-item {
    margin-bottom: 16rpx;
}

.msg-bubble {
    display: inline-block;
    padding: 16rpx 20rpx;
    border-radius: 16rpx;
    font-size: 26rpx;
    line-height: 1.5;
    max-width: 80%;
}

.ai-msg .msg-bubble {
    background: #F0F4F8;
    color: #333;
    border-top-left-radius: 4rpx;
}

.user-msg {
    text-align: right;
}

.user-bubble {
    background: linear-gradient(135deg, #004A7C, #006699);
    color: #fff;
    border-top-right-radius: 4rpx;
    text-align: left;
}

.quick-questions {
    padding: 16rpx 0;
    border-top: 1rpx solid #f0f0f0;
    margin-top: 10rpx;
}

.qq-title {
    font-size: 24rpx;
    color: #999;
    margin-bottom: 12rpx;
}

.qq-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
}

.qq-item {
    font-size: 24rpx;
    color: #004A7C;
    background: #E8F1F8;
    padding: 10rpx 20rpx;
    border-radius: 30rpx;
}

.input-area {
    display: flex;
    gap: 16rpx;
    padding-top: 16rpx;
    border-top: 1rpx solid #f0f0f0;
    margin-top: 10rpx;
}

.chat-input {
    flex: 1;
    background: #F0F4F8;
    border-radius: 40rpx;
    padding: 16rpx 28rpx;
    font-size: 26rpx;
}

.send-btn {
    background: linear-gradient(135deg, #FF7E00, #FF9933);
    color: #fff;
    border-radius: 40rpx;
    padding: 16rpx 32rpx;
    font-size: 26rpx;
    font-weight: 500;
}
</style>
