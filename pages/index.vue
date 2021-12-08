<template>
    <div class="page-index" v-cloak>

        <div class="card-bg notice-wrap">
            <div class="wrap-title">站点公告</div>
            <el-alert
                class="content"
                type="success"
                :description="webConfing.anounce || '暂无公告'"
                :closable="false">
            </el-alert>

        </div>

        <div class="card-bg step-wrap">
            <div class="wrap-title">下单步骤</div>
            <el-steps align-center process-status="success" >
                <el-step
                    title="步骤1" 
                    icon="el-icon-search" 
                    description="去淘宝联盟查看等级，按实际需求，选择购买的商品和数量"
                    :class="[steps == 1 ? 'active': '']"
                    @click.native="changeStep(1)" 
                ></el-step>
                <el-step
                    title="步骤2" 
                    icon="el-icon-upload" 
                    description="从App里找没有券的商品，检测淘口令有效后，下单并支付"
                    :class="[steps == 2 ? 'active': '']"
                    @click.native="changeStep(2)" 
                ></el-step>
                <el-step
                    title="步骤3" 
                    icon="el-icon-success" 
                    description="第二天再查看数据，晚上22点后下单需要后天才能生效"
                    :class="[steps == 3 ? 'active': '']"
                    @click.native="changeStep(3)" 
                ></el-step>
            </el-steps>
        </div>

        <div class="card-bg form-wrap" v-show="steps == 1">
            <div class="wrap-title">查看说明</div>
        </div>

        <div class="card-bg form-wrap" v-show="steps == 2">
            <div class="wrap-title">自助下单</div>
            <el-form :model="ruleForm" label-width="140px">
                <el-form-item label="选择分类">
                    <el-select v-model="currentCid" placeholder="请选择分类" @change="changeCid">
                        <el-option
                            v-for="(item, index) in cidList" 
                            :key="index" 
                            :label="item.name" 
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择商品">
                    <el-select v-model="currentGood.tid" placeholder="请选择商品" @change="changeGid">
                        <el-option 
                            v-for="(item, index) in goodList" 
                            :key="index" 
                            :label="item.name" 
                            :value="item.tid"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品价格">
                    <el-input v-model="totalPrice" disabled placeholder="商品价格"></el-input>
                    <el-input-number v-model="number" @change="handleNumberChange" :min="1" :max="20" label="下单数量"></el-input-number>
                </el-form-item>
                <el-form-item label="淘口令文案">
                    <el-input v-model="ruleForm.tkl"  placeholder="淘口令文案" type="textarea" :rows="4"></el-input>
                    <el-button @click="checkTkl" type="success" plain size="small" class="float-btn">检测淘口令</el-button>
                </el-form-item>
                <el-form-item label="成交帐号链接">
                    <el-input v-model="tklUrl" disabled placeholder="成交帐号链接"></el-input>
                </el-form-item>
                <el-form-item label="下单QQ">
                    <el-input v-model="ruleForm.qq" placeholder="下单QQ，查询订单用"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmitBuy">立即购买</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="card-bg form-wrap" v-show="steps == 3">
            <div class="wrap-title">查询订单</div>
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
            // 站点配置
            webConfing: {},
            steps: 2,
            // 分类列表
            cidList: [],
            // 商品列表
            goodList: [],
            // 当前选中商品
            currentCid: 1,
            currentGood: {},
            // 表单数据
            ruleForm: {
                cid: '', // 分类ID
                gid: '', // 商品ID
                qq: '',
                tkl: '',
            },
            tklUrl: '', // 成交帐号链接
            number: 1,
            // 商品总价
            totalPrice: 0,
        }
    },
    mounted() {
        this.initClassify();
    },
    methods: {
        async initClassify() {
            let cidRes = await api.getClassifyList();
            this.cidList = cidRes;
            this.currentCid = cidRes[0].id;
            this.initGoodList();
        },
        async initGoodList() {
            let goodRes = await api.getGoodList({ act: 'gettool', cid: this.currentCid });
            this.goodList = goodRes.data;
            this.changeGid(0);
        },
        // 切换分类
        async changeCid(value) {
            this.currentCid = value;
            this.initGoodList();
        },
        // 切换商品
        changeGid(value) {
            this.currentGood = this.goodList[value];
            this.calcPrice();
        },
        // 切换数量
        handleNumberChange(value) {
            console.log(value);
            this.calcPrice();
        },
        // 计算价格
        calcPrice() {
            let totalPrice = this.number * parseFloat(this.currentGood.price);
            this.totalPrice = totalPrice.toFixed(2) + ' 元';
        },
        async checkTkl() {
            let { tkl } = this.ruleForm;
            if (!tkl) {
                return this.$notify.error({
                    title: '提示',
                    message: '淘口令不能为空',
                    position: 'bottom-right'
                });
            }
            let res = await api.checkTkl({ txt: tkl});
        },
        async onSubmitBuy() {
            let params = {
                tid: '',
                inputvalue: '',
                inputvalue2: '',
                inputvalue3: '',
                num: '',
            };
            await api.createOrder(params);
        },
        // 切换步骤
        changeStep(value) {
            this.steps = value;
        }
    }
}
</script>

<style lang="less">
@import '../static/less/index.less';
</style>