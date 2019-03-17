<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>我的地址</span>
    </nav-bread>
    <div class="checkout-page">
      <div class="container">
        <div class="checkout-addr">
          <div class="page-title-normal">
            <h2 class="page-title-h2">
              <span>check out</span>
            </h2>
          </div>
          <!-- process step -->
          <div class="check-step">
            <ul>
              <li class="cur">
                <span>确定地址</span></li>
              <li>
                <span>查看订单</span></li>
              <li>
                <span>支付</span> </li>
              <li>
                <span>订单确认</span></li>
            </ul>
          </div>

          <!-- address list -->
          <div class="page-title-normal checkout-title">
            <h2>
              <span>收货地址：</span>
            </h2>
          </div>
          <div class="addr-list-wrap">
            <div class="addr-list">
              <ul>
                <li v-for="(item,index) in addressListFilter" @click="checkAddress(item,index)" :key="index" :class="{'check':checkIndex==index}">
                  <dl>
                    <dt>XXX</dt>
                    <dd class="address">{{item.streetName}}</dd>
                    <dd class="tel">{{item.tel}}</dd>
                  </dl>
                  <div class="addr-opration addr-del">
                    <a href="javascript:;" class="addr-del-btn" @click="delMiddleware(item.addressId)">
                      <svg class="icon icon-del">
                        <use xlink:href="#icon-del"></use>
                      </svg>
                    </a>
                  </div>
                  <div class="addr-opration addr-set-default">
                    <a href="javascript:;" @click="setDefultAddress(item.addressId)" class="addr-set-default-btn" v-if="!item.isDefault">
                      <i>Set default</i>
                    </a>
                  </div>
                  <div class="addr-opration addr-default" v-if="item.isDefault">默认地址</div>
                </li>
                <li class="addr-new">
                  <div class="add-new-inner">
                    <i class="icon-add">
                      <svg class="icon icon-add">
                        <use xlink:href="#icon-add"></use>
                      </svg>
                    </i>
                    <p>添加收货地址</p>
                  </div>
                </li>
              </ul>
            </div>

            <div class="shipping-addr-more">
              <a class="addr-more-btn up-down-btn" href="javascript:;" @click="expand" :class="{'open':expandMessage=='收起'}">
                {{expandMessage}}
                <i class="i-up-down">
                  <i class="i-up-down-l"></i>
                  <i class="i-up-down-r"></i>
                </i>
              </a>
            </div>
          </div>

          <!-- shipping method-->
          <div class="page-title-normal checkout-title">
            <h2>
              <span>配送方式：</span>
            </h2>
          </div>
          <div class="lemall-msg-info hidden">
            <span>The region you selected is not within our delivery area. Please select another shipping address within our delivery
              areas.</span>
          </div>
          <div class="shipping-method-wrap">
            <div class="shipping-method">
              <ul>
                <li class="check">
                  <div class="name">Standard shipping</div>
                  <div class="price">Free</div>
                  <div class="shipping-tips">
                    <p>Once shipped，Order should arrive in the destination in 1-7 business days</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="next-btn-wrap">
             <router-link class="btn btn--m btn--red" v-bind:to="{path:'orderConfirm',query:{'addressId':selectedAddrId}}">Next</router-link>
          </div>
        </div>
      </div>
    </div>

     <!-- //模态框 -->
      <modal :mdShow="isDelModal" v-on:close="closeModal">
          <p slot="message">
          <svg class="icon-status-ok">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
          </svg>
          <span>您确定要删除此地址吗？</span>
        </p>
        <div slot="btnGroup">
          <a class="btn btn--m" href="javascript:;" @click="delModal">确定删除</a>
          <a class="btn btn--m btn--red" href="javascript:;" @click="closeModal">取消</a>
        </div>
      </modal>
    <nav-footer></nav-footer>
  </div>
</template>
<style>
</style>
<script>
import NavHeader from "./../components/NavHeader";
import NavFooter from "./../components/NavFooter";
import NavBread from "./../components/NavBread";
import Modal from "@/components/Modal";
export default {
  name: "Address",
  data() {
    return {
      addressId: "", //当前要删除地址的ip
      isDelModal: false, //地址删除提示框是否显示
      selectedAddrId: "", //当前选择的地址的id
      checkIndex: 0, //当前选择的地址
      limit: 3, //默认只显示3个地址
      addressList: [] //订单地址列表
    };
  },
  mounted() {
    this.getAddressList();
  },
  computed: {
    //展开或收起的文字
    expandMessage() {
      if (this.limit != this.addressList.length) {
        return "展开";
      } else {
        return "收起";
      }
    },
    //根据limit过滤出数组中的前limit个地址
    addressListFilter() {
      return this.addressList.slice(0, this.limit);
    }
  },
  components: {
    NavHeader,
    NavBread,
    NavFooter,
    Modal
  },
  methods: {
    //删除地址
    delModal() {
      this.axios
        .post("/users/delAddress", {
          addressId: this.addressId
        })
        .then(response => {
          let res = response.data;
          if (res.status == "0") {
            this.isDelModal = false;
            this.getAddressList();
          }
        });
    },
    //关闭地址中间件提示
    closeModal() {
      this.isDelModal = false;
    },
    //显示地址中间件提示
    delMiddleware(addressId) {
      this.isDelModal = true;
      this.addressId = addressId;
    },
    //设置默认地址
    setDefultAddress(addressId) {
      this.axios
        .post("/users/setDefault", {
          addressId: addressId
        })
        .then(response => {
          var res = response.data;
          if (res.status == "0") {
            this.getAddressList();
          }
        });
    },
    //选择地址
    checkAddress(good, index) {
      this.checkIndex = index;
      this.selectedAddrId = good.addressId;
    },
    //展开或收起地址
    expand() {
      if (this.limit != this.addressList.length) {
        this.limit = this.addressList.length;
      } else {
        this.limit = 3;
      }
    },
    //获取用户收货地址
    getAddressList() {
      this.axios.get("/users/addressList").then(response => {
        var res = response.data;
        if (res.status == "0") {
          this.addressList = res.result;
          this.addressList.forEach((item, index) => {
            if (item.isDefault) {
              this.checkIndex = index;
              this.selectedAddrId = item.addressId;
            }
          });
        }
      });
    }
  }
};
</script>
