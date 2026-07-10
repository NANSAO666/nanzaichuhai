<template>
    <view class="mine-page">
        <view class="user-section">
            <view class="user-avatar">⛵</view>
            <view class="user-info"><view class="user-name">我的订单</view><view class="user-desc">南崽出海 · 赴一场江海浪漫</view></view>
        </view>
        <view class="order-tabs">
            <view :class="['order-tab',currentTab==='all'?'active':'']" @click="currentTab='all'">全部</view>
            <view :class="['order-tab',currentTab==='pending'?'active':'']" @click="currentTab='pending'">待确认</view>
            <view :class="['order-tab',currentTab==='done'?'active':'']" @click="currentTab='done'">已确认</view>
            <view :class="['order-tab',currentTab==='cancelled'?'active':'']" @click="currentTab='cancelled'">已取消</view>
        </view>
        <view class="order-list" v-if="filteredOrders.length>0">
            <view class="order-card" v-for="order in filteredOrders" :key="order.orderId">
                <view class="order-header"><text class="order-club">{{ order.clubName }}</text><text :class="['order-status',order.status]">{{ statusText[order.status] }}</text></view>
                <view class="order-body">
                    <view class="order-row"><text class="order-label">订单编号</text><text class="order-value">{{ order.orderId }}</text></view>
                    <view class="order-row"><text class="order-label">船型</text><text class="order-value">{{ order.boatSize }}</text></view>
                    <view class="order-row"><text class="order-label">出海日期</text><text class="order-value">{{ order.bookingDate }} {{ order.timeSlot }}</text></view>
                    <view class="order-row"><text class="order-label">出行人数</text><text class="order-value">{{ order.pax }}人</text></view>
                    <view class="order-row" v-if="order.addons&&order.addons.length"><text class="order-label">增值服务</text><text class="order-value">{{ order.addons.join('、') }}</text></view>
                </view>
                <view class="order-footer"><view class="contact-btn" @click="callMerchant"><text>📞 联系商家</text></view><view class="order-time">提交时间: {{ formatTime(order.createdAt) }}</view></view>
            </view>
        </view>
        <view class="empty-state" v-else><text class="empty-icon">📋</text><text class="empty-text">暂无订单</text><view class="empty-btn" @click="goToClubs">去预约游艇</view></view>
    </view>
</template>
<script>
import {orderApi,storage} from '@/utils/api.js';
export default{
    data(){return{orders:[],currentTab:'all',statusText:{pending:'待确认',done:'已确认',cancelled:'已取消'}}},
    computed:{filteredOrders(){return(this.currentTab==='all'?this.orders:this.orders.filter(o=>o.status===this.currentTab)).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))}},
    onShow(){this.loadOrders()},
    methods:{
        async loadOrders(){try{const res=await orderApi.getList();this.orders=res;storage.set('orders',res)}catch(e){this.orders=storage.get('orders',[])}},
        formatTime(t){if(!t)return'';const d=new Date(t);return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`},
        callMerchant(){uni.makePhoneCall({phoneNumber:'13003192344'})},
        goToClubs(){uni.switchTab({url:'/pages/clubs/clubs'})}
    }
}
</script>
<style scoped>
.mine-page{padding-bottom:40rpx}.user-section{background:linear-gradient(135deg,#004A7C,#006699);padding:60rpx 40rpx 80rpx;display:flex;align-items:center;gap:24rpx;border-radius:0 0 40rpx 40rpx}
.user-avatar{width:120rpx;height:120rpx;background:rgba(255,255,255,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:60rpx}
.user-info{color:#fff}.user-name{font-size:36rpx;font-weight:bold}.user-desc{font-size:24rpx;color:#D4AF37;margin-top:8rpx}
.order-tabs{display:flex;background:#fff;margin:0 30rpx;margin-top:-30rpx;border-radius:16rpx;padding:10rpx;position:relative;z-index:10;box-shadow:0 4rpx 16rpx rgba(0,74,124,0.1)}
.order-tab{flex:1;text-align:center;padding:16rpx 0;font-size:26rpx;color:#666;border-radius:12rpx;margin:0 6rpx}.order-tab.active{background:linear-gradient(135deg,#004A7C,#006699);color:#fff;font-weight:600}
.order-list{padding:20rpx 30rpx}.order-card{background:#fff;border-radius:20rpx;margin-bottom:20rpx;overflow:hidden;box-shadow:0 4rpx 16rpx rgba(0,74,124,0.06)}
.order-header{display:flex;justify-content:space-between;align-items:center;padding:24rpx;background:linear-gradient(135deg,#F8FBFD,#EEF5F9)}
.order-club{font-size:30rpx;font-weight:bold;color:#004A7C}
.order-status{font-size:24rpx;padding:8rpx 20rpx;border-radius:30rpx}.order-status.pending{background:#FFF4E6;color:#FF7E00}
.order-status.done{background:#E8F7EE;color:#00A854}.order-status.cancelled{background:#F0F0F0;color:#999}
.order-body{padding:20rpx 24rpx}.order-row{display:flex;justify-content:space-between;padding:10rpx 0;font-size:26rpx}
.order-label{color:#999}.order-value{color:#333}.order-footer{display:flex;justify-content:space-between;align-items:center;padding:20rpx 24rpx;border-top:1rpx solid #f0f0f0}
.contact-btn{background:linear-gradient(135deg,#FF7E00,#FF9933);color:#fff;padding:12rpx 28rpx;border-radius:30rpx;font-size:24rpx}
.order-time{font-size:22rpx;color:#ccc}.empty-state{padding:100rpx 40rpx;text-align:center}
.empty-icon{font-size:100rpx;display:block;margin-bottom:20rpx}.empty-text{font-size:28rpx;color:#999;display:block;margin-bottom:40rpx}
.empty-btn{display:inline-block;background:linear-gradient(135deg,#004A7C,#006699);color:#fff;padding:20rpx 60rpx;border-radius:50rpx;font-size:28rpx}
</style>
