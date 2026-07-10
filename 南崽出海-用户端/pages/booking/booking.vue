<template>
    <view class="booking-page">
        <view class="form-card">
            <view class="form-title">预约信息</view>
            <view class="form-item" @click="showClubPicker=true"><view class="form-label">选择码头</view><view class="form-value">{{ selectedClub?selectedClub.name:'请选择码头' }}<text class="arrow">›</text></view></view>
            <view class="form-item" v-if="selectedClub">
                <view class="form-label">选择船型</view>
                <view class="boat-list"><view :class="['boat-item',selectedBoat===p.size?'active':'']" v-for="(p,i) in selectedClub.pricing" :key="i" @click="selectedBoat=p.size;selectedPrice=p.price"><text class="boat-size">{{ p.size }}</text><text class="boat-price">¥{{ p.price }}</text></view></view>
            </view>
            <view class="form-item" @click="showDatePicker=true"><view class="form-label">出海日期</view><view class="form-value">{{ bookingDate||'请选择日期' }}<text class="arrow">›</text></view></view>
            <view class="form-item" v-if="selectedClub"><view class="form-label">出海时段</view><view class="slot-list"><view :class="['slot-item',selectedSlot===slot?'active':'']" v-for="(slot,i) in selectedClub.timeSlots" :key="i" @click="selectedSlot=slot">{{ slot }}</view></view></view>
            <view class="form-item"><view class="form-label">出行人数</view><view class="counter"><view class="counter-btn" @click="pax>1&&pax--">-</view><text class="counter-num">{{ pax }}</text><view class="counter-btn" @click="pax++">+</view></view></view>
            <view class="form-item" v-if="selectedClub&&selectedClub.addons.length"><view class="form-label">增值服务</view><view class="addon-list"><view :class="['addon-item',selectedAddons.includes(addon.name)?'active':'']" v-for="(addon,i) in selectedClub.addons" :key="i" @click="toggleAddon(addon.name)"><text>{{ addon.name }}</text><text class="addon-price">+¥{{ addon.price }}</text></view></view></view>
        </view>
        <view class="form-card">
            <view class="form-title">联系信息</view>
            <view class="form-item"><view class="form-label">您的姓名</view><input class="form-input" v-model="customerName" placeholder="请输入姓名"/></view>
            <view class="form-item"><view class="form-label">手机号码</view><input class="form-input" v-model="customerPhone" type="number" maxlength="11" placeholder="请输入手机号"/></view>
            <view class="form-item"><view class="form-label">备注信息</view><textarea class="form-textarea" v-model="remark" placeholder="有什么特殊需求请备注"/></view>
        </view>
        <view class="price-card" v-if="selectedPrice">
            <view class="price-row"><text>基础费用</text><text>¥{{ selectedPrice }}</text></view>
            <view class="price-row" v-for="addon in selectedAddonsDetail" :key="addon.name"><text>{{ addon.name }}</text><text>+¥{{ addon.price }}</text></view>
            <view class="price-row total"><text>预估总价</text><text class="total-price">¥{{ totalPrice }}</text></view>
        </view>
        <view class="submit-area"><view class="submit-btn" @click="submitBooking">提交预约</view></view>
        <view class="picker-mask" v-if="showDatePicker" @click="showDatePicker=false"><view class="picker-content" @click.stop><picker-view :value="dateValue" @change="onDateChange" class="date-picker"><picker-view-column><view v-for="y in years" :key="y">{{ y }}年</view></picker-view-column><picker-view-column><view v-for="m in months" :key="m">{{ m }}月</view></picker-view-column><picker-view-column><view v-for="d in days" :key="d">{{ d }}日</view></picker-view-column></picker-view><view class="picker-btns"><view class="picker-btn cancel" @click="showDatePicker=false">取消</view><view class="picker-btn confirm" @click="confirmDate">确定</view></view></view></view>
        <view class="picker-mask" v-if="showClubPicker" @click="showClubPicker=false"><view class="picker-content" @click.stop><view class="picker-title">选择码头</view><scroll-view scroll-y class="club-picker-list"><view class="club-picker-item" v-for="club in activeClubs" :key="club.id" @click="selectClub(club)">{{ club.name }}<text class="club-picker-area">{{ club.area }}</text></view></scroll-view></view></view>
    </view>
</template>
<script>
import {configApi,orderApi,defaultData,storage} from '@/utils/api.js';
export default{
    data(){return{clubs:[],selectedClub:null,selectedBoat:'',selectedPrice:0,bookingDate:'',selectedSlot:'',pax:6,selectedAddons:[],customerName:'',customerPhone:'',remark:'',showDatePicker:false,showClubPicker:false,years:[],months:[],days:[],dateValue:[0,0,0]}},
    computed:{
        activeClubs(){return this.clubs.filter(c=>c.active!==false)},
        selectedAddonsDetail(){if(!this.selectedClub)return[];return this.selectedClub.addons.filter(a=>this.selectedAddons.includes(a.name))},
        totalPrice(){let t=this.selectedPrice;this.selectedAddonsDetail.forEach(a=>t+=a.price);return t}
    },
    onLoad(options){this.initDate();this.loadClubs();if(options.clubId){setTimeout(()=>{const c=this.clubs.find(x=>x.id===options.clubId);if(c)this.selectClub(c)},300)}},
    methods:{
        initDate(){const now=new Date();for(let i=0;i<3;i++)this.years.push(now.getFullYear()+i);for(let i=1;i<=12;i++)this.months.push(i);this.updateDays(now.getFullYear(),now.getMonth()+1);this.dateValue=[0,now.getMonth(),now.getDate()-1]},
        updateDays(y,m){const d=new Date(y,m,0).getDate();this.days=[];for(let i=1;i<=d;i++)this.days.push(i)},
        onDateChange(e){const[yi,mi,di]=e.detail.value;this.updateDays(this.years[yi],this.months[mi]);this.dateValue=[yi,mi,Math.min(di,this.days.length-1)]},
        confirmDate(){const[yi,mi,di]=this.dateValue;this.bookingDate=`${this.years[yi]}-${String(this.months[mi]).padStart(2,'0')}-${String(this.days[di]).padStart(2,'0')}`;this.showDatePicker=false},
        async loadClubs(){try{const res=await configApi.getClubs();this.clubs=res;storage.set('clubs',res)}catch(e){this.clubs=storage.get('clubs',defaultData.clubs)}},
        selectClub(c){this.selectedClub=c;this.selectedBoat=c.pricing[0]?.size||'';this.selectedPrice=c.pricing[0]?.price||0;this.selectedSlot='';this.selectedAddons=[];this.showClubPicker=false},
        toggleAddon(n){const i=this.selectedAddons.indexOf(n);i>=0?this.selectedAddons.splice(i,1):this.selectedAddons.push(n)},
        async submitBooking(){
            if(!this.selectedClub){uni.showToast({title:'请选择码头',icon:'none'});return}
            if(!this.selectedBoat){uni.showToast({title:'请选择船型',icon:'none'});return}
            if(!this.bookingDate){uni.showToast({title:'请选择日期',icon:'none'});return}
            if(!this.selectedSlot){uni.showToast({title:'请选择时段',icon:'none'});return}
            if(!this.customerName.trim()){uni.showToast({title:'请输入姓名',icon:'none'});return}
            if(!/^1\d{10}$/.test(this.customerPhone)){uni.showToast({title:'请输入正确的手机号',icon:'none'});return}
            const o={clubId:this.selectedClub.id,clubName:this.selectedClub.name,clubAddress:this.selectedClub.address,boatSize:this.selectedBoat,bookingDate:this.bookingDate,timeSlot:this.selectedSlot,pax:this.pax,addons:this.selectedAddons,customerName:this.customerName.trim(),customerPhone:this.customerPhone,remark:this.remark.trim(),status:'pending'};
            uni.showLoading({title:'提交中...'});
            try{const res=await orderApi.create(o);uni.hideLoading();if(res.success){uni.showModal({title:'预约成功',content:`订单号：${res.orderId}\n我们会尽快与您联系确认档期！`,showCancel:false,success:()=>uni.switchTab({url:'/pages/mine/mine'})})}else{uni.showToast({title:res.error||'提交失败',icon:'none'})}}
            catch(e){uni.hideLoading();uni.showToast({title:'网络异常，请稍后重试',icon:'none'})}
        }
    }
}
</script>
<style scoped>
.booking-page{padding:20rpx;padding-bottom:160rpx}.form-card{background:#fff;border-radius:20rpx;padding:30rpx;margin-bottom:20rpx}
.form-title{font-size:32rpx;font-weight:bold;color:#004A7C;margin-bottom:24rpx;font-family:Georgia,serif}
.form-item{padding:20rpx 0;border-bottom:1rpx solid #f0f0f0}.form-item:last-child{border-bottom:none}
.form-label{font-size:26rpx;color:#666;margin-bottom:12rpx}.form-value{font-size:28rpx;color:#333;display:flex;justify-content:space-between;align-items:center}
.arrow{color:#ccc;font-size:32rpx}.form-input{background:#F0F4F8;border-radius:12rpx;padding:18rpx 24rpx;font-size:28rpx}
.form-textarea{background:#F0F4F8;border-radius:12rpx;padding:18rpx 24rpx;font-size:28rpx;width:100%;height:160rpx;box-sizing:border-box}
.boat-list{display:flex;flex-wrap:wrap;gap:16rpx}.boat-item{flex:1;min-width:30%;background:#F0F4F8;border-radius:12rpx;padding:20rpx;text-align:center;border:2rpx solid transparent}
.boat-item.active{background:rgba(0,74,124,0.1);border-color:#004A7C}.boat-size{font-size:26rpx;color:#004A7C;font-weight:600;display:block}
.boat-price{font-size:22rpx;color:#FF7E00;margin-top:6rpx;display:block}
.slot-list{display:flex;flex-wrap:wrap;gap:16rpx}.slot-item{padding:14rpx 28rpx;background:#F0F4F8;border-radius:30rpx;font-size:24rpx;color:#666;border:2rpx solid transparent}
.slot-item.active{background:rgba(0,74,124,0.1);border-color:#004A7C;color:#004A7C}
.counter{display:flex;align-items:center;gap:30rpx}.counter-btn{width:60rpx;height:60rpx;background:#F0F4F8;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:32rpx;color:#004A7C}
.counter-num{font-size:32rpx;font-weight:600;color:#004A7C;min-width:60rpx;text-align:center}
.addon-list{display:flex;flex-wrap:wrap;gap:16rpx}.addon-item{padding:14rpx 24rpx;background:#F0F4F8;border-radius:12rpx;font-size:24rpx;color:#666;display:flex;align-items:center;gap:8rpx;border:2rpx solid transparent}
.addon-item.active{background:rgba(255,126,0,0.1);border-color:#FF7E00;color:#FF7E00}.addon-price{font-size:22rpx}
.price-card{background:#fff;border-radius:20rpx;padding:30rpx;margin-bottom:20rpx}.price-row{display:flex;justify-content:space-between;padding:12rpx 0;font-size:26rpx;color:#666}
.price-row.total{border-top:1rpx solid #f0f0f0;margin-top:12rpx;padding-top:20rpx;font-weight:600}.total-price{font-size:36rpx;color:#FF7E00;font-weight:bold}
.submit-area{position:fixed;bottom:0;left:0;right:0;padding:20rpx 30rpx;background:#fff;box-shadow:0 -4rpx 20rpx rgba(0,0,0,0.05)}
.submit-btn{background:linear-gradient(135deg,#FF7E00,#FF9933);color:#fff;border-radius:50rpx;padding:28rpx;text-align:center;font-size:32rpx;font-weight:bold}
.picker-mask{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:999;display:flex;align-items:flex-end}
.picker-content{width:100%;background:#fff;border-radius:30rpx 30rpx 0 0;padding:30rpx;padding-bottom:50rpx}
.picker-title{font-size:30rpx;font-weight:600;color:#004A7C;text-align:center;margin-bottom:20rpx}
.date-picker{height:400rpx}.picker-btns{display:flex;gap:20rpx;margin-top:20rpx}
.picker-btn{flex:1;padding:24rpx;text-align:center;border-radius:50rpx;font-size:28rpx}.picker-btn.cancel{background:#F0F4F8;color:#666}
.picker-btn.confirm{background:linear-gradient(135deg,#004A7C,#006699);color:#fff}.club-picker-list{max-height:600rpx}
.club-picker-item{padding:24rpx;border-bottom:1rpx solid #f0f0f0;font-size:28rpx;color:#333;display:flex;justify-content:space-between;align-items:center}
.club-picker-area{font-size:24rpx;color:#999}
</style>
