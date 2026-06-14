<template>
  <div class="home-page">
    <TopNavBar />
    <VideoPlay />
    <VideoTools />
    <div v-if="loading" class="loading-mask">
      <div class="douyin-loader">
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TopNavBar from "@/components/TopNavBar.vue";
import VideoPlay from "@/components/video/VideoPlay.vue";
import VideoTools from "@/components/video/VideoTools.vue";
import { storeToRefs } from "pinia";
import { useVideoStore } from "@/stores/video.js";

const videoStore = useVideoStore();

const { loading } = storeToRefs(videoStore);
</script>

<style scoped>
.home-page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
  position: relative;
  display: flex;
  flex-direction: column;
}

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
