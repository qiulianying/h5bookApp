<template>
  <!--分类模块-->
  <div>
	<div class="mall_classify" v-if="!!classifyData">
	   <div :key="item.index" v-for="item of classifyData">
		<div class="idx_title flex_sp">
			<span class="mall_title">{{item.name}}</span><span>新增：{{item.total}}</span>
		</div>
		<div class="flex_sp text_l classify_wrap">
			<router-link class="classify_item flex_sp" :to="'/bookMall/bookList?moreid='+itemSub.moreId+'&type=2&name='+itemSub.name" :key="itemSub.index" v-for="itemSub of item.itemList">
				<img class="classify_cover" :src="itemSub.cover" />
				<div class="classify_word">
					<p>{{itemSub.name}}</p>
					<p class="classify_word_small">{{itemSub.count}}</p>
				</div>
			</router-link>
		</div>
		</div>
		
	</div>
  <!-- 加载动画 -->
    <com-pageLoad v-if="isLoad"></com-pageLoad> 
    </div>
	<!--//分类模块-->
  
</template>


<script>
import pageCommon from '@/assets/script/common';
export default {
  name: 'my',
  data () {
    return {
      classifyData:'',
      isLoad:true
    }
  },
  methods:{
  	//分类请求
    initRequest(){
    	const postData = pageCommon.commonArg();
        //协议id
        postData.actionid = 9009;

        this.$http.get(pageCommon.portUrl, { params: postData }).then(function(data) {
            if (!pageCommon.checkResultData(data)) {
                return;
            }
            var data = data.body.ResponseObject[0].module;
            this.classifyData=data;
            this.isLoad=false;            
        }, function(response) {
            pageCommon.requestError()
        });
    },
  },mounted:function(){
    this.initRequest();  
 },
}

</script>

