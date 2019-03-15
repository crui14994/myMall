<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>订单完成</span>
    </nav-bread>
      <div class="container">
    <div class="page-title-normal">
      <h2 class="page-title-h2"><span>check out</span></h2>
    </div>
    <!-- 进度条 -->
    <div class="check-step">
      <ul>
        <li class="cur"><span>Confirm</span> address</li>
        <li class="cur"><span>View your</span> order</li>
        <li class="cur"><span>Make</span> payment</li>
        <li class="cur"><span>Order</span> confirmation</li>
      </ul>
    </div>

    <div class="order-create">
      <div class="order-create-pic"><img src="static/ok-2.png" alt=""></div>
      <div class="order-create-main">
        <h3>Congratulations! <br>Your order is under processing!</h3>
        <p>
          <span>Order ID：{{orderId}}</span>
          <span>Order total：{{orderTotal | currency}}</span>
        </p>
        <div class="order-create-btn-wrap">
          <div class="btn-l-wrap">
            <router-link href="javascript:;" class="btn btn--m" to="/cart">Cart List</router-link>
          </div>
          <div class="btn-r-wrap">
            <router-link href="javascript:;" class="btn btn--m" to="/">Goods List</router-link>
          </div>
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
  name: "OrderSuccess",
  data() {
    return {
      orderId: "",
      orderTotal: 0
    };
  },
  mounted() {
    this.getOrderDetail();
  },
  computed: {},
  components: {
    NavHeader,
    NavBread,
    NavFooter
  },
  methods: {
    //获取订单信息
    getOrderDetail() {
      var orderId = this.$route.query.orderId;
      if (!orderId) {
        return;
      }
      this.axios
        .get(this.serverUrl+"/users/orderDetail", {
          params: { orderId: orderId }
        })
        .then(response => {
          var res = response.data;
          if (res.status == "0") {
            this.orderId = orderId;
            this.orderTotal = res.result.orderTotal;
          }
        });
    }
  }
};
</script>
