<template>
    <view class="admin-images">
        <view class="form-card">
            <view class="form-title">图片管理</view>
            <view class="form-desc">选择码头，上传或管理图片</view>

            <view class="club-select">
                <picker :range="clubNames" @change="onClubChange">
                    <view class="select-box">
                        {{ currentClub ? currentClub.name : '请选择码头' }}
                        <text class="arrow">▼</text>
                    </view>
                </picker>
            </view>
        </view>

        <view class="image-section" v-if="currentClub">
            <view class="section-header">
                <text class="section-title">图片列表 ({{ currentClub.images?.length || 0 }}张)</text>
                <view class="upload-btn" @click="chooseImage">
                    + 上传图片
                </view>
            </view>

            <view class="image-grid">
                <view class="image-item" v-for="(img, i) in currentClub.images" :key="img.id || i">
                    <image :src="img.base64" mode="aspectFill" class="thumb"/>
                    <view class="cover-tag" v-if="img.cover">封面</view>
                </view>
            </view>

            <view class="empty" v-if="!currentClub.images || currentClub.images.length === 0">
                <text class="empty-icon">🖼️</text>
                <text class="empty-text">暂无图片，点击上方按钮上传</text>
            </view>
        </view>

        <view class="save-btn" v-if="currentClub" @click="saveImages">
            保存图片
        </view>
    </view>
</template>

<script>
import { configApi, defaultData, storage } from '@/utils/api.js'

export default {
    data() {
        return {
            clubs: [],
            currentClubIndex: -1,
            currentClub: null
        }
    },
    computed: {
        clubNames() {
            return this.clubs.map(c => c.name)
        }
    },
    onLoad() {
        this.loadClubs()
    },
    methods: {
        async loadClubs() {
            try {
                const res = await configApi.getClubs()
                this.clubs = res
            } catch (e) {
                this.clubs = storage.get('clubs', defaultData.clubs)
            }
        },
        onClubChange(e) {
            this.currentClubIndex = e.detail.value
            this.currentClub = this.clubs[this.currentClubIndex]
        },
        chooseImage() {
            uni.showToast({ title: '图片上传请使用PC后台', icon: 'none' })
        },
        saveImages() {
            uni.showToast({ title: '图片管理请使用PC后台', icon: 'none' })
        }
    }
}
</script>

<style scoped>
.admin-images {
    padding: 20rpx;
    padding-bottom: 160rpx;
}

.form-card {
    background: #fff;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
}

.form-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #004A7C;
    font-family: Georgia, serif;
}

.form-desc {
    font-size: 24rpx;
    color: #999;
    margin-top: 8rpx;
    margin-bottom: 20rpx;
}

.club-select {
    background: #F0F4F8;
    border-radius: 12rpx;
    padding: 20rpx 24rpx;
}

.select-box {
    font-size: 28rpx;
    color: #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.arrow {
    font-size: 20rpx;
    color: #999;
}

.image-section {
    background: #fff;
    border-radius: 20rpx;
    padding: 30rpx;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
}

.section-title {
    font-size: 28rpx;
    font-weight: 600;
    color: #004A7C;
}

.upload-btn {
    background: linear-gradient(135deg, #FF7E00, #FF9933);
    color: #fff;
    padding: 12rpx 24rpx;
    border-radius: 30rpx;
    font-size: 24rpx;
}

.image-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
}

.image-item {
    width: calc(33.33% - 12rpx);
    position: relative;
    border-radius: 12rpx;
    overflow: hidden;
}

.thumb {
    width: 100%;
    height: 180rpx;
}

.cover-tag {
    position: absolute;
    top: 0;
    left: 0;
    background: linear-gradient(135deg, #D4AF37, #F4D03F);
    color: #fff;
    font-size: 20rpx;
    padding: 4rpx 12rpx;
    border-bottom-right-radius: 12rpx;
}

.empty {
    padding: 60rpx 40rpx;
    text-align: center;
}

.empty-icon {
    font-size: 60rpx;
    display: block;
    margin-bottom: 12rpx;
}

.empty-text {
    font-size: 26rpx;
    color: #999;
}

.save-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 20rpx 30rpx;
    background: linear-gradient(135deg, #004A7C, #006699);
    color: #fff;
    border-radius: 50rpx;
    padding: 28rpx;
    text-align: center;
    font-size: 30rpx;
    font-weight: bold;
}
</style>
