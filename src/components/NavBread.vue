<template>
    <div class="nav-breadcrumb-wrap">
        <div class="container">
            <nav class="nav-breadcrumb">
            <a href="/">首页</a>
            <slot></slot>    
            </nav>
        </div>
    </div>
</template>

<script>
export default {
  name: "NavBread",
  props: {},
  data() {
    return {};
  },
  components: {},
  computed: {},
  created() {},
  mounted() {},
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
