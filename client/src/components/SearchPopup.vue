<template>
  <div class="menu-popup-container">
    <van-icon name="search" @click="showRight = true"/>
  </div>
  <van-popup
    v-model:show="showRight"
    position="right"
    :style="{ width: '70%', height: '100%' }"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";

const showRight = ref(false);
</script>

<style scoped></style>
