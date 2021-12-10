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
                    title="① 使用说明" 
                    icon="el-icon-search" 
                    description="去淘宝联盟查看等级，按实际需求，选择购买的商品和数量"
                    :class="[steps == 1 ? 'active': '']"
                    @click.native="changeStep(1)" 
                ></el-step>
                <el-step
                    title="② 自助下单" 
                    icon="el-icon-upload" 
                    description="从App里找没有券的商品，检测淘口令有效后，下单并支付"
                    :class="[steps == 2 ? 'active': '']"
                    @click.native="changeStep(2)" 
                ></el-step>
                <el-step
                    title="③ 查询订单" 
                    icon="el-icon-success" 
                    description="第二天再查看数据，晚上22点后下单需要后天才能生效"
                    :class="[steps == 3 ? 'active': '']"
                    @click.native="changeStep(3)" 
                ></el-step>
            </el-steps>
        </div>

        <div class="card-bg form-wrap" v-show="steps == 1">
            <div class="wrap-title">使用说明</div>
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
                    <el-button @click="checkTkl" :loading="tklChecking" type="success" plain size="small" class="float-btn">检测淘口令</el-button>
                </el-form-item>
                <el-form-item label="成交帐号链接" v-if="tklUrl">
                    <el-input v-model="tklUrl" disabled placeholder="成交帐号链接"></el-input>
                </el-form-item>
                <el-form-item label="核对帐号PID" v-if="tklPid">
                    <el-input v-model="tklPid" disabled placeholder="成交帐号链接"></el-input>
                </el-form-item>
                <el-form-item label="下单QQ">
                    <el-input v-model="ruleForm.qq" placeholder="下单QQ，查询订单用"></el-input>
                </el-form-item>
                <el-form-item class="btn-row" v-if="!currentOrder.trade_no">
                    <el-button type="primary" @click="onSubmitBuy" :loading="submiting">立即购买</el-button>
                </el-form-item>
                <template v-else>
                    <el-form-item>
                        <el-alert
                            title="下单成功，请点击以下链接支付"
                            type="success"
                            :closable="false"
                            show-icon
                        >
                        </el-alert>
                    </el-form-item>
                    <el-form-item class="btn-row">
                        <el-button plain @click="jumpPay('alipay')">
                            <i class="iconfont icon-zhifubao"></i> 支付宝
                        </el-button>
                        <el-button plain @click="jumpPay('qq')">
                            <i class="iconfont icon-qqzhifu"></i> QQ钱包
                        </el-button>
                        <el-button plain @click="reloadPage()">
                            <i class="iconfont icon-zailaiyici"></i> 再来一单
                        </el-button>
                    </el-form-item>
                </template>
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
import setting from '@/setting.js';

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
            // 当前选中分类
            currentCid: 1,
            // 商品列表
            goodList: [],
            // 当前选中商品
            currentGood: {},
            // 表单数据
            ruleForm: {
                qq: '',
                tkl: '',
            },
            tklUrl: '', // 成交帐号链接
            tklPid: '', // 成交帐号Pid
            tklChecking: false,
            submiting: false,
            number: 1,
            // 商品总价
            totalPrice: 0,
            // 历史订单
            orderList: [],
            // 当前订单
            currentOrder: {}
        }
    },
    watch: {
        ruleForm: {
            handler: function(newVal) {
                localStorage.setItem('ruleForm', JSON.stringify(newVal));
                // 清空数据
                this.clearData();
            },
            deep: true
        },
        orderList: {
            handler: function(newVal) {
                localStorage.setItem('orderList', JSON.stringify(newVal));
            },
            deep: true
        }
    },
    mounted() {
        this.getLocalItem();
        this.initClassify();
    },
    methods: {
        getLocalItem() {
            let ruleForm = localStorage.getItem('ruleForm');
            if (ruleForm) {
                try {
                    ruleForm = JSON.parse(ruleForm);
                    let {qq, tkl} = ruleForm;
                    Object.assign(this.ruleForm, {qq, tkl});
                } catch (error) {}
            }
            let orderList = localStorage.getItem('orderList');
            if (orderList) {
                try {
                    this.orderList = JSON.parse(orderList);
                } catch (error) {}
            }
        },
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
            this.tklChecking = true;
            try {
                let res = await api.checkTkl({ txt: tkl});
                if (res.code == 1) {
                    this.tklUrl = res.url;
                    this.tklPid = res.pid;
                    this.$notify.success({
                        title: '提示',
                        message: '链接可用，请核对PID无误后下单',
                        position: 'bottom-right'
                    });
                } else {
                    this.$notify.error({
                        title: '提示',
                        message: '链接不可用，请重新选取淘口令',
                        position: 'bottom-right'
                    });
                }
                this.tklChecking = false;
            } catch (error) {
                console.log(error);
                this.$notify.error({
                    title: '提示',
                    message: '解析淘口令出错，请稍候再试',
                    position: 'bottom-right'
                });
                this.tklChecking = false;
            }
        },
        async onSubmitBuy() {
            let {tklUrl, tklPid, number, currentGood} = this;
            let {qq, tkl} = this.ruleForm;
            if (!currentGood.tid) {
                return this.$notify.error({
                    title: '提示',
                    message: '请选择商品',
                    position: 'bottom-right'
                });
            }
            if (!qq) {
                return this.$notify.error({
                    title: '提示',
                    message: '请填写下单QQ',
                    position: 'bottom-right'
                });
            }
            if (!tkl) {
                return this.$notify.error({
                    title: '提示',
                    message: '请填写淘口令',
                    position: 'bottom-right'
                });
            }
            if (!tklUrl) {
                return this.$notify.error({
                    title: '提示',
                    message: '请点击“检测淘口令”，确认淘口令有效后再下单',
                    position: 'bottom-right'
                });
            }
            try {
                await this.$confirm(`
                <div class="confirm-tips">您本次下单的商品链接对应的淘宝联盟账户ID为【${tklPid}】
                请根据上图提示核对您的账户ID是否一致，账户升级状态只能在该联盟账户ID下查看。
                若不一致请更换链接！否则将无法完成升级。</div>`, '核对信息', 
                {
                    confirmButtonText: '核对无误',
                    cancelButtonText: '取消',
                    dangerouslyUseHTMLString: true
                });
            } catch (error) {
                return; // 取消
            }
            let params = {
                tid: currentGood.tid,
                inputvalue: qq,
                inputvalue2: tkl,
                inputvalue3: tklUrl,
                num: number,
            };
            this.submiting = true;
            try {
                let res = await api.createOrder(params);
                let option = {
                    title: '提示',
                    message: res.msg,
                    position: 'bottom-right'
                };
                if (res.code == 0) {
                    this.currentOrder = {
                        need: res.need,
                        trade_no: res.trade_no,
                        create_date: +new Date()
                    };
                    this.orderList.push(this.currentOrder);
                    this.$notify.success(option);
                } else {
                    this.$notify.error(option);
                }
                this.submiting = false;
            } catch (error) {
                this.submiting = false;
            }
        },
        // 切换步骤
        changeStep(value) {
            this.steps = value;
        },
        clearData() {
            this.tklUrl = '';
            this.tklPid = '';
        },
        reloadPage() {
            window.location.reload();
        },
        // 支付
        jumpPay(payment) {
            let url = '';
            let trade_no = this.currentOrder.trade_no;
            if (payment == 'alipay') {
                url = `${setting.baseURL}/other/submit.php?type=alipay&orderid=${trade_no}`;
            } else if (payment == 'qq'){
                url = `${setting.baseURL}/other/submit.php?type=qqpay&orderid=${trade_no}`
            }
            console.log(url);
            window.open(
                url,
                'LoginWindow',
                `location=1,scrollbars=1,width=800,height=560,left=400,top=200`,
            );
        }
    }
}
</script>

<style lang="less">
@import '../static/less/index.less';
</style>