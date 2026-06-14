<template>
  <div class="avatar-container">
    <van-image fit="cover" position="left" :src="avatarUrl" round />
  </div>
</template>

<script setup lang="ts">
import { computed, watchEffect, toRaw } from "vue";
import { useVideoStore } from "@/stores/video.js";
import { storeToRefs } from "pinia";

const videoStore = useVideoStore();
const { currentVideoInfo } = storeToRefs(videoStore);

watchEffect(() => {
  console.log(toRaw(currentVideoInfo.value));
});

const avatarUrl = computed(() => {
  if (!currentVideoInfo.value) {
    return "";
  }
  return `http://localhost:3300/video/proxy?url=${encodeURIComponent(
    currentVideoInfo.value.author.avatar_168x168.url_list[0],
  )}`;
});

console.log(avatarUrl);
</script>

<style scoped>
.avatar-container {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
