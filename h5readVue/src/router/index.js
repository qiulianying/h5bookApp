import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'
import VueResource from 'vue-resource'

Vue.use(Router);
Vue.use(Vuex);
Vue.use(VueResource);

/* 全局组件 */
//头部
import ComHead from '@/components/head'
//底部
import ComFoot from '@/components/footer'
//加载动画
import ComPageLoad from '@/components/pageLoad'


/* 书架 */
import BookShelf from '@/views/bookShelf/index'


/* 书城 */
import BookMall from '@/views/bookMall/bookMall'
import BookMallIndex from '@/views/bookMall/index'
//详情页
import Detail from '@/views/bookMall/detail'
//评论列表
import CommentList from '@/views/bookMall/commentList'
//评论详情
import CommentDetail from '@/views/bookMall/commentDetail'
//评论页面
import CommentSend from '@/views/bookMall/commentSend'
//书籍列表
import BookList from '@/views/bookMall/bookList'
//章节
import BookChapter from '@/views/bookMall/bookChapter'
//阅读
import BookRead from '@/views/bookMall/bookRead'
//章节订阅页面
import BookPurchase from '@/views/bookMall/bookPurchase'


/* 搜索 */
import Search from '@/views/search/index'


/* 我的账户 */
import My from '@/views/my/my'
//我的首页
import MyIndex from '@/views/my/index'
//绑定手机
import BindPhone from '@/views/my/bindPhone'

//找回账号
import FindAccount from '@/views/my/findAccount'
//帮助
import Help from '@/views/my/help'
//设置密码
import SetPassword from '@/views/my/setPassword'
//充值中心
import PayCenter from '@/views/my/payCenter'
//充值中心
import ChangeAccount from '@/views/my/changeAccount'
//会员充值
import VipPay from '@/views/my/vipPay'

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: '书城',
    component: BookMall,
    children: [
      { path: '', name: "书城", component: BookMallIndex }
    ]
  }, {
    path: '/BookMall',
    component: BookMall,
    children: [
      { path: '', name: "书城", component: BookMallIndex },
      { path: 'detail', name: "书籍详情", component: Detail },
      { path: 'commentList', name: "评论列表", component: CommentList },
      { path: 'commentSend', name: "发送评论", component: CommentSend },
      { path: 'commentDetail', name: "评论详情", component: CommentDetail },
      { path: 'bookList', name: "书籍列表", component: BookList },
      { path: 'bookChapter', name: "章节", component: BookChapter },
      { path: 'bookRead', name: "章节阅读", component: BookRead },
      { path: 'bookPurchase', name: "章节订阅", component: BookPurchase }
    ]
  }, {
    path: '/my',
    component: My,
    children: [
      { path: '', name: "我的账户", component: MyIndex },
      { path: 'help', name: "帮助说明", component: Help },
      { path: 'bindPhone', name: "绑定手机", component: BindPhone },
      { path: 'findAccount', name: "找回账号", component: FindAccount },
      { path: 'setPassword', name: "设置密码", component: SetPassword },
      { path: 'payCenter', name: "充值中心", component: PayCenter },
      { path: 'ChangeAccount', name: "切换账号", component: ChangeAccount },
      { path: 'vipPay', name: "会员充值", component: VipPay }
    ]
  }, {
    path: '/Search',
    component: Search,
    children: [
      { path: '', name: "搜素", component: Search }
    ]
  }, {
    path: '/bookShelf',
    component: BookShelf,
    children: [
      { path: '', name: "书架", component: BookShelf }
    ]
  }, {
    path: '*',
    name: '书城',
    component: BookMall,
  }, ],
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
});

//底部tab
Vue.component('com-foot', ComFoot);

// 头部
Vue.component('com-head', ComHead);

// 加载动画
Vue.component('com-pageLoad', ComPageLoad);
