<template>
    <main class="main_bindPhome wrap">
        <com-head :pageData="pageData"></com-head>
        <div class="mine_bd padding_take topMarginTop">
            <p class="mine_bd_mgb">当前账号：{{urlArg.account}}</p>
            <div class="mine_bd_div">
                <div class="clearfix mine_bd_mgb">
                    <input id="bindPhoneNo" type="tel" placeholder="请输入手机号" class="mine_inp mine_inp_wid1 left tell" maxlength="11" v-model.trim="phone" />
                    <input v-on:click="getCodeTime" type="button" v-model="codeText" class="mine_inp mine_inp_wid2 mine_inp_red left mine_code" id="getNumber" v-bind:style="{background:isGetCode?'#949494':'#ff6600'}" />
                </div>
                <input id="bindPhoneCode" type="number" placeholder="请输入验证码" class="mine_inp mine_bd_mgb mine_code" maxlength="6" v-model.trim="code" />
                <p id="bindPhone" class="mine_btn" v-on:click="bindPhone">绑定该手机</p>
                <p class="mine_co">为了您的账户安全，推荐您绑定手机。绑定后，你可以使用手机号直接登录。</p>
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

<script>
    import pageCommon from '@/assets/script/common';
    require('@/assets/sass/bindPhone.scss');
    export default {
        name: 'bindPhone',
        data() {
            return {
                phone: "",
                code:"",
                codeText:"获取验证码",
                isGetCode:false,
                
                
            }
        },
        methods: {
            //获取验证码
            getCode() {
                if (this.phone == "" || this.phone.length != 11) {
                    this.open("请输入正确的手机号");
                    return;
                }
                const postData = pageCommon.commonArg();
                //协议id
                postData.actionid = 50013;
                postData.account = this.urlArg.account;
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
            getCodeTime(){
                 if (this.phone == "" || this.phone.length != 11) {
                    this.open("请输入正确的手机号");
                    return;
                }
                //防止重复获取验证码
                if(this.isGetCode){
                    return;
                }
                let _time = 60;
                let _timer = ""; 
                let _this = this;
                _this.getCode();
                _this.isGetCode=true;
                _this.codeText="重新发送("+_time+")";
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
            bindPhone(){
                let _this = this;
                if (_this.code == "") {
                    _this.open("请输入正确的验证码");
                    return;
                }
                const postData = pageCommon.commonArg();
                //协议id
                postData.actionid = 50014;
                postData.account = _this.urlArg.account;
                postData.smscode = _this.code;
                this.$http.get(pageCommon.portUrl, {
                    params: postData
                }).then(function(data) {
                    if (!pageCommon.checkResultData(data)) {
                        return;
                    }
                    
                    _this.open(data.body.Description);
                    //不管成功失败，弹窗提示，input框清空
                    
                }, function(response) {
                    pageCommon.requestError()
                });
            },
            open(msg) {
                this.$message(msg);
            }
        },
        created: function() {
            this.pageData = {
                "title": "绑定手机",
                "pageUrl": 'bindPhone'
            };
            this.urlArg = pageCommon.toLowerObj(this.$route.query);
        },
    }
</script>