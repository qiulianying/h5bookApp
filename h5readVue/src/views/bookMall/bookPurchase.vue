<template>
    <div class="wrap">
        <!--头部-->
        <com-head :pageData="pageData"></com-head>

        <main class="main_bookPurchase">
            <h4 class="chapter_title">章节订阅信息</h4>

            <h3 class="chapter_h book_pd">{{this.bookContent.ChapterName}}</h3>

            <p class="book_pd">{{this.bookContent.BookName}}</p>

            <div class="chapter_mes">
                <p>当前账户：{{this.bookContent.NickName}}</p>

                <p class="">账户余额：<span>&nbsp;{{this.bookContent.Money}}&nbsp;</span>阅币&nbsp;|&nbsp;<span>&nbsp;{{this.bookContent.GiftMoney}}&nbsp;</span>礼券
                </p>

                <p>本章价格：{{this.bookContent.Coin}} 阅币</p>

                <p>亲，您的账户余额不足订阅哦，充点零钱支持一下吧，感谢您对作者和正版的支持！</p>

            </div>
            <div class="chapter_btn_d clearfix">
                <router-link to="/my/payCenter" class="chapter_btn chapter_buy left">充值阅币</router-link>
                <a class="chapter_btn chapter_read right" @click="findCount()">阅读本章</a>
            </div>
        </main>
        <footer class="footer_bookPurchase">
            <div class="chapter_btm clearfix book_pd">
                <a href="javascript:;">&nbsp;首页&nbsp;|</a>
                <a href="javascript:;">&nbsp;客服&nbsp;|</a>
                <a href="javascript:;">&nbsp;书架&nbsp;|</a>
                <a href="javascript:;">&nbsp;充值&nbsp;|</a>
                <a href="javascript:;">&nbsp;登录&nbsp;</a>
            </div>
            <p class="chapter_pdb chapter_co">闽ICP备13007466号-3</p>

            <p class="chapter_pdb">福州佳软软件技术有限公司 版权所有</p>

            <p class="chapter_pdb">微信搜索<a href="javascript:;" class="chapter_co1">“畅读书城”</a>关注畅读书城官方公众号</p>
        </footer>
    </div>
</template>

<script type="text/ecmascript-6">
    require('@/assets/sass/bookCatalog.scss');
    /*引入ajax*/
    import pageCommon from '@/assets/script/common';

    name: 'bookPurchase'
    export default {
        data: function () {
            return {
                //页面参数
                urlArg: pageCommon.toLowerObj(this.$route.query),
                //页面内容
                bookContent: ""
            }
        },
        created: function () {
            this.pageData = {
                "title": "章节订阅",
                "pageUrl": 'bookPurchase'
            };
            this.initRequest();
        },
        methods: {
            //初始请求
            initRequest: function () {
                const postData = pageCommon.commonArg();
                //协议id
                postData.actionid = 9006;
                //书籍id
                postData.bookId = this.urlArg.bookid;
                //章节id 章节id不能直接在链接中
                postData.chapterId = this.urlArg.chapterid;

                this.$http.get(pageCommon.portUrl, {params: postData}).then(function (data) {
                    this.bookContent = data.body.ResponseObject[0];

                }, function (response) {
                    pageCommon.requestError()
                });
            },
            //引用elme的组件提示
            findCount: function(){
                this.$message({
                    message: "您的阅币/礼劵不足，请先充值!",
                    type: 'warning'
                });
                return
            }
        }
    }
</script>
