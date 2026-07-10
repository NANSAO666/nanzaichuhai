<template>
    <view class="detail-page" v-if="club">
        <!-- 图片轮播 -->
        <swiper class="banner" indicator-dots autoplay circular>
            <swiper-item v-for="(img, i) in club.images" :key="i">
                <image :src="img.base64" mode="aspectFill" class="banner-img"/>
            </swiper-item>
            <swiper-item v-if="!club.images || club.images.length === 0">
                <view class="banner-placeholder">
                    <text class="banner-emoji">🚤</text>
                </view>
            </swiper-item>
        </swiper>

        <!-- 基本信息 -->
        <view class="info-card">
            <view class="club-title">{{ club.name }}</view>
            <view class="club-area">{{ club.area }} · 起价¥{{ club.pricing[0]?.price }}/3小时</view>
            <view class="club-addr">📍 {{ club.address }}</view>
            <view class="club-route">🛥️ {{ club.route }}</view>
        </view>

        <!-- 船型价格 -->
        <view class="section-card">
            <view class="section-title">船型 & 价格</view>
            <view class="price-list">
                <view class="price-item" v-for="(p, i) in club.pricing" :key="i">
                    <view class="price-left">
                        <text class="boat-size">{{ p.size }}</text>
                        <text class="boat-desc">精致游艇</text>
                    </view>
                    <view class="price-right">
                        <text class="price-num">¥{{ p.price }}</text>
                        <text class="price-unit">/3小时</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 增值服务 -->
        <view class="section-card" v-if="club.addons && club.addons.length">
            <view class="section-title">增值服务</view>
            <view class="addon-list">
                <view class="addon-item" v-for="(a, i) in club.addons" :key="i">
                    <text class="addon-name">{{ a.name }}</text>
                    <text class="addon-price">+¥{{ a.price }}</text>
                </view>
            </view>
        </view>

        <!-- 配套设施 -->
        <view class="section-card">
            <view class="section-title">配套设施</view>
            <view class="facility-tags">
                <text class="facility-tag" v-for="(f, i) in club.facilities" :key="i">{{ f }}</text>
            </view>
        </view>

        <!-- 出海时段 -->
        <view class="section-card">
            <view class="section-title">出海时段</view>
            <view class="slot-list">
                <view class="slot-item" v-for="(s, i) in club.timeSlots" :key="i">{{ s }}</view>
            </view>
        </view>

        <!-- 码头介绍 -->
        <view class="section-card">
            <view class="section-title">码头介绍</view>
            <view class="intro-text">{{ club.intro }}</view>
        </view>

        <!-- 退款政策 -->
        <view class="section-card">
            <view class="section-title">退款政策</view>
            <view class="refund-text">{{ club.refundRule }}</view>
        </view>

        <!-- 底部操作栏 -->
        <view class="bottom-bar">
            <view class="contact-btn" @click="callPhone">
                <text class="bar-icon">📞</text>
                <text>电话咨询</text>
            </view>
            <view class="book-btn" @click="goBooking">
                立即预约
            </view>
        </view>
    </view>
</template>

<script>
import { configApi, defaultData, storage } from '@/utils/api.js'

export default {
    data() {
        return {
            club: null
        }
    },
    onLoad(options) {
        this.loadClub(options.id)
    },
    methods: {
        async loadClub(id) {
            let clubs
            try {
                const res = await configApi.getClubs()
                clubs = res
                storage.set('clubs', res)
            } catch (e) {
                clubs = storage.get('clubs', defaultData.clubs)
            }
            this.club = clubs.find(c => c.id === id)
            if (this.club) {
                uni.setNavigationBarTitle({ title: this.club.name })
            }
        },
        callPhone() {
            uni.makePhoneCall({
                phoneNumber: '13003192344'
            })
        },
        goBooking() {
            uni.navigateTo({ url: '/pages/booking/booking?clubId=' + this.club.id })
        }
    }
}
</script>

<style scoped>
.detail-page {
    padding-bottom: 160rpx;
}

.banner {
    width: 100%;
    height: 400rpx;
}

.banner-img {
    width: 100%;
    height: 400rpx;
}

.banner-placeholder {
    width: 100%;
    height: 400rpx;
    background: linear-gradient(135deg, #E8F1F8, #D4E8F5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.banner-emoji {
    font-size: 100rpx;
}

.info-card {
    background: #fff;
    margin: -30rpx 30rpx 0;
    border-radius: 20rpx;
    padding: 30rpx;
    position: relative;
    z-index: 10;
    box-shadow: 0 4rpx 20rpx rgba(0, 74, 124, 0.1);
}

.club-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #004A7C;
    font-family: Georgia, serif;
}

.club-area {
    font-size: 26rpx;
    color: #FF7E00;
    font-weight: 600;
    margin-top: 8rpx;
}

.club-addr {
    font-size: 26rpx;
    color: #666;
    margin-top: 16rpx;
}

.club-route {
    font-size: 24rpx;
    color: #999;
    margin-top: 8rpx;
}

.section-card {
    background: #fff;
    margin: 20rpx 30rpx 0;
    border-radius: 20rpx;
    padding: 30rpx;
}

.section-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #004A7C;
    margin-bottom: 20rpx;
    font-family: Georgia, serif;
}

.price-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
}

.price-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;
    background: linear-gradient(135deg, #F8FBFD, #EEF5F9);
    border-radius: 12rpx;
}

.price-left {
    display: flex;
    flex-direction: column;
    gap: 6rpx;
}

.boat-size {
    font-size: 28rpx;
    font-weight: 600;
    color: #004A7C;
}

.boat-desc {
    font-size: 22rpx;
    color: #999;
}

.price-right {
    text-align: right;
}

.price-num {
    font-size: 32rpx;
    font-weight: bold;
    color: #FF7E00;
}

.price-unit {
    font-size: 22rpx;
    color: #999;
    margin-left: 6rpx;
}

.addon-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
}

.addon-item {
    background: #FFF4E6;
    padding: 12rpx 24rpx;
    border-radius: 30rpx;
    font-size: 24rpx;
    color: #FF7E00;
}

.addon-price {
    margin-left: 8rpx;
    font-weight: 600;
}

.facility-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
}

.facility-tag {
    background: #E8F1F8;
    color: #004A7C;
    padding: 10rpx 20rpx;
    border-radius: 8rpx;
    font-size: 24rpx;
}

.slot-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
}

.slot-item {
    background: #F0F4F8;
    color: #666;
    padding: 14rpx 28rpx;
    border-radius: 30rpx;
    font-size: 26rpx;
}

.intro-text {
    font-size: 26rpx;
    color: #666;
    line-height: 1.6;
}

.refund-text {
    font-size: 26rpx;
    color: #666;
    line-height: 1.6;
}

.bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    padding: 20rpx 30rpx;
    display: flex;
    gap: 20rpx;
    box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.contact-btn {
    flex: 1;
    background: #F0F4F8;
    border-radius: 50rpx;
    padding: 24rpx;
    text-align: center;
    font-size: 26rpx;
    color: #004A7C;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10rpx;
}

.bar-icon {
    font-size: 28rpx;
}

.book-btn {
    flex: 2;
    background: linear-gradient(135deg, #FF7E00, #FF9933);
    color: #fff;
    border-radius: 50rpx;
    padding: 24rpx;
    text-align: center;
    font-size: 30rpx;
    font-weight: bold;
}
</style>
