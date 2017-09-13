<template>
  <div id="app">
     <transition>
        <keep-alive>
        <router-view></router-view>
        </keep-alive>
    </transition>

  </div>
</template>

<script>

require('./assets/sass/reset.scss')
require('./assets/sass/base.scss')
require('./assets/sass/animated.scss')

require('./assets/script/autoScreen.js')

export default {
  name: 'app',
  data () {
    return {
      
    }
  }
}


</script>
