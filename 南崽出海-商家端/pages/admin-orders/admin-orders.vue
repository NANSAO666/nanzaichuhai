<template>
    <view class="admin-orders">
        <view class="tabs">
            <view class="tab-item" :class="{active:currentTab==='all'}" @click="currentTab='all'">全部</view>
            <view class="tab-item" :class="{active:currentTab==='pending'}" @click="currentTab='pending'">待确认</view>
            <view class="tab-item" :class="{active:currentTab==='confirmed'}" @click="currentTab='confirmed'">已确认</view>
            <view class="tab-item" :class="{active:currentTab==='completed'}" @click="currentTab='completed'">已完成</view>
        </view>
        <view class="order-list">
            <view class="order-card" v-for="order in filteredOrders" :key="order.orderId">
                <view class="order-header">
                    <view class="order-id">订单号：{{ order.orderId }}</view>
                    <view class="order-status" :class="order.status">{{ statusText[order.status] }}</view>
                </view>
                <view class="order-info">
                    <view class="info-row"><text class="info-label">客户：</text><text class="info-value">{{ order.customerName }}</text></view>
                    <view class="info-row"><text class="info-label">电话：</text><text class="info-value">{{ order.customerPhone }}</text></view>
                    <view class="info-row"><text class="info-label">码头：</text><text class="info-value">{{ order.clubName }}</text></view>
                    <view class="info-row"><text class="info-label">日期：</text><text class="info-value">{{ order.date }}</text></view>
                    <view class="info-row"><text class="info-label">时段：</text><text class="info-value">{{ order.timeSlot }}</text></view>
                    <view class="info-row" v-if="order.boatSize"><text class="info-label">船型：</text><text class="info-value">{{ order.boatSize }}</text></view>
                    <view class="info-row" v-if="order.passengers"><text class="info-label">人数：</text><text class="info-value">{{ order.passengers }}人</text></view>
                    <view class="info-row" v-if="order.price"><text class="info-label">金额：</text><text class="info-value">¥{{ order.price }}</text></view>
                    <view class="info-row" v-if="order.remark"><text class="info-label">备注：</text><text class="info-value">{{ order.remark }}</text></view>
                </view>
                <view class="order-time">{{ formatTime(order.createdAt) }}</view>
                <view class="order-actions" v-if="order.status==='pending'">
                    <view class="action-btn confirm" @click="confirmOrder(order)">确认预约</view>
                    <view class="action-btn reject" @click="rejectOrder(order)">拒绝</view>
                </view>
                <view class="order-actions" v-if="order.status==='confirmed'">
                    <view class="action-btn complete" @click="completeOrder(order)">标记完成</view>
                </view>
            </view>
        </view>
        <view class="empty" v-if="filteredOrders.length===0">暂无订单</view>
    </view>
</template>
<script>
import {orderApi,storage} from '@/utils/api.js';
export default{
    data(){return{orders:[],currentTab:'all',statusText:{pending:'待确认',confirmed:'已确认',completed:'已完成',rejected:'已拒绝'}}},
    onShow(){this.loadOrders()},
    computed:{filteredOrders(){return this.orders.filter(o=>this.currentTab==='all'||o.status===this.currentTab).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))}},
    methods:{
        async loadOrders(){try{const res=await orderApi.getList();this.orders=res;storage.set('orders',res)}catch(e){this.orders=storage.get('orders',[])}},
        formatTime(t){if(!t)return'';const d=new Date(t);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')},
        async confirmOrder(order){
            uni.showModal({title:'确认预约',content:'确定确认此订单吗？确认后将推送通知给客户。',success:async(res)=>{
                if(res.confirm){
                    uni.showLoading({title:'确认中...'});
                    try{await orderApi.updateStatus(order.orderId,'confirmed');await this.loadOrders();uni.hideLoading();uni.showToast({title:'已确认',icon:'success'})}
                    catch(e){uni.hideLoading();order.status='confirmed';storage.set('orders',this.orders);uni.showToast({title:'本地已更新',icon:'success'})}
                }
            }})
        },
        async rejectOrder(order){
            uni.showModal({title:'拒绝预约',content:'确定拒绝此订单吗？',success:async(res)=>{
                if(res.confirm){
                    try{await orderApi.updateStatus(order.orderId,'rejected');await this.loadOrders();uni.showToast({title:'已拒绝',icon:'success'})}
                    catch(e){order.status='rejected';storage.set('orders',this.orders);uni.showToast({title:'本地已更新',icon:'success'})}
                }
            }})
        },
        async completeOrder(order){
            uni.showModal({title:'标记完成',content:'确定标记此订单为已完成吗？',success:async(res)=>{
                if(res.confirm){
                    try{await orderApi.updateStatus(order.orderId,'completed');await this.loadOrders();uni.showToast({title:'已完成',icon:'success'})}
                    catch(e){order.status='completed';storage.set('orders',this.orders);uni.showToast({title:'本地已更新',icon:'success'})}
                }
            }})
        }
    }
}
</script>
<style scoped>
.admin-orders{padding:20rpx}.tabs{display:flex;background:#fff;border-radius:16rpx;padding:8rpx;margin-bottom:20rpx}.tab-item{flex:1;text-align:center;padding:20rpx;font-size:26rpx;color:#666;border-radius:12rpx}.tab-item.active{background:#004A7C;color:#fff}
.order-list{display:flex;flex-direction:column;gap:20rpx}.order-card{background:#fff;border-radius:20rpx;padding:30rpx}
.order-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20rpx}
.order-id{font-size:28rpx;font-weight:bold;color:#004A7C}.order-status{font-size:24rpx;padding:8rpx 20rpx;border-radius:20rpx}.order-status.pending{background:#FFF3E0;color:#FF7E00}.order-status.confirmed{background:#E8F5E9;color:#4CAF50}.order-status.completed{background:#E3F2FD;color:#1976D2}.order-status.rejected{background:#FFEBEE;color:#E53935}
.order-info{display:flex;flex-direction:column;gap:12rpx}.info-row{display:flex;font-size:26rpx}.info-label{color:#999;width:120rpx}.info-value{color:#333}
.order-time{font-size:22rpx;color:#999;margin-top:16rpx;padding-top:16rpx;border-top:1rpx solid #f0f0f0}
.order-actions{display:flex;gap:16rpx;margin-top:24rpx}.action-btn{flex:1;padding:20rpx;text-align:center;font-size:28rpx;border-radius:12rpx}.action-btn.confirm{background:#004A7C;color:#fff}.action-btn.reject{background:#F0F4F8;color:#E53935}.action-btn.complete{background:#4CAF50;color:#fff}
.empty{text-align:center;color:#999;padding:100rpx;font-size:28rpx}
</style>
