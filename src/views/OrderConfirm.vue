<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>订单确认</span>
    </nav-bread>
    <div class="container">
    <div class="checkout-order">
      <div class="page-title-normal">
        <h2 class="page-title-h2"><span>check out</span></h2>
      </div>
      <!-- process step -->
      <div class="check-step">
        <ul>
          <li class="cur"><span>Confirm</span> address</li>
          <li class="cur"><span>View your</span> order</li>
          <li><span>Make</span> payment</li>
          <li><span>Order</span> confirmation</li>
        </ul>
      </div>

      <!-- order list -->
      <div class="page-title-normal checkout-title">
        <h2><span>Order content</span></h2>
      </div>
      <div class="item-list-wrap confirm-item-list-wrap">
        <div class="cart-item order-item">
          <div class="cart-item-head">
            <ul>
              <li>Order contents</li>
              <li>Price</li>
              <li>Quantity</li>
              <li>Subtotal</li>
            </ul>
          </div>
          <ul class="cart-item-list">
            <li v-for="(item,index) in cartList" :key="index" v-if="item.checked=='1'">
              <div class="cart-tab-1">
                <div class="cart-item-pic">
                  <img v-lazy="'static/'+item.productImage" :key="'static/'+item.productImage" alt="">
                </div>
                <div class="cart-item-title">
                  <div class="item-name">{{item.productName}}</div>

                </div>
              </div>
              <div class="cart-tab-2">
                <div class="item-price">{{item.salePrice | currency}}</div>
              </div>
              <div class="cart-tab-3">
                <div class="item-quantity">
                  <div class="select-self">
                    <div class="select-self-area">
                      <span class="select-ipt">×{{item.productNum}}</span>
                    </div>
                  </div>
                  <div class="item-stock item-stock-no">In Stock</div>
                </div>
              </div>
              <div class="cart-tab-4">
                <div class="item-price-total">{{item.salePrice*item.productNum | currency}}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Price count -->
      <div class="price-count-wrap">
        <div class="price-count">
          <ul>
            <li>
              <span>Item subtotal:</span>
              <span>{{subTotal | currency}}</span>
            </li>
            <li>
              <span>Shipping:</span>
              <span>{{shipping | currency}}</span>
            </li>
            <li>
              <span>Discount:</span>
              <span>{{discount | currency}}</span>
            </li>
            <li>
              <span>Tax:</span>
              <span>{{tax | currency}}</span>
            </li>
            <li class="order-total-price">
              <span>Order total:</span>
              <span>{{orderTotal | currency}}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="order-foot-wrap">
        <div class="prev-btn-wrap">
          <router-link class="btn btn--m" to="/address">Previous</router-link>
        </div>
        <div class="next-btn-wrap">
          <button class="btn btn--m btn--red" @click="payMent">Proceed to payment</button>
        </div>
      </div>
    </div>
  </div>
    <nav-footer></nav-footer>
  </div>
</template>
<style>
</style>
<script>
import NavHeader from "./../components/NavHeader";
import NavFooter from "./../components/NavFooter";
import NavBread from "./../components/NavBread";
export default {
  name: "OrderConfirm",
  data() {
    return {
      shipping: 100, //配送费
      discount: 200, //折扣
      tax: 400, //税费
      subTotal: 0, //商品总价格
      orderTotal: 0, //商品最终价格
      cartList: [] //购物车列表
    };
  },
  mounted() {
    this.getCartList();
  },
  computed: {},
  components: {
    NavHeader,
    NavBread,
    NavFooter
  },
  methods: {
    //提交到支付页面
    payMent() {
      this.axios
        .post(this.serverUrl+"/users/payMent", {
          addressId: this.$route.query.addressId,
          orderTotal: this.orderTotal
        })
        .then(response => {
          var res = response.data;
          if (res.status == "0") {
            this.$router.push({
              path: "/orderSuccess?orderId=" + res.result.orderId
            });
          }
        });
    },
    //获取购物车列表
    getCartList() {
      this.axios.get(this.serverUrl+"/users/cartList").then(response => {
        var res = response.data;
        if (res.status == "0") {
          this.cartList = res.result;
          this.cartList.forEach(item => {
            if (item.checked == "1") {
              this.subTotal += item.salePrice * item.productNum;
            }
          });
          this.orderTotal =
            this.subTotal + this.shipping - this.discount + this.tax;
        }
      });
    }
  }
};
</script>
