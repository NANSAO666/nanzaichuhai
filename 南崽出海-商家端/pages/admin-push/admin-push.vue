<template>
    <view class="admin-push">
        <view class="form-card">
            <view class="form-title">推送配置</view>
            <view class="form-item"><view class="form-label">推送方式</view>
                <view class="push-mode">
                    <view class="mode-item" :class="{active:pushConfig.mode==='pushplus'}" @click="pushConfig.mode='pushplus'">PushPlus</view>
                    <view class="mode-item" :class="{active:pushConfig.mode==='wechat'}" @click="pushConfig.mode='wechat'">企业微信</view>
                </view>
            </view>
            <view class="form-item"><view class="form-label">PushPlus Token</view><input class="form-input" v-model="pushConfig.pushplusToken" placeholder="用户Token（非消息Token）"/></view>
            <view class="form-item"><view class="form-label">企业微信Webhook</view><input class="form-input" v-model="pushConfig.wechatWebhook" placeholder="Webhook地址"/></view>
            <view class="form-item"><view class="form-label">消息模板</view><textarea class="form-textarea" v-model="pushConfig.template" placeholder="预约确认通知模板"/></view>
        </view>
        <view class="info-card">
            <view class="info-title">📖 配置教程</view>
            <view class="info-content">
                <text class="info-label">PushPlus配置：</text>
                <text class="info-text">1. 关注微信公众号「PushPlus推送加」</text>
                <text class="info-text">2. 点击菜单「一对一推送」获取Token</text>
                <text class="info-text">3. 将Token填入上方输入框</text>
                <text class="info-text">⚠️ 注意：使用「用户Token」而非「消息Token」</text>
                <text class="info-label">企业微信配置：</text>
                <text class="info-text">1. 在企业微信添加机器人</text>
                <text class="info-text">2. 获取Webhook地址</text>
                <text class="info-text">3. 将完整URL填入上方输入框</text>
            </view>
        </view>
        <view class="btn-section">
            <view class="test-btn" @click="testPush">测试推送</view>
            <view class="save-btn" @click="saveConfig">保存配置</view>
        </view>
    </view>
</template>
<script>
import {configApi,pushApi,storage} from '@/utils/api.js';
export default{
    data(){return{pushConfig:{mode:'pushplus',pushplusToken:'',wechatWebhook:'',template:'【南崽出海】新预约通知\n订单号：{orderId}\n客户：{customerName}\n电话：{customerPhone}\n码头：{clubName}\n日期：{date}\n时段：{timeSlot}\n状态：待确认'}}},
    onLoad(){this.loadData()},
    methods:{
        async loadData(){try{const res=await configApi.getWebhook();this.pushConfig=res;storage.set('webhook',res)}catch(e){this.pushConfig=storage.get('webhook',{})}},
        async testPush(){
            uni.showLoading({title:'测试中...'});
            try{const res=await pushApi.test();uni.hideLoading();if(res.success){uni.showToast({title:'推送成功',icon:'success'})}else{uni.showToast({title:res.message||'推送失败',icon:'none'})}}
            catch(e){uni.hideLoading();uni.showToast({title:'推送失败，请检查配置',icon:'none'})}
        },
        async saveConfig(){
            uni.showLoading({title:'保存中...'});
            try{const res=await configApi.saveWebhook(this.pushConfig);uni.hideLoading();if(res.success!==false){storage.set('webhook',this.pushConfig);uni.showToast({title:'保存成功',icon:'success'})}else{uni.showToast({title:'保存失败',icon:'none'})}}
            catch(e){uni.hideLoading();storage.set('webhook',this.pushConfig);uni.showToast({title:'本地已保存',icon:'success'})}
        }
    }
}
</script>
<style scoped>
.admin-push{padding:20rpx;padding-bottom:200rpx}.form-card{background:#fff;border-radius:20rpx;padding:30rpx;margin-bottom:20rpx}
.form-title{font-size:32rpx;font-weight:bold;color:#004A7C;margin-bottom:24rpx;font-family:Georgia,serif}
.form-item{padding:20rpx 0;border-bottom:1rpx solid #f0f0f0}.form-item:last-child{border-bottom:none}
.form-label{font-size:26rpx;color:#666;margin-bottom:12rpx}.form-input{background:#F0F4F8;border-radius:12rpx;padding:18rpx 24rpx;font-size:28rpx}
.form-textarea{background:#F0F4F8;border-radius:12rpx;padding:18rpx 24rpx;font-size:28rpx;width:100%;height:200rpx;box-sizing:border-box}
.push-mode{display:flex;gap:16rpx}.mode-item{flex:1;background:#F0F4F8;border-radius:12rpx;padding:20rpx;text-align:center;font-size:28rpx;color:#666}.mode-item.active{background:#004A7C;color:#fff}
.info-card{background:#FFFBE6;border-radius:20rpx;padding:30rpx;margin-bottom:30rpx;border:1rpx solid #FFE082}
.info-title{font-size:28rpx;font-weight:bold;color:#E65100;margin-bottom:16rpx}.info-content{display:flex;flex-direction:column;gap:8rpx}
.info-label{font-size:26rpx;color:#E65100;font-weight:600}.info-text{font-size:24rpx;color:#8D6E63;padding-left:20rpx}
.btn-section{display:flex;gap:20rpx;position:fixed;bottom:0;left:0;right:0;margin:20rpx 30rpx}
.test-btn{flex:1;background:#F0F4F8;color:#004A7C;border-radius:50rpx;padding:28rpx;text-align:center;font-size:30rpx;font-weight:bold}
.save-btn{flex:2;background:linear-gradient(135deg,#004A7C,#006699);color:#fff;border-radius:50rpx;padding:28rpx;text-align:center;font-size:30rpx;font-weight:bold}
</style>
