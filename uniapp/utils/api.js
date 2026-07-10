// API 配置 - 修改这里的地址为你的后端服务器地址
const BASE_URL = 'http://localhost:3000'

// 通用请求函数
function request(url, method = 'GET', data = {}) {
    return new Promise((resolve, reject) => {
        uni.request({
            url: BASE_URL + url,
            method: method,
            data: data,
            header: {
                'Content-Type': 'application/json'
            },
            success: (res) => {
                if (res.statusCode === 200) {
                    resolve(res.data)
                } else {
                    reject(new Error('请求失败: ' + res.statusCode))
                }
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}

// 配置相关 API
const configApi = {
    // 获取全部配置
    getAll() {
        return request('/api/config')
    },
    // 获取品牌配置
    getBrand() {
        return request('/api/brand')
    },
    // 保存品牌配置
    saveBrand(data) {
        return request('/api/brand', 'POST', data)
    },
    // 获取俱乐部列表
    getClubs() {
        return request('/api/clubs')
    },
    // 保存俱乐部列表
    saveClubs(data) {
        return request('/api/clubs', 'POST', data)
    },
    // 获取AI配置
    getAI() {
        return request('/api/ai')
    },
    // 保存AI配置
    saveAI(data) {
        return request('/api/ai', 'POST', data)
    },
    // 获取推送配置
    getWebhook() {
        return request('/api/webhook')
    },
    // 保存推送配置
    saveWebhook(data) {
        return request('/api/webhook', 'POST', data)
    },
    // 获取说明书
    getManual() {
        return request('/api/manual')
    },
    // 保存说明书
    saveManual(data) {
        return request('/api/manual', 'POST', data)
    }
}

// 订单相关 API
const orderApi = {
    // 获取订单列表
    getList() {
        return request('/api/orders')
    },
    // 创建订单
    create(data) {
        return request('/api/orders', 'POST', data)
    },
    // 更新订单状态
    updateStatus(orderId, status) {
        return request(`/api/orders/${orderId}/status`, 'POST', { status })
    }
}

// 推送相关 API
const pushApi = {
    // 测试推送
    test() {
        return request('/api/push/test', 'POST')
    },
    // 推送订单通知
    order(data) {
        return request('/api/push/order', 'POST', data)
    }
}

// AI 相关 API
const aiApi = {
    // AI对话
    chat(messages) {
        return request('/api/ai/chat', 'POST', { messages })
    }
}

// 默认数据（无网络时使用）
const defaultData = {
    brand: {
        brandName: '南崽出海',
        slogan: '南崽出海,赴一场江海浪漫',
        wechat: 'DaogoG',
        phone: '13003192344',
        address: '广州市南沙区港前大道',
        businessHours: '09:00-21:00',
        overtimeRate: 500,
        brandImage: '',
        intro: '南崽出海专注广州五大游艇俱乐部高端出海体验,精致游艇+专业船长+私域定制,赴一场江海浪漫。'
    },
    clubs: [
        {id:'nansha',name:'南沙游艇会',area:'南沙区',address:'广州市南沙区港前大道',route:'南沙客运港→龙穴岛→凫洲大桥',facilities:['泊位120个','VIP会议厅','海景餐厅'],maxPax:60,timeSlots:['09:00-12:00','14:00-17:00','19:00-22:00'],refundRule:'提前24小时全额退款,12小时内不退',active:true,pricing:[{size:'40英尺',price:2800},{size:'50英尺',price:4500},{size:'60英尺',price:6800},{size:'70英尺',price:9800},{size:'80英尺',price:13800}],addons:[{name:'航拍跟拍',price:800},{name:'酒水套餐',price:1200},{name:'摩托艇',price:600}],images:[],intro:'南沙游艇会是广州规模最大的游艇会,120个泊位,直达出海口,适合远海观光、商务接待。'},
        {id:'taigucang',name:'太古仓游艇会',area:'海珠区',address:'广州市海珠区太古仓码头',route:'太古仓→珠江夜游→广州塔',facilities:['文艺码头','露天酒吧','摄影基地'],maxPax:40,timeSlots:['10:00-13:00','15:00-18:00','19:30-22:30'],refundRule:'提前24小时全额退款',active:true,pricing:[{size:'40英尺',price:2600},{size:'50英尺',price:4200},{size:'60英尺',price:6500},{size:'70英尺',price:9200},{size:'80英尺',price:13000}],addons:[{name:'航拍跟拍',price:800},{name:'酒水套餐',price:1000}],images:[],intro:'太古仓游艇会位于百年文艺码头,珠江夜景绝佳,适合求婚、约会、短视频拍摄。'},
        {id:'changzhou',name:'长洲岛新担涌码头',area:'黄埔区',address:'广州市黄埔区长洲岛新担涌',route:'长洲岛→黄埔军校旧址→江心岛',facilities:['历史海岛','军事文化','农家餐饮'],maxPax:35,timeSlots:['09:00-12:00','14:00-17:00','18:00-21:00'],refundRule:'提前24小时全额退款',active:true,pricing:[{size:'40英尺',price:2400},{size:'50英尺',price:3900},{size:'60英尺',price:6200},{size:'70英尺',price:8800},{size:'80英尺',price:12500}],addons:[{name:'航拍跟拍',price:700},{name:'垂钓装备',price:500}],images:[],intro:'长洲岛新担涌码头毗邻黄埔军校旧址,历史人文浓郁,适合家庭出游、垂钓休闲。'},
        {id:'lianhua',name:'莲花山游艇会',area:'番禺区',address:'广州市番禺区莲花山港',route:'莲花山→狮子洋→海鸥岛',facilities:['莲花山景','休闲度假','餐饮服务'],maxPax:45,timeSlots:['09:00-12:00','13:00-16:00','17:00-20:00'],refundRule:'提前24小时全额退款',active:true,pricing:[{size:'40英尺',price:2500},{size:'50英尺',price:4100},{size:'60英尺',price:6400},{size:'70英尺',price:9000},{size:'80英尺',price:12800}],addons:[{name:'航拍跟拍',price:750},{name:'海钓体验',price:700}],images:[],intro:'莲花山游艇会背靠莲花山,面朝狮子洋,山水相映,适合休闲度假、海钓体验。'},
        {id:'pazhouwan',name:'琶洲湾游艇会',area:'海珠区',address:'广州市海珠区琶洲会展中心江畔',route:'琶洲→广州塔→海心沙',facilities:['CBD江景','商务接待','会议厅'],maxPax:50,timeSlots:['10:00-13:00','14:00-17:00','19:00-22:00'],refundRule:'提前24小时全额退款',active:true,pricing:[{size:'40英尺',price:2700},{size:'50英尺',price:4400},{size:'60英尺',price:6700},{size:'70英尺',price:9500},{size:'80英尺',price:13500}],addons:[{name:'航拍跟拍',price:800},{name:'商务会议布置',price:1800}],images:[],intro:'琶洲湾游艇会坐拥CBD江景,广州塔尽收眼底,顶级商务接待首选。'}
    ],
    manual: [
        {id:'m1',title:'如何预约游艇',content:'1. 在首页或码头页选择心仪的游艇俱乐部\n2. 查看码头详情、船型价格和配套服务\n3. 点击「立即预约」进入预约表单\n4. 选择码头、船型、出海日期和时段\n5. 填写出行人数、姓名和手机号\n6. 提交预约，商家将尽快联系您确认档期\n\n💡 小提示：建议提前1-3天预约，周末和节假日请尽早安排！'},
        {id:'m2',title:'关于费用说明',content:'💰 基础费用：\n按船型/尺寸计费，不同码头价格略有差异，具体见各码头详情页。\n\n⏰ 超时费用：\n超出约定时间按小时计费，具体费率以商家确认为准。\n\n🎁 增值服务：\n航拍跟拍、酒水套餐、摩托艇、海钓体验等可按需选购。\n\n💳 支付方式：\n预约提交后商家联系确认，支持微信/支付宝/银行转账。'},
        {id:'m3',title:'出行须知与安全',content:'👕 穿着建议：\n建议穿着休闲舒适的衣物和防滑鞋，夏季备好防晒用品。\n\n🌊 安全须知：\n• 登船后请听从船长和工作人员指挥\n• 航行时请勿在船舷追逐打闹\n• 老人和儿童需有成人陪同\n• 严禁酒后驾驶游艇\n• 如遇身体不适请及时告知船员\n\n⛑️ 安全设备：\n每艘游艇均配备救生衣、灭火器等安全设备，请放心出行。'},
        {id:'m4',title:'退改政策',content:'📅 提前取消：\n• 出行前24小时以上取消：全额退款\n• 出行前12-24小时取消：退款50%\n• 出行前12小时内取消：不予退款\n\n🌧️ 恶劣天气：\n如遇台风、暴雨等不可抗力因素导致无法出海，可全额退款或改期。\n\n🔄 改期说明：\n如需改期，请提前联系商家，根据档期情况协商安排。'},
        {id:'m5',title:'联系我们',content:'📞 客服电话：13003192344\n💬 微信客服：DaogoG\n📍 商家地址：广州市南沙区港前大道\n🕐 营业时间：09:00-21:00\n\n有任何问题随时联系我们，南崽出海竭诚为您服务！\n\n⛵ 南崽出海，赴一场江海浪漫'}
    ]
}

// 本地存储管理
const storage = {
    get(key, fallback = null) {
        try {
            const val = uni.getStorageSync(key)
            return val ? JSON.parse(val) : fallback
        } catch (e) {
            return fallback
        }
    },
    set(key, value) {
        try {
            uni.setStorageSync(key, JSON.stringify(value))
            return true
        } catch (e) {
            return false
        }
    }
}

export {
    BASE_URL,
    request,
    configApi,
    orderApi,
    pushApi,
    aiApi,
    defaultData,
    storage
}
