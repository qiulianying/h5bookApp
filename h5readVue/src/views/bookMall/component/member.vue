<template>
  <!--会员模块-->
  <div>
  <div class="mall_member" v-if="!!memberData">
    <!--会员精选-->
    <div class="idx_title">
      <span class="mall_title mall_mem_icon mall_mem_select">会员精选</span>
    </div>
    <div class="book_list_mg flex_sp text_c">
      <router-link class="book_pd" :to="'/bookMall/detail?bookid='+item.bookId" :key="item.index" v-for="(item,index) of memberData.vipSelected.books" v-if="index<=2">
        <img class="book_size" :src="item.cover" />
        <p class="book_list_word ellipsis_two">{{item.name}}</p>
      </router-link>
    </div>
    <!--//会员精选-->
    
    <!--会员男频热文-->
    <div class="idx_title">
      <span class="mall_title mall_mem_icon mall_mem_nan">会员男频热文</span>
    </div>
    <router-link :to="'/bookMall/detail?bookid='+item.bookId" class="mall_box flex_sp" :key="item.index" v-for="(item,index) of memberData.vipManHot.books" v-if="index===0">
      <img class="book_size_small book_shadow" :src="item.cover" />
      <div class="mall_brief">
        <h3 class="mall_brief_title ellipsis">{{item.name}}</h3>
        <p>作者：{{item.author}}</p>
        <p class="mall_brief_con ellipsis_two">{{item.introduce}}</p>
      </div>
    </router-link>
    <div class="com_box mall_cai">
      <router-link class="mall_name" :to="'/bookMall/detail?bookid='+item.bookId" :key="item.index" v-for="(item,index) of memberData.vipManHot.books" v-if="index>0">
        <h3 class="mall_black ellipsis">{{item.name}}</h3>
        <p class="ellipsis">
          {{item.introduce}}
        </p>
      </router-link>
    </div>
    <!--//会员男频热文-->
    
    <!--会员女频热文-->
    <div class="idx_title">
      <span class="mall_title mall_mem_icon mall_mem_nv">会员女频热文</span>
    </div>
    <router-link :to="'/bookMall/detail?bookid='+item.bookId" class="mall_box flex_sp" :key="item.index" v-for="(item,index) of memberData.vipFemaleHot.books" v-if="index===0">
      <img class="book_size_small book_shadow" :src="item.cover" />
      <div class="mall_brief">
        <h3 class="mall_brief_title ellipsis">{{item.name}}</h3>
        <p>作者：{{item.author}}</p>
        <p class="mall_brief_con ellipsis_two">{{item.introduce}}</p>
      </div>
    </router-link>
    <div class="com_box mall_cai">
      <router-link class="mall_name" :to="'/bookMall/detail?bookid='+item.bookId" :key="item.index" v-for="(item,index) of memberData.vipFemaleHot.books" v-if="index>0">
        <h3 class="mall_black ellipsis">{{item.name}}</h3>
        <p class="ellipsis">
          {{item.introduce}}
        </p>
      </router-link>
    </div>
    <!--//会员女频热文-->
    
    <!--会员人气排行-->
    <div class="idx_title">
      <span class="mall_title mall_mem_icon mall_mem_rank">会员人气排行</span>
    </div>
    <div class="flex_sp mall_rank_wrap" :key="item.index" v-for="(item,index) of memberData.vipPopularity.books">
      <div class="posr">
        <img class="book_size_small book_shadow" :src="item.cover" />
        <span class="mall_icon_rank">{{index+1}}</span>
      </div>
      <router-link :to="'/bookMall/detail?bookid='+item.bookId" class="mall_brief">
        <h3 class="flex_sp">
          <span class="mall_brief_title brief_wid_hot ellipsis">{{item.name}}</span>
          <span class="brief_icon_hot">{{item.wordCount}}</span>
        </h3>
        <p class="mall_brief_con ellipsis_two">{{item.introduce}}</p>
        <div class="flex_sp">
          <p class="mall_brief_icon">{{item.author}}</p>
          <p>
            <span class="brief_btn">{{item.category}}</span>
            <span class="brief_btn brief_btn_red">{{item.score}}分</span>
          </p>
        </div>
      </router-link>
    </div>
    <router-link class="text_c dblock mall_hot_more" :to="'/bookMall/bookList?moreid='+memberData.vipPopularity.moreId+'&type=0&name=会员人气排行'">查看更多</router-link>
    <!--//会员人气排行-->
    
  </div>
  <!-- 加载动画 -->
    <com-pageLoad v-if="isLoad"></com-pageLoad> 
    </div>
  <!--//会员模块-->
</template>


<script>
import pageCommon from '@/assets/script/common';
export default {
  name: 'my',
  data () {
    return {
      memberData:'',
      //是否展示加载动画
      isLoad:true
    }
  },
  methods:{
    //会员请求
    initRequest(){
       const postData = pageCommon.commonArg();
        //协议id
        postData.actionid = 9028;

        this.$http.get(pageCommon.portUrl, { params: postData }).then(function(data) {
            if (!pageCommon.checkResultData(data)) {
                return;
            }
            var data = data.body.ResponseObject[0];
            this.memberData=data;
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