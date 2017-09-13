<template>
    <main class="Problem wrap">
        <com-head :pageData="pageData"></com-head>
        <div class="mine_content">
            <h3 class="problem_h">常见问题</h3>
            <el-collapse v-model="activeName" accordion style="border:0 none;">
              <el-collapse-item title="如何进行充值" name="1">
                <div>在【我的】的页面点击充值按钮，进入充值页面。在充值中心选择充值方式及充值金额后，点击下一步即可按照提示进行充值。</div>
              </el-collapse-item>
              <el-collapse-item title="关注公众号后，如何再看之前阅读过的书？" name="2">
                <div>1、点击公众号菜单，进入书架，在【历史】选项卡中，可以继续查看之前看过的图书。</div>
                <div>2、若之前书已收藏，也可以在书架的【收藏】选项卡中看到。建议您看到好书时务必点击加入收藏。</div>
                <div>3、另外如果因缓存清理，导致历史被清空时，您也可以在购买记录中查看已购书籍的购买记录。</div>
              </el-collapse-item>
              <el-collapse-item title="礼券如何使用和获取？" name="3">
                <div>1、礼券可等同于阅币使用，当阅币使用完时自动启用。</div>
                <div>2、您可以关注公众号，点击签到菜单获取礼券，另外下载app签到可获得更多礼券，更有不定期运营活动。</div>
                <div>3、其中每日签到的礼券会在每周一清零，请注意提前使用。</div>
              </el-collapse-item>              
            </el-collapse>

          
        </div>
        <div class="footer_contetn">
            <p>更多问题，请联系客服人员</p>
            <p>客服QQ：2633493356</p>
            <p>客服电话：400-032-3881</p>
        </div>
    </main>
</template>

<script>
    require('@/assets/sass/help.scss')
    export default {
        name: 'help',
        data() {
            return {
                 activeName: '1'
            }
        },
        created: function() {
            this.pageData = {
                "title": "帮助说明",
                "pageUrl": 'help'
            };
        },
    }
</script>
