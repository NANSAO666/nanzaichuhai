const BASE_URL = 'http://localhost:3000';
function request(url, method='GET', data={}){
    return new Promise((resolve,reject)=>{
        uni.request({
            url:BASE_URL+url,method,data,header:{'Content-Type':'application/json'},
            success:res=>res.statusCode===200?resolve(res.data):reject(new Error('请求失败')),
            fail:err=>reject(err)
        })
    })
}
const configApi={
    getAll(){return request('/api/config')},getBrand(){return request('/api/brand')},
    getClubs(){return request('/api/clubs')},getAI(){return request('/api/ai')},
    getManual(){return request('/api/manual')}
};
const orderApi={
    getList(){return request('/api/orders')},
    create(data){return request('/api/orders','POST',data)}
};
const aiApi={chat(m){return request('/api/ai/chat','POST',{messages:m})}};
const defaultData={
    brand:{brandName:'南崽出海',slogan:'南崽出海,赴一场江海浪漫',wechat:'DaogoG',phone:'13003192344',address:'广州市南沙区港前大道',businessHours:'09:00-21:00',overtimeRate:500,intro:'南崽出海专注广州五大游艇俱乐部高端出海体验'},
    clubs:[
        {id:'nansha',name:'南沙游艇会',area:'南沙区',address:'广州市南沙区港前大道',route:'南沙客运港→龙穴岛→凫洲大桥',facilities:['泊位120个','VIP会议厅','海景餐厅'],maxPax:60,timeSlots:['09:00-12:00','14:00-17:00','19:00-22:00'],refundRule:'提前24小时全额退款',active:true,pricing:[{size:'40英尺',price:2800},{size:'50英尺',price:4500},{size:'60英尺',price:6800},{size:'70英尺',price:9800},{size:'80英尺',price:13800}],addons:[{name:'航拍跟拍',price:800},{name:'酒水套餐',price:1200},{name:'摩托艇',price:600}],images:[],intro:'广州规模最大的游艇会'},
        {id:'taigucang',name:'太古仓游艇会',area:'海珠区',address:'广州市海珠区太古仓码头',route:'太古仓→珠江夜游→广州塔',facilities:['文艺码头','露天酒吧','摄影基地'],maxPax:40,timeSlots:['10:00-13:00','15:00-18:00','19:30-22:30'],refundRule:'提前24小时全额退款',active:true,pricing:[{size:'40英尺',price:2600},{size:'50英尺',price:4200},{size:'60英尺',price:6500},{size:'70英尺',price:9200},{size:'80英尺',price:13000}],addons:[{name:'航拍跟拍',price:800},{name:'酒水套餐',price:1000}],images:[],intro:'百年文艺码头,珠江夜景绝佳'},
        {id:'changzhou',name:'长洲岛新担涌码头',area:'黄埔区',address:'广州市黄埔区长洲岛新担涌',route:'长洲岛→黄埔军校旧址→江心岛',facilities:['历史海岛','军事文化','农家餐饮'],maxPax:35,timeSlots:['09:00-12:00','14:00-17:00','18:00-21:00'],refundRule:'提前24小时全额退款',active:true,pricing:[{size:'40英尺',price:2400},{size:'50英尺',price:3900},{size:'60英尺',price:6200},{size:'70英尺',price:8800},{size:'80英尺',price:12500}],addons:[{name:'航拍跟拍',price:700},{name:'垂钓装备',price:500}],images:[],intro:'毗邻黄埔军校旧址'},
        {id:'lianhua',name:'莲花山游艇会',area:'番禺区',address:'广州市番禺区莲花山港',route:'莲花山→狮子洋→海鸥岛',facilities:['莲花山景','休闲度假','餐饮服务'],maxPax:45,timeSlots:['09:00-12:00','13:00-16:00','17:00-20:00'],refundRule:'提前24小时全额退款',active:true,pricing:[{size:'40英尺',price:2500},{size:'50英尺',price:4100},{size:'60英尺',price:6400},{size:'70英尺',price:9000},{size:'80英尺',price:12800}],addons:[{name:'航拍跟拍',price:750},{name:'海钓体验',price:700}],images:[],intro:'背靠莲花山,面朝狮子洋'},
        {id:'pazhouwan',name:'琶洲湾游艇会',area:'海珠区',address:'广州市海珠区琶洲会展中心江畔',route:'琶洲→广州塔→海心沙',facilities:['CBD江景','商务接待','会议厅'],maxPax:50,timeSlots:['10:00-13:00','14:00-17:00','19:00-22:00'],refundRule:'提前24小时全额退款',active:true,pricing:[{size:'40英尺',price:2700},{size:'50英尺',price:4400},{size:'60英尺',price:6700},{size:'70英尺',price:9500},{size:'80英尺',price:13500}],addons:[{name:'航拍跟拍',price:800},{name:'商务会议布置',price:1800}],images:[],intro:'坐拥CBD江景,广州塔尽收眼底'}
    ],
    manual:[
        {id:'m1',title:'如何预约游艇',content:'1. 在首页或码头页选择心仪的游艇俱乐部\n2. 查看码头详情、船型价格和配套服务\n3. 点击「立即预约」进入预约表单\n4. 选择码头、船型、出海日期和时段\n5. 填写出行人数、姓名和手机号\n6. 提交预约，商家将尽快联系您确认档期'},
        {id:'m2',title:'关于费用说明',content:'💰 基础费用：按船型/尺寸计费，不同码头价格略有差异\n⏰ 超时费用：超出约定时间按小时计费\n🎁 增值服务：航拍跟拍、酒水套餐、摩托艇、海钓体验等可按需选购'},
        {id:'m3',title:'出行须知与安全',content:'👕 穿着建议：建议穿着休闲舒适的衣物和防滑鞋\n🌊 安全须知：登船后请听从船长和工作人员指挥\n⛑️ 安全设备：每艘游艇均配备救生衣、灭火器等安全设备'},
        {id:'m4',title:'退改政策',content:'📅 提前取消：出行前24小时以上取消全额退款，12-24小时退款50%，12小时内不予退款\n🌧️ 恶劣天气：如遇台风、暴雨等不可抗力因素导致无法出海，可全额退款或改期'},
        {id:'m5',title:'联系我们',content:'📞 客服电话：13003192344\n💬 微信客服：DaogoG\n📍 商家地址：广州市南沙区港前大道\n🕐 营业时间：09:00-21:00'}
    ]
};
const storage={
    get(key,fallback=null){try{const v=uni.getStorageSync(key);return v?JSON.parse(v):fallback}catch(e){return fallback}},
    set(key,value){try{uni.setStorageSync(key,JSON.stringify(value));return true}catch(e){return false}}
};
export{BASE_URL,request,configApi,orderApi,aiApi,defaultData,storage};
