<template>
    <view class="admin-orders">
        <!-- 筛选 -->
        <view class="filter-bar">
            <view 
                :class="['filter-item', currentFilter === 'all' ? 'active' : '']"
                @click="currentFilter = 'all'"
            >全部</view>
            <view 
                :class="['filter-item', currentFilter === 'pending' ? 'active' : '']"
                @click="currentFilter = 'pending'"
            >待确认</view>
            <view 
                :class="['filter-item', currentFilter === 'done' ? 'active' : '']"
                @click="currentFilter = 'done'"
            >已成交</view>
            <view 
                :class="['filter-item', currentFilter === 'cancelled' ? 'active' : '']"
                @click="currentFilter = 'cancelled'"
            >已取消</view>
        </view>

        <!-- 订单列表 -->
        <view class="order-list" v-if="filteredOrders.length > 0">
            <view class="order-card" v-for="order in filteredOrders" :key="order.orderId">
                <view class="order-header">
                    <text class="order-club">{{ order.clubName }}</text>
                    <text :class="['order-status', order.status]">
                        {{ statusText[order.status] }}
                    </text>
                </view>

                <view class="order-body">
                    <view class="info-row">
                        <text class="info-label">订单编号</text>
                        <text class="info-value">{{ order.orderId }}</text>
                    </view>
                    <view class="info-row">
                        <text class="info-label">客户姓名</text>
                        <text class="info-value">{{ order.customerName }}</text>
                    </view>
                    <view class="info-row">
                        <text class="info-label">联系电话</text>
                        <text class="info-value link" @click="callPhone(order.customerPhone)">{{ order.customerPhone }}</text>
                    </view>
                    <view class="info-row">
                        <text class="info-label">船型</text>
                        <text class="info-value">{{ order.boatSize }}</text>
                    </view>
                    <view class="info-row">
                        <text class="info-label">出海时间</text>
                        <text class="info-value">{{ order.bookingDate }} {{ order.timeSlot }}</text>
                    </view>
                    <view class="info-row">
                        <text class="info-label">出行人数</text>
                        <text class="info-value">{{ order.pax }}人</text>
                    </view>
                    <view class="info-row" v-if="order.addons && order.addons.length">
                        <text class="info-label">增值服务</text>
                        <text class="info-value">{{ order.addons.join('、') }}</text>
                    </view>
                    <view class="info-row" v-if="order.remark">
                        <text class="info-label">备注</text>
                        <text class="info-value">{{ order.remark }}</text>
                    </view>
                </view>

                <view class="order-footer" v-if="order.status === 'pending'">
                    <view class="action-btn cancel" @click="updateStatus(order, 'cancelled')">
                        取消订单
                    </view>
                    <view class="action-btn confirm" @click="updateStatus(order, 'done')">
                        确认成交
                    </view>
                </view>

                <view class="order-time">
                    提交时间: {{ formatTime(order.createdAt) }}
                </view>
            </view>
        </view>

        <view class="empty" v-else>
            <text class="empty-icon">📋</text>
            <text class="empty-text">暂无订单</text>
        </view>
    </view>
</template>

<script>
import { orderApi, pushApi, storage } from '@/utils/api.js'

export default {
    data() {
        return {
            orders: [],
            currentFilter: 'pending',
            statusText: {
                pending: '待确认',
                done: '已成交',
                cancelled: '已取消'
            }
        }
    },
    computed: {
        filteredOrders() {
            let list = this.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            if (this.currentFilter === 'all') return list
            return list.filter(o => o.status === this.currentFilter)
        }
    },
    onShow() {
        this.loadOrders()
    },
    methods: {
        async loadOrders() {
            try {
                const res = await orderApi.getList()
                this.orders = res
                storage.set('orders', res)
            } catch (e) {
                this.orders = storage.get('orders', [])
            }
        },
        async updateStatus(order, status) {
            const action = status === 'done' ? '确认成交' : '取消订单'
            uni.showModal({
                title: '提示',
                content: `确定要${action}吗？`,
                success: async (res) => {
                    if (!res.confirm) return
                    
                    uni.showLoading({ title: '处理中...' })
                    try {
                        const r = await orderApi.updateStatus(order.orderId, status)
                        uni.hideLoading()
                        if (r.success !== false) {
                            order.status = status
                            
                            if (status === 'done') {
                                uni.showToast({ title: '正在推送通知...', icon: 'none' })
                                try {
                                    await pushApi.order(order)
                                } catch (e) {}
                            }
                            
                            uni.showToast({ title: '操作成功', icon: 'success' })
                            this.loadOrders()
                        } else {
                            uni.showToast({ title: '操作失败', icon: 'none' })
                        }
                    } catch (e) {
                        uni.hideLoading()
                        uni.showToast({ title: '网络异常', icon: 'none' })
                    }
                }
            })
        },
        callPhone(phone) {
            uni.makePhoneCall({ phoneNumber: phone })
        },
        formatTime(time) {
            if (!time) return ''
            const d = new Date(time)
            const pad = n => String(n).padStart(2, '0')
            return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
        }
    }
}
</script>

<style scoped>
.admin-orders {
    padding-bottom: 40rpx;
}

.filter-bar {
    display: flex;
    background: #fff;
    padding: 16rpx 30rpx;
    position: sticky;
    top: 0;
    z-index: 10;
}

.filter-item {
    flex: 1;
    text-align: center;
    padding: 16rpx 0;
    font-size: 26rpx;
    color: #666;
    border-radius: 30rpx;
    margin: 0 6rpx;
}

.filter-item.active {
    background: linear-gradient(135deg, #004A7C, #006699);
    color: #fff;
    font-weight: 600;
}

.order-list {
    padding: 20rpx 30rpx;
}

.order-card {
    background: #fff;
    border-radius: 20rpx;
    margin-bottom: 20rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 16rpx rgba(0, 74, 124, 0.06);
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx;
    background: linear-gradient(135deg, #F8FBFD, #EEF5F9);
}

.order-club {
    font-size: 30rpx;
    font-weight: bold;
    color: #004A7C;
}

.order-status {
    font-size: 24rpx;
    padding: 8rpx 20rpx;
    border-radius: 30rpx;
}

.order-status.pending {
    background: #FFF4E6;
    color: #FF7E00;
}

.order-status.done {
    background: #E8F7EE;
    color: #00A854;
}

.order-status.cancelled {
    background: #F0F0F0;
    color: #999;
}

.order-body {
    padding: 20rpx 24rpx;
}

.info-row {
    display: flex;
    justify-content: space-between;
    padding: 10rpx 0;
    font-size: 26rpx;
}

.info-label {
    color: #999;
}

.info-value {
    color: #333;
    max-width: 60%;
    text-align: right;
}

.info-value.link {
    color: #004A7C;
    text-decoration: underline;
}

.order-footer {
    display: flex;
    gap: 20rpx;
    padding: 20rpx 24rpx;
    border-top: 1rpx solid #f0f0f0;
}

.action-btn {
    flex: 1;
    padding: 18rpx;
    text-align: center;
    border-radius: 40rpx;
    font-size: 26rpx;
    font-weight: 500;
}

.action-btn.cancel {
    background: #F0F0F0;
    color: #666;
}

.action-btn.confirm {
    background: linear-gradient(135deg, #FF7E00, #FF9933);
    color: #fff;
}

.order-time {
    font-size: 22rpx;
    color: #ccc;
    padding: 16rpx 24rpx;
    text-align: right;
    border-top: 1rpx solid #f0f0f0;
}

.empty {
    padding: 100rpx 40rpx;
    text-align: center;
}

.empty-icon {
    font-size: 100rpx;
    display: block;
    margin-bottom: 20rpx;
}

.empty-text {
    font-size: 28rpx;
    color: #999;
}
</style>
