<template>
    <main class="main_content wrap">
        <div class="payContent">
            <com-head :pageData="pageData"></com-head>
            <div class="PayMoney_wrap padding_take topMarginTop">
                <p class="PayMoney_p">充值账号： {{payInfo.Account}}</p>

                <p class="PayMoney_p">昵　　称： {{payInfo.NickName}}</p>

                <p class="PayMoney_p">账户余额：<span class="PayMoney_co">&nbsp;{{payInfo.Money}}&nbsp;</span>阅币&nbsp;|&nbsp;<span
                        class="PayMoney_co">&nbsp;{{payInfo.GiftMoney}}&nbsp;</span>礼券</p>
            </div>
            <!--支付充值区域-->
            <div class="pay_content">
                <div class="clearfix PayMoney3_title" id="PayMoney3_title">
                    <div class="PayMoney3_title1 " :class="changeIndex==index?'PayMoney3_active':''"
                         @click="choosePay(index)" v-for="(item,index) of payInfo.Items">
                        <div class="item_img" :class="{'weixin_bg' :item.Icon==1, 'zhifu_bg': item.Icon==2}"></div>
                        <span>{{item.Name}}</span>
                    </div>
                </div>
                <ul class="guess_con padding_take" id="guess_con">
                    <li v-bind:class="payInfo.SelectIndex == index?'guess_check':''" @click="chooseItem(index)"
                        v-for="(item,index) in payInfo.PayItems">
                        <div class="guess_con_content">
                            <p class="PayMoney_co">{{item.PayMoney}}元</p>
                            <span class="PayMoney_mgt">{{item.ChargeMoney}}+送<span class="PayMoney_sp PayMoney_co">{{item.GiveMoney}} </span>币</span>
                        </div>
                    </li>
                </ul>
                <div class="guess_click padding_take">
                    <a class="PayMoney_btn_next" @click="pay()">下一步</a>
                </div>
                <!--提示-->
                <form class="PayMoney_tip padding_take">
                    <fieldset class="PayMoney_attition">
                        <legend>温馨提示</legend>
                        <p class="">1.充值兑换比例：1元=100阅币;</p>

                        <p class="">2.充值遇到问题时，请联系客服。</p>

                        <p class="t_center">客服QQ：2633493356</p>

                        <p class="t_center">客服电话：400-032-3881</p>

                        <p class="t_center">书友交流或问题反馈请加入官方QQ群：467163530</p>
                    </fieldset>
                </form>
            </div>
        </div>
        <div id="zfbContent" v-html="zfbHtml"></div>
    </main>
</template>

<script>
    require('@/assets/sass/payCenter.scss')
    import pageCommon from '@/assets/script/common';
    export default {
        name: 'payCenter',
        data()
    {
        return {
            //支付渠道
            "changeIndex": 0,
            //支付信息
            "payInfo": {},
            //支付宝页面
            "zfbHtml": ''
        }
    }
    ,
    methods: {
        //初始加载
        initRequest()
        {
            const postData = pageCommon.commonArg();
            //协议id
            postData.actionid = 9011;
            this.$http.get(pageCommon.portUrl, {
                params: postData
            }).then(function (data) {
                if (!pageCommon.checkResultData(data)) {
                    return;
                }
                var data = data.body.ResponseObject[0];

                this.payInfo = data;
            }, function (response) {
                pageCommon.requestError()
            });
        }
    ,
        //选择支付渠道
        choosePay(e)
        {
            this.changeIndex = e;
        }
    ,
        //选择支付选项
        chooseItem(e)
        {
            this.payInfo.SelectIndex = e;
        }
    ,
        //微信原生支付
        onBridgeReady(args, total_fee)
        {
            var argsJson = JSON.parse(args);
            WeixinJSBridge.invoke(
                    'getBrandWCPayRequest', {
                        "appId": argsJson.appId,
                        "timeStamp": argsJson.timeStamp.toString(),
                        "nonceStr": argsJson.nonceStr,
                        "package": argsJson.package,
                        "signType": argsJson.signType,
                        "paySign": argsJson.paySign
                    },
                    function (res) {
                        if (res.err_msg == "get_brand_wcpay_request:ok") {
                            //console.warn('支付成功');
                        } // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
                        if (res.err_msg == "get_brand_wcpay_request:cancel") {
                            //console.warn('取消支付');
                        }
                        if (res.err_msg == "get_brand_wcpay_request:fail") {
                            //console.warn('支付失败');
                            //var context = currentPage.context;
                            //getPayResult(10063, context.UserId, context.Account, context.ServerId, context.ProductId);
                            mainView.router.loadPage("PayProblem.html");
                        }
                    }
            );
        }
    ,
        //支付
        pay()
        {
            let userInfo = pageCommon.toLowerObj(pageCommon.geteLocas('userInfo')),
                    mobilePhone = '',
                    payChannelId = this.payInfo.Items[this.changeIndex].Channel,
                    couponId = this.payInfo.PayItems[this.payInfo.SelectIndex].GiveMoney === 'year' ? 1 : '';


            var postData = {
                PayChanelId: payChannelId,
                UserId: userInfo.accountid,
                Account: userInfo.account,
                ServerId: this.payInfo.ServerId,
                Amount: this.payInfo.PayItems[this.payInfo.SelectIndex].PayMoney * 100,
                ProductId: this.payInfo.ProductId,
                MobilePhone: mobilePhone || '',
                ShopItem: "阅币支付",
                OsType: "9",
                showJson: 1,
                couponId: couponId
            };

            this.$http.get(pageCommon.payUrl, {
                params: postData
            }).then(function (data) {
                if (!pageCommon.checkResultData(data)) {
                    return;
                }
                var data = data.body.ResultValue;
                if (payChannelId == 10055 || payChannelId == 50055) {
                    //原生微信
                    this.onBridgeReady(data.url);
                } else if (payChannelId == 10057 || payChannelId == 50057) {
                    //第三方微信
                    window.location.href = data.url;
                } else if (payChannelId == 10059 || payChannelId == 50059) {
                    //支付宝
                    this.zfbHtml = data.url;
                    setTimeout(function () {
                        document.forms[0].submit();
                    }, 3000);
                }

            }, function (response) {
                pageCommon.requestError()
            });
        }
    }
    ,
    created: function () {
        this.initRequest();
        this.pageData = {
            "title": "充值中心",
            "pageUrl": 'payCenter'
        };
    }
    ,
    updated:function () {

    }
    }
</script>

