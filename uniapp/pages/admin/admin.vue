<template>
    <view class="admin-page">
        <!-- 顶部信息 -->
        <view class="admin-header">
            <view class="admin-title">管理员后台</view>
            <view class="admin-status" v-if="serverConnected">
                <text class="status-dot online"></text>
                服务已连接
            </view>
            <view class="admin-status" v-else>
                <text class="status-dot offline"></text>
                本地模式
            </view>
        </view>

        <!-- 功能菜单 -->
        <view class="menu-grid">
            <view class="menu-item" @click="goTo('/pages/admin-brand/admin-brand')">
                <text class="menu-icon">🏪</text>
                <text class="menu-label">品牌配置</text>
            </view>
            <view class="menu-item" @click="goTo('/pages/admin-clubs/admin-clubs')">
                <text class="menu-icon">🏝️</text>
                <text class="menu-label">码头管理</text>
            </view>
            <view class="menu-item" @click="goTo('/pages/admin-ai/admin-ai')">
                <text class="menu-icon">🤖</text>
                <text class="menu-label">AI配置</text>
            </view>
            <view class="menu-item" @click="goTo('/pages/admin-push/admin-push')">
                <text class="menu-icon">📢</text>
                <text class="menu-label">推送配置</text>
            </view>
            <view class="menu-item" @click="goTo('/pages/admin-orders/admin-orders')">
                <text class="menu-icon">📋</text>
                <text class="menu-label">订单管理</text>
            </view>
            <view class="menu-item" @click="goTo('/pages/admin-manual/admin-manual')">
                <text class="menu-icon">📖</text>
                <text class="menu-label">说明书</text>
            </view>
            <view class="menu-item" @click="goTo('/pages/admin-images/admin-images')">
                <text class="menu-icon">🖼️</text>
                <text class="menu-label">图片管理</text>
            </view>
            <view class="menu-item" @click="showReset">
                <text class="menu-icon">🔄</text>
                <text class="menu-label">系统重置</text>
            </view>
        </view>

        <!-- 统计卡片 -->
        <view class="stat-section">
            <view class="stat-card">
                <text class="stat-num">{{ clubCount }}</text>
                <text class="stat-label">运营码头</text>
            </view>
            <view class="stat-card">
                <text class="stat-num">{{ orderCount }}</text>
                <text class="stat-label">累计订单</text>
            </view>
            <view class="stat-card">
                <text class="stat-num">{{ pendingCount }}</text>
                <text class="stat-label">待处理</text>
            </view>
        </view>
    </view>
</template>

<script>
import { configApi, orderApi, defaultData, storage } from '@/utils/api.js'

export default {
    data() {
        return {
            serverConnected: false,
            clubCount: 0,
            orderCount: 0,
            pendingCount: 0
        }
    },
    onShow() {
        this.loadStats()
    },
    methods: {
        async loadStats() {
            try {
                const clubs = await configApi.getClubs()
                this.clubCount = clubs.filter(c => c.active !== false).length
                this.serverConnected = true
            } catch (e) {
                this.serverConnected = false
                const clubs = storage.get('clubs', defaultData.clubs)
                this.clubCount = clubs.filter(c => c.active !== false).length
            }

            try {
                const orders = await orderApi.getList()
                this.orderCount = orders.length
                this.pendingCount = orders.filter(o => o.status === 'pending').length
                storage.set('orders', orders)
            } catch (e) {
                const orders = storage.get('orders', [])
                this.orderCount = orders.length
                this.pendingCount = orders.filter(o => o.status === 'pending').length
            }
        },
        goTo(url) {
            uni.navigateTo({ url })
        },
        showReset() {
            uni.showModal({
                title: '系统重置',
                content: '确定要重置所有数据吗？此操作不可恢复！',
                success: (res) => {
                    if (res.confirm) {
                        uni.clearStorageSync()
                        uni.showToast({ title: '已重置', icon: 'success' })
                        this.loadStats()
                    }
                }
            })
        }
    }
}
</script>

<style scoped>
.admin-page {
    padding: 30rpx;
    padding-bottom: 60rpx;
}

.admin-header {
    background: linear-gradient(135deg, #004A7C, #006699);
    border-radius: 20rpx;
    padding: 40rpx;
    margin-bottom: 30rpx;
    color: #fff;
}

.admin-title {
    font-size: 36rpx;
    font-weight: bold;
    font-family: Georgia, serif;
}

.admin-status {
    font-size: 24rpx;
    color: #D4AF37;
    margin-top: 12rpx;
    display: flex;
    align-items: center;
    gap: 10rpx;
}

.status-dot {
    width: 16rpx;
    height: 16rpx;
    border-radius: 50%;
}

.status-dot.online {
    background: #00D084;
    box-shadow: 0 0 10rpx #00D084;
}

.status-dot.offline {
    background: #FF7E00;
}

.menu-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    margin-bottom: 30rpx;
}

.menu-item {
    width: calc(25% - 15rpx);
    background: #fff;
    border-radius: 16rpx;
    padding: 30rpx 10rpx;
    text-align: center;
    box-shadow: 0 4rpx 12rpx rgba(0, 74, 124, 0.06);
}

.menu-icon {
    font-size: 48rpx;
    display: block;
    margin-bottom: 10rpx;
}

.menu-label {
    font-size: 22rpx;
    color: #004A7C;
    font-weight: 500;
    display: block;
}

.stat-section {
    display: flex;
    gap: 20rpx;
}

.stat-card {
    flex: 1;
    background: #fff;
    border-radius: 16rpx;
    padding: 30rpx 20rpx;
    text-align: center;
    box-shadow: 0 4rpx 12rpx rgba(0, 74, 124, 0.06);
}

.stat-num {
    font-size: 40rpx;
    font-weight: bold;
    color: #004A7C;
    display: block;
    font-family: Georgia, serif;
}

.stat-label {
    font-size: 22rpx;
    color: #999;
    margin-top: 8rpx;
    display: block;
}
</style>
