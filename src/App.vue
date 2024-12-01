<script setup lang="ts">

// @ts-ignore
import left from './components/left.vue'



</script>

<template>
  <div class="main"  >
    <left />
    <router-view></router-view>

  </div>

  <!-- <chat /> -->
</template>
<style scoped>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;

}
.home{
  float: left;
  width: calc(100% - 300px);
}
.left{
  float: left;
  width: 300px;
  background-color: rgb(236, 236, 236);
  height: 100vh;
}
</style>
