import axios from 'axios';
import setting from '@/setting.js';

const http = axios.create({
    baseURL: setting.baseURL,
    timeout: 1000,
});

// 返回拦截器
http.interceptors.response.use((config) => {
    return config.data;
});

export default {
    // 获取页面配置
    getIndexData(params = {}) {
        return http.get(`/api/index.php`, { params })
    },
    // 获取商品列分类
    getClassifyList() {
        return [
            { name: '淘宝联盟引流', id: 1 },
            { name: '联盟成交金额', id: 10 },
            { name: '联盟成交人数', id: 9 },
        ]
    },
    // 获取商品列表、详情、价格，下单
    getGoodList(params ={}) {
        return http.get(`/ajax.php`, { params })
    },
    // 检测淘口令
    checkTkl(params ={}) {
        return http.post(`/tkl.php`, params)
    },
    // 生成订单
    createOrder(params ={}) {
        return http.post('/ajax.php?act=pay', params)
    }

}