<template>
    <div class="wrap">
        <main class="main_search">
            <header class="search_header">
                <div class="dets_top_div">
                    <input type="search" class="sea_top" placeholder="搜索书名、作者、出版社" v-model="keyword" @click="maskShow()"/>
                    <a class="top_nac_icon back" id="btn_return" href="/"></a>
                    <a class="top_nac_icon3" href="javascript:;" @click="search()"></a>
                </div>
            </header>
            <!--热门搜索 ajax内容填充-->
            <div class="mok_bai word_bai_con" v-show="history">
                <h5 class="title_po">热门搜索 <span class="Refresh_bg" @click="refresh()"></span></h5>
                <ul class="clearfix hot_ul">
                    <li v-for="item of hotData" @click="searchWrod(item)">
                        <a>{{item}}</a>
                    </li>
                </ul>
            </div>
            <!--/热门搜索-->
            <!--搜索历史 ajax内容填充-->
            <div class="search_history_cons" v-show="history">
                <h5 class="title_po">搜索历史 <span class="del_bg1" @click="clearSearcHistory()"></span></h5>
                <ul class="clearfix history_ul">
                    <li v-for="item of searcHistory" @click="searchWrod(item)">
                        <a href="javascript:;">{{item}}</a>
                    </li>
                </ul>
            </div>
            <!--快速搜索内容框 ajax内容填充-->
            <div class="search_keyword_con" v-show="keywordShow">
                <ul class="clearfix keyword_ul">
                    <li class="searchBoxLi" v-for="item of keywordContent" @click="searchWrod(item.name)">{{item.name}}</li>
                </ul>
            </div>

            <!--搜索内容显示-->
            <div class="search_content" v-show="search_content_show">
                <div class="title clearfix">
                    <span class="search_ell idx_left">"{{keyword}}"的相关作品</span>
                    <span class="search_number">{{search_content.recordCount}}</span>
                </div>
                <ul class="clearfix searchResult">
                    <li class="list_search_con_li" v-for="item of search_content.bookList">
                        <router-link :to="hrefCheck(item.url)">
                            <img class="search_book_img" :src="item.cover" :alt="item.name" :title="item.name">
                            <div class="pos_rea">
                                <div class="pos_rea_title">
                                    <em class="font_wryh">{{item.name}}</em>
                                    <span class="num_read">{{item.readNum}}阅读</span>
                                </div>
                                <p class="search_book_include">{{item.introduce}}</p>

                                <p class="clearfix author">
                                    <i class="icon_author">{{item.author}}</i>
                                    <span class="bor_green right">{{item.score}}分</span>
                                    <span class="bor_blue right">{{item.status}}</span>
                                </p>
                            </div>
                        </router-link>
                    </li>
                </ul>
            </div>
            <!-- 底部-->
            <com-foot active="2"></com-foot>
            <!-- 加载动画 -->
            <com-pageLoad v-if="isLoad"></com-pageLoad>
            <!--遮盖层-->
            <div class="mask" v-show="showmask" @click="showmask=false,keywordShow=false"></div>
        </main>
    </div>
</template>
<script type="text/ecmascript-6">
    require('@/assets/sass/search.scss')
    require('@/assets/sass/search_header.scss')

    import pageCommon from '@/assets/script/common';
    export default {
        name: 'search',
        data: function () {
            return {
                //热门搜素
                hotData: [],
                //搜素词
                keyword: '',
                //页码
                pageIndex: 1,
                //搜素历史
                searcHistory: [],
                //遮盖幕
                showmask: false,
                //关键词显示
                keywordShow: false,
                //关键词搜索内容
                keywordContent: [],
                //历史和热门搜索
                history: true,
                //搜索内容显示
                search_content_show: false,
                search_content: [],
                //控制显示隐藏
                opent: false,

                /*控制显示数量*/
                getNumber: 20,
                //是否暂时加载动画
                isLoad:true

            }
        },
        watch: {
            //如果keyword发生变化，就执行该函数
            keyword: function () {
                this.getKeyWordContent();
            }
        },
        methods: {
            //初始加载
            initRequest(item) {

                const postData = pageCommon.commonArg();
                //协议id
                postData.actionid = 9014;
                //协议id
                postData.keyword = this.keyword;
                //协议id
                postData.pageIndex = this.pageIndex;
                //协议id
                if(item == "" || item == undefined || item == null){
                    postData.pageSize = 20;
                    /*清空之前的下拉数量*/
                    this.getNumber = 20
                }else {
                    postData.pageSize = item;
                }

                this.$http.get(pageCommon.portUrl, {params: postData}).then(function (data) {
                    if (!pageCommon.checkResultData(data)) {
                        return;
                    }
                    var data = data.body.ResponseObject[0].module;

                    if (!this.keyword && item == undefined) {
                        this.hotData = data.hotSearch;
                    }
                    this.isLoad=false;
                    this.search_content = data;
                    this.opent = true;

                }, function (response) {
                    pageCommon.requestError()
                });
            },
            //刷新
            refresh(){
                this.keyword = '';
                this.pageIndex = 1;
                this.initRequest();
            },
            //搜素
            search(){
                //输入框是否为空
                if (!(this.keyword.trim())) {
                    this.keyword = '';
                    return;
                }
                var value = window.localStorage.getItem('searcHistory'), arr = [];
                if (value) {
                    arr = JSON.parse(value);
                    arr.unshift(this.keyword);
                    /*es6去除重复*/
                    const set = new Set(arr);
                    [...set];
                    /*历史记录不超过10*/
                    var setContent = JSON.parse(JSON.stringify(set));
                    if(setContent.length > 10){
                        setContent.pop();
                    }
                    this.searcHistory = setContent;
                    window.localStorage.setItem('searcHistory', JSON.stringify(setContent));
                } else {
                    arr.unshift(this.keyword);
                    const set = new Set(arr);
                    [...set];
                    /*历史记录不超过10*/
                    var setContent = JSON.parse(JSON.stringify(set));
                    if(setContent.length > 10){
                        setContent.pop();
                    }
                    window.localStorage.setItem('searcHistory', JSON.stringify(setContent));
                }

                this.history = false;
                this.keywordShow = false;
                this.showmask = false;
                this.search_content_show = true

                this.initRequest();
            },
            //历史记录
            getSearcHistory(){
                this.searcHistory = JSON.parse(window.localStorage.getItem('searcHistory'))
            },
            //清除历史记录
            clearSearcHistory(){
                this.searcHistory = [];
                window.localStorage.removeItem('searcHistory');
            },
            //搜素词
            searchWrod(e){
                this.keyword = e;

                //输入框是否为空
                if (!(this.keyword.trim())) {
                    this.keyword = '';
                    return;
                }
                var value = window.localStorage.getItem('searcHistory');

                var arr = [];

                if (value) {
                    arr = JSON.parse(value);
                    arr.unshift(this.keyword);
                    /*es6去除重复*/
                    const set = new Set(arr);
                    [...set];
                    /*历史记录不超过10*/
                    var setContent = JSON.parse(JSON.stringify(set));
                    if(setContent.length > 10){
                        setContent.pop();
                    }
                    this.searcHistory = setContent;
                    window.localStorage.setItem('searcHistory', JSON.stringify(setContent));
                } else {
                    arr.unshift(this.keyword);
                    const set = new Set(arr);
                    [...set];
                    /*历史记录不超过10*/
                    var setContent = JSON.parse(JSON.stringify(set));
                    if(setContent.length > 10){
                        setContent.pop();
                    }
                    window.localStorage.setItem('searcHistory', JSON.stringify(setContent));
                }

                this.history = false;
                this.keywordShow = false;
                this.showmask = false;
                this.search_content_show = true

                this.opent = false;

                this.initRequest();
            },
            //遮盖幕
            maskShow(){
                this.showmask = true;
            },
            //关键词搜索调用ajax，并判断获取到的ajax数量，最多显示8个
            getKeyWordContent(){

                if (this.opent) {
                    this.keywordShow = true;
                }

                const postData = pageCommon.commonArg();
                //协议id
                postData.actionid = 9014;
                //协议id
                postData.keyword = this.keyword;
                //协议id
                postData.pageIndex = this.pageIndex;
                //协议id
                postData.pageSize = 8;

                this.$http.get(pageCommon.portUrl, {params: postData}).then(function (data) {
                    if (!pageCommon.checkResultData(data)) {
                        return;
                    }
                    var data = data.body.ResponseObject[0].module;

                    this.keywordContent = data.bookList;

                }, function (response) {
                    pageCommon.requestError()
                });
            },
            /*上拉加载更多*/
            scrollContent: function(){
                var _this = this;

                /*滚动条在Y轴上的滚动距离*/
                function getScrollTop(){
                    var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
                    if(document.body){
                        bodyScrollTop = document.body.scrollTop;
                    }
                    if(document.documentElement){
                        documentScrollTop = document.documentElement.scrollTop;
                    }
                    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
                    return scrollTop;
                }
                /*文档的总高度*/
                function getScrollHeight(){
                    var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
                    if(document.body){
                        bodyScrollHeight = document.body.scrollHeight;
                    }
                    if(document.documentElement){
                        documentScrollHeight = document.documentElement.scrollHeight;
                    }
                    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
                    return scrollHeight;
                }
                /*浏览器视口的高度*/
                function getWindowHeight(){
                    var windowHeight = 0;
                    if(document.compatMode == "CSS1Compat"){
                        windowHeight = document.documentElement.clientHeight;
                    }else{
                        windowHeight = document.body.clientHeight;
                    }
                    return windowHeight;
                }

                window.onscroll = function(){
                    /*如果达到底部，调用相关ajax*/
                    if(getScrollTop() + getWindowHeight() === getScrollHeight()){
                        _this.getNumber = _this.getNumber + 20;

                        _this.initRequest(_this.getNumber);
                    }
                };
            },

            /*处理返回的链接*/
            hrefCheck: function(content){
                var hrefContent = "bookMall/detail?" + (content.split("?")[1])
                return hrefContent
            }
        },

        created() {
            this.initRequest();
            this.getSearcHistory();

            /*上拉加载更多*/
            this.scrollContent();
        }
    }


</script>