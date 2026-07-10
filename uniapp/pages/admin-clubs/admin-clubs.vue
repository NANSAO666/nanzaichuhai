<template>
    <view class="admin-clubs">
        <view class="club-list">
            <view class="club-card" v-for="club in clubs" :key="club.id">
                <view class="club-header">
                    <view class="club-name">{{ club.name }}</view>
                    <view :class="['status-tag', club.active ? 'active' : 'inactive']">
                        {{ club.active ? '运营中' : '已停用' }}
                    </view>
                </view>
                <view class="club-info">
                    <text>📍 {{ club.area }} · {{ club.address }}</text>
                </view>
                <view class="club-info">
                    <text>💰 {{ club.pricing[0]?.size }} ¥{{ club.pricing[0]?.price }}起</text>
                </view>
                <view class="club-actions">
                    <view class="action-btn edit" @click="editClub(club)">编辑</view>
                    <view class="action-btn toggle" @click="toggleClub(club)">
                        {{ club.active ? '停用' : '启用' }}
                    </view>
                </view>
            </view>
        </view>

        <view class="add-btn" @click="addClub">
            + 新增码头
        </view>
    </view>
</template>

<script>
import { configApi, defaultData, storage } from '@/utils/api.js'

export default {
    data() {
        return {
            clubs: []
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
        async toggleClub(club) {
            const action = club.active ? '停用' : '启用'
            uni.showModal({
                title: '提示',
                content: `确定要${action} ${club.name} 吗？`,
                success: async (res) => {
                    if (!res.confirm) return
                    club.active = !club.active
                    try {
                        await configApi.saveClubs(this.clubs)
                    } catch (e) {}
                    storage.set('clubs', this.clubs)
                    uni.showToast({ title: `${action}成功`, icon: 'success' })
                }
            })
        },
        editClub(club) {
            uni.showToast({ title: '编辑功能请使用PC后台', icon: 'none' })
        },
        addClub() {
            uni.showToast({ title: '新增功能请使用PC后台', icon: 'none' })
        }
    }
}
</script>

<style scoped>
.admin-clubs {
    padding: 20rpx;
    padding-bottom: 160rpx;
}

.club-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 74, 124, 0.06);
}

.club-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12rpx;
}

.club-name {
    font-size: 30rpx;
    font-weight: bold;
    color: #004A7C;
}

.status-tag {
    font-size: 22rpx;
    padding: 6rpx 16rpx;
    border-radius: 20rpx;
}

.status-tag.active {
    background: #E8F7EE;
    color: #00A854;
}

.status-tag.inactive {
    background: #F0F0F0;
    color: #999;
}

.club-info {
    font-size: 24rpx;
    color: #666;
    padding: 6rpx 0;
}

.club-actions {
    display: flex;
    gap: 16rpx;
    margin-top: 16rpx;
    padding-top: 16rpx;
    border-top: 1rpx solid #f0f0f0;
}

.action-btn {
    flex: 1;
    padding: 14rpx;
    text-align: center;
    border-radius: 30rpx;
    font-size: 24rpx;
}

.action-btn.edit {
    background: #E8F1F8;
    color: #004A7C;
}

.action-btn.toggle {
    background: #FFF4E6;
    color: #FF7E00;
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
