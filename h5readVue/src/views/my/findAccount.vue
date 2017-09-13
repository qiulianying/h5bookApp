<template>
    <main class="FindNum-content">
        <com-head :pageData="pageData"></com-head>
        <div class="find_num clearfix topMarginTop">
            <div class="find_mgb clearfix">
                <span class="co_gray">充值订单号：</span>
                <input id="txtOrderId" v-model.trim="orderNum" class="find_inp_com" type="text" placeholder="输入充值订单号" />
            </div>
            <div class="find_mgb clearfix">
                <span class="co_gray find_span_l">充值时间：</span>
                <el-date-picker  class="find_inp_sel" v-model="dataNum" type="date" placeholder="选择日期">
                 </el-date-picker>
            </div>
            <div class="find_mgb clearfix">
                <span class="co_gray find_span_l">充值金额：</span>
                <input v-model.trim="money"  id="txtConsum" class="find_inp_com" type="number" placeholder="输入充值金额" />
            </div>
            <a class="find_inp2 mine_inp_blue" id="find_inp2_content" v-on:click="findCount">找回账号</a>
        </div>
        <div class="zhifu_bg find_step">
            <div class="find_step_tab">
                <span :class="active===0?'find_step_sp find_tab1 find_tab_active':'find_step_sp find_tab1'" @click="tag(0)">微信订单号获取</span>
                <span :class="active===1?'find_step_sp find_tab2 find_tab_active':'find_step_sp find_tab2'" @click="tag(1)">支付宝订单号获取</span>
            </div>
            <div class="find_step_div wechat_step" v-show="active===0">
                <img src="../../assets/delete/wechat_step_01.png" alt="">
                <img src="../../assets/delete/wechat_step_02.png" alt="">
                <img src="../../assets/delete/wechat_step_03.png" alt="">
                <img src="../../assets/delete/wechat_step_04.png" alt="">
            </div>
            <div class="find_step_div zhifubao_step" v-show="active===1">
                <img src="../../assets/delete/zhifubao_step_01.png" alt="">
                <img src="../../assets/delete/zhifubao_step_02.png" alt="">
                <img src="../../assets/delete/zhifubao_step_03.png" alt="">
                <img src="../../assets/delete/zhifubao_step_04.png" alt="">
            </div>
        </div>
        <!--提醒框-->
        <!-- <div class="list_1 dbnone" id="list_1">
            <h3>安卓读书</h3>
            <div class="list_2" id="list_2">
                <p id="tip">请输入正确的手机号码</p>
                <div class="sure_down"><a href="javascript:;" id="sure_chekc">确定</a></div>
            </div>
        </div> -->
        <!--遮盖层-->
        <!-- <div id="mask" class="mask dbnone"></div> -->
    </main>
</template>

<script type="text/ecmascript-6">
import pageCommon from '@/assets/script/common';
    export default {
        name: 'findAccount',
        data() {
            return {
                //默认选中tag
                active:0,
                //日期
                dataNum: '',
                //金额
                money: '',
                //订单号
                orderNum:''
            };
        },
         methods: {           
            //找回账号
            findCount(){
                if(this.orderNum==""){
                    this.$message("订单号不能为空");
                    return;
                }  
                if(this.money==""){
                    this.$message("金额不能为空");
                    return;
                } 
                if(this.dataNum==""){
                    this.$message("日期不能为空");
                    return;
                }  
                const postData = pageCommon.commonArg();
                let _this = this;
                //协议id
                postData.actionid = 9023;
                postData.orderId = this.orderNum;
                postData.time = this.dataNum;
                postData.consum = this.money;
                this.$http.get(pageCommon.portUrl, {
                    params: postData
                }).then(function(data) {
                    if (!pageCommon.checkResultData(data)) {
                        return;
                    }
                   _this.open(data.body.Description)
                }, function(response) {
                    pageCommon.requestError()
                });
            },
             tag(e) {
                this.active=e;
            }

        },
        created: function() {
            this.pageData = {
                "title": "账号找回",
                "pageUrl": 'findAccount'
            };
        },
    }
</script>
