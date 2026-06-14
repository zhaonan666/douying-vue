<template>
  <div
    class="video-list"
    @touchstart="onTouchStart"
    @touchmove.prevent="onTouchMove"
    @touchend="onTouchEnd"
  >
    <div
      class="video-track"
      :class="{ dragging: isDragging }"
      :style="{
        transform: `translateY(calc(-${activeIndex * 100}vh + ${dragOffsetY}px + ${106 * activeIndex}px))`,
      }"
    >
      <div
        v-for="(videoInfo, index) in videoInfoList"
        :key="videoInfo.aweme_id"
        class="video-item"
        @click="isPaused = !isPaused"
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
        <!-- 播放停止按钮 -->
        <div class="pause-btn" v-if="isPaused"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from "vue";
import request from "@/request/request.js";
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useVideoStore } from "@/stores/video.js";

const videoStore = useVideoStore();

const { videoInfoList, activeIndex } = storeToRefs(videoStore);
const { getVideoList } = videoStore;

const startY = ref(0);
const videoRefs = ref([]);
const dragOffsetY = ref(0);
const isDragging = ref(false);
const isPaused = ref(false);

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
  isDragging.value = true;
};

const onTouchMove = (e) => {
  const currentY = e.touches[0].clientY;
  dragOffsetY.value = currentY - startY.value;
};
const onTouchEnd = () => {
  const threshold = 80;

  if (dragOffsetY.value < -threshold) {
    activeIndex.value = Math.min(
      activeIndex.value + 1,
      videoInfoList.value.length - 1,
    );
  } else if (dragOffsetY.value > threshold) {
    activeIndex.value = Math.max(activeIndex.value - 1, 0);
  }

  dragOffsetY.value = 0;
  isDragging.value = false;
};
onMounted(async () => {
  await getVideoList();
  await nextTick();
  playCurrentVideo();
});

watch(activeIndex, async () => {
  await nextTick();
  playCurrentVideo();
});

watch(isPaused, () => {
  if (isPaused.value) {
    videoRefs.value[activeIndex.value]?.pause();
  } else {
    videoRefs.value[activeIndex.value]?.play().catch(() => {});
  }
});
</script>

<style scoped>
.video-list {
  width: 100%;
  height: calc(100vh - 106px);
  overflow-y: hidden;
}

.video-track {
  height: 100%;
  transition: transform 0.28s ease;
}

.video-track.dragging {
  transition: none;
}

.video-item {
  width: 100%;
  height: 100%;
  position: relative;
}

.video-player {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.pause-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0px;
  height: 0px;
  border-top: 24px solid transparent;
  border-bottom: 24px solid transparent;
  border-left: 42px solid rgba(255, 255, 255, 0.3);
}
</style>
