// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import VueResource from "vue-resource"
import goods from './components/goods/goods'
import seller from './components/seller/seller'
import ratings from './components/ratings/ratings'
import './common/stylus/index.styl'
Vue.use(VueRouter)
Vue.use(VueResource)
const  router = new VueRouter({
mode:"hash",
linkActiveClass:"myactive",//设置高亮显示。myactive的样式在app.vue当中设置
routes:[
 {path:'/',redirect:'goods'},  //设置默认的页面
 { path:'/goods',
    component:goods
  },
  { path :'/ratings',
    component:ratings
  },
  { path:'/seller',
    component:seller
  }
]
}) 
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
