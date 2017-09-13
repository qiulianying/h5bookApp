<template>
  <!--免费模块-->
  <div>
	<div class="mall_free" v-if="!!freeData">
		<!--限时免费-->
		<div class="idx_title flex_sp">
			<div>
				<p class="mall_title free_title">限时免费</p>
				<p class="free_time"><span class="free_time_btn">{{timeFree.hour}}</span>：<span class="free_time_btn">{{timeFree.min}}</span>：<span class="free_time_btn">{{timeFree.second}}</span></p>
			</div>  
			<router-link :to="'/bookMall/bookList?moreid='+freeData.bookLimitFree.moreId+'&type='+freeData.bookLimitFree.type+'&name='+freeData.bookLimitFree.name" class="free_more">更多</router-link>
		</div>
		<div class="book_list_mg flex_sp text_c">
			<router-link class="book_pd posr" :to="'/bookMall/detail?bookid='+item.bookId" :key="item.index" v-for="item of freeData.bookLimitFree.bookList">
				<span class="free_icon"></span>
				<img class="book_size" :src="item.cover" />
				<p class="book_list_word ellipsis_two">{{item.name}}</p>
			</router-link>
		</div>
		<!--//限时免费-->
		
		<!--章节限免-->
		<div class="idx_title flex_sp">
			<div>
				<p class="mall_title free_title">章节限免</p>
				<p class="free_time"><span class="free_time_btn">{{chapterFree.hour}}</span>：<span class="free_time_btn">{{chapterFree.min}}</span>：<span class="free_time_btn">{{chapterFree.second}}</span></p>
			</div>  
			<router-link class="free_more" :to="'/bookMall/bookList?moreid='+freeData.chapterLimitFree.moreId+'&type='+freeData.chapterLimitFree.type+'&name='+freeData.chapterLimitFree.name">更多</router-link>
		</div>
		
		<div class="com_box mall_cai">
			<router-link class="mall_name" :to="'/bookMall/detail?bookid='+item.bookId" :key="item.index" v-for="item of freeData.chapterLimitFree.bookList">
				<h3 class="mall_black ellipsis">{{item.name}}</h3>
				<p class="ellipsis">
					{{item.introduce}}
				</p>
			</router-link>
		</div>
		<!--//章节限免-->
		
		<!--免费新书-->
		<div class="idx_title mall_title">免费新书</div>
		<router-link :to="'/bookMall/detail?bookid='+item.bookId" class="mall_rank_wrap flex_sp" :key="item.index" v-for="item of freeData.bookFree.bookList">
				<img class="book_size_small book_shadow" :src="item.cover" />
				<div class="mall_brief">
					<h3 class="flex_sp"><span class="mall_brief_title free_wid ellipsis">{{item.name}}</span><span>{{item.readNum}}人在追</span></h3>
					<p class="mall_brief_con ellipsis_two">{{item.introduce}}</p>
					<div class="flex_sp">
						<p class="mall_brief_icon">{{item.author}}</p>
						<p>
							<span class="brief_btn">{{item.category}}</span>
							<span class="brief_btn brief_btn_red">{{item.score}}分</span>
						</p>
					</div>
				</div>
		</router-link>
		<!--//免费新书-->
		<router-link class="text_c dblock mall_hot_more" :to="'/bookMall/bookList?moreid='+freeData.bookFree.moreId+'&type=0&name='+freeData.bookFree.name">查看更多<span class="more_double"></span></router-link>
		
	</div>
	<!-- 加载动画 -->
        <com-pageLoad v-if="isLoad"></com-pageLoad> 
        </div>
	<!--//免费模块-->
</template>


<script>
import pageCommon from '@/assets/script/common';
export default {
  name: 'my',
  data () {
    return {
      //免费数据
      freeData:'',
      //限时免费
      timeFree:{},
      //限时免费
      chapterFree:{},
      //是否展示加载动画
      isLoad:true
    }
  },
  methods:{
  	//免费请求
    initRequest(){
    	const postData = pageCommon.commonArg(),_this=this;
        //协议id
        postData.actionid = 9025;

        this.$http.get(pageCommon.portUrl, { params: postData }).then(function(data) {
            if (!pageCommon.checkResultData(data)) {
                return;
            }
            var data = data.body.ResponseObject[0],
            timeFree=data.bookLimitFree.leftTime,
            chapterFree=data.chapterLimitFree.leftTime;
            _this.timeFree=_this.leftTime(timeFree);
            _this.chapterFree=_this.leftTime(chapterFree); 
            setInterval(function(){
            	timeFree-=1;
            	chapterFree-=1;
            	_this.timeFree=_this.leftTime(timeFree);
            	_this.chapterFree=_this.leftTime(chapterFree);               
            },1000);
            this.freeData=data;
            this.isLoad=false;
            
        }, function(response) {
            pageCommon.requestError()
        });
    },
    
    
    //倒计时
    leftTime(seconds){
    	var min = Math.floor(seconds / 60),
        second = seconds % 60,
        hour='00', newMin=min % 60, time;

	    if (min > 60 ) {
	        hour = Math.floor(min / 60);
	    }

	    if(hour<10 && hour>0){
	    	hour='0'+hour;
	    }else if(hour<0){
            hour='00';
	    }

	    if (newMin < 10 && newMin>0) { 
	    	min = '0' + newMin;
	    }else if (newMin<=0) { 
	    	min = '00';
	    } else{
	    	min=newMin;
	    }   
	    	    
        
	    if (second < 10) { second = '0' + second;}

	    return {
	    	'hour':hour,
	    	'min':min,
	    	'second':second
	    };
       
    }
  },mounted:function(){
    this.initRequest();  
 },
}

</script>

