<template>
    <view class="admin-manual">
        <view class="manual-list">
            <view class="manual-item" v-for="(item, index) in manual" :key="item.id" @click="editItem(item)">
                <view class="item-index">{{ index + 1 }}</view>
                <view class="item-content">
                    <text class="item-title">{{ item.title }}</text>
                    <text class="item-desc">{{ item.content.slice(0, 50) }}...</text>
                </view>
                <text class="item-arrow">›</text>
            </view>
        </view>

        <view class="add-btn" @click="addItem">
            + 新增章节
        </view>
    </view>
</template>

<script>
import { configApi, defaultData, storage } from '@/utils/api.js'

export default {
    data() {
        return {
            manual: []
        }
    },
    onShow() {
        this.loadManual()
    },
    methods: {
        async loadManual() {
            try {
                const res = await configApi.getManual()
                this.manual = res
                storage.set('manual', res)
            } catch (e) {
                this.manual = storage.get('manual', defaultData.manual)
            }
        },
        editItem(item) {
            uni.showToast({ title: '编辑功能请使用PC后台', icon: 'none' })
        },
        addItem() {
            uni.showToast({ title: '新增功能请使用PC后台', icon: 'none' })
        }
    }
}
</script>

<style scoped>
.admin-manual {
    padding: 20rpx;
    padding-bottom: 160rpx;
}

.manual-list {
    background: #fff;
    border-radius: 16rpx;
    overflow: hidden;
}

.manual-item {
    display: flex;
    align-items: center;
    padding: 24rpx;
    border-bottom: 1rpx solid #f0f0f0;
}

.manual-item:last-child {
    border-bottom: none;
}

.item-index {
    width: 48rpx;
    height: 48rpx;
    background: linear-gradient(135deg, #004A7C, #006699);
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24rpx;
    font-weight: bold;
    margin-right: 20rpx;
}

.item-content {
    flex: 1;
}

.item-title {
    font-size: 28rpx;
    font-weight: 600;
    color: #004A7C;
    display: block;
}

.item-desc {
    font-size: 24rpx;
    color: #999;
    margin-top: 6rpx;
    display: block;
}

.item-arrow {
    font-size: 32rpx;
    color: #ccc;
}

.add-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 20rpx 30rpx;
    background: linear-gradient(135deg, #FF7E00, #FF9933);
    color: #fff;
    border-radius: 50rpx;
    padding: 26rpx;
    text-align: center;
    font-size: 28rpx;
    font-weight: bold;
}
</style>
