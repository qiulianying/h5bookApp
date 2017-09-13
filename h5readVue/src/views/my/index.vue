<template>
  <main class="main_content wrap">
  <com-head :pageData="pageData"></com-head>
    <div class="mine_div topMarginTop">
        <!--账户信息-->
        <ul class="clearfix mine_div_list">
            <li>
                <img :src="userInfo.HeadUrl" />
            </li>
            <li class="mine_list_second">
                <p class="mine_div_ft">{{userInfo.NickName}}</p>
                <p class="mine_div_co mine_div_mo">账号：{{userInfo.Account}}</p>
            </li>
            <li class="mine_list_last">
                <router-link to="/my/payCenter"><span class="mine_div_tch">充值</span></router-link>
            </li>
        </ul>
        <div class="acc_list clearfix">
            <router-link class="acc_list_li" to="/my/payCenter"><span>阅币</span><span class="acc_li_blue">{{userInfo.Money}}</span></router-link>
            <div class="acc_list_li"><span>礼券</span><span class="acc_li_blue">{{userInfo.GiftMoney}}</span></div>
            <div class="acc_list_li">
                <span>会员</span>
                <router-link class="acc_li_black" to="/my/VIPpay" v-if="userInfo.IsVip">{{userInfo.VipTip}}</router-link>
                <router-link class="acc_li_black" to="/my/VIPpay" v-if="!userInfo.IsVip">立即开通</router-link>
            </div>
        </div>
    </div>
    <!--账户操作-->
    <ul class="mine_take_list">
       <li class="mine_list">
            <a id="QQloading" href="javascript:;" class="mine_list_a qd">
                <ul class="clearfix">
                    <li>
                        <span class="icon_bg icon_imgQQ"></span>
                    </li>
                    <li>
                        <p>绑定QQ号</p>
                    </li>
                    <li>
                        <span class="mine_list_sp bd_sp" style="color:#848B90" v-if="userInfo.HasBindQQ">已绑定</span>
                        <span class="mine_list_sp bd_sp" v-if="!userInfo.HasBindQQ" v-on:click="bindQQ">未绑定</span>
                    </li>
                </ul>
            </a>
        </li>
        <li class="mine_list">
            <a id="mineQd" href="javascript:;" class="mine_list_a qd">
                <ul class="clearfix">
                    <li>
                        <span class="icon_bg icon_img1"></span>
                    </li>
                    <li>
                        <p>礼券</p>
                    </li>
                    <li>
                        <span class=" mine_list_sp" style="color:#848B90" v-if="userInfo.IsSign">已签到</span>
                        <span class="mine_list_btn mine_list_blue" style="padding-right: 6px;" v-if="!userInfo.IsSign" v-on:click="CheckIn">签到</span>
                    </li>
                </ul>
            </a>
        </li>
        <li class="mine_list">
            <a v-bind:href="userInfo.IsShowBindPhone?'javascript:;':'/my/bindPhone?Account='+userInfo.Account"  class="mine_list_a bd">
                <ul class="clearfix">
                    <li>
                        <span class="icon_bg icon_img2"></span>
                    </li>
                    <li>
                        <p>绑定手机号</p>
                    </li>
                    <li>
                        <span class=" bd_sp mine_list_sp" style="color:#848B90"  v-if="userInfo.IsShowBindPhone">已绑定</span>
                        <span class="mine_list_sp bd_sp" v-if="!userInfo.IsShowBindPhone">送300礼券</span>
                    </li>
                </ul>
            </a>
        </li>
        <li class="mine_list">
            <router-link v-bind:to="'/my/setPassword?Account='+userInfo.Account" class="mine_list_a bd">
                <ul class="clearfix">
                    <li>
                        <span class="icon_bg icon_img3"></span>
                    </li>
                    <li>
                        <p>密码设置</p>
                    </li>
                    <li>
                        <span class="mine_list_sp bd_sp" style="color:#848B90"  v-if="userInfo.HasSetPwd">修改</span>
                        <span class="mine_list_sp bd_sp" v-if="!userInfo.HasSetPwd">送50礼券</span>
                    </li>
                </ul>
            </router-link>
        </li>
        <li class="mine_list">
            <router-link to="/my/help" class="mine_list_a">
                <ul class="clearfix">
                    <li>
                        <span class="icon_bg icon_img4"></span>
                    </li>
                    <li>
                        <p class="mine_list_a">帮助说明</p>
                    </li>
                    <li>
                        <span class="mine_list_sp">&nbsp;</span>
                    </li>
                </ul>
            </router-link>
        </li>
        <li class="mine_list">
            <router-link to="/my/FindAccount" class="mine_list_a">
                <ul class="clearfix">
                    <li>
                        <span class="icon_bg icon_img5"></span>
                    </li>
                    <li>
                        <p class="mine_list_a">账号找回</p>
                    </li>
                    <li>
                        <span class="mine_list_sp mine_list_co">账号遗失一步找回</span>
                    </li>
                </ul>
            </router-link>
        </li>
        <li class="mine_list">
            <router-link to="/my/changeAccount" class="mine_list_a  mine_list_qie">切换账号</router-link>
        </li>
    </ul>
    <!-- 底部-->
    <com-foot active="3"></com-foot>  
    <!-- 加载动画 -->
    <com-pageLoad v-if="isLoad"></com-pageLoad>
</main>
</template>

<script>
require('@/assets/sass/my_content.scss')
import pageCommon from '@/assets/script/common';
export default {
  name: 'myIndex',
  data () {
    return {
       userInfo:{},
       qqAppId:"101382398",
       //是的展示加载动画
       isLoad:true
    }
  }, methods:{
    //初始加载
    initRequest() {
      const postData = pageCommon.commonArg();
        //协议id
        postData.actionid = 9012;
        let _this = this;
        this.$http.get(pageCommon.portUrl, { params: postData }).then(function(data) {
            if (!pageCommon.checkResultData(data)) {
                return;
            }
            var data = data.body.ResponseObject[0];
            _this.userInfo=data;
            this.isLoad=false;
            //是否密码设置
            window.localStorage.setItem('HasSetPwd',data.HasSetPwd);
        }, function(response) {
            pageCommon.requestError()
        });
    },
    //签到事件
    CheckIn(){
        const postData = pageCommon.commonArg();
        postData.actionid = 4002;
        let _this = this;
        this.$http.get(pageCommon.portUrl, { params: postData }).then(function(data) {
            if (!pageCommon.checkResultData(data)) {
                return;
            }
            _this.open(data.body.Description);
            _this.userInfo.IsSign = true;
        }, function(response) {
            pageCommon.requestError()
        });
    },
     open(msg) {
        this.$message(msg);
    },
    bindQQ(){
        var redirectUrl = encodeURIComponent(document.URL);
        var url = "https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=" + this.qqAppId + "&redirect_uri=" + redirectUrl + "&scope=get_user_info&state=qqBind";
        location.href = url;
    }    
  },    
    created:function(){
    this.pageData={
        "title":"我的账户",
        "pageUrl":'myIndex'
    };
    this.initRequest();   
 }, 
}
</script>
