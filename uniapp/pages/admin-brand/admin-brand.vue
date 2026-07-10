<template>
    <view class="admin-brand">
        <view class="form-card">
            <view class="form-title">品牌信息</view>
            
            <view class="form-item">
                <view class="form-label">品牌名称</view>
                <input class="form-input" v-model="form.brandName" placeholder="请输入品牌名称"/>
            </view>

            <view class="form-item">
                <view class="form-label">品牌标语</view>
                <input class="form-input" v-model="form.slogan" placeholder="请输入品牌标语"/>
            </view>

            <view class="form-item">
                <view class="form-label">商家微信</view>
                <input class="form-input" v-model="form.wechat" placeholder="请输入微信号"/>
            </view>

            <view class="form-item">
                <view class="form-label">联系电话</view>
                <input class="form-input" v-model="form.phone" type="number" placeholder="请输入联系电话"/>
            </view>

            <view class="form-item">
                <view class="form-label">商家地址</view>
                <input class="form-input" v-model="form.address" placeholder="请输入地址"/>
            </view>

            <view class="form-item">
                <view class="form-label">营业时间</view>
                <input class="form-input" v-model="form.businessHours" placeholder="例如 09:00-21:00"/>
            </view>

            <view class="form-item">
                <view class="form-label">超时费用(元/小时)</view>
                <input class="form-input" v-model="form.overtimeRate" type="number" placeholder="超时每小时费用"/>
            </view>

            <view class="form-item">
                <view class="form-label">品牌简介</view>
                <textarea class="form-textarea" v-model="form.intro" placeholder="品牌介绍文字"/>
            </view>
        </view>

        <view class="save-btn" @click="saveConfig">
            保存配置
        </view>
    </view>
</template>

<script>
import { configApi, storage, defaultData } from '@/utils/api.js'

export default {
    data() {
        return {
            form: {
                brandName: '',
                slogan: '',
                wechat: '',
                phone: '',
                address: '',
                businessHours: '',
                overtimeRate: 0,
                intro: ''
            }
        }
    },
    onLoad() {
        this.loadData()
    },
    methods: {
        async loadData() {
            try {
                const res = await configApi.getBrand()
                this.form = res
                storage.set('brand', res)
            } catch (e) {
                this.form = storage.get('brand', defaultData.brand)
            }
        },
        async saveConfig() {
            if (!this.form.brandName) {
                uni.showToast({ title: '请输入品牌名称', icon: 'none' })
                return
            }
            if (!this.form.wechat) {
                uni.showToast({ title: '请输入微信号', icon: 'none' })
                return
            }
            if (!this.form.phone) {
                uni.showToast({ title: '请输入联系电话', icon: 'none' })
                return
            }

            uni.showLoading({ title: '保存中...' })
            try {
                const res = await configApi.saveBrand(this.form)
                uni.hideLoading()
                if (res.success !== false) {
                    storage.set('brand', this.form)
                    uni.showToast({ title: '保存成功', icon: 'success' })
                } else {
                    uni.showToast({ title: '保存失败', icon: 'none' })
                }
            } catch (e) {
                uni.hideLoading()
                storage.set('brand', this.form)
                uni.showToast({ title: '本地已保存', icon: 'success' })
            }
        }
    }
}
</script>

<style scoped>
.admin-brand {
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
    margin-bottom: 24rpx;
    font-family: Georgia, serif;
}

.form-item {
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
}

.form-item:last-child {
    border-bottom: none;
}

.form-label {
    font-size: 26rpx;
    color: #666;
    margin-bottom: 12rpx;
}

.form-input {
    background: #F0F4F8;
    border-radius: 12rpx;
    padding: 18rpx 24rpx;
    font-size: 28rpx;
}

.form-textarea {
    background: #F0F4F8;
    border-radius: 12rpx;
    padding: 18rpx 24rpx;
    font-size: 28rpx;
    width: 100%;
    height: 200rpx;
    box-sizing: border-box;
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
