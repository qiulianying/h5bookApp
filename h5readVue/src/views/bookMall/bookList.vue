<template>
<div class="wrap">
	<!--头部导航-->
	<com-head :pageData="pageData"></com-head>
	<div class="topMarginTop more_wrap" id="moreWrap">	
  <div id="moreItemBox">
     <router-link :to="'/bookMall/detail?bookid='+item.bookId" class="more_list flex_sp" v-for="item of bookListData" key="item.index">
  			<img class="book_size_small book_shadow" :src="item.cover" />
  			<div class="mall_brief">
  				<h3 class="mall_brief_title ellipsis">{{item.name}}</h3>
  				<p class="ellipsis">作者：{{item.author}}</p>
  				<p class="mall_brief_con ellipsis_two">{{item.introduce}}</p>
  			</div>
      </router-link>	
  </div>
      <!--加载更多-->
  <div class="load_wrap" v-show="pageAddLoad">
    <span class="load_con load_animation"></span>
  </div>
  
  <!--默认图-->
  <img class="recom_moren" src="../../assets/images/default.png" v-show="pageIndex>pageCount" />	
	</div>	
	
  <!-- 加载动画 -->
  <com-pageLoad v-if="isLoad"></com-pageLoad>
</div>
</template>


<script>
import pageCommon from '@/assets/script/common';
export default {
  name: 'detail',
  data () {
    return {
      //页码
      pageIndex:1,
      //书籍列表
      bookListData:[],
      //页数
      pageCount:1,
      //标题
      bookListTitle:'',
      //页面参数
      urlArg:pageCommon.toLowerObj(this.$route.query),
      //是的展示加载动画
      isLoad:true,
      //上拉加载
      pageAddLoad:false
    }
  },
  methods:{
     //初始请求
     initRequest(){      
     	const postData = pageCommon.commonArg();
        //协议id
        postData.actionid = 9004;
        //更多页id
        postData.id = this.urlArg.moreid;
        //更多页id类型
        postData.type = this.urlArg.type;
        //分页大小
        postData.take = 20;
        //页码
        postData.pageIndex = this.pageIndex;
        //标题
        postData.name =  encodeURI(this.urlArg.name);
        //频道类型
        postData.channel =this.urlArg.channel?this.urlArg.channel:'0';


        this.$http.get(pageCommon.portUrl, { params: postData }).then(function(data) {
            if (!pageCommon.checkResultData(data)) {
                return;
            }
            var data = data.body.ResponseObject[0].module;
            if(this.pageIndex<=1){
               this.bookListData=data.itemList;
               this.pageCount=data.pageCount;
               this.bookListTitle=data.name;
               this.isLoad=false;
            }else{
               this.pageAddLoad=false; 
               this.bookListData=this.bookListData.concat(data.itemList);
            }
                        
        }, function(response) {
            pageCommon.requestError()
        });
     }
  },
  created(){
    this.pageData={
        "title":this.urlArg.name,
        "pageUrl":'/bookMall/bookList'
    };
    this.initRequest();
  },
  updated:function(){
    var _this=this;
    var $moreWrap=document.querySelector('#moreWrap'),        
        //获取内容高度
        contentHeight=document.querySelector('#moreItemBox').offsetHeight,
        //获取顶部高度
        headHeight=document.querySelector('.index_header').offsetHeight;
        //设置容器高度
        $moreWrap.style.height="calc(100% - "+headHeight+"px)";
        //获取容器高度
       var moreWrapHeight=$moreWrap.offsetHeight;
    $moreWrap.onscroll = function(){
      //是否加载中
      if(_this.pageAddLoad){
         return;
      }
      //滚动高度
      var scrollTop=$moreWrap.scrollTop; 
      //滚动到底部     
      if(moreWrapHeight+scrollTop>=contentHeight-20){
         _this.pageAddLoad=true;         
         _this.pageIndex+=1;
         if(_this.pageIndex>_this.pageCount){
           _this.pageAddLoad=false; 
           return;
         }
         _this.initRequest();
      }   
    };
    
  }

}

</script>
