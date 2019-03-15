<template>
 <div>
      <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':mdShow}">
        <div class="md-modal-inner">
          <div class="md-top">
            <button class="md-close"  @click="closeModal">Close</button>
          </div>
          <div class="md-content">
            <div class="confirm-tips">
              <slot name="message"></slot>
            </div>
            <div class="btn-wrap">
              <slot name="btnGroup"></slot>
            </div>
          </div>
        </div>
      </div>
      <div  v-if="mdShow" @click="closeModal" class="md-overlay"></div>
    </div>
</template>

<script>

export default {
  name: "Modal",
  props:["mdShow"],
  data() {
    return {
    };
  },
  components: {},
  computed: {},
  created() {},
  mounted() {
  },
  methods: {
      closeModal(){
          this.$emit("close");
      }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
