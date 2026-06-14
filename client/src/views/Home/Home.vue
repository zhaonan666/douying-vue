<template>
  <div class="home-page">
    <TopNavBar />
    <div class="video-list" @touchstart="onTouchStart" @touchend="onTouchEnd">
      <div
        class="video-track"
        :style="{ transform: `translateY(-${activeIndex * 100}vh)` }"
      >
        <div
          v-for="(videoInfo, index) in videoInfoList"
          :key="videoInfo.aweme_id"
          class="video-item"
        >
          <video
            :ref="(el) => setVideoRef(el, index)"
            :src="`http://localhost:3300/video/proxy?url=${encodeURIComponent(videoInfo.video.playUrl)}`"
            autoplay
            loop
            muted
            playsinline
            class="video-player"
          ></video>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TopNavBar from "@/components/TopNavBar.vue";
import { onMounted, nextTick } from "vue";
import request from "@/request/request.js";
import { ref, watch } from "vue";
const videoInfoList = ref([]);
const activeIndex = ref(0);
const startY = ref(0);
const videoRefs = ref([]);

function setVideoRef(el, index) {
  if (el) {
    videoRefs.value[index] = el;
  }
}

function playCurrentVideo() {
  videoRefs.value.forEach((video, index) => {
    if (!video) return;

    if (index === activeIndex.value) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  });
}

const onTouchStart = (e) => {
  startY.value = e.touches[0].clientY;
};

const onTouchEnd = (e) => {
  const endY = e.changedTouches[0].clientY;
  const diff = startY.value - endY;

  if (Math.abs(diff) < 50) return;

  if (diff > 0) {
    activeIndex.value = Math.min(
      activeIndex.value + 1,
      videoInfoList.value.length - 1,
    );
  } else {
    activeIndex.value = Math.max(activeIndex.value - 1, 0);
  }
};

onMounted(() => {
  request
    .get("/video")
    .then(async (res) => {
      videoInfoList.value = res;
      await nextTick();
      playCurrentVideo();
    })
    .catch((err) => {
      console.error("获取视频信息失败：", err);
    });
});

watch(activeIndex, async () => {
  await nextTick();
  playCurrentVideo();
});
</script>

<style scoped>
.home-page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
}

.video-list {
  width: 100%;
  height: 100%;
  overflow-y: hidden;
}

.video-track {
  height: 100%;
  transition: transform 0.28s ease;
}

.video-item {
  width: 100%;
  height: 100vh;
}

.video-player {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
