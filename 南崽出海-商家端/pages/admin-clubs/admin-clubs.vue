<template>
    <view class="admin-clubs">
        <view class="club-list">
            <view class="club-card" v-for="(club,i) in clubs" :key="club.id" @click="editClub(club)">
                <view class="club-header">
                    <view class="club-name">{{ club.name }}</view>
                    <view class="club-status" :class="club.active?'active':'inactive'">{{ club.active?'运营中':'已停用' }}</view>
                </view>
                <view class="club-info">{{ club.area }} · {{ club.address }}</view>
                <view class="club-images">
                    <image v-for="(img,j) in (club.images||[]).slice(0,3)" :key="j" :src="img.base64" mode="aspectFill" class="mini-img"/>
                    <view class="add-img" v-if="!club.images||club.images.length<3" @click.stop="addImage(club)"><text>+</text></view>
                </view>
                <view class="club-price">起价 ¥{{ club.pricing[0]?.price || 0 }}/3小时</view>
                <view class="club-actions">
                    <view class="action-btn" @click.stop="toggleStatus(club)">{{ club.active?'停用':'启用' }}</view>
                    <view class="action-btn delete" @click.stop="deleteClub(club)">删除</view>
                </view>
            </view>
        </view>
        <view class="add-btn" @click="addNewClub"><text class="add-icon">+</text><text>新增码头</text></view>
    </view>
</template>
<script>
import {configApi,storage} from '@/utils/api.js';
export default{
    data(){return{clubs:[]}},
    onLoad(){this.loadClubs()},
    methods:{
        async loadClubs(){try{const res=await configApi.getClubs();this.clubs=res;storage.set('clubs',res)}catch(e){this.clubs=storage.get('clubs',[])}},
        async saveClubs(){uni.showLoading({title:'保存中...'});try{await configApi.saveClubs(this.clubs);storage.set('clubs',this.clubs);uni.hideLoading();uni.showToast({title:'保存成功',icon:'success'})}catch(e){uni.hideLoading();storage.set('clubs',this.clubs);uni.showToast({title:'本地已保存',icon:'success'})}},
        addNewClub(){
            const newClub={id:'club_'+Date.now(),name:'新码头',area:'',address:'',route:'',intro:'',refundRule:'',images:[],pricing:[{size:'40尺',price:0},{size:'55尺',price:0},{size:'70尺',price:0}],addons:[],facilities:[],timeSlots:['上午09:00-12:00','下午14:00-17:00','傍晚17:00-20:00'],active:true};
            this.clubs.push(newClub);this.saveClubs()
        },
        editClub(club){
            uni.showModal({title:'编辑码头',editable:true,placeholderText:'输入码头名称',content:club.name,success:(res)=>{
                if(res.confirm&&res.content){club.name=res.content;this.saveClubs()}
            }})
        },
        toggleStatus(club){club.active=!club.active;this.saveClubs()},
        deleteClub(club){
            uni.showModal({title:'删除确认',content:'确定删除此码头？',success:(res)=>{
                if(res.confirm){this.clubs=this.clubs.filter(c=>c.id!==club.id);this.saveClubs()}
            }})
        },
        addImage(club){
            uni.showToast({title:'图片管理请前往图片管理页',icon:'none'})
        }
    }
}
</script>
<style scoped>
.admin-clubs{padding:20rpx;padding-bottom:160rpx}.club-list{display:flex;flex-direction:column;gap:20rpx}
.club-card{background:#fff;border-radius:20rpx;padding:30rpx}.club-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16rpx}
.club-name{font-size:30rpx;font-weight:bold;color:#004A7C}.club-status{font-size:22rpx;padding:6rpx 16rpx;border-radius:20rpx}.club-status.active{background:#E8F5E9;color:#4CAF50}.club-status.inactive{background:#FFF3E0;color:#FF7E00}
.club-info{font-size:24rpx;color:#666;margin-bottom:16rpx}.club-images{display:flex;gap:12rpx;margin-bottom:16rpx}
.mini-img{width:120rpx;height:120rpx;border-radius:12rpx;object-fit:cover}.add-img{width:120rpx;height:120rpx;border-radius:12rpx;border:2rpx dashed #ccc;display:flex;align-items:center;justify-content:center;font-size:40rpx;color:#999}
.club-price{font-size:28rpx;color:#FF7E00;font-weight:bold;margin-bottom:20rpx}.club-actions{display:flex;gap:16rpx}
.action-btn{flex:1;background:#F0F4F8;color:#004A7C;border-radius:12rpx;padding:16rpx;text-align:center;font-size:26rpx}.action-btn.delete{background:#FFEBEE;color:#E53935}
.add-btn{position:fixed;bottom:0;left:0;right:0;margin:20rpx 30rpx;background:linear-gradient(135deg,#004A7C,#006699);color:#fff;border-radius:50rpx;padding:28rpx;text-align:center;font-size:30rpx;font-weight:bold;display:flex;align-items:center;justify-content:center;gap:12rpx}.add-icon{font-size:40rpx}
</style>
