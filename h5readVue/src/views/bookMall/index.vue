<template>
  <div class="wrap" >
   <!--头部导航-->
	<div class="read_head">
		<div class="head_wrap flex_sp">            
               <img class="head_logo" src="../../assets/images/idx_logo.png" />	
			<div class="head_right text_r">
			     <router-link to="/my">
				   <img class="head_user" src="indexData.user.HeadUrl" v-if="indexData.user" /> 
				 </router-link>
				<router-link to="/my/payCenter" class="head_recharge">|&nbsp;&nbsp;充值</router-link>
			</div>
		</div>
	</div>
	<!--//头部导航-->
	
	<!--头部分类-->
	<div class="text_c mall_nav">
	   <ul class="flex_sp">	
			<li :class="tabActive===0?'mall_nav_list mall_nav_act':'mall_nav_list'" @click="changeTap(0)">首页</li>
			<li :class="tabActive===1?'mall_nav_list mall_nav_act':'mall_nav_list'" @click="changeTap(1)">会员</li>
			<li :class="tabActive===2?'mall_nav_list mall_nav_act':'mall_nav_list'" @click="changeTap(2)">分类</li>
			<li :class="tabActive===3?'mall_nav_list mall_nav_act':'mall_nav_list'" @click="changeTap(3)">免费</li>
	   </ul>
	</div>
	<!--//头部分类-->
  <!-- 首页 -->
  <mall-home v-show="tabActive===0"></mall-home>
  <!-- 会员 -->
  <mall-member v-show="tabActive===1"></mall-member>
  <!-- 分类 -->
  <mall-classify v-show="tabActive===2"></mall-classify>
  <!-- 免费 -->
  <mall-free v-show="tabActive===3"></mall-free>

	<!-- 底部-->
	<com-foot active="1"></com-foot>
  
  </div>
</template>

<script>
require('@/assets/sass/index.scss')
import pageCommon from '@/assets/script/common';

//首页
import Home from '@/views/bookMall/component/home'

//会员
import Member from '@/views/bookMall/component/member'

//分类
import Classify from '@/views/bookMall/component/classify'

//免费
import Free from '@/views/bookMall/component/free'

export default {
  name: 'bookMall',
  data () {
    return {
      //分类切换
      tabActive:0,
      indexData:''       
    }
  },
    components: {
     //首页
     'mall-home': Home,
     //会员
     'mall-member': Member,
     //分类
     'mall-classify': Classify,
     //免费
     'mall-free': Free,
  },
   methods:{
    //初始加载
    initRequest() {
      const postData = pageCommon.commonArg();
        //协议id
        postData.actionid = 9001;

        this.$http.get(pageCommon.portUrl, { params: postData }).then(function(data) {
            if (!pageCommon.checkResultData(data)) {
                return;
            }
            var data = data.body.ResponseObject[0];
            this.indexData=data;
            this.hotRank=data.module[9];
            this.peopleRank=data.module[11];
            
        }, function(response) {
            pageCommon.requestError()
        });
    },
    //分类切换
    changeTap(e){
       this.tabActive=e;       
    }   
  }, 
  created:function(){    
     pageCommon.init(); 
   },  
  mounted:function(){
   // this.initRequest(); 
 }, 
}
</script>

	
