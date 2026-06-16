<template>
  <div class="loading-mask" v-if="loading">
    <div class="douyin-loader">
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
  loading: boolean;
}>();
</script>

<style scoped>
.loading-mask {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: grid;
  place-items: center;
  background: #000;
}

.douyin-loader {
  position: relative;
  width: 56px;
  height: 24px;
}

.douyin-loader span {
  position: absolute;
  top: 4px;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  animation: douyin-loading 0.9s ease-in-out infinite;
}

.douyin-loader span:first-child {
  left: 8px;
  background: #25f4ee;
}

.douyin-loader span:last-child {
  right: 8px;
  background: #fe2c55;
  animation-delay: -0.45s;
}

@keyframes douyin-loading {
  0%,
  100% {
    transform: translateX(0) scale(0.85);
    opacity: 0.65;
  }

  50% {
    transform: translateX(24px) scale(1.15);
    opacity: 1;
  }
}
</style>
