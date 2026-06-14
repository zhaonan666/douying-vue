<template>
  <div class="home-page">
    <TopNavBar />
    <VideoPlay />
    <VideoTools />
  </div>
</template>

<script setup lang="ts">
import TopNavBar from "@/components/TopNavBar.vue";
import VideoPlay from "@/components/video/VideoPlay.vue";
import VideoTools from "@/components/video/VideoTools.vue";
</script>

<style scoped>
.home-page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
  position: relative;
}
</style>
