<template>
    <div class="page-index">

        <div class="card-bg notice-wrap">
            <div class="wrap-title">站点公告</div>
            <el-alert
                class="content"
                type="success"
                description="暂无公告">
            </el-alert>

        </div>

        <div class="card-bg step-wrap">
            <div class="wrap-title">下单步骤</div>
            <el-steps :active="2" align-center>
                <el-step title="步骤1" description="这是一段很长很长很长的描述性文字"></el-step>
                <el-step title="步骤2" description="这是一段很长很长很长的描述性文字"></el-step>
                <el-step title="步骤4" description="这是一段很长很长很长的描述性文字"></el-step>
            </el-steps>
        </div>

        <div class="card-bg form-wrap">
            <div class="wrap-title">自助下单</div>
        </div>

        <div class="card-bg questions-wrap">
            <div class="wrap-title">常见问题</div>
            <div class="ques-item">①.引流数据第二天更新后不够的请联系客服</div>
            <div class="ques-item">②.22点之后下单后天才能满</div>
            <div class="ques-item">③.点我查看如何找无优惠券商品</div>
        </div>
    </div>
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

<style lang="less">
@import '../static/less/index.less';
</style>