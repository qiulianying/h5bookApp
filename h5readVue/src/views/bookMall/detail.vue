<template>
<div class="wrap">
	<!--头部导航-->
  <com-head :pageData="pageData"></com-head>
	
	<!--详情-->
	<div class="detail_show">
		<img class="detail_foggy" :src="detailData.cover" />
		<div class="flex_st show_content">
			<img class="book_size" :src="detailData.cover" />
			<div class="show_word">
				<p class="show_title ellipsis">{{detailData.name}}</p>
				<div class="posr show_star_wrap">
					<div class="show_star">
						<p class="show_star_wid" :style="'width:'+starWidth"><span class="show_star_on"></span></p>
					</div>
					<span class="show_score">{{detailData.score}}分</span> 
				</div> 
				<p>作者：{{detailData.author}}</p>
				<p>类型：<a class="show_type" href="javascript:;">{{detailData.category}}</a></p>
				<p>字数：{{detailData.wordCount}}</p>
				<a class="show_vip" href="javascript:;" v-if="detailData.isUserVip">{{detailData.vipTip}}</a>
				<router-link class="show_vip" to="/my/vipPay" v-if="!detailData.isUserVip">开通会员，全站小说八折 ></router-link>
			</div>
		</div>
	</div>
	<!--//详情-->
	<div class="detail_btn_wrap">
		<p class="detail_btn btn_collect" @click="joinCollect(detailData.chapterId)">加入收藏</p>
		<router-link class="detail_btn btn_read" :to="'/bookMall/bookRead?bookid='+detailData.bookId+'&chapterid='+detailData.chapterId">立即阅读</router-link>
	</div>

	<div :class="detailMax?'detail_brief_max detail_brief':'detail_brief'">
		<p>
			简介：{{detailData.introduce}}
		</p>
		<span :class="detailMax?'detail_brief_icon detail_down':'detail_brief_icon'" @click="detailMaxFun"></span>
	</div>
	<div class="flex_sp detail_catalog">
		<router-link class="catalog_look" :to="'/bookMall/bookChapter?bookid='+detailData.bookId+'&chapterid='+detailData.chapterId">查看目录</router-link>
		<div class="catalog_update clearfix">
			<router-link :to="'/bookMall/bookRead?bookid='+detailData.bookId+'&chapterid='+detailData.latestChapterId" class="catalog_new ellipsis">{{detailData.latestChapter}}</router-link>
			<p class="catalog_time text_r">{{detailData.update}}</p>
		</div>
	</div>
	<!--评论-->
	<div class="flex_sp detail_comment_title">
		<span class="comment_title_left">评论</span>
		<router-link class="comment_title_right text_r" :to="'/bookMall/commentSend?bookid='+detailData.bookId">写评论</router-link>
	</div>
	<div class="detail_comment_list clearfix" v-for="(item,index) of commentData">
		<img class="comment_icon" :src="item.HeadUrl" />
		<div class="comment_word">
			<p class="comment_name">
				{{item.SenderName}}
				<span class="comment_name_icon comment_write" v-if="item.IsTop"></span>
				<span class="comment_name_icon comment_top" v-if="item.IsTop"></span>
			</p>
			<p class="ellipsis_two" v-html="item.Content"></p>
			<p class="clearfix comment_p">
				<span class="comment_time">{{item.SendTime}}</span>
				<span :class="item.HasSupport?'comment_finger_on':'comment_finger'" @click="support(item.CommentId,index)">{{item.SupportNum || 0}}</span>
				<router-link class="comment_talk" :to="'/bookMall/commentDetail?bookid='+detailData.bookId+'&commentid='+item.CommentId">{{item.CommentNum || 0}}</router-link>
			</p>
		</div>
	</div>
	<router-link class="detail_comment_more" :to="'/bookMall/commentList?bookid='+detailData.bookId">查看更多评论</router-link>
	<!--//评论-->
  <!-- 加载动画 -->
  <com-pageLoad v-if="isLoad"></com-pageLoad>
   </div> 
</template>


<script>
require('@/assets/sass/detail.scss');
import pageCommon from '@/assets/script/common';
export default {
  name: 'detail',
  data () {
    return {
      //详情页数据
      detailData:{},
      //评论数据
      commentData:[],
      //星星宽度
      starWidth:0,
      //是否隐藏简介
      detailMax:true,
      //页面参数
      urlArg:{},
      //是否展示加载动画
      isLoad:true
    }
  },
  methods:{
     //初始请求
     initRequest(){
      this.urlArg=pageCommon.toLowerObj(this.$route.query);
     	const postData = pageCommon.commonArg();
        //协议id
        postData.actionid = 9002;
        //书籍id
        postData.bookid = this.urlArg.bookid;        

        this.$http.get(pageCommon.portUrl, { params: postData }).then(function(data) {
            if (!pageCommon.checkResultData(data)) {
                return;
            }
            var data = data.body.ResponseObject[0].module;
            this.detailData=data.book;
            this.commentData=data.commentList;
            this.starWidth=data.book.score/5*100+"%";
            this.isLoad=false;
            data.commentList.forEach(function(v,i){
             
              console.log(v.Content.replace(/\[(\W+?)\]/g, "http://img.51changdu.com/$1.png"));
            });
        }, function(response) {
            pageCommon.requestError()
        });
     },
     //加入收藏
     joinCollect(e){
     	const postData = pageCommon.commonArg();
        //协议id
        postData.actionid = 90177;
        //书籍id
        postData.bookid = this.urlArg.bookid;
        //章节id
        postData.chapterId = e;        

        this.$http.get(pageCommon.portUrl, { params: postData }).then(function(data) {
            if (!pageCommon.checkResultData(data)) {
                return;
            }
            this.$message({
              message: '恭喜你，成功加入收藏',
              type: 'success'
            });

        }, function(response) {
            pageCommon.requestError()
        });
     },
     //展示全部文章简介
     detailMaxFun(){
     	 this.detailMax=!this.detailMax;
     },  
     //点赞
     support(e,index){
     	
     	const postData = pageCommon.commonArg();
        //协议id
        postData.actionid = 30002;
        //书籍id
        postData.commentId = e;

        if(this.commentData[index].HasSupport){
          //取消赞
          postData.stateType = 1; 
        }else{
          //点赞
          postData.stateType = 0; 
        }
               

        this.$http.get(pageCommon.portUrl, { params: postData }).then(function(data) {
            if (!pageCommon.checkResultData(data)) {
                return;
            } 

            var thisObj= this.commentData[index];
            
            if(postData.stateType===1){
               thisObj.HasSupport=false;
               thisObj.SupportNum=(thisObj.SupportNum || 0)-1;
            } else{
               thisObj.HasSupport=true;
               thisObj.SupportNum=(thisObj.SupportNum || 0)+1;
            } 

            this.commentData.splice(index, 1, thisObj);                 

        }, function(response) {
            pageCommon.requestError()
        });
     }
  },
  created(){
     this.pageData={
        "title":"书籍详情",
        "pageUrl":'/bookMall/detail'
    };
     this.initRequest();
     
  },
    watch: {
    // 如果路由有变化，会再次执行该方法
       '$route': 'initRequest'
   } 
}

</script>
