'use strict';

const db = uniCloud.database();
const configCollection = db.collection('nzch_config');
const ordersCollection = db.collection('nzch_orders');

const ADMIN_TOKEN = 'nzch_admin_2026';

exports.main = async (event, context) => {
  const { action, data, token } = event;
  
  try {
    switch(action) {
      case 'getConfig':
        return await getConfig();
      case 'updateConfig':
        if(token !== ADMIN_TOKEN) return { errCode: 403, errMsg: '无权限' };
        return await updateConfig(data);
      case 'createOrder':
        return await createOrder(data);
      case 'getOrders':
        if(token !== ADMIN_TOKEN) return { errCode: 403, errMsg: '无权限' };
        return await getOrders(data);
      case 'updateOrder':
        if(token !== ADMIN_TOKEN) return { errCode: 403, errMsg: '无权限' };
        return await updateOrder(data);
      default:
        return { errCode: 400, errMsg: '未知操作' };
    }
  } catch(e) {
    console.error('API错误:', e);
    return { errCode: 500, errMsg: e.message };
  }
};

async function getConfig() {
  const res = await configCollection.where({ key: 'main' }).get();
  if(res.data && res.data.length > 0) {
    return { errCode: 0, errMsg: '', data: res.data[0].value };
  }
  return { errCode: 0, errMsg: '', data: null };
}

async function updateConfig(configData) {
  const res = await configCollection.where({ key: 'main' }).get();
  if(res.data && res.data.length > 0) {
    await configCollection.doc(res.data[0]._id).update({
      value: configData,
      updateTime: Date.now()
    });
  } else {
    await configCollection.add({
      key: 'main',
      value: configData,
      createTime: Date.now(),
      updateTime: Date.now()
    });
  }
  return { errCode: 0, errMsg: '', data: { success: true } };
}

async function createOrder(order) {
  const result = await ordersCollection.add({
    ...order,
    createTime: Date.now(),
    updateTime: Date.now()
  });
  return { 
    errCode: 0, 
    errMsg: '', 
    data: { 
      id: result.id,
      orderId: order.orderId
    } 
  };
}

async function getOrders(params = {}) {
  const { phone, status, clubId, page = 1, pageSize = 50 } = params;
  let query = ordersCollection;
  
  const where = {};
  if(phone) where.customerPhone = phone;
  if(status) where.status = status;
  if(clubId) where.clubId = clubId;
  
  if(Object.keys(where).length > 0) {
    query = query.where(where);
  }
  
  const countRes = await query.count();
  const listRes = await query
    .orderBy('createTime', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get();
  
  return {
    errCode: 0,
    errMsg: '',
    data: {
      list: listRes.data,
      total: countRes.total,
      page,
      pageSize
    }
  };
}

async function updateOrder(params) {
  const { orderId, status, ...updateData } = params;
  const res = await ordersCollection.where({ orderId }).get();
  
  if(!res.data || res.data.length === 0) {
    return { errCode: 404, errMsg: '订单不存在' };
  }
  
  await ordersCollection.doc(res.data[0]._id).update({
    ...updateData,
    status: status || res.data[0].status,
    updateTime: Date.now()
  });
  
  return { errCode: 0, errMsg: '', data: { success: true } };
}
