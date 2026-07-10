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
    getAll(){return request('/api/config')},
    getBrand(){return request('/api/brand')},saveBrand(d){return request('/api/brand','POST',d)},
    getClubs(){return request('/api/clubs')},saveClubs(d){return request('/api/clubs','POST',d)},
    getAI(){return request('/api/ai')},saveAI(d){return request('/api/ai','POST',d)},
    getWebhook(){return request('/api/webhook')},saveWebhook(d){return request('/api/webhook','POST',d)},
    getManual(){return request('/api/manual')},saveManual(d){return request('/api/manual','POST',d)}
};
const orderApi={getList(){return request('/api/orders')},updateStatus(id,s){return request(`/api/orders/${id}/status`,'POST',{status:s})}};
const pushApi={test(){return request('/api/push/test','POST')},order(d){return request('/api/push/order','POST',d)}};
const storage={
    get(key,fallback=null){try{const v=uni.getStorageSync(key);return v?JSON.parse(v):fallback}catch(e){return fallback}},
    set(key,value){try{uni.setStorageSync(key,JSON.stringify(value));return true}catch(e){return false}}
};
export{BASE_URL,request,configApi,orderApi,pushApi,storage};
