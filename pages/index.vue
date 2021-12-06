<template>
  <h1>{{ webConfing }}</h1>
</template>

<script>
import api from '@/api/index';

export default {
    async asyncData() {
        let res = await api.getIndexData({act: 'index'});
        return {
            webConfing: res.data
        }
    },
    head() {
        let { title, sitename, keywords, } = this.webConfing;
        return {
            title: `${sitename} - ${title}`,
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: keywords
                },
                {
                    hid: 'keyword',
                    name: 'keyword',
                    content: keywords
                }
            ]
        }
    },
    data() {
        return {
            webConfing: {},
        }
    },
    mounted() {
        this.initData();
    },
    methods: {
        async initData() {
            // try {
            //     let {data} = await api.getIndexData({act: 'index'});
            //     this.webConfing = data;
            //     // 弹窗通知
            //     data.anounce && this.$alert(data.anounce);
            // } catch (error) {
            //     this.$alert('获取网站配置失败');
            // }
        }
    }
}
</script>