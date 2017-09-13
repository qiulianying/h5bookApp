<template>
    <main class="main_bindPhome wrap">
        <com-head :pageData="pageData"></com-head>
        <div class="mine_bd padding_take topMarginTop">
            <div class="mine_bd_div" v-show="!boxShow">
                <div class="clearfix mine_bd_mgb">
                    <input v-model.trim="account" id="PassPhoneOrName" type="tel" placeholder="手机或者帐号" class="mine_inp left tell" />
                </div>
                <input v-model.trim="pwd" id="PassWordName" type="password" placeholder="请填写密码" class="mine_inp mine_bd_mgb mine_code" />
                <p id="toLoading" class="mine_btn" v-on:click="acountloding">登录</p>
                <p class="mine_right" v-on:click="changeLanding">手机验证登录</p>
                <!--QQ帐号登录的方式  在畅读书城中有出现-->
                <div class="other_login">
                    <h3 class="other_login_title">其他登录方式</h3>
                    <a href="javascript:;" class="QQloading" v-on:click="QQloding">
                        <span class="QQicon"></span>
                        <p>QQ账号</p>
                    </a>
                </div>
            </div>
            <div class="mine_bd_div" v-show="boxShow">
                <p class="mine_bd_mgb">使用您已绑定的手机号，获取验证码登录！</p>
                <div class="clearfix mine_bd_mgb">
                    <input v-model="phone" id="bindPhoneNo" type="tel" placeholder="请输入手机号" class="mine_inp mine_inp_wid1 left tell" maxlength="11" />
                    <input v-on:click="getCodeTime" v-model="codeText" type="button"  class="mine_inp mine_inp_wid2 mine_inp_red left mine_code" id="getNumber" v-bind:style="{background:isGetCode?'#949494':'#ff6600'}" />
                </div>
                <input id="bindPhoneCode" type="text" placeholder="请输入验证码" class="mine_inp mine_bd_mgb mine_code" maxlength="6" v-model.trim="code"/>
                <p id="bindPhone" class="mine_btn" v-on:click="phoneloding">登录</p>
                <p class="mine_right" v-on:click="changeLanding">账号密码登录</p>
            </div>
        </div>
    </main>
</template>

<script>
    import pageCommon from '@/assets/script/common';
    export default {
        name: 'changeAccount',
        data() {
            return {
                boxShow: false,
                account: "",
                pwd: "",
                phone: "",
                code:"",
                codeText:"获取验证码",
                isGetCode:false,
                qqAppId:"101382398"
            }
        },
        methods: {
            changeLanding() {
                this.boxShow = !this.boxShow;
            },
            //账号登陆
            acountloding() {
                if (this.pwd == "" || this.account == "") {
                    this.open("账号或密码不能为空!");
                    return;
                }
                let _this = this;
                const postData = pageCommon.commonArg();
                //协议id
                postData.actionid = 6010;
                postData.account = this.account;
                postData.pwd = this.pwd;
                this.$http.get(pageCommon.portUrl, {
                    params: postData
                }).then(function(data) {
                    if (!pageCommon.checkResultData(data)) {
                        return;
                    }
                    if(data.body.Description==""){
                        location.href="/my";
                    }else{
                    _this.open(data.body.Description);
                    }
                    //不管成功失败，弹窗提示，input框清空
                }, function(response) {
                    pageCommon.requestError()
                });
            },
            //获取验证码
            getCodeTime(){
                //防止重复获取验证码
                if(this.phone == "" || this.phone.length != 11) {
                    this.open("请输入正确的手机号");
                    return;
                }
                if(this.isGetCode){
                    return;
                }
                let _time = 60;
                let _timer = ""; 
                let _this = this;
                _this.isGetCode=true;
                _this.codeText="重新发送("+_time+")";
                //触发请求
                _this.getCode();
                clearInterval(_timer);
                _timer = setInterval(function(){
                    if(_time==0){
                        clearInterval(_timer);
                        _this.codeText="获取验证码";
                         _this.isGetCode=false;
                        return;
                    }
                    _time--;
                    _this.codeText="重新发送("+_time+")";
                },1000)
            },
            open(msg) {
                this.$message(msg);
            },
            //手机登陆
            phoneloding(){
                let _this = this;
                if (_this.code == "") {
                    _this.open("请输入正确的验证码");
                    return;
                }
                if(this.phone == "" || this.phone.length != 11) {
                    this.open("请输入正确的手机号");
                    return;
                }
                const postData = pageCommon.commonArg();
                //协议id
                postData.actionid = 50035;
                postData.phone = _this.phone;
                postData.smscode = _this.code;
                this.$http.get(pageCommon.portUrl, {
                    params: postData
                }).then(function(data) {
                    if (!pageCommon.checkResultData(data)) {
                        return;
                    }
                    if(data.body.Description!=""){
                        _this.open(data.body.Description)
                    }else{
                        location.href="/my"
                    }
                }, function(response) {
                    pageCommon.requestError()
                });
            },
            //获取验证码
            getCode() {
                const postData = pageCommon.commonArg();
                //协议id
                postData.actionid = 50025;
                postData.phone = this.phone;
                this.$http.get(pageCommon.portUrl, {
                    params: postData
                }).then(function(data) {
                    if (!pageCommon.checkResultData(data)) {
                        return;
                    }
                }, function(response) {
                    pageCommon.requestError()
                });
            },
            QQloding(){
                var redirectUrl = encodeURIComponent(document.URL);
                var url = "https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=" + this.qqAppId + "&redirect_uri=" + redirectUrl + "&scope=get_user_info&state=qqLogin";
                location.href = url;
            }
        },
        created: function() {
            this.pageData = {
                "title": "切换账号",
                "pageUrl": 'changeAccount'
            };
        },
    }
</script>

