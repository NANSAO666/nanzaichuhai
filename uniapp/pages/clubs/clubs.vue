<template>
    <view class="clubs-page">
        <!-- 区域筛选 -->
        <scroll-view scroll-x class="area-tabs">
            <view 
                v-for="area in areas" 
                :key="area"
                :class="['area-tab', currentArea === area ? 'active' : '']"
                @click="currentArea = area"
            >
                {{ area }}
            </view>
        </scroll-view>

        <!-- 码头列表 -->
        <view class="club-list">
            <view 
                class="club-item" 
                v-for="club in filteredClubs" 
                :key="club.id"
                @click="goToDetail(club.id)"
            >
                <view class="club-cover">
                    <text v-if="!club.images || club.images.length === 0" class="club-cover-emoji">🚤</text>
                    <image v-else :src="club.images[0].base64" mode="aspectFill" class="club-cover-img"/>
                    <view class="club-area-tag">{{ club.area }}</view>
                </view>
                <view class="club-content">
                    <view class="club-title-row">
                        <text class="club-title">{{ club.name }}</text>
                        <text class="club-price">¥{{ club.pricing[0]?.price }}起</text>
                    </view>
                    <text class="club-address">📍 {{ club.address }}</text>
                    <view class="club-facilities">
                        <text class="facility-tag" v-for="(f, i) in club.facilities.slice(0, 3)" :key="i">{{ f }}</text>
                    </view>
                    <view class="club-footer">
                        <text class="club-time">⏰ {{ club.timeSlots[0] }} 等{{ club.timeSlots.length }}个时段</text>
                        <view class="book-btn" @click.stop="goBooking(club.id)">立即预约</view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { configApi, defaultData, storage } from '@/utils/api.js'

export default {
    data() {
        return {
            clubs: [],
            currentArea: '全部'
        }
    },
    computed: {
        areas() {
            const areaSet = new Set(['全部'])
            this.clubs.forEach(c => areaSet.add(c.area))
            return Array.from(areaSet)
        },
        filteredClubs() {
            if (this.currentArea === '全部') {
                return this.clubs.filter(c => c.active !== false)
            }
            return this.clubs.filter(c => c.area === this.currentArea && c.active !== false)
        }
    },
    onShow() {
        this.loadClubs()
    },
    methods: {
        async loadClubs() {
            try {
                const res = await configApi.getClubs()
                this.clubs = res
                storage.set('clubs', res)
            } catch (e) {
                this.clubs = storage.get('clubs', defaultData.clubs)
            }
        },
        goToDetail(id) {
            uni.navigateTo({ url: '/pages/club-detail/club-detail?id=' + id })
        },
        goBooking(id) {
            uni.navigateTo({ url: '/pages/booking/booking?clubId=' + id })
        }
    }
}
</script>

<style scoped>
.clubs-page {
    padding-bottom: 40rpx;
}

.area-tabs {
    white-space: nowrap;
    padding: 20rpx 30rpx;
    background: #fff;
}

.area-tab {
    display: inline-block;
    padding: 12rpx 30rpx;
    margin-right: 16rpx;
    background: #F0F4F8;
    border-radius: 40rpx;
    font-size: 26rpx;
    color: #666;
}

.area-tab.active {
    background: linear-gradient(135deg, #004A7C, #006699);
    color: #fff;
}

.club-list {
    padding: 20rpx 30rpx;
}

.club-item {
    background: #fff;
    border-radius: 20rpx;
    margin-bottom: 24rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 16rpx rgba(0, 74, 124, 0.06);
}

.club-cover {
    position: relative;
    height: 200rpx;
    background: linear-gradient(135deg, #E8F1F8, #D4E8F5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.club-cover-emoji {
    font-size: 70rpx;
}

.club-cover-img {
    width: 100%;
    height: 200rpx;
}

.club-area-tag {
    position: absolute;
    left: 20rpx;
    top: 20rpx;
    background: rgba(0, 74, 124, 0.8);
    color: #fff;
    font-size: 22rpx;
    padding: 6rpx 16rpx;
    border-radius: 20rpx;
}

.club-content {
    padding: 24rpx;
}

.club-title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.club-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #004A7C;
}

.club-price {
    font-size: 28rpx;
    color: #FF7E00;
    font-weight: 600;
}

.club-address {
    font-size: 24rpx;
    color: #999;
    margin-top: 10rpx;
    display: block;
}

.club-facilities {
    display: flex;
    flex-wrap: wrap;
    margin-top: 14rpx;
}

.facility-tag {
    font-size: 20rpx;
    color: #004A7C;
    background: #E8F1F8;
    padding: 6rpx 14rpx;
    border-radius: 8rpx;
    margin-right: 12rpx;
    margin-bottom: 8rpx;
}

.club-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 18rpx;
    padding-top: 18rpx;
    border-top: 1rpx solid #f0f0f0;
}

.club-time {
    font-size: 22rpx;
    color: #999;
}

.book-btn {
    background: linear-gradient(135deg, #FF7E00, #FF9933);
    color: #fff;
    font-size: 24rpx;
    padding: 12rpx 28rpx;
    border-radius: 30rpx;
    font-weight: 500;
}
</style>
