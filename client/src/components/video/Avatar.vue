<template>
  <div class="avatar-container">
    <van-image fit="cover" position="left" :src="avatarUrl" round />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useVideoStore } from "@/stores/video.js";
import { storeToRefs } from "pinia";

const videoStore = useVideoStore();
const { currentVideoInfo } = storeToRefs(videoStore);

const avatarUrl = computed(() => {
  return currentVideoInfo.value?.avatarUrl || "";
});
</script>

<style scoped>
.avatar-container {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
