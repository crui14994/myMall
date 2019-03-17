<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>我的购物车</span>
    </nav-bread>
<div class="container">
  <div class="cart">
    <div class="page-title-normal">
      <h2 class="page-title-h2"><span>我的购物车</span></h2>
    </div>
    <div class="item-list-wrap">
      <div class="cart-item">
        <div class="cart-item-head">
          <ul>
            <li>商品</li>
            <li>价格</li>
            <li>数量</li>
            <li>价格</li>
            <li>删除</li>
          </ul>
        </div>
        <ul class="cart-item-list">
          <li v-for="(item,index) in cartList" :key="index"> 
            <div class="cart-tab-1">
              <div class="cart-item-check">
                <a href="javascipt:;" class="checkbox-btn item-check-btn" :class="{'check':item.checked==1}" @click="editCart('checked',item)">
                  <svg class="icon icon-ok">
                    <use xlink:href="#icon-ok"></use>
                  </svg>
                </a>
              </div>
              <div class="cart-item-pic">
                <img v-lazy="'static/'+item.productImage">
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
                <div class="select-self select-self-open">
                  <div class="select-self-area">
                    <a class="input-sub" @click="editCart('reduce',item)">-</a>
                    <span class="select-ipt">{{item.productNum}}</span>
                    <a class="input-add" @click="editCart('add',item)">+</a>
                  </div>
                </div>
              </div>
            </div>
            <div class="cart-tab-4">
              <div class="item-price-total">{{item.salePrice*item.productNum | currency}}</div>
            </div>
            <div class="cart-tab-5">
              <div class="cart-item-opration">
                <a href="javascript:;" class="item-edit-btn">
                  <svg class="icon icon-del" @click="showDelModal(item)">
                    <use xlink:href="#icon-del"></use>
                  </svg>
                </a>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-foot-wrap">
      <div class="cart-foot-inner">
        <div class="cart-foot-l">
          <div class="item-all-check">
            <a href="javascipt:;" @click="editCheckAll">
                  <span class="checkbox-btn item-check-btn" :class="{'check':selectAll}">
                      <svg class="icon icon-ok"><use xlink:href="#icon-ok"/></svg>
                  </span>
              <span>全部选择</span>
            </a>
          </div>
        </div>
        <div class="cart-foot-r">
          <div class="item-total">
            商品总价: <span class="total-price">{{totalPrice | currency}}</span>
          </div>
          <div class="btn-wrap">
            <a class="btn btn--red" :class="{'btn--dis':checkedCount==0}" @click="checkOut">提交</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

    <!-- 删除确认模态框 -->
      <modal :mdShow="delShow" v-on:close="closeModal">
          <p slot="message">
          <span>您确定要删除此商品吗？</span>
        </p>
        <div slot="btnGroup">
          <a class="btn btn--m" href="javascript:;" @click="delCart">确定</a>
          <a class="btn btn--m btn--red" href="javascript:;" @click="closeModal">取消</a>
        </div>
      </modal>
    <nav-footer></nav-footer>
  </div>
</template>
<style>
.input-sub,
.input-add {
  min-width: 40px;
  height: 100%;
  border: 0;
  color: #605f5f;
  text-align: center;
  font-size: 16px;
  overflow: hidden;
  display: inline-block;
  background: #f0f0f0;
}
.item-quantity .select-self-area {
  background: none;
  border: 1px solid #f0f0f0;
}
.item-quantity .select-self-area .select-ipt {
  display: inline-block;
  padding: 0 3px;
  width: 30px;
  min-width: 30px;
  text-align: center;
}
</style>
<script>
import NavHeader from "./../components/NavHeader";
import NavFooter from "./../components/NavFooter";
import NavBread from "./../components/NavBread";
import Modal from "@/components/Modal";
export default {
  name: "Cart",
  data() {
    return {
      delShow: false, //是否显示删除提示模态框
      delGood: {}, //当前要删除的商品
      // selectAll:false, //是否全部选中
      cartList: []
    };
  },
  mounted() {
    this.getCartList();
  },
  computed: {
    //是否全部选中
    selectAll() {
      return this.checkedCount == this.cartList.length;
    },
    //有多少件商品被选中
    checkedCount() {
      var i = 0;
      this.cartList.forEach(item => {
        if (item.checked == "1") i++;
      });
      return i;
    },
    //商品总价
    totalPrice() {
      var price = 0;
      this.cartList.forEach(item => {
        if (item.checked == "1") {
          price += parseFloat(item.productNum) * parseFloat(item.salePrice);
        }
      });
      return price;
    }
  },
  components: {
    NavHeader,
    NavBread,
    NavFooter,
    Modal
  },
  methods: {
    //结账，跳转到地址页
    checkOut() {
      if (this.checkedCount > 0) {
        this.$router.push({
          path: "/address"
        });
      }
    },
    //是否全部选中事件
    editCheckAll() {
      var flag = !this.selectAll;
      this.cartList.forEach(item => {
        item.checked = flag ? "1" : "0";
      });
      this.axios
        .post("/users/editCheckAll", {
          checkAll: flag
        })
        .then(response => {
          let res = response.data;
          if (res.status == "0") {
            // this.getCartList();
          }
        });
    },
    //修改商品数量和是否是选中状态
    editCart(flag, good) {
      if (flag == "reduce") {
        //减
        if (good.productNum > 1) {
          good.productNum--;
          this.$store.commit("addCartCount", -1);
        }
      } else if (flag == "add") {
        //加
        good.productNum++;
        this.$store.commit("addCartCount", 1);
      } else if (flag == "checked") {
        //修改是否选中
        good.checked = good.checked == "1" ? "0" : "1";
      }
      this.axios
        .post("/users/cartEdit", {
          productId: good.productId,
          productNum: good.productNum,
          checked: good.checked
        })
        .then(response => {
          var res = response.data;
          if (res.status == "0") {
          }
        });
    },
    //显示删除提示框，将要删除的商品存入变量delGodo
    showDelModal(good) {
      this.delGood = good;
      this.delShow = true;
    },
    //商品删除
    delCart() {
      this.axios
        .post("/users/cartDel", {
          productId: this.delGood.productId
        })
        .then(response => {
          var res = response.data;
          if (res.status == "0") {
            this.$store.commit("addCartCount", -this.delGood.productNum);
            this.delShow = false;
            this.getCartList();
          }
        });
    },
    //获得当前用户的购物车列表
    getCartList() {
      this.axios.get("/users/cartList").then(response => {
        var res = response.data;
        if (res.status == "0") {
          this.cartList = res.result;
        }
      });
    },
    //关闭模态框
    closeModal() {
      this.delShow = false;
    }
  }
};
</script>
