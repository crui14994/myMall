import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state={
    userStateName:"",
    cartCount:0
}

const mutations={
    updataUserName(state,name){
        state.userStateName = name;
    },
    updataCartCount(state,num){
        state.cartCount = parseInt(num);
    },
    addCartCount(state,num){
        state.cartCount +=  parseInt(num);
    }
}

export default new Vuex.Store({
    state,mutations
})