<template>
    <main class="main_bindPhome wrap">
        <com-head :pageData="pageData"></com-head>
        <div class="mine_bd padding_take topMarginTop">
            <p class="mine_bd_mgb">当前账号：{{urlArg.account}}</p>
            <div class="mine_bd_div">
                <div class="clearfix mine_bd_mgb" v-show="HasSetPwd">
                    <input id="PassWord" type="password" placeholder="请填写旧密码" class="mine_inp left tell" v-model.trim="oldpwd" />
                </div>
                <div class="clearfix mine_bd_mgb">
                    <input id="PassWord" type="password" placeholder="请填写密码" class="mine_inp left tell" v-model.trim="pwd" />
                </div>
                <input id="PassWordAgin" type="password" placeholder="请再次填写密码" class="mine_inp mine_bd_mgb mine_code" v-model.trim="repwd" />
                <p id="bindPassWord" class="mine_btn" v-on:click="setPsw">设置</p>
                <p class="mine_co">提示：牢记账号与所设置的密码，以便后期直接登录。</p>
            </div>
        </div>
    </main>
</template>

<script>
    import pageCommon from '@/assets/script/common';
    export default {
        name: 'setPassword',
        data() {
            return {
                oldpwd: "",
                pwd: "",
                repwd: "",
                HasSetPwd: ""
            }
        },
        methods: {
            //初始加载
            initRequest() {
                const postData = pageCommon.commonArg();
                let _this = this;
                //协议id
                postData.actionid = 607;
                postData.oldpwd = this.oldpwd;
                postData.pwd = this.pwd;
                this.$http.get(pageCommon.portUrl, {
                    params: postData
                }).then(function(data) {
                    if (!pageCommon.checkResultData(data)) {
                        return;
                    }
                    if(data.body.Description==""){
                        _this.open("密码设置成功");
                    }else{
                        _this.open(data.body.Description);
                    }
                    _this.oldpwd = _this.repwd = _this.pwd = "";
                    var data = data.body.ResponseObject[0];
                    _this.userInfo = data;
                }, function(response) {
                    console.log(response);
                    pageCommon.requestError()
                });
            },
            //设置按钮触发事件
            setPsw() {
                if(this.pwd!=this.repwd){
                    this.open("请保持密码一致");
                    return;
                }
                this.initRequest();
            },
            //提示框
            open(msg) {
                this.$message(msg);
            }
        },
        created: function() {
            this.pageData = {
                "title": "密码设置",
                "pageUrl": 'setPassword'
            };
            //取账号
            this.urlArg = pageCommon.toLowerObj(this.$route.query);
            //判断是否设置过密码，来确实是否显示oldpsw 这个input框
            let _HasSetPwd = window.localStorage.getItem('HasSetPwd');
            if (_HasSetPwd) {
                this.HasSetPwd = true;
            } else {
                this.HasSetPwd = false;
            }
        },
    }
</script>
