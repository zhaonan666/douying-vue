<template>
  <div class="menu-popup-container">
    <van-icon name="wap-nav" @click="showLeft = true" />
  </div>

  <van-popup
    v-model:show="showLeft"
    position="left"
    :style="{ width: '70%', height: '100%' }"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";

const showLeft = ref(false);
</script>

<style scoped></style>
