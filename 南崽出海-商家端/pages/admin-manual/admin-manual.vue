<template>
    <view class="admin-manual">
        <view class="form-card">
            <view class="form-title">使用说明书</view>
            <textarea class="form-textarea" v-model="manualContent" placeholder="输入使用说明书内容，将在客户端展示给用户"></textarea>
        </view>
        <view class="preview-section">
            <view class="preview-title">预览效果</view>
            <view class="preview-content" v-if="manualContent">{{ manualContent }}</view>
            <view class="preview-empty" v-else>暂未配置说明书内容</view>
        </view>
        <view class="save-btn" @click="saveConfig">保存说明书</view>
    </view>
</template>
<script>
import {configApi,storage} from '@/utils/api.js';
export default{
    data(){return{manualContent:''}},
    onLoad(){this.loadData()},
    methods:{
        async loadData(){try{const res=await configApi.getManual();this.manualContent=res.content||'';storage.set('manual',res)}catch(e){const m=storage.get('manual',{});this.manualContent=m.content||''}},
        async saveConfig(){
            uni.showLoading({title:'保存中...'});
            try{const res=await configApi.saveManual({content:this.manualContent});uni.hideLoading();if(res.success!==false){storage.set('manual',{content:this.manualContent});uni.showToast({title:'保存成功',icon:'success'})}else{uni.showToast({title:'保存失败',icon:'none'})}}
            catch(e){uni.hideLoading();storage.set('manual',{content:this.manualContent});uni.showToast({title:'本地已保存',icon:'success'})}
        }
    }
}
</script>
<style scoped>
.admin-manual{padding:20rpx;padding-bottom:160rpx}.form-card{background:#fff;border-radius:20rpx;padding:30rpx;margin-bottom:20rpx}
.form-title{font-size:32rpx;font-weight:bold;color:#004A7C;margin-bottom:24rpx;font-family:Georgia,serif}
.form-textarea{background:#F0F4F8;border-radius:12rpx;padding:24rpx;font-size:28rpx;width:100%;height:400rpx;box-sizing:border-box}
.preview-section{background:#fff;border-radius:20rpx;padding:30rpx;margin-bottom:20rpx}
.preview-title{font-size:28rpx;font-weight:bold;color:#004A7C;margin-bottom:20rpx}.preview-content{font-size:26rpx;color:#666;line-height:1.6;white-space:pre-wrap}
.preview-empty{font-size:26rpx;color:#999;text-align:center;padding:60rpx}
.save-btn{position:fixed;bottom:0;left:0;right:0;margin:20rpx 30rpx;background:linear-gradient(135deg,#004A7C,#006699);color:#fff;border-radius:50rpx;padding:28rpx;text-align:center;font-size:30rpx;font-weight:bold}
</style>
