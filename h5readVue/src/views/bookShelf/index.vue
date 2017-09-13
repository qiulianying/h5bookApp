<template>
<div class="wrap">
	<!--头部导航-->
	<div :class="actived===0?'shelf_head shelf_brown':'shelf_head'">
		<div class="head_wrap flex_cen">
			<p class="head_tab margin_a"><span :class="actived===0?'tab_common tab_active':'tab_common'" @click="changeTab(0)">历史</span><span :class="actived===1?'tab_common tab_active':'tab_common'" @click="changeTab(1)">收藏</span></p>
			<p class="head_word text_l" @click="manage()">{{manageState?'完成':'管理'}}</p>
		</div>
	</div>
	<!--//头部导航-->
	
	<!--书架-->
	<div class="shelf_wrap">
		<div class="text_c" v-if="actived===0">
			<div class="shelf_list flex_st shelf_brown">
				<div class="shelf_li book_pd" v-for="item of topList" :key="item.index" @click="delItem(item.bookId,1)">
					<p class="shelf_check" v-if="manageState && item.type===1"></p>
					<router-link :to="'/bookMall/bookRead?bookid='+item.bookId+'&chapterid='+item.chapterId">
						<div class="posr">
							<img class="book_size book_shadow" :src="item.cover" />
							<span class="shelf_num">{{item.newChapterNum}}</span>
							<img class="shelf_icon" src="../../assets/images/icon_read.png" v-if="item.type===1" />
							<img class="shelf_free" src="../../assets/images/free_icon.png" v-if="item.type===2" />
						</div>
						<!--<p class="book_list_word ellipsis_two">{{item.name}}</p>-->
					</router-link>
				</div>
			</div>

			<!--推荐-->
			<div class="swiper_container">
				
				  <el-carousel :interval="5000" indicator-position="none">
				  <template v-for="item of recoms">
				    <el-carousel-item >
				      <div class="swiper-slide posr shelf_groom">
							<span class="shelf_groom_btn">推荐</span>
							<router-link class="shelf_groom_word ellipsis" :to="'/bookMall/bookRead?bookid='+item.bookId+'&chapterid='+item.chapterId">{{item.title}}</router-link>
							<!-- <span class="shelf_groom_icon"></span> -->
						</div>
				    </el-carousel-item>
				    </template>
				  </el-carousel>
				
			</div>

			
			<!-- <div class="swiper-container">
				<div class="swiper-wrapper">
					<div class="swiper-slide posr shelf_groom">
						<span class="shelf_groom_btn">推荐</span>
						<router-link class="shelf_groom_word ellipsis" :to="'/bookMall/bookRead?bookid='+item.bookId+'&chapterid='+item.chapterId">推荐推荐</router-link>
						<span class="shelf_groom_icon"></span>
					</div>
				</div>
			</div> -->

			<div class="shelf_list flex_st" v-if="History.length>0">
				<div class="shelf_li book_pd" v-for="item of History" :key="item.index" @click="delItem(item.bookId,1)">
					<p class="shelf_check" v-if="manageState"></p>
					<router-link :to="'/bookMall/bookRead?bookid='+item.bookId+'&chapterid='+item.chapterId">
						<div class="posr">
							<img class="book_size book_shadow" :src="item.cover" />
							<span class="shelf_num">{{item.newChapterNum}}</span>
						</div>
						<p class="book_list_word ellipsis_two">{{item.name}}</p>
					</router-link>
				</div>	
				<router-link to="/bookMall"><img class="book_size book_pd" src="../../assets/images/add_book.png" /></router-link>

			</div>			
			
		
			<!--没有书-->
			<div class="shelf_tip" v-if="History.length<=0">
				<img class="shelf_tip_pic" src="../../assets/images/icon_normal.png" alt="" />
				<p>提醒您遇到好书千万要记得加入书架呦！下次可以直接从书架继续阅读。</p>
			</div>		
		</div>
		<div class="shelf_list flex_st text_c" v-if="actived===1" @click="delItem(item.bookId,0)">
			<div class="shelf_li book_pd" v-for="item of Collect" :key="item.index">
				<p class="shelf_check" v-if="manageState"></p>
				<router-link :to="'/bookMall/bookRead?bookid='+item.bookId+'&chapterid='+item.chapterId">
					<div class="posr">
						<img class="book_size book_shadow" :src="item.cover" />
						<span class="shelf_num" v-if="item.newChapterNum">{{item.newChapterNum}}</span>
					</div>
					<p class="book_list_word ellipsis_two">{{item.name}}</p>
				</router-link>
			</div>	
			<!--没有书-->
			<div class="shelf_tip" v-if="Collect.length<=0">
				<img class="shelf_tip_pic" src="../../assets/images/icon_normal.png" alt="" />
				<p>提醒您遇到好书千万要记得加入书架呦！下次可以直接从书架继续阅读。</p>
			</div>			
		</div>
		<!-- 底部-->
	    <com-foot active="0"></com-foot>
	    <!-- 加载动画 -->
	    <com-pageLoad v-if="isLoad"></com-pageLoad>	

	</div>
	
	
	
	
	<!--底部导航-->
	<!-- <footer class="shelf_footer flex_sp t_center">
		<p class="footer_item footer_blue">全选</p>
		<p class="footer_item">删除</p>
	</footer> -->
	<!--//底部导航-->
   </div> 
</template>
<script>
require('@/assets/sass/bookshelf.scss');
import pageCommon from '@/assets/script/common';
export default {
  name: 'bookShelf',
  data () {
    return {
      //切换位置
      "actived": 0,
      //收藏
      "Collect": [],
      //历史
      "History": [],
      //限免
      topList:[],
      //推荐
      recoms:[],
      //是否管理
      "manageState": false,
      //是否展示loading
      "isLoad":true
    }
  },
  methods:{
  	//初始加载
    initRequest() {
      const postData = pageCommon.commonArg();
        //协议id
        postData.actionid = 9017;

        this.$http.get(pageCommon.portUrl, { params: postData }).then(function(data) {
            if (!pageCommon.checkResultData(data)) {
                return;
            }
            var data = data.body.ResponseObject[0].module;
            this.History=data.history;
            this.Collect=data.collect;
            this.topList=data.topList;
            this.recoms=data.recoms;
            this.isLoad=false;            
        }, function(response) {
            pageCommon.requestError()
        });
    },
    //切换tab
    changeTab(e){
        this.actived=e;
    },
    //管理
    manage(){
      this.manageState=!this.manageState;
    },
    //删除
    delItem(bookid,index){
    	if(!this.manageState){
           return;
    	}
		const postData = pageCommon.commonArg();
		        //协议id
		        postData.actionid = 90178;

		        //bookid
		        postData.bookIds = bookid;
		        //历史还是收藏
		        postData.type = index;
		        

		        this.$http.get(pageCommon.portUrl, { params: postData }).then(function(data) {
		            if (!pageCommon.checkResultData(data)) {
		                return;
		            }
		            
		            this.initRequest();		            
		        }, function(response) {
		            pageCommon.requestError()
		        });
    }
  },    
	created() {
		var  time='',_this=this;
	   pageCommon.init();

	   //登录之后调用接口
	   time=setInterval(function(){
	   	if(pageCommon.isLogined()){
            _this.initRequest();
            clearInterval(time);
	   	}	   	
	   },100);	   
	}

}
</script>