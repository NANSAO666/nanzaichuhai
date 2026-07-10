<template>
    <view class="admin-push">
        <view class="form-card">
            <view class="form-title">消息推送配置</view>
            <view class="form-desc">客户预约后自动推送订单通知到您的微信</view>

            <!-- 推送方式选择 -->
            <view class="type-selector">
                <view 
                    :class="['type-card', form.type === 'pushplus' ? 'active' : '']"
                    @click="form.type = 'pushplus'"
                >
                    <text class="type-icon">📱</text>
                    <text class="type-name">PushPlus</text>
                    <text class="type-desc">个人微信接收</text>
                </view>
                <view 
                    :class="['type-card', form.type === 'wecom' ? 'active' : '']"
                    @click="form.type = 'wecom'"
                >
                    <text class="type-icon">💼</text>
                    <text class="type-name">企业微信</text>
                    <text class="type-desc">推送到群聊</text>
                </view>
            </view>

            <!-- PushPlus配置 -->
            <view class="form-item" v-if="form.type === 'pushplus'">
                <view class="form-label">PushPlus Token</view>
                <input class="form-input" v-model="form.token" placeholder="请输入PushPlus Token"/>
                <view class="tips-box">
                    <view class="tips-title">📖 如何获取Token？</view>
                    <view class="tips-content">
                        1. 微信搜索公众号「PushPlus推送加」并关注
                        2. 进入公众号，点击底部菜单「推送加」
                        3. 点击「发送消息」，复制您的token
                    </view>
                </view>
            </view>

            <!-- 企业微信配置 -->
            <view class="form-item" v-if="form.type === 'wecom'">
                <view class="form-label">Webhook地址</view>
                <input class="form-input" v-model="form.url" placeholder="请输入企业微信群机器人Webhook地址"/>
            </view>
        </view>

        <!-- 操作按钮 -->
        <view class="btn-group">
            <view class="btn-test" @click="testPush">发送测试消息</view>
            <view class="btn-save" @click="saveConfig">保存配置</view>
        </view>
    </view>
</template>

<script>
import { configApi, pushApi, storage } from '@/utils/api.js'

export default {
    data() {
        return {
            form: {
                type: 'pushplus',
                token: '',
                url: '',
                useProxy: false
            }
        }
    },
    onLoad() {
        this.loadData()
    },
    methods: {
        async loadData() {
            const saved = storage.get('webhook', null)
            if (saved) {
                this.form = { ...this.form, ...saved }
            }
            try {
                const res = await configApi.getWebhook()
                if (res) {
                    this.form.type = res.type || 'pushplus'
                }
            } catch (e) {}
        },
        async saveConfig() {
            if (this.form.type === 'pushplus' && !this.form.token) {
                uni.showToast({ title: '请输入Token', icon: 'none' })
                return
            }
            if (this.form.type === 'wecom' && !this.form.url) {
                uni.showToast({ title: '请输入Webhook地址', icon: 'none' })
                return
            }

            uni.showLoading({ title: '保存中...' })
            try {
                const res = await configApi.saveWebhook(this.form)
                uni.hideLoading()
                if (res.success !== false) {
                    storage.set('webhook', this.form)
                    uni.showToast({ title: '保存成功', icon: 'success' })
                } else {
                    uni.showToast({ title: '保存失败', icon: 'none' })
                }
            } catch (e) {
                uni.hideLoading()
                storage.set('webhook', this.form)
                uni.showToast({ title: '本地已保存', icon: 'success' })
            }
        },
        async testPush() {
            if (this.form.type === 'pushplus' && !this.form.token) {
                uni.showToast({ title: '请先填写Token', icon: 'none' })
                return
            }
            if (this.form.type === 'wecom' && !this.form.url) {
                uni.showToast({ title: '请先填写Webhook地址', icon: 'none' })
                return
            }

            uni.showLoading({ title: '发送中...' })
            try {
                const res = await pushApi.test()
                uni.hideLoading()
                if (res.success) {
                    uni.showToast({ title: '发送成功 ✓', icon: 'success' })
                } else {
                    uni.showToast({ title: res.error || '推送失败', icon: 'none' })
                }
            } catch (e) {
                uni.hideLoading()
                uni.showToast({ title: '网络异常', icon: 'none' })
            }
        }
    }
}
</script>

<style scoped>
.admin-push {
    padding: 20rpx;
    padding-bottom: 200rpx;
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
    font-family: Georgia, serif;
}

.form-desc {
    font-size: 26rpx;
    color: #999;
    margin-top: 8rpx;
    margin-bottom: 24rpx;
}

.type-selector {
    display: flex;
    gap: 20rpx;
    margin-bottom: 30rpx;
}

.type-card {
    flex: 1;
    background: #F0F4F8;
    border-radius: 16rpx;
    padding: 30rpx 20rpx;
    text-align: center;
    border: 2rpx solid transparent;
}

.type-card.active {
    background: rgba(0, 74, 124, 0.08);
    border-color: #004A7C;
}

.type-icon {
    font-size: 48rpx;
    display: block;
    margin-bottom: 10rpx;
}

.type-name {
    font-size: 28rpx;
    font-weight: 600;
    color: #004A7C;
    display: block;
}

.type-desc {
    font-size: 22rpx;
    color: #999;
    margin-top: 6rpx;
    display: block;
}

.form-item {
    padding: 20rpx 0;
    border-top: 1rpx solid #f0f0f0;
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

.tips-box {
    background: #F0F9F0;
    border-radius: 12rpx;
    padding: 20rpx;
    margin-top: 16rpx;
}

.tips-title {
    font-size: 26rpx;
    color: #00A854;
    font-weight: 600;
    margin-bottom: 12rpx;
}

.tips-content {
    font-size: 24rpx;
    color: #666;
    line-height: 1.8;
}

.btn-group {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20rpx 30rpx;
    background: #fff;
    display: flex;
    gap: 20rpx;
    box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.btn-test {
    flex: 1;
    background: #F0F4F8;
    color: #004A7C;
    border-radius: 50rpx;
    padding: 24rpx;
    text-align: center;
    font-size: 28rpx;
    font-weight: 600;
}

.btn-save {
    flex: 2;
    background: linear-gradient(135deg, #004A7C, #006699);
    color: #fff;
    border-radius: 50rpx;
    padding: 24rpx;
    text-align: center;
    font-size: 28rpx;
    font-weight: bold;
}
</style>
