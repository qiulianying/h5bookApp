<template>
<div class="wrap">
	<!--头部导航-->
	<com-head :pageData="pageData"></com-head>
	
	<div class="comment_fixed">
		<!--书籍详情-->
		<div class="comment_book" v-if="commentList">
			<div class="flex_st book_content">
				<img class="book_left_size" :src="commentList.cover" />
				<div class="book_word">
					<p class="book_title ellipsis">{{commentList.name}}</p>
					<div class="posr show_star_wrap">
						<div class="show_star">
							<p class="show_star_wid" :style="'width:'+commentList.star"><span class="show_star_on"></span></p>
						</div>
						<span class="show_score">{{commentList.score}}</span> 
					</div> 
					<p class="book_user">{{commentList.author}}</p>
					<p><span class="book_blue">{{commentList.readNum || 0}}</span>人在读</p>
				</div>
			</div>
		</div>
		<!--//书籍详情-->
		<div class="flex_sp detail_comment_title">
			<p class="comment_title_left">评论<span class="comment_title_count">（共{{commentList.commentCount || 0}}条）</span></p>
			<p class="comment_title_tab text_r"><span :class="actived===0?'tab_sp common_blue':'tab_sp'" @click="changeTab(0)">时间</span><span :class="actived===1?'tab_sp common_blue':'tab_sp'" @click="changeTab(1)">热度</span></p>
			<!--<router-link class="comment_title_right text_r" :to="'/bookMall/commentSend?bookid='+commentList.bookId">写评论</router-link>-->
		</div>
	</div>
	
	
	<!--评论-->
	<div class="detail_comment_mgt" id="detailComment">
		<div id="detailCommentBox">
			<!--时间-->
			<div class="detail_comment_list clearfix" v-for="(item,index) of commentData">
				<img class="comment_icon" :src="item.HeadUrl" />
				<div class="comment_word">
					<p class="comment_name">
						{{item.SenderName}}
						<span class="comment_name_icon comment_write" v-if="item.IsAuthor"></span>
						<span class="comment_name_icon comment_top" v-if="item.IsTop"></span>
					</p>
					<p class="ellipsis_two" v-html="replaceImg(item.Content)"></p>
					<p class="clearfix comment_p">
						<span class="comment_time">{{item.SendTime}}</span>
						<span :class="item.HasSupport?'comment_finger_on':'comment_finger'" @click="support(item.CommentId,index)">{{item.SupportNum || 0}}</span>
						<router-link class="comment_talk" :to="'/bookMall/commentDetail?bookid='+commentList.bookId+'&commentid='+item.CommentId">{{item.CommentNum || 0}}</router-link>
					</p>
				</div>
			</div>	
		 </div>	
		<!--<router-link class="detail_comment_more" to="javascript:;">查看更多评论</router-link>-->
		<!--加载更多-->
		<div class="load_wrap" v-show="pageAddLoad">
			<span class="load_con load_animation"></span>
		</div>
		
		<!--默认图-->
		<img class="recom_moren" src="../../assets/images/default.png" v-if="(pageIndex+1)>=pageCount" />
	</div>
	<!--//评论-->
	
	<!--底部导航-->
	<footer class="comment_footer">
		<router-link class="comment_footer_btn" :to="'/bookMall/commentSend?bookid='+commentList.bookId">写评论</router-link>
	</footer>
	<!--//底部导航-->
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
       //切换位置
      "actived": 0,
      //页码
      "pageIndex":0,
      //总页数
      "pageCount":0,
      //详情页数据
      commentList:{},
      //评论数据
      commentData:[],
      //时间排序
      commentTimeData:[],
      //热度排序
      commentHotData:[],
      //星星宽度
      starWidth:0,
      //url参数
      urlArg:pageCommon.toLowerObj(this.$route.query),
      //是否展示加载动画
      isLoad:true,
      //加载下一页load
      pageAddLoad:false
    }
  },
  methods:{
     //初始请求
     initRequest(){
     	const postData = pageCommon.commonArg();
        //协议id
        postData.actionid = 9026;
        //书籍id
        postData.bookId = this.urlArg.bookid;
        //页数
        postData.pageIndex=this.pageIndex;

        this.$http.get(pageCommon.portUrl, { params: postData }).then(function(data) {
            if (!pageCommon.checkResultData(data)) {
                return;
            }
            var data = data.body.ResponseObject[0];
            if(this.pageIndex<=0){
	            this.commentList=data.book;
	            this.pageCount=data.pageCount;
	            //时间排序
	            this.commentTimeData=data.commentList;
	            //热度排序
	            this.commentHotData=data.commentListByHot;

	            this.commentData=this.commentTimeData;

	            this.starWidth=data.book.score/5*100+"%";
	            this.isLoad=false;
            }else{
            	//时间排序
	            this.commentTimeData=this.commentTimeData.concat(data.commentList);
	            //热度排序
	            this.commentHotData=this.commentHotData.concat(data.commentListByHot);
	            if(this.actived==0){
                   this.commentData=this.commentTimeData;
	            }else{
	            	this.commentData=this.commentHotData;
	            }	            
            }
            this.pageAddLoad=false;

            this.commentData.forEach(function(v,i){
             
              console.log();
            });
            
        }, function(response) {
            pageCommon.requestError()
        });
     },
     //切换tab
     changeTab(e){
        this.actived=e;
        if(e===0){
           this.commentData=this.commentTimeData;
        }else{
           this.commentData=this.commentHotData;
        }
        document.querySelector('#detailComment').scrollTop=0;
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

        var commentData;

        if(this.actived==0){
          commentData =this.commentTimeData;
        }else{
          commentData=this.commentHotData;
        }
               

        this.$http.get(pageCommon.portUrl, { params: postData }).then(function(data) {
            if (!pageCommon.checkResultData(data)) {
                return;
            }  


            var thisObj= this.commentData[index];
            
            if(postData.stateType==1){
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
     },
     //过滤表情
     replaceImg:function (value) {
        return value.replace(/\[(\W+?)\]/g, "<img src='http://img.andreader.com/sharp/H5BookStore/small_img/faceicon//$1.png' />")
    }
  },
  created(){
    this.pageData={
        "title":"评论详情",
        "pageUrl":'/bookMall/commentSend'
    };
     this.initRequest();
  },
  updated:function(){
    var _this=this;
    var $detailComment=document.querySelector('#detailComment'),        
        //获取内容高度
        contentHeight=document.querySelector('#detailCommentBox').offsetHeight,
        //获取顶部高度
        headHeight=document.querySelector('.index_header').offsetHeight,
        //获取底部高度
        footHeight=document.querySelector('.comment_footer').offsetHeight,
        //头部定位高度
        headfixedHeight=document.querySelector('.comment_fixed').offsetHeight,
        //页面高度
        winHeight=pageCommon.getWindowHeight();
        //设置容器高度
        $detailComment.style.height=winHeight-headHeight-footHeight -headfixedHeight+"px";
        //获取容器高度
       var detailCommentHeight=$detailComment.offsetHeight;
       $detailComment.onscroll = function(){
      //是否加载中
      if(_this.pageAddLoad){
         return;
      }
      //滚动高度
      var scrollTop=$detailComment.scrollTop; 
      //滚动到底部     
      if(detailCommentHeight+scrollTop>=contentHeight-20){
         _this.pageAddLoad=true;         
         _this.pageIndex+=1;
         if((_this.pageIndex+1)>_this.pageCount){        
           _this.pageAddLoad=false; 
           return;
         }
         _this.initRequest();
      }   
    };
    
  }
}

</script>
