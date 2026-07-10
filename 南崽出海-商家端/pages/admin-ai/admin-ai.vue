<template>
    <view class="admin-ai">
        <view class="platform-section">
            <view class="section-title">AI平台一键切换</view>
            <view class="platform-grid">
                <view class="platform-item" :class="{active:aiConfig.platform==='sijifluid'}" @click="selectPlatform('sijifluid')">
                    <text class="platform-icon">⚡</text><text class="platform-name">硅基流动</text><text class="platform-desc">免费API</text>
                </view>
                <view class="platform-item" :class="{active:aiConfig.platform==='zhipu'}" @click="selectPlatform('zhipu')">
                    <text class="platform-icon">🧠</text><text class="platform-name">智谱AI</text><text class="platform-desc">glm-4</text>
                </view>
                <view class="platform-item" :class="{active:aiConfig.platform==='kimi'}" @click="selectPlatform('kimi')">
                    <text class="platform-icon">✨</text><text class="platform-name">Kimi</text><text class="platform-desc">长文本</text>
                </view>
                <view class="platform-item" :class="{active:aiConfig.platform==='deepseek'}" @click="selectPlatform('deepseek')">
                    <text class="platform-icon">🔍</text><text class="platform-name">DeepSeek</text><text class="platform-desc">免费</text>
                </view>
            </view>
        </view>
        <view class="form-card">
            <view class="form-title">AI配置</view>
            <view class="form-item"><view class="form-label">API地址</view><input class="form-input" v-model="aiConfig.apiUrl" placeholder="AI接口地址"/></view>
            <view class="form-item"><view class="form-label">API Key</view><input class="form-input" v-model="aiConfig.apiKey" placeholder="API密钥"/></view>
            <view class="form-item"><view class="form-label">模型名称</view><input class="form-input" v-model="aiConfig.model" placeholder="模型名称"/></view>
            <view class="form-item"><view class="form-label">温度</view><input class="form-input" v-model="aiConfig.temperature" type="number" placeholder="0.1-1.0"/></view>
            <view class="form-item"><view class="form-label">最大Token</view><input class="form-input" v-model="aiConfig.maxTokens" type="number" placeholder="2000"/></view>
            <view class="form-item"><view class="form-label">角色词</view><textarea class="form-textarea" v-model="aiConfig.systemPrompt" placeholder="AI角色设定"/></view>
        </view>
        <view class="save-btn" @click="saveConfig">保存配置</view>
    </view>
</template>
<script>
import {configApi,storage} from '@/utils/api.js';
const platforms={
    sijifluid:{apiUrl:'https://api.sijifluid.com/v1/chat/completions',apiKey:'',model:'gpt-3.5-turbo',temperature:0.7,maxTokens:2000},
    zhipu:{apiUrl:'https://open.bigmodel.cn/api/paas/v4/chat/completions',apiKey:'',model:'glm-4',temperature:0.7,maxTokens:2000},
    kimi:{apiUrl:'https://api.moonshot.cn/v1/chat/completions',apiKey:'',model:'moonshot-v1-8k',temperature:0.7,maxTokens:8000},
    deepseek:{apiUrl:'https://api.deepseek.com/v1/chat/completions',apiKey:'',model:'deepseek-chat',temperature:0.7,maxTokens:2000}
};
export default{
    data(){return{aiConfig:{platform:'sijifluid',apiUrl:'',apiKey:'',model:'',temperature:0.7,maxTokens:2000,systemPrompt:''}}},
    onLoad(){this.loadData()},
    methods:{
        async loadData(){try{const res=await configApi.getAI();this.aiConfig=res;storage.set('ai',res)}catch(e){this.aiConfig=storage.get('ai',{})}},
        selectPlatform(name){
            const p=platforms[name];this.aiConfig.platform=name;this.aiConfig.apiUrl=p.apiUrl;this.aiConfig.model=p.model;this.aiConfig.temperature=p.temperature;this.aiConfig.maxTokens=p.maxTokens;
            uni.showToast({title:'已切换至'+(name==='sijifluid'?'硅基流动':name==='zhipu'?'智谱AI':name==='kimi'?'Kimi':'DeepSeek'),icon:'success'})
        },
        async saveConfig(){
            uni.showLoading({title:'保存中...'});
            try{const res=await configApi.saveAI(this.aiConfig);uni.hideLoading();if(res.success!==false){storage.set('ai',this.aiConfig);uni.showToast({title:'保存成功',icon:'success'})}else{uni.showToast({title:'保存失败',icon:'none'})}}
            catch(e){uni.hideLoading();storage.set('ai',this.aiConfig);uni.showToast({title:'本地已保存',icon:'success'})}
        }
    }
}
</script>
<style scoped>
.admin-ai{padding:20rpx;padding-bottom:160rpx}.platform-section{background:#fff;border-radius:20rpx;padding:30rpx;margin-bottom:20rpx}
.section-title{font-size:32rpx;font-weight:bold;color:#004A7C;margin-bottom:24rpx;font-family:Georgia,serif}
.platform-grid{display:flex;flex-wrap:wrap;gap:16rpx}.platform-item{width:calc(50% - 8rpx);background:#F8FBFD;border-radius:16rpx;padding:24rpx;text-align:center;border:2rpx solid transparent}
.platform-item.active{border-color:#004A7C;background:#E8F1F8}.platform-icon{font-size:40rpx;display:block;margin-bottom:8rpx}
.platform-name{font-size:26rpx;font-weight:600;color:#004A7C;display:block}.platform-desc{font-size:20rpx;color:#999;margin-top:4rpx;display:block}
.form-card{background:#fff;border-radius:20rpx;padding:30rpx;margin-bottom:20rpx}
.form-title{font-size:32rpx;font-weight:bold;color:#004A7C;margin-bottom:24rpx;font-family:Georgia,serif}
.form-item{padding:20rpx 0;border-bottom:1rpx solid #f0f0f0}.form-item:last-child{border-bottom:none}
.form-label{font-size:26rpx;color:#666;margin-bottom:12rpx}.form-input{background:#F0F4F8;border-radius:12rpx;padding:18rpx 24rpx;font-size:28rpx}
.form-textarea{background:#F0F4F8;border-radius:12rpx;padding:18rpx 24rpx;font-size:28rpx;width:100%;height:200rpx;box-sizing:border-box}
.save-btn{position:fixed;bottom:0;left:0;right:0;margin:20rpx 30rpx;background:linear-gradient(135deg,#004A7C,#006699);color:#fff;border-radius:50rpx;padding:28rpx;text-align:center;font-size:30rpx;font-weight:bold}
</style>
