<template>
 <div class="wrap">
	<com-head :pageData="pageData"></com-head>	
	<div class="comment_wrap topMarginTop">
		<div class="block" v-show="isStar">    
      <el-rate v-model="score"></el-rate>
      <p>轻触星星给本书打分</p>
    </div>
		
    <el-input
      type="textarea"
      :autosize="{ minRows: 6, maxRows: 6}"
      :placeholder="placeholderTxt"
      v-model="comnetnTxt" class="comment_text">
    </el-input>
    <a href="javascript:;" class="head_title comment_btn" @click="send()">发送</a>
	</div>
  </div>
</template>


<script>
require('@/assets/sass/detail.scss');
import pageCommon from '@/assets/script/common';
export default {
  name: 'detail',
  data () {
    return {
      //评分
      score:0,
      //评论内容
      comnetnTxt:"",
      //是否显示星星
      isStar:true,
      //默认文字
      placeholderTxt:'留下您对这本书的想法和感受',
      //页面参数
      urlArg:pageCommon.toLowerObj(this.$route.query)
    }
  },
  methods:{
     //发送点击
     send:function(){
       if(this.urlArg.commentid){
         this.replyComment();
       }else{
        this.commentSend();
       }
     },
     //发送评论
     commentSend(){
     	const postData = pageCommon.commonArg();
        //协议id
        postData.actionid = 30001;
        //书籍id
        postData.bookId = this.urlArg.bookid;
        //评分
        postData.Score = this.score;
        //评论内容
        postData.content = encodeURI(this.comnetnTxt);

        if(!postData.content){
          this.$message({
            message: '请填写评论内容~',
            type: 'warning'
          });
          return;
        }        

        this.$http.get(pageCommon.portUrl, { params: postData }).then(function(data) {
            if (!pageCommon.checkResultData(data)) {
                return;
            }
            
            this.$router.go(-1);
            
        }, function(response) {
            pageCommon.requestError()
        });
     },
     //回复评论
     replyComment:function(){
        const postData = pageCommon.commonArg();
        //协议id
        postData.actionid = 30004;
        //评论id
        postData.commentId = this.urlArg.commentid;
        //被回复者名字
        postData.toName = encodeURI(this.urlArg.sendername);
        //评论内容
        postData.content = encodeURI(this.comnetnTxt);

        if(!postData.content){
          this.$message({
            message: '请填写评论内容~',
            type: 'warning'
          });
          return;
        }        

        this.$http.get(pageCommon.portUrl, { params: postData }).then(function(data) {
            if (!pageCommon.checkResultData(data)) {
                return;
            }
            
            this.$router.go(-1);
            
        }, function(response) {
            pageCommon.requestError()
        });
     }
  },
  created(){
    this.pageData={
        "title":"发布评论",
        "pageUrl":'/bookMall/commentSend'
    };

    if(this.urlArg.commentid){
        this.isStar=false;
        if(this.urlArg.sendername){
           this.placeholderTxt="@"+this.urlArg.sendername;
        }else{
           this.placeholderTxt='留下你对此评论的想法和感受';
        }
    }        
         
  }
}

</script>
