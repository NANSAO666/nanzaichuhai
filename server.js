const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(__dirname));

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const defaultBrand = {
  brandName: '南崽出海',
  slogan: '南崽出海,赴一场江海浪漫',
  wechat: 'DaogoG',
  phone: '13003192344',
  address: '广州市南沙区港前大道',
  businessHours: '09:00-21:00',
  overtimeRate: 500,
  brandImage: '',
  intro: '南崽出海专注广州五大游艇俱乐部高端出海体验,精致游艇+专业船长+私域定制,赴一场江海浪漫。'
};

const defaultClubs = [
  {id:'nansha',name:'南沙游艇会',area:'南沙区',address:'广州市南沙区港前大道',route:'南沙客运港→龙穴岛→凫洲大桥',facilities:['泊位120个','VIP会议厅','海景餐厅'],maxPax:60,timeSlots:['09:00-12:00','14:00-17:00','19:00-22:00'],refundRule:'提前24小时全额退款,12小时内不退',active:true,pricing:[{size:'40英尺',price:2800},{size:'50英尺',price:4500},{size:'60英尺',price:6800},{size:'70英尺',price:9800},{size:'80英尺',price:13800}],addons:[{name:'航拍跟拍',price:800},{name:'酒水套餐',price:1200},{name:'摩托艇',price:600}],images:[],intro:'南沙游艇会是广州规模最大的游艇会,120个泊位,直达出海口,适合远海观光、商务接待。'},
  {id:'taigucang',name:'太古仓游艇会',area:'海珠区',address:'广州市海珠区太古仓码头',route:'太古仓→珠江夜游→广州塔',facilities:['文艺码头','露天酒吧','摄影基地'],maxPax:40,timeSlots:['10:00-13:00','15:00-18:00','19:30-22:30'],refundRule:'提前24小时全额退款',active:true,pricing:[{size:'40英尺',price:2600},{size:'50英尺',price:4200},{size:'60英尺',price:6500},{size:'70英尺',price:9200},{size:'80英尺',price:13000}],addons:[{name:'航拍跟拍',price:800},{name:'酒水套餐',price:1000}],images:[],intro:'太古仓游艇会位于百年文艺码头,珠江夜景绝佳,适合求婚、约会、短视频拍摄。'},
  {id:'changzhou',name:'长洲岛新担涌码头',area:'黄埔区',address:'广州市黄埔区长洲岛新担涌',route:'长洲岛→黄埔军校旧址→江心岛',facilities:['历史海岛','军事文化','农家餐饮'],maxPax:35,timeSlots:['09:00-12:00','14:00-17:00','18:00-21:00'],refundRule:'提前24小时全额退款',active:true,pricing:[{size:'40英尺',price:2400},{size:'50英尺',price:3900},{size:'60英尺',price:6200},{size:'70英尺',price:8800},{size:'80英尺',price:12500}],addons:[{name:'航拍跟拍',price:700},{name:'垂钓装备',price:500}],images:[],intro:'长洲岛新担涌码头毗邻黄埔军校旧址,历史人文浓郁,适合家庭出游、垂钓休闲。'},
  {id:'lianhua',name:'莲花山游艇会',area:'番禺区',address:'广州市番禺区莲花山港',route:'莲花山→狮子洋→海鸥岛',facilities:['莲花山景','休闲度假','餐饮服务'],maxPax:45,timeSlots:['09:00-12:00','13:00-16:00','17:00-20:00'],refundRule:'提前24小时全额退款',active:true,pricing:[{size:'40英尺',price:2500},{size:'50英尺',price:4100},{size:'60英尺',price:6400},{size:'70英尺',price:9000},{size:'80英尺',price:12800}],addons:[{name:'航拍跟拍',price:750},{name:'海钓体验',price:700}],images:[],intro:'莲花山游艇会背靠莲花山,面朝狮子洋,山水相映,适合休闲度假、海钓体验。'},
  {id:'pazhouwan',name:'琶洲湾游艇会',area:'海珠区',address:'广州市海珠区琶洲会展中心江畔',route:'琶洲→广州塔→海心沙',facilities:['CBD江景','商务接待','会议厅'],maxPax:50,timeSlots:['10:00-13:00','14:00-17:00','19:00-22:00'],refundRule:'提前24小时全额退款',active:true,pricing:[{size:'40英尺',price:2700},{size:'50英尺',price:4400},{size:'60英尺',price:6700},{size:'70英尺',price:9500},{size:'80英尺',price:13500}],addons:[{name:'航拍跟拍',price:800},{name:'商务会议布置',price:1800}],images:[],intro:'琶洲湾游艇会坐拥CBD江景,广州塔尽收眼底,顶级商务接待首选。'}
];

const defaultAI = {
  apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
  apiKey: '',
  model: 'Qwen/Qwen2.5-7B-Instruct',
  systemPrompt: '你是广州【南崽出海】专属游艇运营顾问,商家微信DaogoG,联系电话13003192344;精通南沙、太古仓、琶洲湾、长洲岛、莲花山全部码头航线、租赁价格、出海规则,输出文案轻奢高级适配私域、朋友圈、短视频,所有报价、预约规则严格按照后台配置输出,简洁无冗余内容,客户咨询可主动推送商家微信和电话。',
  quickQuestions: ['南沙游艇会怎么走?','求婚推荐哪个码头?','珠江夜游哪家体验最好?','报价包含哪些服务?']
};

const defaultWebhook = { type: 'pushplus', token: '', url: '', useProxy: false };

const defaultManual = [
  {id:'m1', title:'码头筛选教程', content:'1. 打开南崽出海首页,向下滑动至「码头筛选专区」。\n2. 点击顶部区域标签(南沙区/海珠区/黄埔区/番禺区)可按区域筛选。\n3. 点击任一码头卡片进入详情页,查看码头实景图、游艇实拍、配套设施。\n4. 选定心仪码头后,点击「立即预约」进入预约表单。', image:''},
  {id:'m2', title:'在线预约全流程', content:'1. 在预约表单依次选择:俱乐部、船型、出海日期、时段、出行人数。\n2. 填写姓名、手机号(必填),可填写个性化出行备注。\n3. 点击「提交预约」,系统校验必填项。\n4. 提交成功后弹窗显示唯一订单编号。\n5. 商家微信DaogoG、电话13003192344会快速联系您确认档期。', image:''},
  {id:'m3', title:'报价测算流程', content:'1. 在码头详情页点击「智能报价」按钮。\n2. 选择游艇船型(40/50/60/70/80英尺),价格自动显示。\n3. 勾选增值服务(航拍/酒水/摩托艇等),价格累加。\n4. 系统自动生成清晰报价明细单,客户不可修改定价。\n5. 满意后点击「立即预约」直接进入表单。', image:''},
  {id:'m4', title:'退款须知', content:'1. 各码头退款规则不同,详情见码头介绍页。\n2. 一般规则:提前24小时全额退款,12-24小时退50%,12小时内不退。\n3. 如遇恶劣天气无法出海,可全额改期或退款。\n4. 退款请联系商家微信DaogoG或电话13003192344办理。', image:''},
  {id:'m5', title:'常见FAQ', content:'Q: 出海安全吗?\nA: 全程专业船长护航,配备救生设备,安全有保障。\n\nQ: 可以自带酒水食物吗?\nA: 可以自带,也可选购船上酒水套餐。\n\nQ: 出海时长多久?\nA: 标准时段3小时,可加时,超时按后台配置加价。\n\nQ: 儿童可以参加吗?\nA: 可以,需成人陪同并穿救生衣。\n\nQ: 如何联系商家?\nA: 微信DaogoG,电话13003192344。', image:''}
];

const dataFiles = {
  brand: 'brand.json',
  clubs: 'clubs.json',
  ai: 'ai.json',
  webhook: 'webhook.json',
  manual: 'manual.json',
  orders: 'orders.json'
};

function loadData(key) {
  const file = path.join(DATA_DIR, dataFiles[key]);
  if (!fs.existsSync(file)) {
    const defaults = { brand: defaultBrand, clubs: defaultClubs, ai: defaultAI, webhook: defaultWebhook, manual: defaultManual, orders: [] };
    return defaults[key];
  }
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch(e) {
    return null;
  }
}

function saveData(key, data) {
  const file = path.join(DATA_DIR, dataFiles[key]);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

app.get('/api/config', (req, res) => {
  res.json({
    brand: loadData('brand'),
    clubs: loadData('clubs'),
    ai: loadData('ai'),
    manual: loadData('manual'),
    webhook: { type: loadData('webhook')?.type || 'pushplus' }
  });
});

app.get('/api/brand', (req, res) => {
  res.json(loadData('brand'));
});

app.post('/api/brand', (req, res) => {
  saveData('brand', req.body);
  res.json({ success: true });
});

app.get('/api/clubs', (req, res) => {
  res.json(loadData('clubs'));
});

app.post('/api/clubs', (req, res) => {
  saveData('clubs', req.body);
  res.json({ success: true });
});

app.get('/api/ai', (req, res) => {
  const ai = loadData('ai');
  res.json({ ...ai, apiKey: undefined });
});

app.post('/api/ai', (req, res) => {
  saveData('ai', req.body);
  res.json({ success: true });
});

app.get('/api/webhook', (req, res) => {
  const wh = loadData('webhook');
  res.json({ type: wh?.type || 'pushplus' });
});

app.post('/api/webhook', (req, res) => {
  saveData('webhook', req.body);
  res.json({ success: true });
});

app.get('/api/manual', (req, res) => {
  res.json(loadData('manual'));
});

app.post('/api/manual', (req, res) => {
  saveData('manual', req.body);
  res.json({ success: true });
});

app.get('/api/orders', (req, res) => {
  res.json(loadData('orders') || []);
});

app.post('/api/orders', (req, res) => {
  const orders = loadData('orders') || [];
  const order = req.body;
  order.createdAt = new Date().toISOString();
  if (!order.orderId) {
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    order.orderId = `NZC${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}${rand}`;
  }
  if (!order.status) order.status = 'pending';
  orders.push(order);
  saveData('orders', orders);
  res.json({ success: true, orderId: order.orderId, order });
});

app.post('/api/orders/:orderId/status', (req, res) => {
  const orders = loadData('orders') || [];
  const order = orders.find(o => o.orderId === req.params.orderId);
  if (!order) return res.json({ success: false, error: '订单不存在' });
  order.status = req.body.status;
  saveData('orders', orders);
  res.json({ success: true });
});

async function sendPushPlus(token, title, content) {
  try {
    const https = require('https');
    const body = JSON.stringify({ token, title, content, template: 'txt' });
    return new Promise((resolve, reject) => {
      const req = https.request({
        hostname: 'www.pushplus.plus',
        path: '/send',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            resolve(result.code === 200);
          } catch(e) { resolve(false); }
        });
      });
      req.on('error', reject);
      req.write(body);
      req.end();
    });
  } catch(e) {
    console.error('PushPlus推送失败:', e);
    return false;
  }
}

async function sendWecom(url, content) {
  try {
    const https = require('https');
    const body = JSON.stringify({ msgtype: 'text', text: { content } });
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const req = https.request({
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            resolve(result.errcode === 0);
          } catch(e) { resolve(false); }
        });
      });
      req.on('error', reject);
      req.write(body);
      req.end();
    });
  } catch(e) {
    console.error('企业微信推送失败:', e);
    return false;
  }
}

app.post('/api/push/test', async (req, res) => {
  const wh = loadData('webhook');
  const title = '【南崽出海】测试消息';
  const content = '🎉 配置成功!客户预约后将自动推送订单通知至此微信。';
  let ok = false;
  let msg = '';
  
  if (wh.type === 'pushplus') {
    if (!wh.token) { res.json({ success: false, error: '请先配置PushPlus Token' }); return; }
    ok = await sendPushPlus(wh.token, title, content);
    msg = ok ? '推送成功' : '推送失败';
  } else {
    if (!wh.url) { res.json({ success: false, error: '请先配置Webhook地址' }); return; }
    ok = await sendWecom(wh.url, content);
    msg = ok ? '推送成功' : '推送失败';
  }
  res.json({ success: ok, msg });
});

app.post('/api/push/order', async (req, res) => {
  const wh = loadData('webhook');
  const order = req.body;
  const brand = loadData('brand');
  const content = `【南崽出海·新游艇预约通知】
订单编号：${order.orderId}
预约码头：${order.clubName}
码头地址：${order.clubAddress}
客户姓名：${order.customerName}
联系电话：${order.customerPhone}
选定游艇：${order.boatSize}
出海日期&时段：${order.bookingDate} ${order.timeSlot}
出行人数：${order.pax}
增值配套：${(order.addons||[]).join('、')||'无'}
客户出行备注：${order.remark||'无'}
商家对接：微信${brand.wechat} / 电话${brand.phone}
提交时间：${new Date(order.createdAt).toLocaleString('zh-CN')}
请尽快联系客户确认档期！`;

  let ok = false;
  if (wh.type === 'pushplus' && wh.token) {
    ok = await sendPushPlus(wh.token, '【南崽出海】新游艇预约通知', content);
  } else if (wh.type === 'wecom' && wh.url) {
    ok = await sendWecom(wh.url, content);
  }
  res.json({ success: ok });
});

app.post('/api/ai/chat', async (req, res) => {
  const ai = loadData('ai');
  if (!ai.apiKey || !ai.apiUrl) { res.json({ success: false, error: 'AI未配置' }); return; }
  
  try {
    const urlObj = new URL(ai.apiUrl);
    const isHttps = urlObj.protocol === 'https:';
    const httpMod = require(isHttps ? 'https' : 'http');
    const body = JSON.stringify({
      model: ai.model,
      messages: [
        { role: 'system', content: ai.systemPrompt },
        ...req.body.messages
      ],
      max_tokens: 1000
    });
    
    const result = await new Promise((resolve, reject) => {
      const req2 = httpMod.request({
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ai.apiKey}`,
          'Content-Length': Buffer.byteLength(body)
        }
      }, (res2) => {
        let data = '';
        res2.on('data', chunk => data += chunk);
        res2.on('end', () => {
          try {
            const result = JSON.parse(data);
            if (result.choices && result.choices[0]) {
              resolve(result.choices[0].message.content);
            } else {
              reject(new Error('AI返回格式错误'));
            }
          } catch(e) { reject(e); }
        });
      });
      req2.on('error', reject);
      req2.write(body);
      req2.end();
    });
    
    res.json({ success: true, content: result });
  } catch(e) {
    res.json({ success: false, error: e.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  const os = require('os');
  const ifaces = os.networkInterfaces();
  let ipList = ['localhost'];
  Object.keys(ifaces).forEach(ifname => {
    ifaces[ifname].forEach(iface => {
      if (iface.family === 'IPv4' && !iface.internal) {
        ipList.push(iface.address);
      }
    });
  });
  console.log(`
╔═══════════════════════════════════════════════════╗
║        南崽出海 - 后端服务已启动                  ║
╠═══════════════════════════════════════════════════╣
║  管理员后台: http://localhost:${PORT}/管理员后台.html  ║
║  客户前端:   http://localhost:${PORT}/客户前端.html    ║
║  API接口:    http://localhost:${PORT}/api/...          ║
╠═══════════════════════════════════════════════════╣
║  手机访问地址（同一局域网）：                       ║
${ipList.map(ip => `║    http://${ip}:${PORT}/管理员后台.html`).join('\n')}
╚═══════════════════════════════════════════════════╗
  `);
});
