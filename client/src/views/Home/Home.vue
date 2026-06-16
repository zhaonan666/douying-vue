<template>
  <div class="home-page">
    <TopNavBar />
    <VideoPlay />
    <VideoTools />
    <Loading :loading="loading" />
  </div>
</template>

<script setup lang="ts">
import TopNavBar from "@/components/TopNavBar.vue";
import Loading from "@/components/Loading.vue";
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


</style>
