<template>
  <div class="wrap">
     <transition :name="animate">            
        <router-view></router-view>
    </transition>
  </div>
</template>


<script>
require('@/assets/sass/my_content.scss')
export default {
  name: 'my',
  data () {
    return {
      animate:'fadeInRight'
    }
  },beforeRouteUpdate (to, from, next) {
    // console.log(to);
    // console.log(from);

    const toDepth = to.path.split('/').length;
    const fromDepth = from.path.split('/').length;
    this.animate = toDepth < fromDepth ? 'fadeInLeft' : 'fadeInRight';  

    next();
  },
}

</script>
