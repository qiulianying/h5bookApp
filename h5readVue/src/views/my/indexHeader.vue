<template>
<header class="index_header">
    <div class="dets_top_div">
        <h3>{{pageData.title}}</h3>
        <a class="top_nac_icon back" @click="back()" href="javascript:;" v-if="backUrl!='/'"></a>
        <a class="top_nac_icon3" href="javascript:;"></a>
    </div>
</header>
</template>

<script>
require('@/assets/sass/index_header.scss')

export default {
  name: 'hello',
  data () {
    return {
      title: '我的账户',
      backUrl:"/"
    }
  },
  props:['pageData'],
  methods:{
    back(){
      this.$router.go(-1)
    }
  },
  created:function(){

    if(this.pageData.pageUrl==='myIndex'){
      this.backUrl="/"
    }else{
      this.backUrl="/my"
    }
 },     
}
</script>