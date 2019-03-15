<template>
  <div>
      <nav-header></nav-header>
      <nav-bread><span>商品</span></nav-bread>

      <div class="accessory-result-page accessory-page">
        <div class="container">
            <div class="filter-nav">
            <span class="sortby">商品排序:</span>
            <a href="javascript:void(0)" class="default cur">默认</a>
            <a href="javascript:void(0)" class="price" @click="setPriceSort">
              价格 
              <svg class="icon icon-arrow-short" :class="{'sort-up':sort!=1}"><use xlink:href="#icon-arrow-short"></use></svg>
            </a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">选择价格区间</a>
            </div>
            <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" :class="{'filterby-show':filterBy}" id="filter">
                <dl class="filter-price">
                    <dt>选择价格区间:</dt>
                    <dd @click="closeFilterPop">
                        <a href="javascript:void(0)" @click="setPriceFilter('all')" :class="{cur:filterState=='all'}">全部</a>
                    </dd >
                    <dd v-for="(price,index) in filterPrice" :key="index" @click="closeFilterPop">
                        <a href="javascript:void(0)" @click="setPriceFilter(index)" :class="{cur:filterState==index}">{{price.startPrice}}-{{price.endPrice}}</a>
                    </dd>
                </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
                    <div class="accessory-list col-4">
                        <ul>
                            <li v-for="(good,index) in goodsList" :key="index">
                                <div class="pic">
                                    <a href="#"><img v-lazy="'static/'+good.productImage" :key="'static/'+good.productImage" alt=""></a>
                                </div>
                                <div class="main">
                                    <div class="name">{{good.productName}}</div>
                                    <div class="price">{{good.salePrice}}</div>
                                    <div class="btn-area">
                                    <a href="javascript:;" @click="addCart(good.productId)" class="btn btn--m">加入购物车</a>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div class="loading" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                          {{loadingMessage}}
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
      <!-- //模态框 -->
      <modal :mdShow="mdShow" v-on:close="closeModal">
          <p slot="message">
             请先登录,否则无法加入到购物车中!
          </p>
          <div slot="btnGroup">
              <a class="btn btn--m" href="javascript:;" @click="closeModal">关闭</a>
          </div>
      </modal>

      <!-- //模态框 -->
      <modal :mdShow="mdShowLogin" v-on:close="closeModal">
          <p slot="message">
          <svg class="icon-status-ok">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
          </svg>
          <span>加入购物车成功!</span>
        </p>
        <div slot="btnGroup">
          <a class="btn btn--m" href="javascript:;" @click="mdShowLogin = false">继续购物</a>
          <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">查看购物车</router-link>
        </div>
      </modal>
      <!-- 弹出半透明层 -->
      <div class="md-overlay" v-show="filterBy"  @click.stop="closeFilterPop"></div>
    
      <!-- footer -->
      <nav-footer></nav-footer>
  </div>
</template>

<script>
import NavHeader from "@/components/NavHeader";
import NavBread from "@/components/NavBread";
import NavFooter from "@/components/NavFooter";
import Modal from "@/components/Modal";

export default {
  name: "GoodsList",
  props: {},
  data() {
    return {
      mdShow:false, //点击购物车是否显示未登录的模态框
      mdShowLogin:false,  //点击购物车是否显示登录的模态框
      busy: false, //没有执行加载过程，可触发滚动方法
      loadingMessage: "正在加载...",
      page: 1, //当前页码
      pageSize: 8, //每一页显示的数量
      sort: 1, //默认正序
      priceLevel: "all", //价格过滤，值为all，0,1,2,3
      filterBy: false, //在视图层比较小时价格过滤默认不显示
      filterState: "all",
      goodsList: [], //商品
      filterPrice: [
        //价格过滤
        {
          startPrice: "0.00",
          endPrice: "100.00"
        },
        {
          startPrice: "100.00",
          endPrice: "500.00"
        },
        {
          startPrice: "500.00",
          endPrice: "1000.00"
        },
        {
          startPrice: "1000.00",
          endPrice: "5000.00"
        }
      ]
    };
  },
  components: {
    NavHeader,
    NavBread,
    NavFooter,
    Modal
  },
  computed: {},
  created() {
    this.getGoodsList();
  },
  mounted() {},
  methods: {
    //关闭点击购物车出现模态框
    closeModal(){
      this.mdShow = false;
      this.mdShowLogin= false
    },
    //滚动到距离底部指定位置时触发
    loadMore: function() {
      this.busy = true;
      //官方示例中延迟了1秒，防止滚动条滚动时的频繁请求数据
      setTimeout(() => {
        //这里请求接口去拿数据，实际应该是调用一个请求数据的方法
        this.page++;
        this.getGoodsList(true);
      }, 500);
    },
    //根据参数获取商品列表
    getGoodsList(flag) {
      this.axios
        .get(this.serverUrl+"/goods/list", {
          params: {
            page: this.page,
            pageSize: this.pageSize,
            sort: this.sort,
            priceLevel: this.priceLevel
          }
        })
        .then(response => {
          var res = response.data;
          if (res.status == "0") {
            if (flag) {
              this.goodsList = this.goodsList.concat(res.result.list);
              if (res.result.count == 0) {
                this.busy = true;
                this.loadingMessage = "已全部加载完成！";
              } else {
                this.busy = false;
                this.loadingMessage = "正在加载...";
              }
            } else {
              this.goodsList = res.result.list;
              this.busy = false;
              this.loadingMessage = "正在加载...";
            }
            if (this.goodsList.length < this.pageSize) {
              this.loadingMessage = "已全部加载完成！";
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //选择价格过滤区间
    setPriceFilter(i) {
      this.filterState = i;
      this.priceLevel = i;
      this.page = 1; //设置价格排序后重新从第一页开始加载
      this.getGoodsList();
    },
    //设置价格排序
    setPriceSort() {
      this.sort = this.sort == 1 ? -1 : 1;
      this.page = 1; //设置价格排序后重新从第一页开始加载
      this.getGoodsList();
    },
    //当视图变小时点击显示价格过滤
    showFilterPop() {
      this.filterBy = true;
    },
    //关闭价格过滤
    closeFilterPop() {
      this.filterBy = false;
    },
    //加入到购物车
    addCart(productId) {
      this.axios
        .post(this.serverUrl+"/goods/addCart", {
          productId: productId
        })
        .then(res => {
          var res = res.data;
          if (res.status == 0) {
            this.mdShowLogin=true;
          } else {
            this.mdShow=true;
          }
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img[lazy="loading"] {
  display: block;
  width: 70px;
  height: 70px;
  margin: 0 auto;
  position: relative;
  top: 70px;
}
.loading {
  width: 100%;
  height: 40px;
  text-align: center;
  line-height: 40px;
  background-color: #ededed;
  border: solid 1px #eeee;
}
.icon-arrow-short {
  transition: all 0.3s ease-out;
}
.sort-up {
  transform: rotate(180deg);
  transition: all 0.3s ease-out;
}
</style>
