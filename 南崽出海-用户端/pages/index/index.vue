<template>
    <view class="home-page">
        <view class="hero-section">
            <view class="hero-content">
                <view class="brand-name">{{ brand.brandName||'南崽出海' }}</view>
                <view class="brand-slogan">{{ brand.slogan||'南崽出海,赴一场江海浪漫' }}</view>
            </view>
        </view>
        <view class="quick-entry">
            <view class="entry-card" @click="goToClubs"><text class="entry-icon">🏝️</text><text class="entry-title">游艇码头</text><text class="entry-desc">五大码头任选</text></view>
            <view class="entry-card" @click="goToBooking"><text class="entry-icon">📅</text><text class="entry-title">立即预约</text><text class="entry-desc">快速预订游艇</text></view>
            <view class="entry-card" @click="goToService"><text class="entry-icon">💬</text><text class="entry-title">客户服务</text><text class="entry-desc">AI+人工客服</text></view>
        </view>
        <view class="section">
            <view class="section-header"><text class="section-title">精选码头</text><text class="section-more" @click="goToClubs">查看全部 →</text></view>
            <scroll-view scroll-x class="club-scroll">
                <view class="club-card" v-for="club in activeClubs.slice(0,3)" :key="club.id" @click="goToDetail(club.id)">
                    <view class="club-img"><text v-if="!club.images||club.images.length===0" class="club-emoji">🚤</text><image v-else :src="club.images[0].base64" mode="aspectFill" class="club-image"/></view>
                    <view class="club-info"><text class="club-name">{{ club.name }}</text><text class="club-area">{{ club.area }}</text><text class="club-price">¥{{ club.pricing[0]?.price }}起</text></view>
                </view>
            </scroll-view>
        </view>
        <view class="section">
            <view class="section-header"><text class="section-title">关于我们</text></view>
            <view class="about-card">
                <text class="about-intro">{{ brand.intro||'南崽出海专注广州五大游艇俱乐部高端出海体验' }}</text>
                <view class="contact-row">
                    <view class="contact-item" @click="callPhone"><text class="contact-icon">📞</text><text class="contact-text">{{ brand.phone||'13003192344' }}</text></view>
                    <view class="contact-item" @click="copyWechat"><text class="contact-icon">💬</text><text class="contact-text">微信: {{ brand.wechat||'DaogoG' }}</text></view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
import {configApi,defaultData,storage} from '@/utils/api.js';
export default{
    data(){return{brand:{},clubs:[]}},
    computed:{activeClubs(){return this.clubs.filter(c=>c.active!==false)}},
    onShow(){this.loadData()},
    methods:{
        async loadData(){
            try{const res=await configApi.getAll();if(res.brand){this.brand=res.brand;storage.set('brand',res.brand)}if(res.clubs){this.clubs=res.clubs;storage.set('clubs',res.clubs)}}
            catch(e){this.brand=storage.get('brand',defaultData.brand);this.clubs=storage.get('clubs',defaultData.clubs)}
        },
        goToClubs(){uni.switchTab({url:'/pages/clubs/clubs'})},
        goToBooking(){uni.navigateTo({url:'/pages/booking/booking'})},
        goToService(){uni.switchTab({url:'/pages/service/service'})},
        goToDetail(id){uni.navigateTo({url:'/pages/club-detail/club-detail?id='+id})},
        callPhone(){uni.makePhoneCall({phoneNumber:this.brand.phone||'13003192344'})},
        copyWechat(){uni.setClipboardData({data:this.brand.wechat||'DaogoG',success:()=>uni.showToast({title:'微信号已复制',icon:'success'})})}
    }
}
</script>
<style scoped>
.home-page{padding-bottom:40rpx}
.hero-section{background:linear-gradient(135deg,#004A7C,#006699);padding:60rpx 40rpx 80rpx;border-radius:0 0 40rpx 40rpx}
.brand-name{font-size:48rpx;font-weight:bold;color:#fff;font-family:Georgia,serif}
.brand-slogan{font-size:28rpx;color:#D4AF37;margin-top:12rpx}
.quick-entry{display:flex;justify-content:space-between;padding:0 30rpx;margin-top:-40rpx;position:relative;z-index:10}
.entry-card{width:31%;background:#fff;border-radius:20rpx;padding:30rpx 20rpx;text-align:center;box-shadow:0 4rpx 20rpx rgba(0,74,124,0.1)}
.entry-icon{font-size:48rpx;display:block;margin-bottom:10rpx}
.entry-title{font-size:28rpx;font-weight:600;color:#004A7C;display:block}
.entry-desc{font-size:22rpx;color:#999;margin-top:6rpx;display:block}
.section{padding:30rpx 30rpx 0}
.section-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20rpx}
.section-title{font-size:34rpx;font-weight:bold;color:#004A7C;font-family:Georgia,serif}
.section-more{font-size:26rpx;color:#FF7E00}
.club-scroll{white-space:nowrap}
.club-card{display:inline-block;width:320rpx;background:#fff;border-radius:20rpx;margin-right:20rpx;overflow:hidden;box-shadow:0 4rpx 16rpx rgba(0,74,124,0.08)}
.club-img{width:100%;height:180rpx;background:linear-gradient(135deg,#E8F1F8,#D4E8F5);display:flex;align-items:center;justify-content:center}
.club-emoji{font-size:60rpx}.club-image{width:100%;height:180rpx}
.club-info{padding:20rpx}.club-name{font-size:28rpx;font-weight:600;color:#004A7C;display:block}
.club-area{font-size:22rpx;color:#999;margin-top:6rpx;display:block}
.club-price{font-size:24rpx;color:#FF7E00;font-weight:600;margin-top:8rpx;display:block}
.about-card{background:#fff;border-radius:20rpx;padding:30rpx;box-shadow:0 4rpx 16rpx rgba(0,74,124,0.06)}
.about-intro{font-size:28rpx;color:#666;line-height:1.6;display:block}
.contact-row{display:flex;margin-top:30rpx;padding-top:30rpx;border-top:1rpx solid #f0f0f0}
.contact-item{flex:1;text-align:center;display:flex;flex-direction:column;align-items:center}
.contact-icon{font-size:36rpx;margin-bottom:8rpx}.contact-text{font-size:24rpx;color:#004A7C}
</style>
