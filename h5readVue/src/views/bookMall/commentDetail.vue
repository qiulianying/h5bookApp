<template>
<div class="wrap">
	<!--头部导航-->
  <com-head :pageData="pageData"></com-head>
	
	<!--评论-->
	<div class="detail_comment_list topMarginTop clearfix">
		<img class="comment_icon" :src="headData.HeadUrl" />
		<div class="comment_word">
			<p class="comment_name">
				{{headData.SenderName}}
				<span class="comment_name_icon comment_write" v-if="headData.IsAuthor"></span>
				<span class="comment_name_icon comment_top" v-if="headData.IsTop"></span>
			</p>
			<p>{{headData.Content}} </p>
			<p class="clearfix comment_p">
				<span class="comment_time">{{headData.SendTime}}</span>
				<span :class="headData.HasSupport?'comment_finger_on':'comment_finger'" @click="support(headData.CommentId)">{{headData.SupportNum || 0}}</span>
			</p>
		</div>
	</div>
	<!--//评论-->
	
	<!--回复-->
	<div class="detail_comment_title">全部回复（{{headData.CommentNum || 0}}）</div>
	<div class="detail_comment_list clearfix" v-for="(item,index) of commentListData" v-if="commentListData.length>0">
		<img class="comment_icon" :src="item.HeadUrl" />
		<div class="comment_word">
			<p class="comment_name">
				{{item.SenderName}}
				<span class="comment_name_icon comment_write" v-if="item.IsAuthor"></span>
				<span class="comment_name_icon comment_top" v-if="item.IsTop"></span>
			</p>
      <p class="ellipsis_more"><span v-if="item.ToName">回复<em>@{{item.ToName}}:</em></span>{{item.Content}}</p>
			<p class="clearfix comment_p">
				<span class="comment_time">{{item.SendTime}}</span>
				<router-link class="comment_talk" :to="'/bookMall/commentSend?commentId='+headData.CommentId+'&senderName='+ item.SenderName">{{item.CommentNum || 0}}</router-link>
			</p>
		</div>
	</div>
	<!--//回复-->
	
	<!--底部导航-->
	<footer class="comment_footer">
		<router-link class="comment_footer_btn" :to="'/bookMall/commentSend?commentid='+headData.CommentId">写评论</router-link>
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
      //详情页数据
      headData:{},
      //评论数据
      commentListData:[],
      //页码
      pageIndex:1,
      //url参数
      urlArg:pageCommon.toLowerObj(this.$route.query),
      //是的展示加载动画
      isLoad:true
    }
  },
  methods:{
     //初始请求
     initRequest(){
     	const postData = pageCommon.commonArg();
        //协议id
        postData.actionid = 90266;
         //评论id
        postData.bookid = this.urlArg.bookid;
        //评论id
        postData.commentId = this.urlArg.commentid;
        //页码
        postData.pageIndex = this.pageIndex;
        //每页条数
        postData.pageSize = 20;

        this.$http.get(pageCommon.portUrl, { params: postData }).then(function(data) {
            if (!pageCommon.checkResultData(data)) {
                return;
            }
            var data = data.body.ResponseObject[0];
            this.headData=data.comment;
            this.commentListData=data.comment.ReplyList;

            console.log(this.commentListData);
            this.isLoad=false;
        }, function(response) {
            pageCommon.requestError()
        });
     },
     //点赞
     support(e){

     	const postData = pageCommon.commonArg();
        //协议id
        postData.actionid = 30002;
        //书籍id
        postData.commentId = e;
        if(this.headData.HasSupport){
           postData.stateType = 1;  
        }else{          
           postData.stateType = 0;  
        }              

        this.$http.get(pageCommon.portUrl, { params: postData }).then(function(data) {
            if (!pageCommon.checkResultData(data)) {
                return;
            }  
            if(postData.stateType==0){
               this.headData.HasSupport=true;
               this.headData.SupportNum=(this.headData.SupportNum || 0)+1;
            }else{
               this.headData.HasSupport=false;
               this.headData.SupportNum=(this.headData.SupportNum || 0)-1;
            }          

        }, function(response) {
            pageCommon.requestError()
        });
     }
  },
  created(){
    this.pageData={
        "title":"评论详情",
        "pageUrl":'/bookMall/commentDetail'
    };
     this.initRequest();
  }
}

</script>
