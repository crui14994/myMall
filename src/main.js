// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload' //图片懒加载插件
import infiniteScroll from 'vue-infinite-scroll' //滚动加载插件
import VueCurrencyFilter from 'vue-currency-filter' //价格过滤器


import axios from 'axios';
import apiConfig from './../config/api.config.js'
axios.defaults.baseURL=apiConfig.baseURL;
Vue.prototype.axios = axios;


Vue.config.productionTip = false

//导入css样式
import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/product.css'
import "./assets/css/login.css";

//图片懒加载插件
Vue.use(VueLazyload, {
  try: 3, // default 1
  loading: 'static/loading-svg/loading-bars.svg'
})

//滚动加载插件
Vue.use(infiniteScroll)

//价格过滤器
Vue.use(VueCurrencyFilter,
  {
    symbol: '$',
    thousandsSeparator: ',',
    fractionCount: 2,
    fractionSeparator: '.',
    symbolPosition: 'front',
    symbolSpacing: true
  })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
