<template>
  <div class="bottom-nav-bar-container">
    <van-tabbar v-model="active" route class="bottom-nav-bar">
      <van-tabbar-item to="/home">首页</van-tabbar-item>
      <van-tabbar-item to="/shop">商城</van-tabbar-item>
      <van-tabbar-item to="/publish">
        <Icon icon="lucide:plus" width="24" />
      </van-tabbar-item>
      <van-tabbar-item to="/messages">消息</van-tabbar-item>
      <van-tabbar-item to="/my">我</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";
const active = ref("home");
</script>

<style scoped>
:deep(.van-tabbar) {
  height: 58px;
  background: #000;
}

:deep(.van-tabbar-item__text) {
  font-size: 15px;
  line-height: 20px;
  color: white;
}
:deep(.van-tabbar-item--active) {
  background: black;
}
</style>
