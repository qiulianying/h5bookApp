<template>
    <main class="main_VIPpay">
        <com-head :pageData="pageData"></com-head>
        <div class="PayMoney_wrap padding_take topMarginTop">
            <div class="imgBox"><img v-bind:src="user.headUrl" alt=""><i v-bind:class="user.isVip?'isVip':'noVip'"></i></div>
            <div class="VIP_message">
                <h3>{{user.name}}</h3>
                <p class="ellipsis">{{user.tip}}</p>
            </div>
        </div>
        <!--支付充值区域-->
        <div class="pay_content">
            <div class="clearfix PayMoney3_title" id="PayMoney3_title">
                <p class="vip_tip">会员周期里的一个月按30天计，从开通当日起生效。</p>
                <div v-for="(item, index) in payChannel.items" :class="[changeIndex==index?'PayMoney3_active':'','PayMoney3_title'+(index+1)]" @click="choosePay(index)">
                    <div class="item_img" :class="{'weixin_bg' :item.icon==1, 'zhifu_bg': item.icon==2}"></div>
                    <span>{{item.name}}</span>
                </div>
            </div>
            <ul class="guess_con" id="guess_con">
                <li v-for="(item, index) in payItem" :class="payItemIndex == index?'guess_check':''" @click="chooseItem(index)">
                    <div class="guess_con_content">
                        <i v-if="item.isRecom" class="suggest"></i>
                        <p class="PayMoney_data">{{item.type}}</p>
                        <p class="PayMoney_sp">{{item.money}}元</p>
                    </div>
                </li>
            </ul>
            <div class="guess_click padding_take">
                <a class="PayMoney_btn_next" @click="pay()">{{user.isVip?'续费会员':'开通会员'}}</a>
            </div>
            <div class="VIP_introduce">
                <h3 class="vip_privilege">会员特权</h3>
                <ul class="vip_content">
                    <li>
                        <img src="../../assets/images/icon/m_vip.png" alt="">
                        <div class="introduce">
                            <h3>会员专区免费</h3>
                            <p>专区海量图书免费阅读</p>
                        </div>
                    </li>
                    <li>
                        <img src="../../assets/images/icon/z_vip.png" alt="">
                        <div class="introduce">
                            <h3>全站小说八折</h3>
                            <p>专区外尽享八折优惠</p>
                        </div>
                    </li>
                    <li>
                        <img src="../../assets/images/icon/1_vip.png" alt="">
                        <div class="introduce">
                            <h3>每月礼券赠送</h3>
                            <p>每月赠送200礼券</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </main>
</template>

<script>
    require('@/assets/sass/payCenter.scss');
    import pageCommon from '@/assets/script/common';
    export default {
        name: 'vipPay',
        data() {
            return {
                //支付渠道选项
                "changeIndex": 0, 
                //支付渠道
                "payChannel":[],
                //选择支付项
                "payItem":[], 
                //选择支付项
                "payItemIndex":0,               
                //支付信息
                "user":{},
            }
        },
        methods: {
            //初始加载
            initRequest() {
                const postData = pageCommon.commonArg();
                //协议id
                postData.actionid = 9029;
                let _this = this;
                this.$http.get(pageCommon.portUrl, {
                    params: postData
                }).then(function(data) {
                    if (!pageCommon.checkResultData(data)) {
                        return;
                    }
                    var data = data.body.ResponseObject[0];
                    this.payChannel = data.payChannel;
                    this.payItem = data.payItem;
                    this.user = data.user;
                    data.payItem.forEach(function(v,i){
                      if(v.isRecom){
                        _this.payItemIndex=i;
                      }
                    });
                }, function(response) {
                    pageCommon.requestError()
                });
            },
            //选择支付渠道
            choosePay(e){
               this.changeIndex=e;
            },
            //选择支付选项
            chooseItem(e) {
               this.payItemIndex=e;
            },
            //微信原生支付
            onBridgeReady(args, total_fee) {
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
                    function(res) {
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
            },
            //支付
            pay(){
                let userInfo=pageCommon.toLowerObj(pageCommon.geteLocas('userInfo')),
                  mobilePhone='',
                  payChannelId=this.payChannel.items[this.changeIndex].channel;

             
               
                var postData = {
                    PayChanelId:payChannelId,
                    UserId: userInfo.accountid,
                    Account: userInfo.account,
                    ServerId: 0,
                    Amount: this.payItem[this.payItemIndex].money * 100,
                    ProductId: this.payChannel.productId,
                    MobilePhone: mobilePhone || '',
                    ShopItemId:this.payItem[this.payItemIndex].shopitem,
                    OsType:9,
                    ShopItem: "阅币支付",
                    showJson:1
                };

                this.$http.get(pageCommon.payUrl, {
                                params: postData
                            }).then(function(data) {
                    if (!pageCommon.checkResultData(data)) {
                        return;
                    }
                    var data=data.body.ResultValue;
                    if(payChannelId == 10055 || payChannelId == 50055){
                        //原生微信
                       this.onBridgeReady(data.url);
                    }else if(payChannelId == 10057 || payChannelId == 50057){
                       //第三方微信
                       window.location.href=data.url;
                    }else if(payChannelId == 10059 || payChannelId == 50059){
                       //支付宝
                       this.zfbHtml=data.url;
                       setTimeout(function(){
                          document.forms[0].submit();
                       }, 3000);
                    }

                }, function(response) {
                    pageCommon.requestError()
                });            
            },
            //充值接口
            PayResult(userId, account, productId) {
                let _this = this;
                let _channel = _this.channel,
                    _amount = _this.money,
                    _shopitem = _this.shopitem,
                    _openId = window.localStorage.getItem("openId") || "";
                var paydata = {
                    PayChanelId: _channel,
                    UserId: userId,
                    Account: account,
                    ServerId: '0',
                    Amount: _amount * 100,
                    ProductId: productId,
                    MobilePhone: _openId,
                    ShopItem: "会员充值",
                    ShopItemId: _shopitem,
                    OsType: "9"
                };
                console.log(paydata)
                this.$http.get(pageCommon.payUrl, {
                    params: paydata,
                    emulateJSON: true
                }).then(function(r) {
                    
                }, function(response) {
                    pageCommon.requestError()
                });
            }
        },
        created: function() {
            this.initRequest();
            this.pageData = {
                "title": "会员充值",
                "pageUrl": 'vipPay'
            };
        },
    }
</script>