<template>
    <div class="wrap">
        <com-head :pageData="pageData"></com-head>
        <div class="main_bookCatalog">
            <div class="catalog_tab">
                <div class="clearfix catalog_content">
                    <h3 class="left catalog_title">{{resultData.name}}</h3>

                    <div class="catalog_check right">
                        <span :class="sortActive===0?'tab_Positive left catalog_active':'tab_Positive left'"
                              @click="sort(0)">正序</span>
                        <span :class="sortActive===1?'tab_Reverse left catalog_active':'tab_Reverse left'"
                              @click="sort(1)">倒序</span>
                    </div>
                </div>
            </div>

            <!--具体目录-->
            <section class="booklist">
                <ul class="booklist_ul" id="bookList">
                    <li :class="item.isSelected?'direct-ul-current':''" v-for="(item,index) of bookChapterData">
<!--                        <router-link :to="'/bookMall/bookRead?bookid='+item.bookId+'&chapterid='+item.chapterId"
                                     class="item-link ellipsis" @click="chapterTurn()">{{item.name}}
                            <span class="free" v-if="item.payType!=1">{{item.text}}</span>
                            <span class="money" v-if="item.payType==1">{{item.currency}}</span>
                        </router-link>-->

                        <!--使用链接的方式判断引入-->
                        <a class="item-link ellipsis" @click="chapterTurn(item,index)">{{item.name}}
                            <span class="free" v-if="item.payType!=1">{{item.text}}</span>
                            <span class="money" v-if="item.payType==1">{{item.currency}}</span>
                        </a>
                    </li>
                </ul>

                <div class="paging clearfix">
                    <!--无上页添加.disabled类-->

                    <span :class="resultData.prevPageIndex?'paging_last left':'paging_last left disabled'"
                          @click="pageTurn('prev')">上一页</span>


                    <div class="paging-sect left">
                        <select class="catalogSect" @change="changePageNum($event)">
                            <option v-for="(item,index) of selectArr"
                                    :selected="resultData.selectPage==(index+1)?'selected':''">{{item}}
                            </option>
                        </select>
                    </div>

                    <span :class="resultData.nextPageIndex?'paging_next right':'paging_next right disabled'"
                          @click="pageTurn('next')">下一页</span>

                </div>
            </section>
        </div>
        <!-- 加载动画 -->
        <com-pageLoad v-if="isLoad"></com-pageLoad>
    </div>
</template>

<script type="text/ecmascript-6">
    require('@/assets/sass/bookCatalog.scss');
    import pageCommon from '@/assets/script/common';
    export default {
        name: 'detail',
        data: function() {
            return {
                //页码
                pageIndex: 1,
                //返回数据
                resultData: [],
                //章节数据
                bookChapterData: [],
                //排序
                sortActive: 0,
                //页码
                selectArr: [],
                //章节
                cid: '',
                //标题
                bookListTitle: '',
                //url参数
                urlArg: pageCommon.toLowerObj(this.$route.query),
                //是的展示加载动画
                isLoad: true
            }
        },
        methods: {
            //初始请求
            initRequest: function(){
                const postData = pageCommon.commonArg();
                //协议id
                postData.actionid = 9005;
                //更多页id
                postData.bookid = this.urlArg.bookid;
                //分页大小
                postData.pageSize = 100;
                //页码
                postData.pageIndex = this.pageIndex;
                //章节id
                postData.cid = this.cid;


                this.$http.get(pageCommon.portUrl, {params: postData}).then(function (data) {
                    if (!pageCommon.checkResultData(data)) {
                        return;
                    }
                    var data = data.body.ResponseObject[0].module, time = '';
                    this.resultData = data;
                    this.bookChapterData = data.ascList;
                    this.isLoad = false;

                    if (this.selectArr.length > 0) {
                        return;
                    }

                    //页码
                    for (var i = 1; i <= data.pageCount; i++) {
                        this.selectArr.push(i);
                    }

                    console.log(this.resultData.ascList[48]);


                }, function (response) {
                    pageCommon.requestError()
                });
            },
            //排序
            sort(e){
                if (e === 0) {
                    this.bookChapterData = this.resultData.ascList;
                } else {
                    this.bookChapterData = this.resultData.descList;
                }

                this.sortActive = e;
            },
            //翻页
            pageTurn(e){

                if (e === 'prev') {
                    this.pageIndex = this.resultData.prevPageIndex;
                } else if (e === 'next') {
                    this.pageIndex = this.resultData.nextPageIndex;
                }

                if (!this.pageIndex) {
                    return;
                }

                this.cid = '';
                this.initRequest();
            },
            //选择页码
            changePageNum(e){
                this.pageIndex = e.target.value;
                this.cid = '';
                this.initRequest();
            },
            //滚动到当前章节
            scrollChapter(){
                const subHeight = document.querySelector('.index_header').offsetHeight + document.querySelector('.catalog_tab').offsetHeight + document.querySelector('.paging').offsetHeight,
                        winHeight = pageCommon.getWindowHeight(),
                        dom = document.querySelector('#bookList'),
                        domItemHeight = dom.firstChild.offsetHeight;

                dom.style.height = winHeight - subHeight + 'px';
                var index = 0;
                this.resultData.ascList.forEach(function (v, i) {
                    if (v.isSelected) {
                        index = i;
                    }
                });

                dom.scrollTop = domItemHeight * index;
            },
            //判断章节金额是否足够
            chapterTurn: function(item_content,index){
                let bookMoney = this.resultData.ascList[index];

                if(bookMoney.payType == 1 && bookMoney.isRecharge){
                    this.$router.push({path: "/bookMall/bookPurchase?bookId=" + item_content.bookId + '&chapterId=' + item_content.chapterId});
                }else {
                    this.$router.push({path: '/bookMall/bookRead?bookid='+item_content.bookId+'&chapterid='+item_content.chapterId});
                }
            }
        },
        created(){
            this.pageData = {
                "title": "目录",
                "pageUrl": '/bookMall/bookChapter'
            };
            this.cid = this.urlArg.chapterid;
            this.initRequest();
        },
        updated: function () {
            this.scrollChapter();
        }

    }

</script>