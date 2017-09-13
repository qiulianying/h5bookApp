<template>
    <main :class="isDayTime==0?'main_bookread dayTime':'main_bookread nigthTiem'" id="bookReadWrap">
        <!-- top nav -->
        <!--  <nav class="read_top clearfix" data-bookid="63257" data-nextchapterid="3686">
             <span class="read_top_left left"></span>
             <div class="read_top_right right">
                 <ul class="clearfix">
                     <li>
                         <router-link to="/bookMall">首页</router-link>
                     </li>
                     <li>
                         <router-link to="/bookShelf">书架</router-link>
                     </li>
                     <li>
                         <router-link to="/my/payCenter">充值</router-link>
                     </li>
                 </ul>
             </div>
         </nav> -->

        <!--top title-->
        <div class="read_title">
            <div class="read_title_look clearfix">
                <div class="left clearfix title_content">
                    <router-link to="/bookMall" class="left read_idx_a">首页</router-link>
                    <router-link :to="'/bookMall/detail?bookid='+bookReadData.bookId"
                                 class="left read_name_wid ellipsis">{{bookReadData.name}}
                    </router-link>
                </div>
                <div class="right day title_change" style="width: unset; display: block;">
                    <span class="day1" @click="changeScene()"></span>
                    <span class="red_small" @click="changeSize('sub')"></span>
                    <span class="red_big" @click="changeSize('add')"></span>
                </div>
            </div>
        </div>

        <!--content-->
        <div class="read_content">
            <section :class="'read_content_title font_'+fontSize" v-html="bookReadData.txt"></section>

            <!--  <router-link to="javascript:;" class="read-link ellipsis" v-for="item of bookReadData.recomBookList">【推荐】{{item.title}}</router-link> -->

            <aside class="read_Catalog clearfix">
                <a :class="bookReadData.prevChapterId==0?'read_Catalog_none':''" @click="chapterTurn('prev')">上一章</a>
                <router-link :to="'/bookMall/bookChapter?bookid='+bookReadData.bookId+'&chapterid='+bookReadData.chapterId">
                    目录
                </router-link>
                <a :class="bookReadData.nextChapterId==0?'read_Catalog_none':''" @click="chapterTurn('next')">下一章</a>
            </aside>


            <!--游戏推荐  没有到小说最后一章的时候显示-->
            <div class="Recommend_game" v-if="bookReadData.nextChapterId!=0">
                <ul class="read_game clearfix" v-if="bookReadData.recomGame">
                    <li class="read_game_img">
                        <img class="read_game_pic" :src="bookReadData.recomGame.icon" alt="">
                    </li>
                    <li class="game_contetn">
                        <p class="read_game_p1 ellipsis">{{bookReadData.recomGame.name}}</p>

                        <p class="read_game_jian ellipsis">{{bookReadData.recomGame.subTitle}}</p>
                    </li>
                    <li class="read_game_btn">
                        <router-link class="read_game_btn OpenGame" :to="bookReadData.recomGame.url"> 继续</router-link>
                    </li>
                </ul>
                <p class="read_game_p2">PS：玩过的游戏，可在书城首页再次游玩！</p>
            </div>
            <!--//游戏推荐-->


            <!--书籍推荐  看到小说最后一章的时候显示-->
            <div class="read_list" v-if="lastRecomBooks.length>0">
                <h3 class="read_tip_line">您已读完本书当前所有章节</h3>

                <div class="read_list_title">
                    <p>喜欢这本书的书友也在读：</p>

                    <p class="read_ref_bock" @click="lastRecomRefresh()"><i class="read_refresh"></i>换一换</p>
                </div>

                <div class="book_list_read flex_sp text_c">
                    <router-link class="book_pd"
                                 :to="'/bookMall/bookRead?bookid='+item.bookId+'&chapterid='+item.chapterId"
                                 v-for="item of lastRecomBooks" :key="item.index">
                        <img class="book_size" :src="item.cover"/>

                        <p class="book_list_word ellipsis_two">{{item.name}}</p>

                        <p class="read_per text_l">{{item.extMsg}}</p>
                    </router-link>
                </div>

                <div class="link_box">
                    <router-link class="link_book_item" to="/bookShelf">
                        <i class="link_book_img"></i>返回书架
                    </router-link>
                    <router-link class="link_book_item" to="/bookMall">
                        <i class="link_book_city"></i>逛逛书城
                    </router-link>
                </div>
            </div>
            <!--//书籍推荐-->


            <!--追书-->
            <div class="read_more_wrap">
                <div class="read_more">
                    <p>【追本书】请关注微信号“安卓读书”，回复书号<span>“91106”</span>，即可找到本书！</p>

                    <p>书友交流或问题反馈请加入官方QQ群：467163530</p>
                </div>
            </div>
        </div>

        <!--外部推荐-->
        <aside class="read_down">
            <div class="idx_down clearfix">
                <img class="left" src="../../assets/images/icon/logo_down.png">

                <div class="left idx_down_word">
                    <h3>畅读书城</h3>

                    <p class="bq_co1 bq_ft">小说全，更新快，天天发福利</p>
                </div>
                <router-link class="idx_down_btn right" to="javascript:;">下载</router-link>
            </div>
        </aside>
        <!-- 加载动画 -->
        <com-pageLoad v-if="isLoad"></com-pageLoad>
    </main>

</template>


<script type="text/ecmascript-6">
    require('@/assets/sass/bookRead.scss');
    import pageCommon from '@/assets/script/common';

    export default {
        name: 'detail',
        data: function () {
            return {
                //章节id
                cid: '',
                //章节数据
                bookReadData: [],
                //标题
                bookReadTitle: '',
                //最后一章书籍推荐
                lastRecomBooks: [],
                //是否白天
                isDayTime: 0,
                //字体大小
                fontSize: 1,
                //页面参数
                urlArg: pageCommon.toLowerObj(this.$route.query),
                //是否展示加载动画
                isLoad: true
            }
        },
        methods: {
            //初始请求
            initRequest(){
                const postData = pageCommon.commonArg();
                //协议id
                postData.actionid = 9007;
                //书籍id
                postData.bookid = this.urlArg.bookid;
                //章节id
                postData.chapterId = this.cid;

                this.$http.get(pageCommon.portUrl, {params: postData}).then(function (data) {
                    if (!pageCommon.checkResultData(data)) {
                        return;
                    }

                    var data = data.body.ResponseObject[0].module,
                            readLocation = JSON.parse(window.localStorage.getItem('ReadLocation') || '{}'),
                            scrollTop = readLocation[this.urlArg.bookid],
                            time = 0;

                    console.log(data);

                    this.bookReadData = data;

                    this.lastRecomBooks = data.lastRecomBooks;
                    this.isLoad = false;

                    window.clearTimeout(time);
                    time = setTimeout(function () {
                        document.querySelector('#bookReadWrap').scrollTop = scrollTop > 0 ? scrollTop : 0;
                    }, 100);

                }, function (response) {
                    pageCommon.requestError()
                });
            },
            //刷新最后一张推荐
            lastRecomRefresh(){
                const postData = pageCommon.commonArg();
                //协议id
                postData.actionid = 9030;
                //书籍id
                postData.bookid = this.urlArg.bookid;

                this.$http.get(pageCommon.portUrl, {params: postData}).then(function (data) {
                    if (!pageCommon.checkResultData(data)) {
                        return;
                    }
                    var data = data.body.ResponseObject[0];

                    this.lastRecomBooks = data.lastRecomBooks;

                }, function (response) {
                    pageCommon.requestError()
                });
            },
            //上一章、下一章  this.bookReadData.prevIsRecharge
            chapterTurn(e){
                if (e === 'prev') {
                    if (this.bookReadData.prevIsRecharge) {
                        /*跳转到章节订阅*/
                        this.$router.push({path: "/bookMall/bookPurchase?bookId=" + this.bookReadData.bookId + '&chapterId=' + this.bookReadData.prevChapterId})
                    } else if(this.bookReadData.prevIsRecharge = "undefinde") {
                        this.cid = this.bookReadData.prevChapterId;
                    }
                } else if (e === 'next') {
                    console.log(this.bookReadData.chapterId + "这个是上一个的。。。。");
                    console.log(this.bookReadData.nextChapterId + "当前这个");
                    if(this.bookReadData.nextIsRecharge){
                        this.$router.push({path: "/bookMall/bookPurchase?bookId=" + this.bookReadData.bookId + '&chapterId=' + this.bookReadData.nextChapterId})
                    }else if(this.bookReadData.nextIsRecharge = "undefinde"){
                        this.cid = this.bookReadData.nextChapterId;
                    }
                }

                if (this.cid == 0) {
                    return;
                }

                this.initRequest();
            },
            //白天黑夜场景切换
            changeScene(){

                if (this.isDayTime == 0) {
                    this.isDayTime = 1;
                } else {
                    this.isDayTime = 0;
                }
                window.localStorage.setItem('isDayTime', this.isDayTime);
            },
            //字体大小
            changeSize(e){
                if (e === 'sub') {
                    if (this.fontSize <= 1) {
                        return;
                    }
                    this.fontSize -= 1;
                } else if (e === 'add') {
                    if (this.fontSize >= 4) {
                        return;
                    }
                    this.fontSize += 1;
                }
                window.localStorage.setItem('fontSize', this.fontSize);
            },
        },
        created(){
            this.cid = this.urlArg.chapterid;
            this.fontSize = Number(window.localStorage.getItem('fontSize')) || 1;
            this.isDayTime = window.localStorage.getItem('isDayTime') || 0;
            this.initRequest();
        },
        destroyed: function () {
            //写入存储
            var data = {},
                    value = window.localStorage.getItem('ReadLocation');
            if (value) {
                data = JSON.parse(value);
            }

            data[this.urlArg.bookid] = pageCommon.getDomScrollHeight('bookReadWrap');
            window.localStorage.setItem('ReadLocation', JSON.stringify(data));
        }
    }


</script>
