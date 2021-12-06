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
    getIndexData(params) {
        return http.get(`/api/index.php`, { params })
    }

}