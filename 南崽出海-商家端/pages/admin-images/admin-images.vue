<template>
    <view class="admin-images">
        <view class="club-select">
            <view class="select-label">选择码头</view>
            <picker :value="clubIndex" :range="clubNames" @change="onClubChange">
                <view class="picker-value">{{ clubs[clubIndex]?.name || '请选择码头' }}</view>
            </picker>
        </view>
        <view class="image-grid" v-if="currentClub">
            <view class="image-item" v-for="(img,i) in currentClub.images" :key="i">
                <image :src="img.base64" mode="aspectFill" class="image-preview"/>
                <view class="image-delete" @click="deleteImage(i)">删除</view>
                <view class="image-cover" v-if="img.isCover">封面</view>
            </view>
            <view class="upload-btn" @click="uploadImage"><text class="upload-icon">+</text><text class="upload-text">上传图片</text></view>
        </view>
        <view class="empty" v-if="!clubs.length">暂无码头，请先添加码头</view>
        <view class="empty" v-if="clubs.length&&!currentClub">请选择码头</view>
        <view class="save-btn" v-if="currentClub" @click="saveConfig">保存图片</view>
    </view>
</template>
<script>
import {configApi,storage} from '@/utils/api.js';
export default{
    data(){return{clubs:[],clubIndex:0}},
    onLoad(){this.loadClubs()},
    computed:{currentClub(){return this.clubs[this.clubIndex]},clubNames(){return this.clubs.map(c=>c.name)}},
    methods:{
        async loadClubs(){try{const res=await configApi.getClubs();this.clubs=res;storage.set('clubs',res)}catch(e){this.clubs=storage.get('clubs',[])}},
        onClubChange(e){this.clubIndex=e.detail.value},
        uploadImage(){
            uni.chooseImage({count:9,success:async(res)=>{
                uni.showLoading({title:'上传中...'});
                for(let i=0;i<res.tempFilePaths.length;i++){
                    const base64=await this.getBase64(res.tempFilePaths[i]);
                    if(!this.currentClub.images)this.currentClub.images=[];
                    this.currentClub.images.push({base64,isCover:this.currentClub.images.length===0});
                }
                uni.hideLoading();this.saveConfig();
            }})
        },
        getBase64(path){return new Promise((resolve)=>{uni.getFileSystemManager().readFile({filePath:path,encoding:'base64',success:(res)=>{resolve('data:image/png;base64,'+res.data)},fail:()=>{resolve('')}})})},
        deleteImage(index){
            uni.showModal({title:'删除图片',content:'确定删除此图片吗？',success:(res)=>{if(res.confirm){this.currentClub.images.splice(index,1);this.saveConfig()}}})
        },
        async saveConfig(){
            uni.showLoading({title:'保存中...'});
            try{await configApi.saveClubs(this.clubs);storage.set('clubs',this.clubs);uni.hideLoading();uni.showToast({title:'保存成功',icon:'success'})}
            catch(e){uni.hideLoading();storage.set('clubs',this.clubs);uni.showToast({title:'本地已保存',icon:'success'})}
        }
    }
}
</script>
<style scoped>
.admin-images{padding:20rpx;padding-bottom:160rpx}.club-select{background:#fff;border-radius:20rpx;padding:30rpx;margin-bottom:20rpx}
.select-label{font-size:26rpx;color:#666;margin-bottom:12rpx}.picker-value{background:#F0F4F8;border-radius:12rpx;padding:20rpx;font-size:28rpx;color:#004A7C}
.image-grid{display:flex;flex-wrap:wrap;gap:16rpx}.image-item{width:calc(33.33% - 12rpx);position:relative;border-radius:16rpx;overflow:hidden}
.image-preview{width:100%;height:200rpx;object-fit:cover}.image-delete{position:absolute;top:8rpx;right:8rpx;background:rgba(0,0,0,0.6);color:#fff;padding:6rpx 12rpx;font-size:20rpx;border-radius:8rpx}
.image-cover{position:absolute;bottom:8rpx;left:8rpx;background:#FF7E00;color:#fff;padding:6rpx 12rpx;font-size:20rpx;border-radius:8rpx}
.upload-btn{width:calc(33.33% - 12rpx);height:200rpx;border:2rpx dashed #ccc;border-radius:16rpx;display:flex;flex-direction:column;align-items:center;justify-content:center}
.upload-icon{font-size:48rpx;color:#999}.upload-text{font-size:24rpx;color:#999;margin-top:8rpx}
.empty{text-align:center;color:#999;padding:100rpx;font-size:28rpx}
.save-btn{position:fixed;bottom:0;left:0;right:0;margin:20rpx 30rpx;background:linear-gradient(135deg,#004A7C,#006699);color:#fff;border-radius:50rpx;padding:28rpx;text-align:center;font-size:30rpx;font-weight:bold}
</style>
